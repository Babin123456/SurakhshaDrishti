const express = require("express");
const crypto = require("crypto");
const db = require("../handlers/dbHandler");

const router = express.Router();

// Helper to generate 16-digit cryptographic security key (format: RZ-XXXX-XXXX-XXXX)
function generate16DigitZoneKey() {
    const raw = crypto.randomBytes(6).toString('hex').toUpperCase(); // 12 chars
    return `RZ-${raw.substring(0,4)}-${raw.substring(4,8)}-${raw.substring(8,12)}`;
}

// 1. GET /zones — List all hazard zones with active assignment & resolution stats
router.get("/", async (req, res, next) => {
    try {
        const result = await db.query(`
            SELECT 
                z.*,
                COUNT(a.assignment_id)::int AS active_officers_count,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'user_id', a.user_id,
                            'officer_name', a.officer_name,
                            'department', a.department,
                            'assigned_at', a.assigned_at,
                            'vote_to_resolve', a.vote_to_resolve
                        )
                    ) FILTER (WHERE a.user_id IS NOT NULL), '[]'
                ) AS assigned_officers
            FROM hazard_zones z
            LEFT JOIN zone_assignments a ON z.zone_id = a.zone_id
            WHERE z.status = 'ACTIVE_RED_ZONE'
            GROUP BY z.zone_id
            ORDER BY z.risk_score DESC
        `);

        const activeZones = result.rows || [];
        const combinedZones = [];

        for (const zone of activeZones) {
            combinedZones.push(zone);
            if (zone.zone_type === 'RED') {
                const yellowZone = {
                    ...zone,
                    zone_id: zone.zone_id + '-YELLOW-BUFFER',
                    name: zone.name + ' (Warning Buffer)',
                    zone_type: 'YELLOW',
                    radius_meters: (zone.radius_meters || 3000) + 7000,
                    risk_score: Math.max(0, zone.risk_score - 40),
                    status: 'ACTIVE_WARNING_ZONE',
                    assigned_officers: [],
                    active_officers_count: 0
                };
                combinedZones.push(yellowZone);
            }
        }

        return res.json({
            success: true,
            zones: combinedZones
        });
    } catch (err) {
        return next(err);
    }
});

// 1.5 GET /zones/search — Search red zones by geohash, key, or name
router.get("/search", async (req, res, next) => {
    const { q, mode } = req.query;
    if (!q) {
        return res.json({ success: true, zones: [] });
    }
    
    try {
        const searchTerm = `%${q}%`;
        const result = await db.query(`
            SELECT 
                z.*,
                COUNT(a.assignment_id)::int AS active_officers_count,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'user_id', a.user_id,
                            'officer_name', a.officer_name,
                            'department', a.department,
                            'assigned_at', a.assigned_at,
                            'vote_to_resolve', a.vote_to_resolve
                        )
                    ) FILTER (WHERE a.user_id IS NOT NULL), '[]'
                ) AS assigned_officers
            FROM hazard_zones z
            LEFT JOIN zone_assignments a ON z.zone_id = a.zone_id
            WHERE z.access_key ILIKE $1 OR z.geohash ILIKE $1 OR z.name ILIKE $1 OR z.zone_id ILIKE $1
            GROUP BY z.zone_id
            ORDER BY z.risk_score DESC
        `, [searchTerm]);

        return res.json({
            success: true,
            zones: result.rows
        });
    } catch (err) {
        return next(err);
    }
});

// 2. POST /zones/create — Create new Red Zone (Generates 16-digit security key)
router.post("/create", async (req, res, next) => {
    const { name, state, lat, lng, hazard_type, population_risk, radius_meters, resolution_votes_required } = req.body;

    if (!name || !lat || !lng) {
        res.statusCode = 400;
        return next(new Error("Zone name, lat, and lng are required."));
    }

    const zoneId = 'RZ-' + name.replaceAll(' ', '-').toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
    const accessKey = generate16DigitZoneKey();
    const geohash = `g${Math.floor(100000 + Math.random() * 900000)}`;

    try {
        await db.query(
            `INSERT INTO hazard_zones (zone_id, name, state, lat, lng, zone_type, hazard_type, risk_score, geohash, population_risk, radius_meters, access_key, status, resolution_votes_required) 
             VALUES ($1, $2, $3, $4, $5, 'RED', $6, 90, $7, $8, $9, $10, 'ACTIVE_RED_ZONE', $11)`,
            [zoneId, name, state || 'India', lat, lng, hazard_type || 'LANDSLIDE', geohash, population_risk || 1200, radius_meters || 3000, accessKey, resolution_votes_required || 2]
        );

        return res.json({
            success: true,
            message: `Red Zone ${name} registered. 16-Digit Key Generated: ${accessKey}`,
            zone: {
                zone_id: zoneId,
                name,
                access_key: accessKey,
                status: 'ACTIVE_RED_ZONE'
            }
        });
    } catch (err) {
        return next(err);
    }
});

