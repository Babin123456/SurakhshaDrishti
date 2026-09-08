const h3 = require('h3-js');

// Helper to calculate distance between two lat/lngs in km
function distance(latlng1, latlng2) {
    // using h3 greatCircleDistance
    return h3.greatCircleDistance(latlng1, latlng2, 'km');
}

/**
 * Perform A* pathfinding on H3 hexes
 * @param {Array} startLatLng - [lat, lng]
 * @param {Array} endLatLng - [lat, lng]
 * @param {Array} obstacles - Array of H3 hex indexes to avoid
 * @param {Number} res - H3 resolution (e.g. 10)
 */
function findPath(startLatLng, endLatLng, obstacles, res = 10) {
    const startHex = h3.latLngToCell(startLatLng[0], startLatLng[1], res);
    const endHex = h3.latLngToCell(endLatLng[0], endLatLng[1], res);

    if (obstacles.includes(startHex)) throw new Error("Start is inside an obstacle!");
    if (obstacles.includes(endHex)) throw new Error("End is inside an obstacle!");

    console.log(`Finding path from ${startHex} to ${endHex} at resolution ${res}`);

    const obstacleSet = new Set(obstacles);

    // A* Data structures
    const openSet = new Set([startHex]);
    const cameFrom = new Map();

    const gScore = new Map();
    gScore.set(startHex, 0);

    const fScore = new Map();
    fScore.set(startHex, distance(startLatLng, endLatLng));

    let iterations = 0;

    while (openSet.size > 0) {
        iterations++;
        // Limit iterations to prevent infinite loop on impossible paths
        if (iterations > 10000) {
            throw new Error("Pathfinding timeout: exceeded 10000 iterations");
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
            console.log(`Path found in ${iterations} iterations.`);
            // Reconstruct path
            const path = [current];
            while (cameFrom.has(current)) {
                current = cameFrom.get(current);
                path.push(current);
            }
            return path.reverse();
        }

        openSet.delete(current);
        const currentLatLng = h3.cellToLatLng(current);

        // Get neighbors (gridDisk with radius 1 gives the cell and 6 neighbors)
        const neighbors = h3.gridDisk(current, 1).filter(h => h !== current);

        for (const neighbor of neighbors) {
            if (obstacleSet.has(neighbor)) continue;

            const neighborLatLng = h3.cellToLatLng(neighbor);
            const tentative_gScore = gScore.get(current) + distance(currentLatLng, neighborLatLng);

            const neighborGScore = gScore.has(neighbor) ? gScore.get(neighbor) : Infinity;

            if (tentative_gScore < neighborGScore) {
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentative_gScore);
                fScore.set(neighbor, tentative_gScore + distance(neighborLatLng, endLatLng));
                
                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                }
            }
        }
    }

    throw new Error("No path found. The destination might be completely blocked.");
}

// Generate an obstacle zone (a circle of hexes)
function getRedZoneHexes(centerLatLng, radiusKm, res) {
    const centerHex = h3.latLngToCell(centerLatLng[0], centerLatLng[1], res);
    // Find the approximate grid radius based on edge length
    const edgeLenKm = h3.getHexagonEdgeLengthAvg(res, 'km');
    const ringSize = Math.ceil(radiusKm / (edgeLenKm * Math.sqrt(3))); // rough approximation
    
    return h3.gridDisk(centerHex, ringSize);
}

// ================= TEST RUN =================

// Resolution 10 is ~66m edge length (good for pathfinding in a neighborhood)
// We will test in Kolkata around [22.5726, 88.3639]
const res = 10;
const start = [22.5700, 88.3600];
const end = [22.5800, 88.3700];

// Let's drop a red zone in the middle
const redZoneCenter = [22.5750, 88.3650];
const redZoneRadiusKm = 0.4;

console.log(`Generating obstacle zone at ${redZoneCenter} with radius ${redZoneRadiusKm}km...`);
const obstacleHexes = getRedZoneHexes(redZoneCenter, redZoneRadiusKm, res);
console.log(`Generated ${obstacleHexes.length} obstacle hexes.`);

try {
    const pathHexes = findPath(start, end, obstacleHexes, res);
    console.log(`\nSUCCESS! Path found with ${pathHexes.length} hops.`);
    
    // Convert hex path back to coordinates for map rendering
    const pathCoords = pathHexes.map(hex => h3.cellToLatLng(hex));
    console.log(`First 3 coords:`, pathCoords.slice(0, 3));
    console.log(`...`);
    console.log(`Last 3 coords:`, pathCoords.slice(-3));

    // Print out a JSON that we can copy-paste into frontend testing if needed
    // console.log(JSON.stringify(pathCoords));
} catch (e) {
    console.error(`\nFAILED:`, e.message);
}
