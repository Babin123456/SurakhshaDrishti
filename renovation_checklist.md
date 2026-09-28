# The Great SurakshaDrishti Renovation 🛠️

This is the ultimate checklist for **Phase 2 Development**. We pitched an incredibly advanced, mathematically secure, zero-internet ecosystem in our idea submission. Now we have to actually build the missing logic to make it bulletproof. 

Here is everything left to tie up (the "loose ends") across the entire stack:

---

## 1. The Chatting & Communication System (Inter-agency)
Right now, the chat might just be passing basic strings over Socket.io. We need to upgrade it to match the pitch:
- [ ] **E2EE Degenerate Tree Integration:** Hook up `crypto.js` to the chat routes. Every message sent between NDRF, Police, and SDMA must be encrypted client-side using the hierarchical degenerate tree structure before hitting the backend.
- [ ] **Offline Chat Syncing:** If a node drops offline, local messages must queue up via IndexedDB and sync via the P2P mesh (or GSM bridge) once a connection is re-established.
- [ ] **Role-Based Chat Rooms:** Ensure the Command Console chat explicitly segregates channels (e.g., Tactical-Only for NDRF, Public-Broadcast for Civilians).

## 2. Multi-Agency Cryptographic Consensus (Edge Case 3)
We pitched that a Red Zone cannot be cleared until 80% of agencies agree. Currently, it's likely just an admin toggle.
- [ ] **The Consensus Engine:** Create a new table/state that tracks digital signatures from NDRF, Police, and SDMA. 
- [ ] **Voting Smart Contract / Logic:** The Red Zone status cannot switch from "Active" to "All Clear" until the threshold (80% / 3 out of 4 keys) is mathematically met on the backend.
- [ ] **Consensus Dashboard UI:** Build the UI panel where officers insert their physical/digital keys to cast their "Clearance Vote."

## 3. Dynamic H3 Routing & Bed Capacity (Edge Case 2)
We have `h3PathfindingTest.js`, but it needs to be fully integrated into the live app.
- [ ] **Live OSRM Routing:** Hook up a local instance of OSRM (Open Source Routing Machine).
- [ ] **Bed Capacity Balancer:** Currently, shelter capacities are mocked (e.g., `capacity: 300`). We need real-time decrementing. If Shelter A hits 95% capacity, the A* algorithm must dynamically recalculate the weight of that node and reroute civilians to Shelter B.
- [ ] **Pre-caching Vector Maps:** Implement the logic in `userApp` to proactively download OSM vector tiles the moment a Yellow warning is issued, ensuring offline map availability.

## 4. Hardware-Level Siren & Alerts (Edge Case 4)
We pitched bypassing "Do Not Disturb" at 3 AM.
- [ ] **Web Audio API Oscillator:** Write the script that generates the 800Hz square-wave siren.
- [ ] **Electron Frameless Override:** For the desktop client, use Electron's `setAlwaysOnTop` and `kiosk` modes to spawn an un-closeable alert window.
- [ ] **Native Mobile Hooks:** (For React Native / Android) Implement a background service that requests `ACCESS_NOTIFICATION_POLICY` to bypass silent mode and blast the audio.

## 5. QuickSign Offline Pass
We pitched instant credentialing without email 2FA during a crisis.
- [ ] **JWT Local Generation:** Create the fallback flow where a user can generate a localized ECDSA tracking token offline, turning them into a traceable node immediately without waiting for an OTP SMS that will never arrive.

## 6. Purging The Mocks (The Cleanup)
- [ ] Replace `MOCK-1` and `MOCK-2` in `zones.js` with real PostGIS spatial queries.
- [ ] Remove hardcoded capacities and distances (replace Haversine mock with the actual H3 distance calculation).
- [ ] Clean up all dummy data in the Supabase schema and enforce strict row-level security (RLS).