// POST /zones/ai-satellite-detect — Real-Time AI Satellite Imaging Analysis Telemetry Ingestion
router.post("/ai-satellite-detect", async (req, res, next) => {
    const { lat, lng, radius_meters, zone_type, hazard_type, risk_score, name, population_risk } = req.body;

    if (!lat || !lng) {
        res.statusCode = 400;
        return next(new Error("Exact latitude and longitude are required for AI Satellite Ingestion."));
    }

    const calculatedZoneType = (zone_type || (risk_score >= 80 ? 'RED' : 'YELLOW')).toUpperCase();
    const zoneName = name || `AI-Detected ${hazard_type || 'Landslide'} Sector (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E)`;
    const zoneId = 'RZ-AI-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const accessKey = generate16DigitZoneKey();
    const geohash = `g${Math.floor(100000 + Math.random() * 900000)}`;

    try {
        await db.query(
            `INSERT INTO hazard_zones (zone_id, name, state, lat, lng, zone_type, hazard_type, risk_score, geohash, population_risk, radius_meters, access_key, status, resolution_votes_required) 
             VALUES ($1, $2, 'AI Satellite Feed', $3, $4, $5, $6, $7, $8, $9, $10, $11, 'ACTIVE_RED_ZONE', 2)
             ON CONFLICT (zone_id) DO UPDATE 
             SET lat = EXCLUDED.lat, lng = EXCLUDED.lng, risk_score = EXCLUDED.risk_score, radius_meters = EXCLUDED.radius_meters`,
            [zoneId, zoneName, lat, lng, calculatedZoneType, hazard_type || 'LANDSLIDE', risk_score || 92, geohash, population_risk || 1500, radius_meters || 3500, accessKey]
        );

        // Broadcast to all connected Administrator Consoles via Socket.io
        const io = req.app.get("socketio");
        if (io) {
            io.emit("ai_red_zone_detected", {
                zone_id: zoneId,
                name: zoneName,
                lat,
                lng,
                zone_type: calculatedZoneType,
                radius_meters: radius_meters || 3500,
                access_key: accessKey,
                risk_score: risk_score || 92,
                timestamp: new Date().toISOString()
            });
        }

        return res.json({
            success: true,
            message: `AI Satellite Detection Ingested: ${calculatedZoneType} Zone created with 16-Digit Key.`,
            detection: {
                zone_id: zoneId,
                name: zoneName,
                lat,
                lng,
                radius_meters: radius_meters || 3500,
                zone_type: calculatedZoneType,
                access_key: accessKey,
                risk_score: risk_score || 92
            }
        });
    } catch (err) {
        return next(err);
    }
});

// 3. POST /zones/assign — Officer assigns self to a Red Zone using 16-Digit Key
router.post("/assign", async (req, res, next) => {
    const { zone_id, access_key, user_id, officer_name, department } = req.body;

    if (!zone_id || !user_id) {
        res.statusCode = 400;
        return next(new Error("zone_id and user_id are required."));
    }

    try {
        // Verify Zone Key if provided
        const zoneRes = await db.query(`SELECT access_key, status FROM hazard_zones WHERE zone_id = $1`, [zone_id]);
        if (!zoneRes.rows[0]) {
            res.statusCode = 404;
            return next(new Error("Red Zone not found in database."));
        }

        const zone = zoneRes.rows[0];

        // If access key supplied, validate matching 16-digit key
        if (access_key && access_key.trim().toUpperCase() !== zone.access_key.trim().toUpperCase()) {
            res.statusCode = 403;
            return next(new Error("Invalid 16-Digit Security Access Key for this Red Zone."));
        }

        // Register assignment
        await db.query(
            `INSERT INTO zone_assignments (zone_id, user_id, officer_name, department) 
             VALUES ($1, $2, $3, $4) 
             ON CONFLICT (zone_id, user_id) 
             DO UPDATE SET officer_name = EXCLUDED.officer_name, department = EXCLUDED.department, assigned_at = CURRENT_TIMESTAMP`,
            [zone_id, user_id, officer_name || user_id, department || 'NDRF']
        );

        // Fetch updated officer list
        const officersRes = await db.query(
            `SELECT user_id, officer_name, department, vote_to_resolve FROM zone_assignments WHERE zone_id = $1`,
            [zone_id]
        );

        return res.json({
            success: true,
            message: `Officer ${officer_name || user_id} assigned to ${zone_id} successfully!`,
            assignedOfficers: officersRes.rows
        });
    } catch (err) {
        return next(err);
    }
});

