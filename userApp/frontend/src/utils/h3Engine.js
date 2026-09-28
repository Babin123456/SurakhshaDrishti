/**
 * LOCAL H3 Spatial Engine — Runs 100% on-device (offline capable)
 * 
 * This module is the core of Edge Case 5 (Map Blackouts During Evacuation).
 * All pathfinding, distance calculations, and shelter routing happen
 * LOCALLY on the user's device. If the network drops mid-evacuation,
 * this engine continues to function without any server dependency.
 * 
 * Provides:
 *  - A* pathfinding on H3 hexagonal grids (avoids Red Zone obstacles)
 *  - H3 distance calculations
 *  - Red Zone hex generation from lat/lng + radius
 *  - Shelter ranking by H3 grid distance with capacity weighting
 *  - Offline-first: caches Red Zone and shelter data to localStorage
 */

import h3 from 'h3-js';

// H3 Resolution 10 ≈ 66m edge length (neighborhood-scale pathfinding)
const DEFAULT_RESOLUTION = 10;

// ─── LOCAL CACHE (survives network loss) ───────────────────────────

const CACHE_KEYS = {
    RED_ZONES: 'suraksha_cached_red_zones',
    SHELTERS: 'suraksha_cached_shelters',
    LAST_SYNC: 'suraksha_h3_last_sync'
};

/**
 * Cache Red Zone data locally so pathfinding works offline
 */
export function cacheRedZones(zones) {
    try {
        localStorage.setItem(CACHE_KEYS.RED_ZONES, JSON.stringify(zones));
        localStorage.setItem(CACHE_KEYS.LAST_SYNC, Date.now().toString());
    } catch (e) {
        console.warn('[H3 Engine] Failed to cache Red Zones:', e);
    }
}

/**
 * Cache shelter data locally so routing works offline
 */
export function cacheShelters(shelters) {
    try {
        localStorage.setItem(CACHE_KEYS.SHELTERS, JSON.stringify(shelters));
    } catch (e) {
        console.warn('[H3 Engine] Failed to cache shelters:', e);
    }
}

/**
 * Load cached Red Zones (returns [] if nothing cached)
 */
