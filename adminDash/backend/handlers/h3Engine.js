/**
 * H3 Spatial Engine — Reusable A* Pathfinding & Distance Module
 * Ported from userApp/backend/h3PathfindingTest.js into a production module.
 * 
 * Provides:
 *  - A* pathfinding on H3 hexagonal grids (avoids Red Zone obstacles)
 *  - H3 distance calculations (replaces Haversine mocks)
 *  - Red Zone hex generation from lat/lng + radius
 *  - Shelter ranking by H3 grid distance with capacity weighting
 */

const h3 = require('h3-js');

// Default H3 resolution: 10 ≈ 66m edge length (neighborhood-scale pathfinding)
const DEFAULT_RESOLUTION = 10;

/**
 * Great circle distance between two [lat, lng] pairs in meters
 */
function distanceMeters(latlng1, latlng2) {
    return h3.greatCircleDistance(latlng1, latlng2, 'm');
}

/**
 * Great circle distance between two [lat, lng] pairs in km
 */
function distanceKm(latlng1, latlng2) {
    return h3.greatCircleDistance(latlng1, latlng2, 'km');
}

/**
 * Generate set of H3 hex indexes covering a circular Red Zone
 * @param {Array} centerLatLng - [lat, lng]
 * @param {Number} radiusKm - radius in kilometers
 * @param {Number} res - H3 resolution (default 10)
 * @returns {string[]} Array of H3 hex indexes
 */
function getRedZoneHexes(centerLatLng, radiusKm, res = DEFAULT_RESOLUTION) {
    const centerHex = h3.latLngToCell(centerLatLng[0], centerLatLng[1], res);
    const edgeLenKm = h3.getHexagonEdgeLengthAvg(res, 'km');
    const ringSize = Math.ceil(radiusKm / (edgeLenKm * Math.sqrt(3)));
    return h3.gridDisk(centerHex, ringSize);
}

/**
 * A* Pathfinding on H3 hexagonal grid
 * @param {Array} startLatLng - [lat, lng]
 * @param {Array} endLatLng - [lat, lng]
 * @param {string[]} obstacles - Array of H3 hex indexes to avoid (Red Zones)
 * @param {Number} res - H3 resolution
 * @returns {{ path: Array, hops: Number, distanceKm: Number }}
 */
function findPath(startLatLng, endLatLng, obstacles = [], res = DEFAULT_RESOLUTION) {
    const startHex = h3.latLngToCell(startLatLng[0], startLatLng[1], res);
    const endHex = h3.latLngToCell(endLatLng[0], endLatLng[1], res);

    if (obstacles.includes(startHex)) {
        throw new Error("Start position is inside a Red Zone obstacle.");
    }
    if (obstacles.includes(endHex)) {
        throw new Error("Destination is inside a Red Zone obstacle.");
    }

    const obstacleSet = new Set(obstacles);

    // A* data structures
    const openSet = new Set([startHex]);
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    gScore.set(startHex, 0);
    fScore.set(startHex, distanceKm(startLatLng, endLatLng));

    let iterations = 0;
    const MAX_ITERATIONS = 15000;

    while (openSet.size > 0) {
        iterations++;
        if (iterations > MAX_ITERATIONS) {
            throw new Error(`Pathfinding timeout: exceeded ${MAX_ITERATIONS} iterations.`);
        }

        // Find node with lowest fScore
        let current = null;
        let minF = Infinity;
        for (const hex of openSet) {
            const f = fScore.get(hex) || Infinity;
            if (f < minF) {
                minF = f;
                current = hex;
            }
        }

        if (current === endHex) {
            // Reconstruct path
            const path = [current];
            while (cameFrom.has(current)) {
                current = cameFrom.get(current);
                path.push(current);
            }
            const orderedPath = path.reverse();
            const pathCoords = orderedPath.map(hex => h3.cellToLatLng(hex));

            // Calculate total path distance
            let totalDist = 0;
            for (let i = 1; i < pathCoords.length; i++) {
                totalDist += distanceKm(pathCoords[i - 1], pathCoords[i]);
            }

            return {
                path: pathCoords,
                hexPath: orderedPath,
                hops: orderedPath.length,
                distanceKm: Math.round(totalDist * 1000) / 1000,
                iterations
            };
        }

        openSet.delete(current);
        const currentLatLng = h3.cellToLatLng(current);

        // Get 6 neighbors
        const neighbors = h3.gridDisk(current, 1).filter(h => h !== current);

        for (const neighbor of neighbors) {
            if (obstacleSet.has(neighbor)) continue;

            const neighborLatLng = h3.cellToLatLng(neighbor);
            const tentativeG = (gScore.get(current) || 0) + distanceKm(currentLatLng, neighborLatLng);
            const neighborG = gScore.has(neighbor) ? gScore.get(neighbor) : Infinity;

            if (tentativeG < neighborG) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentativeG);
                fScore.set(neighbor, tentativeG + distanceKm(neighborLatLng, endLatLng));
                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                }
            }
        }
    }

    throw new Error("No path found. The destination may be completely blocked by Red Zones.");
}

/**
 * Rank shelters by H3 grid distance with capacity weighting.
 * Shelters near or above 95% capacity get a penalty multiplier.
 * 
 * @param {Array} userLatLng - [lat, lng]
 * @param {Array} shelters - Array of shelter objects { shelter_id, lat, lng, capacity_total, capacity_occupied, ... }
 * @param {string[]} redZoneHexes - H3 hexes to avoid
 * @returns {Array} Sorted shelters with distance and score
 */
function rankShelters(userLatLng, shelters, redZoneHexes = []) {
    const CAPACITY_THRESHOLD = 0.95;

    const scored = shelters.map(shelter => {
        const shelterLatLng = [parseFloat(shelter.lat), parseFloat(shelter.lng)];
        const rawDistKm = distanceKm(userLatLng, shelterLatLng);
        
        const occupancyRatio = (shelter.capacity_occupied || 0) / Math.max(1, shelter.capacity_total || 1);
        const isFull = occupancyRatio >= 1.0;
        const isNearFull = occupancyRatio >= CAPACITY_THRESHOLD;

        // Penalty: full shelters get infinite score, near-full get 3x multiplier
        let capacityMultiplier = 1.0;
        if (isFull) capacityMultiplier = Infinity;
        else if (isNearFull) capacityMultiplier = 3.0;

        const score = rawDistKm * capacityMultiplier;
        const remainingCapacity = Math.max(0, (shelter.capacity_total || 0) - (shelter.capacity_occupied || 0));

        return {
            ...shelter,
            h3_distance_km: Math.round(rawDistKm * 1000) / 1000,
            occupancy_percent: Math.round(occupancyRatio * 100),
            remaining_capacity: remainingCapacity,
            routing_score: score === Infinity ? 999999 : Math.round(score * 1000) / 1000,
            is_recommended: !isFull && !isNearFull
        };
    });

    // Sort by routing_score ascending (closest + most available first)
    scored.sort((a, b) => a.routing_score - b.routing_score);

    return scored;
}

module.exports = {
    distanceMeters,
    distanceKm,
    getRedZoneHexes,
    findPath,
    rankShelters,
    DEFAULT_RESOLUTION
};