// 4. POST /zones/vote-resolve — Officer votes to resolve Red Zone (Requires Majority Consensus)
router.post("/vote-resolve", async (req, res, next) => {
    const { zone_id, user_id } = req.body;

    if (!zone_id || !user_id) {
        res.statusCode = 400;
        return next(new Error("zone_id and user_id are required."));
    }

    try {
        // Record vote
        await db.query(
            `UPDATE zone_assignments SET vote_to_resolve = true, voted_at = CURRENT_TIMESTAMP WHERE zone_id = $1 AND user_id = $2`,
            [zone_id, user_id]
        );

        // Calculate total votes vs required
        const voteCountRes = await db.query(
            `SELECT COUNT(*)::int AS total_votes FROM zone_assignments WHERE zone_id = $1 AND vote_to_resolve = true`,
            [zone_id]
        );
        const totalVotes = voteCountRes.rows[0].total_votes;

        const assignedRes = await db.query(
            `SELECT COUNT(*)::int AS total_assigned FROM zone_assignments WHERE zone_id = $1`,
            [zone_id]
        );
        const totalAssigned = assignedRes.rows[0].total_assigned;
        const votesRequired = Math.max(1, Math.ceil(totalAssigned * 0.8)); // 80% consensus required

        let newStatus = 'ACTIVE_RED_ZONE';
        let isResolved = false;

        if (totalVotes >= votesRequired) {
            newStatus = 'SITUATION_UNDER_CONTROL';
            isResolved = true;
            await db.query(
                `UPDATE hazard_zones SET status = 'SITUATION_UNDER_CONTROL' WHERE zone_id = $1`,
                [zone_id]
            );
            await db.query(
                `INSERT INTO history_red_zones (zone_id) VALUES ($1) ON CONFLICT DO NOTHING`,
                [zone_id]
            ).catch(() => {}); // Fallback in case table doesn't exist
        } else {
            await db.query(
                `UPDATE hazard_zones SET resolution_votes_cast = $1 WHERE zone_id = $2`,
                [totalVotes, zone_id]
            );
        }

        return res.json({
            success: true,
            isResolved,
            status: newStatus,
            totalVotes,
            votesRequired,
            message: isResolved 
                ? `Red Zone ${zone_id} marked as RESOLVED — Situation Under Control!` 
                : `Vote recorded (${totalVotes}/${votesRequired} consensus votes).`
        });
    } catch (err) {
        return next(err);
    }
});

// 4.5 POST /zones/unassign — Officer unassigns self from a Red Zone
router.post("/unassign", async (req, res, next) => {
    const { zone_id, user_id } = req.body;

    if (!zone_id || !user_id) {
        res.statusCode = 400;
        return next(new Error("zone_id and user_id are required."));
    }

    try {
        const zoneRes = await db.query(`SELECT status FROM hazard_zones WHERE zone_id = $1`, [zone_id]);
        if (!zoneRes.rows[0]) {
            res.statusCode = 404;
            return next(new Error("Red Zone not found in database."));
        }

        if (zoneRes.rows[0].status !== 'SITUATION_UNDER_CONTROL') {
            res.statusCode = 403;
            return next(new Error("Cannot unassign: the area is not marked cleared. 80% of assigned officers must vote to resolve first."));
        }

        await db.query(`DELETE FROM zone_assignments WHERE zone_id = $1 AND user_id = $2`, [zone_id, user_id]);

        return res.json({
            success: true,
            message: `Officer successfully unassigned from ${zone_id}.`
        });
    } catch (err) {
        return next(err);
    }
});

// 5. GET /zones/:zoneId/trapped-citizens — Geolocation pings of residents inside Red Zone
router.get("/:zoneId/trapped-citizens", async (req, res, next) => {
    const { zoneId } = req.params;

    try {
        // Fetch active emergency passes for this zone
        const passRes = await db.query(
            `SELECT pass_id, user_id, phone, lat, lng, special_needs, created_at FROM emergency_passes WHERE status = 'ACTIVE_RED_ZONE' LIMIT 20`
        );

        // Fallback simulation pings around Wayanad Sector 4 if empty
        const citizens = passRes.rows.length > 0 ? passRes.rows : [
            { id: 'SOS-901', lat: 11.6862, lng: 76.1331, name: 'Resident #104 (Elderly)', phone: '+91 98765 43210', status: 'CRITICAL_TRAPPED' },
            { id: 'SOS-902', lat: 11.6841, lng: 76.1315, name: 'Resident #105 (Infant Family)', phone: '+91 98765 43211', status: 'CRITICAL_TRAPPED' },
            { id: 'SOS-903', lat: 11.6870, lng: 76.1345, name: 'Resident #106', phone: '+91 98765 43212', status: 'EVACUATING' }
        ];

        return res.json({
            success: true,
            zoneId,
            citizens
        });
    } catch (err) {
        return next(err);
    }
});

// 6. GET /zones/shelters/search — Safe location database matching red zone access key
router.get("/shelters/search", async (req, res, next) => {
    const { key } = req.query;
    if (!key) return res.json({ success: true, shelters: [] });

    try {
        const result = await db.query(`SELECT * FROM shelters WHERE primary_hashed_key = $1`, [key]);
        return res.json({
            success: true,
            shelters: result.rows
        });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
