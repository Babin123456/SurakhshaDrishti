/**
 * H3 Routing API Routes
 * Exposes the H3 engine for pathfinding, shelter ranking, and capacity management.
 * 
 * Endpoints:
 *   POST /h3/pathfind          — A* pathfinding between two points avoiding Red Zones
 *   POST /h3/rank-shelters     — Rank nearby shelters by distance + capacity
 *   POST /h3/shelters/checkin  — Decrement shelter capacity when a civilian arrives
 */

const express = require("express");
const router = express.Router();
const db = require("../handlers/dbHandler");
const h3Engine = require("../handlers/h3Engine");

/**
 * POST /h3/pathfind
 * Body: { start: [lat, lng], end: [lat, lng], redZones: [{ lat, lng, radiusKm }] }
 * Returns: { path: [[lat,lng],...], hops, distanceKm }
 */
router.post("/pathfind", async (req, res, next) => {
    const { start, end, redZones } = req.body;

    if (!start || !end || !Array.isArray(start) || !Array.isArray(end)) {
        return res.status(400).json({ success: false, error: "start and end must be [lat, lng] arrays." });
    }

    try {
        // Build obstacle hex set from all active Red Zones
        let allObstacles = [];

        // If redZones explicitly provided, use those
        if (redZones && Array.isArray(redZones)) {
            for (const rz of redZones) {
                const hexes = h3Engine.getRedZoneHexes(
                    [parseFloat(rz.lat), parseFloat(rz.lng)],
                    parseFloat(rz.radiusKm) || 3
                );
                allObstacles = allObstacles.concat(hexes);
            }
        } else {
            // Otherwise, fetch active Red Zones from database
            const activeZones = await db.query(
                `SELECT lat, lng, radius_meters FROM hazard_zones WHERE status = 'ACTIVE_RED_ZONE' AND zone_type = 'RED'`
            );
            for (const zone of activeZones.rows) {
                const radiusKm = (zone.radius_meters || 3000) / 1000;
                const hexes = h3Engine.getRedZoneHexes(
                    [parseFloat(zone.lat), parseFloat(zone.lng)],
                    radiusKm
                );
                allObstacles = allObstacles.concat(hexes);
            }
        }

        const result = h3Engine.findPath(
            [parseFloat(start[0]), parseFloat(start[1])],
            [parseFloat(end[0]), parseFloat(end[1])],
            allObstacles
        );

        return res.json({
            success: true,
            path: result.path,
            hops: result.hops,
            distanceKm: result.distanceKm,
            iterations: result.iterations,
            obstacleHexCount: allObstacles.length
        });
    } catch (err) {
        return res.status(422).json({
            success: false,
            error: err.message
        });
    }
});

/**
 * POST /h3/rank-shelters
 * Body: { lat, lng, radiusMeters? }
 * Returns ranked shelters sorted by H3 distance + capacity weighting
 */