export function getCachedRedZones() {
    try {
        const data = localStorage.getItem(CACHE_KEYS.RED_ZONES);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

/**
 * Load cached shelters (returns [] if nothing cached)
 */
export function getCachedShelters() {
    try {
        const data = localStorage.getItem(CACHE_KEYS.SHELTERS);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

// ─── DISTANCE FUNCTIONS ────────────────────────────────────────────

/**
 * Great circle distance between two [lat, lng] pairs in meters
 */
export function distanceMeters(latlng1, latlng2) {
    return h3.greatCircleDistance(latlng1, latlng2, 'm');
}

/**
 * Great circle distance between two [lat, lng] pairs in km
 */
export function distanceKm(latlng1, latlng2) {
    return h3.greatCircleDistance(latlng1, latlng2, 'km');
}

// ─── RED ZONE HEX GENERATION ──────────────────────────────────────

/**
 * Generate set of H3 hex indexes covering a circular Red Zone
 * @param {Array} centerLatLng - [lat, lng]
 * @param {Number} radiusKm - radius in kilometers
 * @param {Number} res - H3 resolution (default 10)
 * @returns {string[]} Array of H3 hex indexes
 */
export function getRedZoneHexes(centerLatLng, radiusKm, res = DEFAULT_RESOLUTION) {
    const centerHex = h3.latLngToCell(centerLatLng[0], centerLatLng[1], res);
    const edgeLenKm = h3.getHexagonEdgeLengthAvg(res, 'km');
    const ringSize = Math.ceil(radiusKm / (edgeLenKm * Math.sqrt(3)));
    return h3.gridDisk(centerHex, ringSize);
}

/**
 * Build a complete obstacle set from an array of Red Zones.
 * Uses cached data if provided zones are empty (offline mode).
 * @param {Array} zones - [{ lat, lng, radius_meters }]
 * @returns {string[]} Combined H3 hex obstacle set
 */
export function buildObstacleSet(zones) {
    const source = (zones && zones.length > 0) ? zones : getCachedRedZones();
    let allHexes = [];

    for (const zone of source) {
        const radiusKm = (zone.radius_meters || zone.radiusKm * 1000 || 3000) / 1000;
        const hexes = getRedZoneHexes(
            [parseFloat(zone.lat), parseFloat(zone.lng)],
            radiusKm
        );
        allHexes = allHexes.concat(hexes);
    }

    return allHexes;
}

// ─── A* PATHFINDING (runs entirely on-device) ─────────────────────

/**
 * A* Pathfinding on H3 hexagonal grid — FULLY LOCAL
 * @param {Array} startLatLng - [lat, lng]
 * @param {Array} endLatLng - [lat, lng]
 * @param {string[]} obstacles - Array of H3 hex indexes to avoid (Red Zones)
 * @param {Number} res - H3 resolution
 * @returns {{ path: Array, hops: Number, distanceKm: Number }}
 */
export function findPath(startLatLng, endLatLng, obstacles = [], res = DEFAULT_RESOLUTION) {
    const startHex = h3.latLngToCell(startLatLng[0], startLatLng[1], res);
    const endHex = h3.latLngToCell(endLatLng[0], endLatLng[1], res);

    if (obstacles.includes(startHex)) {
        throw new Error("Your current position is inside a Red Zone.");
    }
    if (obstacles.includes(endHex)) {
        throw new Error("The destination shelter is inside a Red Zone.");
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
            // Fallback: return straight-line vector to shelter
            return {
                path: [startLatLng, endLatLng],
                hexPath: [startHex, endHex],
                hops: 2,
                distanceKm: distanceKm(startLatLng, endLatLng),
                iterations,
                fallback: true,
                fallbackReason: 'Pathfinding timeout — using straight-line vector fallback.'
            };
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
                iterations,
                fallback: false
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

    // No path found — return straight-line vector as ultimate fallback
    return {
        path: [startLatLng, endLatLng],
        hexPath: [startHex, endHex],
        hops: 2,
        distanceKm: distanceKm(startLatLng, endLatLng),
        iterations,
        fallback: true,
        fallbackReason: 'No H3 path found — using straight-line vector fallback.'
    };
}

// ─── SHELTER RANKING (local, capacity-aware) ──────────────────────

/**
 * Rank shelters by H3 distance with capacity weighting.
 * Uses cached shelter data if none provided (offline mode).
 * 
 * @param {Array} userLatLng - [lat, lng]
 * @param {Array} shelters - Shelter objects (or null to use cache)
 * @returns {Array} Sorted shelters with distance and score
 */
export function rankShelters(userLatLng, shelters = null) {
    const CAPACITY_THRESHOLD = 0.95;
    const source = (shelters && shelters.length > 0) ? shelters : getCachedShelters();

    const scored = source.map(shelter => {
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

    scored.sort((a, b) => a.routing_score - b.routing_score);
    return scored;
}

/**
 * MASTER FUNCTION: Full offline-capable evacuation routing
 * 1. Gets user position
 * 2. Ranks shelters (from cache if offline)
 * 3. Pathfinds to the best shelter avoiding Red Zones
 * 
 * @param {Array} userLatLng - [lat, lng]
 * @param {Array|null} liveZones - live red zones (null = use cache)
 * @param {Array|null} liveShelters - live shelters (null = use cache)
 * @returns {{ bestShelter, path, allShelters }}
 */
export function computeEvacuationRoute(userLatLng, liveZones = null, liveShelters = null) {
    // 1. Build obstacle set (cached if offline)
    const obstacles = buildObstacleSet(liveZones);

    // 2. Rank shelters by distance + capacity
    const ranked = rankShelters(userLatLng, liveShelters);
    if (ranked.length === 0) {
        throw new Error("No shelters available. Stay in place and await rescue.");
    }

    // 3. Try pathfinding to the best recommended shelter
    const recommended = ranked.find(s => s.is_recommended) || ranked[0];
    const shelterLatLng = [parseFloat(recommended.lat), parseFloat(recommended.lng)];

    const pathResult = findPath(userLatLng, shelterLatLng, obstacles);

    return {
        bestShelter: recommended,
        path: pathResult,
        allShelters: ranked,
        isOffline: (!liveZones || liveZones.length === 0),
        timestamp: Date.now()
    };
}