router.post("/rank-shelters", async (req, res, next) => {
    const { lat, lng, radiusMeters } = req.body;

    if (!lat || !lng) {
        return res.status(400).json({ success: false, error: "lat and lng are required." });
    }

    try {
        const userLatLng = [parseFloat(lat), parseFloat(lng)];
        const searchRadius = parseFloat(radiusMeters) || 7000;

        // Fetch all shelters from DB
        const shelterRes = await db.query(`SELECT * FROM shelters WHERE status != 'CLOSED'`);
        let shelters = shelterRes.rows || [];

        // If no official shelters, try Overpass API
        if (shelters.length === 0) {
            const overpassQuery = `[out:json];node(around:${searchRadius},${lat},${lng})["amenity"~"school|hospital"];out;`;
            const endpoints = [
                `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`,
                `https://lz4.overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`,
                `https://maps.mail.ru/osm/tools/overpass/api/interpreter?data=${encodeURIComponent(overpassQuery)}`
            ];

            let osmData = null;
            for (const url of endpoints) {
                try {
                    const fetchRes = await fetch(url);
                    if (!fetchRes.ok) continue;
                    osmData = await fetchRes.json();
                    if (osmData && osmData.elements) break;
                } catch (e) { /* Try next endpoint */ }
            }

            if (osmData && osmData.elements) {
                for (const node of osmData.elements) {
                    if (!node.tags || !node.tags.name) continue;
                    const type = node.tags.amenity;
                    shelters.push({
                        shelter_id: `OSM-${node.id}`,
                        name: node.tags.name + (type === 'hospital' ? ' (Hospital)' : ' (School)'),
                        lat: node.lat,
                        lng: node.lon,
                        capacity_total: type === 'hospital' ? 300 : 800,
                        capacity_occupied: 0,
                        status: 'OPEN',
                        is_officially_registered: false,
                        source_data: 'OpenStreetMap'
                    });
                }
            }
        }

        // Filter by H3 distance (only shelters within searchRadius)
        shelters = shelters.filter(s => {
            const dist = h3Engine.distanceMeters(userLatLng, [parseFloat(s.lat), parseFloat(s.lng)]);
            return dist <= searchRadius;
        });

        // Fetch active Red Zone hexes for avoidance info
        const activeZones = await db.query(
            `SELECT lat, lng, radius_meters FROM hazard_zones WHERE status = 'ACTIVE_RED_ZONE' AND zone_type = 'RED'`
        );
        let redZoneHexes = [];
        for (const zone of activeZones.rows) {
            const hexes = h3Engine.getRedZoneHexes(
                [parseFloat(zone.lat), parseFloat(zone.lng)],
                (zone.radius_meters || 3000) / 1000
            );
            redZoneHexes = redZoneHexes.concat(hexes);
        }

        const ranked = h3Engine.rankShelters(userLatLng, shelters, redZoneHexes);

        return res.json({
            success: true,
            shelters: ranked.slice(0, 5),
            total_found: shelters.length,
            source: shelters.some(s => s.is_officially_registered) ? 'official_db' : 'dynamic_osm'
        });
    } catch (err) {
        console.error("Rank shelters error:", err);
        return next(err);
    }
});

/**
 * POST /h3/shelters/checkin
 * Body: { shelter_id, count? }
 * Increments capacity_occupied when civilian(s) arrive at a shelter
 */
router.post("/shelters/checkin", async (req, res, next) => {
    const { shelter_id, count } = req.body;
    const increment = parseInt(count) || 1;

    if (!shelter_id) {
        return res.status(400).json({ success: false, error: "shelter_id is required." });
    }

    try {
        const result = await db.query(
            `UPDATE shelters 
             SET capacity_occupied = LEAST(capacity_total, capacity_occupied + $1)
             WHERE shelter_id = $2
             RETURNING shelter_id, name, capacity_total, capacity_occupied, status`,
            [increment, shelter_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Shelter not found." });
        }

        const shelter = result.rows[0];
        const occupancy = shelter.capacity_occupied / shelter.capacity_total;

        // Auto-update status if shelter is now full
        if (occupancy >= 1.0) {
            await db.query(`UPDATE shelters SET status = 'FULL' WHERE shelter_id = $1`, [shelter_id]);
            shelter.status = 'FULL';
        } else if (occupancy >= 0.95) {
            await db.query(`UPDATE shelters SET status = 'NEAR_FULL' WHERE shelter_id = $1`, [shelter_id]);
            shelter.status = 'NEAR_FULL';
        }

        // Broadcast capacity update via Socket.io
        const io = req.app.get("socketio");
        if (io) {
            io.emit("shelter_capacity_update", {
                shelter_id: shelter.shelter_id,
                name: shelter.name,
                capacity_total: shelter.capacity_total,
                capacity_occupied: shelter.capacity_occupied,
                status: shelter.status,
                occupancy_percent: Math.round(occupancy * 100)
            });
        }

        return res.json({
            success: true,
            message: `Checked in ${increment} civilian(s) to ${shelter.name}.`,
            shelter
        });
    } catch (err) {
        return next(err);
    }
});

/**
 * POST /h3/shelters/checkout
 * Body: { shelter_id, count? }
 * Decrements capacity_occupied when civilian(s) leave a shelter
 */
router.post("/shelters/checkout", async (req, res, next) => {
    const { shelter_id, count } = req.body;
    const decrement = parseInt(count) || 1;

    if (!shelter_id) {
        return res.status(400).json({ success: false, error: "shelter_id is required." });
    }

    try {
        const result = await db.query(
            `UPDATE shelters 
             SET capacity_occupied = GREATEST(0, capacity_occupied - $1),
                 status = 'OPEN'
             WHERE shelter_id = $2
             RETURNING shelter_id, name, capacity_total, capacity_occupied, status`,
            [decrement, shelter_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: "Shelter not found." });
        }

        return res.json({
            success: true,
            message: `Checked out ${decrement} civilian(s) from ${result.rows[0].name}.`,
            shelter: result.rows[0]
        });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
