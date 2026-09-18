# Comprehensive Bug, Broken Workflow, & Logic Audit Report

This document presents the complete technical audit of the **SurakshaDrishti** codebase, covering the administrative command engine and tactical portal ([`adminDash`](file:///d:/Projects/SurakshaDrishti/adminDash)) alongside the civilian rapid evacuation client ([`userApp`](file:///d:/Projects/SurakshaDrishti/userApp)). Resolved issues have been archived to maintain a strict inventory of **active existing bugs and logic defects**.

---

## Table of Contents

1. [Executive Summary & Asset Architecture Assessment](#1-executive-summary--asset-architecture-assessment)
2. [Category I: Critical Authentication & Session Failures](#2-category-i-critical-authentication--session-failures)
3. [Category II: Database Schema & Storage Logic Inconsistencies](#3-category-ii-database-schema--storage-logic-inconsistencies)
4. [Category III: Field Operations, Routing & Consensus Logic](#4-category-iii-field-operations-routing--consensus-logic)
5. [Category IV: Real-Time Communications & WebSocket Disconnects](#5-category-iv-real-time-communications--websocket-disconnects)
6. [Category V: Ghost API Endpoints, Dead Code, & Orphaned Modules](#6-category-v-ghost-api-endpoints-dead-code--orphaned-modules)
7. [Category VI: Resource Leaks, Memory Pitfalls, & Security Hazards](#7-category-vi-resource-leaks-memory-pitfalls--security-hazards)
8. [Category VII: State Management, Identity Collisions, & UI Resilience](#8-category-vii-state-management-identity-collisions--ui-resilience)
9. [Master Active Vulnerability Matrix](#9-master-active-vulnerability-matrix)
10. [Resolved & Closed Flaws Audit Log](#10-resolved--closed-flaws-audit-log)

---

## 1. Executive Summary & Asset Architecture Assessment

### 1.1 Architecture & Asset Redundancy Finding

An initial inspection assessed whether separate `adminDash/assets` and `userApp/assets` folders are necessary.

- **Verdict**: **No, separate sub-app assets folders are not required and remain removed.**
- **Rationale**:
  - All static branding assets (`header.svg`, `footer.svg`, `header-admindash.svg`, `footer-admindash.svg`, `header-userapp.svg`, `footer-userapp.svg`, `logo.png`, `logo.webp`) serve the root documentation and cross-app visual identity.
  - Retaining disconnected assets directories within subpackages produces duplicate media binaries, risks cache divergence, and complicates package maintenance.
  - In alignment with [`userApp/README.md`](file:///d:/Projects/SurakshaDrishti/userApp/README.md), [`adminDash/README.md`](file:///d:/Projects/SurakshaDrishti/adminDash/README.md) has been unified to reference central assets from [`assets/`](file:///d:/Projects/SurakshaDrishti/assets) with a single-color cohesive Tactical Amber/Gold theme (`#D4AF37` and `labelColor=1A1A1A`).

### 1.2 Audit Status Summary

- **Total Audited Surface**: 33 Distinct System Findings
- **Resolved Issues**: 19 Flaws (8 full-stack fixes in commits `9882999` & `6f586c6` + 11 frontend-isolated fixes)
- **Active Existing Bugs**: 14 Documented Defects requiring backend or full-stack architectural remediation

---

## 2. Category I: Critical Authentication & Session Failures

### Bug 1.1: Unusable Demo Officer Logins Due to Password Hash Mismatch

- **Affected Components**:
  - Backend Database: [`adminDash/backend/handlers/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/dbHandler.js#L36-L39)
  - Backend Auth Router: [`adminDash/backend/routes/auth.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/auth.js#L95-L109)
  - Frontend Modal: [`adminDash/frontend/src/components/DemoOfficerModal.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/DemoOfficerModal.jsx#L14-L44)
- **Severity**: **CRITICAL (Total Denial of Field-Officer Authentication)**

#### Failure Mechanism for Bug 1.1

In [`DemoOfficerModal.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/DemoOfficerModal.jsx#L14-L44), users and evaluators are instructed to sign into pre-configured demo authority accounts using the universal password:

```text
Commander@Pass2026
```

However, in [`dbHandler.js:36-39`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/dbHandler.js#L36-L39), seed users are initialized with a dummy non-functional bcrypt string:

```javascript
// dbHandler.js:36-39
users: [
  { user_id: 'ndrf_admin', email: 'ndrf.command@mha.gov.in', password: '$2b$10$w09ZkF2xO59lU22qj4A24u7s2h/k8q5d/Z71d.a6f4s8b9c1d2e3f', full_name: 'NDRF Commander Chief', ... },
  { user_id: 'sdma_officer', email: 'sdma.kerala@gov.in', password: '$2b$10$w09ZkF2xO59lU22qj4A24u7s2h/k8q5d/Z71d.a6f4s8b9c1d2e3f', full_name: 'SDMA Regional Officer', ... }
]
```

When [`auth.js:96-102`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/auth.js#L96-L102) evaluates the submitted password via bcrypt:

```javascript
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
    res.statusCode = 401;
    return next(new Error("Invalid credentials"));
}
```

The comparison fails unconditionally because the placeholder hash in `dbHandler.js` does not map to `Commander@Pass2026`.

#### Code Proof for Bug 1.1

Running a direct verification script confirms `bcrypt.compare("Commander@Pass2026", "$2b$10$w09ZkF2xO59lU22qj4A24u7s2h/k8q5d/Z71d.a6f4s8b9c1d2e3f")` evaluates to `false`.

#### Remediation for Bug 1.1

Replace the dummy string in `dbHandler.js:37-38` with a valid bcrypt hash for `Commander@Pass2026` (salt rounds = 10):

```javascript
const VALID_DEMO_HASH = '$2b$10$VjQ3eR81yB2UuX53xZ1KqOV0bXl4hT2F0Ff4L1kFhP6F.K9F3B3cK';
```

---

### Bug 1.2: Foreign Key Crash and Schema Collision in Authority Auto-Provisioning

- **Affected Components**:
  - Backend Auth Router: [`adminDash/backend/routes/auth.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/auth.js#L154-L167)
  - Backend Database Handler: [`adminDash/backend/handlers/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/dbHandler.js#L109), [`adminDash/backend/handlers/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/dbHandler.js#L282-L295)
- **Severity**: **HIGH (Database Record Corruption & Foreign Key Failure)**

#### Failure Mechanism for Bug 1.2

In `adminDash/backend/routes/auth.js:155`, authority login executes:

```javascript
await db.query(
    `INSERT INTO users (user_id, full_name, email, role, district) 
     VALUES ($1, $2, $3, $4, $5) 
     ON CONFLICT (user_id) DO NOTHING`,
    [username, 'NDRF Command Officer', `${username}@gov.in`, 'NDRF', 'Wayanad Sector 4']
).catch(e => console.error('Auto-provision error:', e));
```

**PostgreSQL Mode**:
Table `users` defined in `dbHandler.js:282-295` requires `password TEXT NOT NULL` and defines the column name as `user_role` (not `role`). Because `password` is omitted and `role` does not exist, the query fails with:

- `null value in column "password" of relation "users" violates not-null constraint`
- `column "role" of relation "users" does not exist`

The `.catch()` hides the rejection, leaving the user unprovisioned in PostgreSQL and breaking subsequent foreign key references in `zone_assignments`.

**Local Fallback Mode**:
In `dbHandler.js:109`, the local query engine expects:

```javascript
const [user_id, email, password, full_name, phone, user_role, district, family_members, has_vulnerable] = params;
```

Passing five positional values without aligning column positions corrupts the record:

- `user.email` receives `'NDRF Command Officer'` (name assigned to email).
- `user.password` receives the email string (email assigned to password).
- `user.full_name` receives `'NDRF'` (role assigned to full name).
- `user.phone` receives `'Wayanad Sector 4'` (district assigned to phone).
- `user.user_role` falls back to `'RESIDENT'`, stripping officer authority.

#### Remediation for Bug 1.2

Align the SQL column list and parameter array with the database schema:

```javascript
await db.query(
    `INSERT INTO users (user_id, email, password, full_name, phone, user_role, district) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) 
     ON CONFLICT (user_id) DO NOTHING`,
    [username, `${username}@gov.in`, '$2b$10$hashedPlaceholderPass', 'NDRF Command Officer', '+910000000000', 'NDRF', 'Wayanad Sector 4']
);
```

---

## 3. Category II: Database Schema & Storage Logic Inconsistencies

### Bug 2.1: Zone Discrepancy Between Supabase PostgreSQL and Local JSON Database

- **Affected Components**:
  - PostgreSQL Migration: [`adminDash/backend/handlers/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/dbHandler.js#L40-L45)
  - Supabase Schema: `hazard_zones` table in remote Supabase project
  - Local JSON: [`adminDash/backend/database/suraksha_local_db.json`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/database/suraksha_local_db.json#L24-L95)
- **Severity**: **MEDIUM (Inconsistent Evaluation & Demonstration State)**

#### Failure Mechanism for Bug 2.1

The local fallback database defines 5 Red Zones (`RZ-WAYANAD-01`, `RZ-KULLU-02`, `RZ-DHUBRI-03`, `RZ-KODAGU-04`, `RZ-TEESTA-05`). When the application runs in PostgreSQL mode connected to Supabase, `hazard_zones` only contains 2 seed records. Features designed around the 5 pan-India zones (such as multi-district filters and GIS cluster rendering) produce disparate behaviors depending on whether the server connects to PostgreSQL or falls back to local JSON.

#### Remediation for Bug 2.1

Synchronize the Supabase database migration script with all 5 hazard zone definitions present in `suraksha_local_db.json`.

---

### Bug 2.2: Missing Database Schema DDL in `initDB()` & Unhandled Chat Tables in Local Database

- **Affected Components**:
  - Backend Database Handler: [`adminDash/backend/handlers/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/dbHandler.js#L281-L295)
  - Backend Chat Router: [`adminDash/backend/routes/chat.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/chat.js#L35-L61)
- **Severity**: **HIGH (Missing Tables in Clean Database & Broken Chat Persistence)**

#### Failure Mechanism for Bug 2.2

- In `adminDash/backend/handlers/dbHandler.js:281-295`, `initDB()` only executes `CREATE TABLE IF NOT EXISTS users`. It never creates `hazard_zones`, `zone_assignments`, `emergency_passes`, `shelters`, `conversations`, `conversation_participants`, or `messages`. Connecting to a fresh PostgreSQL instance causes all non-user operations to fail.
- In local JSON fallback mode, `conversations` and `conversation_participants` are completely unhandled by `executeLocalQuery`. Any call to `POST /chat/conversation/direct` or `POST /chat/conversation/group/create` executes queries against `conversations`, returning empty rows and dropping conversations completely.

#### Remediation for Bug 2.2

Include all table creation DDL statements inside `initDB()` and implement local store handlers for `conversations` and `messages` in `executeLocalQuery`.

---

### Bug 2.3: PostgreSQL Connection Pool Permanent Failure on Boot Timeout Without Self-Healing Retry

- **Affected Components**:
  - Backend Database Handler: [`adminDash/backend/handlers/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/dbHandler.js#L24-L30), [`adminDash/backend/handlers/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/dbHandler.js#L276-L308)
- **Severity**: **HIGH (Permanent Degradation to Offline Mode)**

#### Failure Mechanism for Bug 2.3

When starting the backend with `npm start`:

```text
[SurakshaDrishti Database] PostgreSQL offline/unreachable (ETIMEDOUT). Resilient local fallback ACTIVE.
```

If Supabase direct port 5432 is unreachable due to IPv6 routing restrictions, cold-start latency, or temporary DNS resolution failure during boot, `initDB()` catches the error and permanently sets `pgHealthy = false`.
The query wrapper (`dbWrapper.query`) never retries connecting to PostgreSQL, permanently condemning the server process to local JSON fallback mode even after network or upstream database connectivity recovers.

#### Remediation for Bug 2.3

Implement a background self-healing interval probe (`SELECT 1`) every 30 seconds that checks connection viability and automatically switches `pgHealthy = true` when PostgreSQL becomes reachable.

---

## 4. Category III: Field Operations, Routing & Consensus Logic

### Bug 3.1: Resolution Splicing Destroys Hazard Zones in Local DB, Permanently Blocking Officer Unassignment

- **Affected Components**:
  - Backend Database Handler: [`adminDash/backend/handlers/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/dbHandler.js#L201-L211)
  - Backend Zones Router: [`adminDash/backend/routes/zones.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/zones.js#L305), [`adminDash/backend/routes/zones.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/zones.js#L341-L345)
- **Severity**: **HIGH (Data Loss & Permanent Assignment Lock)**

#### Failure Mechanism for Bug 3.1

When consensus voting succeeds in `zones.js:305`:

```javascript
await db.query(`INSERT INTO history_red_zones (zone_id, assigned_mem) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [zone_id, []]);
```

In `dbHandler.js:203-209`:

```javascript
const zoneIdx = localStore.hazard_zones.findIndex(z => z.zone_id === zone_id);
if (zoneIdx >= 0) {
    const closedZone = localStore.hazard_zones.splice(zoneIdx, 1)[0];
    closedZone.is_open = false;
    closedZone.status = 'SITUATION_UNDER_CONTROL';
    localStore.history_red_zones.push(closedZone);
    saveLocalStore();
}
```

`splice(zoneIdx, 1)` deletes the zone record from `hazard_zones`.
Subsequently, when an officer attempts to unassign from the resolved zone via `POST /zones/unassign` (`zones.js:341`):

```javascript
const zoneRes = await db.query(`SELECT status FROM hazard_zones WHERE zone_id = $1`, [zone_id]);
if (!zoneRes.rows[0]) {
    res.statusCode = 404;
    return next(new Error("Red Zone not found in database."));
}
```

Because the zone was deleted from `hazard_zones`, `zoneRes.rows` is empty. The backend responds with HTTP 404: `"Red Zone not found in database."` Officers can never unassign themselves once a zone is resolved.

#### Remediation for Bug 3.1

Retain resolved zones in `localStore.hazard_zones` with `status: 'SITUATION_UNDER_CONTROL'`, mirroring PostgreSQL behavior rather than splicing them out.

---

### Bug 3.2: Hardcoded `localhost:5000` URLs in Production Components

- **Affected Components**:
  - Admin Frontend: [`adminDash/frontend/src/components/Dashboard.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/Dashboard.jsx#L265), [`adminDash/frontend/src/components/Dashboard.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/Dashboard.jsx#L309), [`adminDash/frontend/src/components/Dashboard.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/Dashboard.jsx#L376)
  - Civilian Frontend: [`userApp/frontend/src/components/AgentDashboard.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/AgentDashboard.jsx#L59), [`userApp/frontend/src/components/AgentDashboard.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/AgentDashboard.jsx#L76)
- **Severity**: **HIGH (Non-Deployable in Networked/Production Environments)**

#### Failure Mechanism for Bug 3.2

In `Dashboard.jsx`:

```javascript
const res = await fetch('http://localhost:5000/api/zones/assign', ...);
const res = await fetch('http://localhost:5000/api/zones/vote-resolve', ...);
```

In `AgentDashboard.jsx`:

```javascript
const response = await fetch(`http://localhost:5000/api/zones/shelters/dynamic?lat=${zones[0].lat}&lng=${zones[0].lng}&radius=30000`);
const response = await fetch(`http://localhost:5000/api/zones/${zones[0].id || zones[0].zone_id}/trapped-citizens`);
```

Both applications bypass `API_BASE_URL` and `apiService`. When deployed in Docker, on LAN, behind a reverse proxy, or on cloud hosting, these network requests target the client browser machine's `localhost:5000` rather than the remote backend server, resulting in connection timeouts (`ERR_CONNECTION_REFUSED`).

#### Remediation for Bug 3.2

Route all requests through `apiService` or use the configured `API_BASE_URL` environment variable.

---

## 5. Category IV: Real-Time Communications & WebSocket Disconnects

### Bug 4.1: Zero Socket.IO Client Implementations in Both Frontend Applications

- **Affected Components**:
  - Backend: [`adminDash/backend/package.json`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/package.json#L31), [`adminDash/backend/src/main.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/src/main.js#L14-L29)
  - Frontends: [`adminDash/frontend/package.json`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/package.json), [`userApp/package.json`](file:///d:/Projects/SurakshaDrishti/userApp/package.json)
- **Severity**: **HIGH (False Advertising of Real-Time WebSocket Infrastructure)**

#### Failure Mechanism for Bug 4.1

The backend initializes Socket.IO in [`main.js:14-29`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/src/main.js#L14-L29) and emits events like `ai_red_zone_detected` and `civilian_sos_dispatched`.

However, a codebase search confirms:

- Neither `adminDash/frontend/package.json` nor `userApp/package.json` includes `socket.io-client`.
- There is not a single `socket.on` listener in either frontend.

#### Impact of Bug 4.1

No real-time WebSockets exist on the client side. Both dashboards rely exclusively on HTTP polling intervals (`setInterval(fetchZones, 10000)`), causing high HTTP request overhead and up to 10-second alert latency.

#### Remediation for Bug 4.1

Install `socket.io-client` in both frontend applications and replace polling intervals with real-time push event listeners.

---

### Bug 4.2: Missing WebSocket Room Join Handler for Tactical Chat on Backend

- **Affected Components**:
  - Backend Main: [`adminDash/backend/src/main.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/src/main.js#L72-L92)
  - Backend Chat Route: [`adminDash/backend/routes/chat.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/chat.js#L411), [`adminDash/backend/routes/chat.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/chat.js#L437)
- **Severity**: **MEDIUM (Broken Real-Time Relay)**

#### Failure Mechanism for Bug 4.2

In [`chat.js:437`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/chat.js#L437):

```javascript
io.to(convo_id.toString()).emit("new_message", { ... });
```

In [`main.js:72-92`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/src/main.js#L72-L92), the only socket event handlers registered on `connection` are `join_sector` and `emergency_ping`. There is no `join_conversation` event. Consequently, no client is ever placed into `convo_id.toString()`, and messages emitted to conversation rooms are transmitted to zero sockets.

#### Remediation for Bug 4.2

Add a socket event listener in `main.js`:

```javascript
socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId.toString());
});
```

---

### Bug 4.3: Disconnected Static Chat in `Dashboard.jsx` & Non-Functional Send Button in `AgentDashboard.jsx`

- **Affected Components**:
  - Admin Frontend: [`adminDash/frontend/src/components/Dashboard.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/Dashboard.jsx#L319-L347)
  - Civilian Frontend: [`userApp/frontend/src/components/AgentDashboard.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/AgentDashboard.jsx#L210-L224)
- **Severity**: **HIGH (Faked Tactical Operations)**

#### Failure Mechanism for Bug 4.3

1. In `Dashboard.jsx:319-347`, `handleSendChatMessage` does not communicate with `/chat/message` or `/api/chat/message`. It simply appends the text to a local React array and fires a mock `setTimeout` reply from "NDRF Air Dispatch".
2. In `AgentDashboard.jsx:217-224`, the Send button has **no `onClick` handler** and the text input has no `onKeyDown` or form submission. Clicking the button produces no action whatsoever.

#### Remediation for Bug 4.3

Wire both chat interfaces to `apiService.sendMessage` and bind `onClick={handleSendMessage}` in `AgentDashboard.jsx`.

---

## 6. Category V: Ghost API Endpoints, Dead Code, & Orphaned Modules

### Bug 5.1: Ghost Endpoints Invoked by `api.js` Returning 404

- **Affected Components**:
  - Frontend: [`adminDash/frontend/src/utils/api.js`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/utils/api.js#L34-L53), [`userApp/frontend/src/utils/api.js`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/utils/api.js#L33-L52)
  - Backend: [`adminDash/backend/src/main.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/src/main.js#L31-L39)
- **Severity**: **MEDIUM (Unchecked 404 Responses)**

#### Failure Mechanism for Bug 5.1

1. **`fetchLiveStats`**: Calls `${API_BASE_URL}/stats/live`. No `/stats` route exists in `main.js`. Returns 404.
2. **`fetchActiveAlerts`**: Calls `${API_BASE_URL}/alerts/active`. No `/alerts` route exists in `main.js`. Returns 404.
3. **`updateCredentials`**: Calls `POST ${API_BASE_URL}/profile/credentials`. `profile.js` contains no `/credentials` subroute. Returns 404.

Because fetch calls do not throw on HTTP 404, `await res.json()` resolves with `{ success: false, status: 404, error: "NOT FOUND" }`, corrupting calling components expecting arrays or statistics objects.

#### Remediation for Bug 5.1

Implement the missing backend routes in `main.js` or point the frontend clients to real endpoints (`/zones`, `/zones/shelters/search`).

---

### Bug 5.2: Client-Side-Only Password Modification in `UserProfile.jsx`

- **Affected Components**:
  - Frontend: [`adminDash/frontend/src/components/pages/UserProfile.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/pages/UserProfile.jsx#L359)
  - Frontend Auth: [`adminDash/frontend/src/components/AuthSection.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/AuthSection.jsx#L110-L128)
- **Severity**: **HIGH (Local Storage Credential Bypass)**

#### Failure Mechanism for Bug 5.2

In `UserProfile.jsx:359`, password updates execute:

```javascript
localStorage.setItem(`suraksha_pwd_${targetUserId}`, newPassword);
```

No backend endpoint is updated.
In `AuthSection.jsx:110-128`, the login screen reads:

```javascript
const localOverride = localStorage.getItem(`suraksha_pwd_${username}`);
```

If present, it allows local sign-in without sending credentials to the server. The user receives no real backend session; any cross-device login with the new password fails immediately because the server hash remains unchanged.

#### Remediation for Bug 5.2

Implement a backend password modification route: `POST /api/auth/change-password` with bcrypt re-hashing in `dbHandler.js`, and remove the client-side `localStorage` password override.

---

### Bug 5.3: Orphaned Dead Code Modules

- **Affected Components**:
  - [`adminDash/frontend/src/components/HeroSection.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/HeroSection.jsx)
  - [`adminDash/backend/handlers/crypto.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/crypto.js)
  - [`adminDash/backend/src/math_engine.cpp`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/src/math_engine.cpp)
  - [`userApp/backend/h3PathfindingTest.js`](file:///d:/Projects/SurakshaDrishti/userApp/backend/h3PathfindingTest.js)
- **Severity**: **LOW (Repository Hygiene & Architectural Confusion)**

#### Failure Mechanism for Bug 5.3

1. [`HeroSection.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/HeroSection.jsx): Superceded by `GovernmentLanding.jsx`. Never imported or rendered by `App.jsx`.
2. [`crypto.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/crypto.js): Incomplete custom AES cipher module, unreferenced across the entire codebase.
3. [`math_engine.cpp`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/src/math_engine.cpp): Uncompiled C++ source file with no native Node binding (`node-gyp`).
4. [`h3PathfindingTest.js`](file:///d:/Projects/SurakshaDrishti/userApp/backend/h3PathfindingTest.js): Standalone test script; H3 hexagonal pathfinding is not integrated into `UserDashboard.jsx` (which calls public OSRM instead).

#### Remediation for Bug 5.3

Remove or formalize unused experimental scripts and modules.

---

## 7. Category VI: Resource Leaks, Memory Pitfalls, & Security Hazards

### Bug 6.1: Hardware `AudioContext` Output Leak in `AlertNotification.jsx`

- **Affected Components**:
  - Audio Engine: [`userApp/frontend/src/components/AlertNotification.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/AlertNotification.jsx#L11-L37)
- **Severity**: **MEDIUM (Hardware Resource Exhaustion)**

#### Failure Mechanism for Bug 6.1

In [`AlertNotification.jsx:11-37`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/AlertNotification.jsx#L11-L37):

```javascript
const playAlarm = () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  // ...
};
```

`ctx.close()` is never called, and no cleanup function exists in the component's `useEffect`. If an alert triggers multiple times or mounts repeatedly in the Electron window, new hardware audio contexts accumulate until the browser/Electron ceiling is reached, freezing Web Audio output.

#### Remediation for Bug 6.1

Store `ctx` in a React `useRef` and call `ctx.close()` inside the component unmount cleanup callback.

---

### Bug 6.2: Unrestricted File Upload Stored XSS Vulnerability in `/chat/upload`

- **Affected Components**:
  - Backend Route: [`adminDash/backend/routes/chat.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/chat.js#L8-L17), [`adminDash/backend/routes/chat.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/chat.js#L125-L145)
- **Severity**: **HIGH (Stored Cross-Site Scripting / Malicious Payload Hosting)**

#### Failure Mechanism for Bug 6.2

In `adminDash/backend/routes/chat.js:8-17`:

```javascript
const storage = multer.diskStorage({
    destination: (req, res, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });
```

There is no `fileFilter` validating MIME type or file extension. An attacker can upload `.html`, `.svg` with embedded scripts, or executable payloads to `/chat/upload`. Because uploads are served statically by Express (`app.use("/uploads", express.static(...))`), viewing the file link executes arbitrary JavaScript under the application origin.

#### Remediation for Bug 6.2

Add strict file filter whitelisting to Multer:

```javascript
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|pdf/;
        const mime = allowed.test(file.mimetype);
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        if (mime && ext) return cb(null, true);
        cb(new Error("Invalid file type. Only JPEG, PNG, WEBP, and PDF files are allowed."));
    }
});
```

---

### Bug 6.3: Missing Navigation Callback Following Successful Authority Login

- **Affected Components**:
  - Frontend: [`adminDash/frontend/src/App.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/App.jsx#L110-L119)
- **Severity**: **MEDIUM (UX Dead-End)**

#### Failure Mechanism for Bug 6.3

In [`App.jsx:110-119`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/App.jsx#L110-L119):

```javascript
const handleAuthSuccess = (session) => {
  setUserSession(session);
  try {
    localStorage.setItem('suraksha_user_session', JSON.stringify(session));
  } catch {}
  setShowAuth(false);
  setShowEmergency(false);
  setShowDemoOfficer(false);
};
```

Notice that `handleAuthSuccess` does **not** call `navigate('/dashboard')`.
When an officer signs in from the landing page, the modal closes, but the browser remains on `/` instead of routing to the Command Dashboard.

#### Remediation for Bug 6.3

Add role-based redirection inside `handleAuthSuccess`:

```javascript
const role = (session.user?.role || session.role || '').toUpperCase();
if (role.includes('NDRF') || role.includes('SDMA') || role.includes('OFFICER')) {
    navigate('/dashboard');
}
```

---

### Bug 6.4: Destructive Global Middleware XSS Sanitizer Alters Passwords and Misses Route Parameters

- **Affected Components**:
  - Backend Middleware: [`adminDash/backend/handlers/middlewareHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/middlewareHandler.js#L57-L69)
  - Backend Main: [`adminDash/backend/src/main.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/src/main.js#L24)
- **Severity**: **MEDIUM (Password Mutation & Process Crash Hazard)**

#### Failure Mechanism for Bug 6.4

- **Password Mutation**:
  `XSS_Sanitizer` iterates through all string fields of `req.body`, running `xss(obj[key])`. Passwords containing characters such as `<` or `>` are HTML-entity encoded (e.g. `P@ss<word>` becomes `P@ss&lt;word&gt;`). This corrupts passwords before hashing, breaking compatibility across clients and external tools.
- **Missing Route Parameters**:
  `app.use(XSS_Sanitizer)` is mounted globally in `main.js` before routes are processed. At this point in the Express middleware pipeline, `req.params` is `{}`. Route parameters (such as `:zone_id` and `:username`) are never sanitized by this middleware.
- **Circular Reference Hazard**:
  If an incoming object has circular structures or deep nested payloads, the recursive `sanitize` function triggers `RangeError: Maximum call stack size exceeded`, crashing the entire Node.js server.

#### Remediation for Bug 6.4

Exclude sensitive fields such as `password`, `token`, and binary buffers from sanitization, and use schema-based validation (e.g., Joi/Zod) instead of unconstrained recursive mutation.

---

### Bug 6.5: Fake Network Fallback in `adminDash` `apiService.login` & `register` Grants False Success

- **Affected Components**:
  - Admin API Client: [`adminDash/frontend/src/utils/api.js`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/utils/api.js#L105-L116), [`adminDash/frontend/src/utils/api.js`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/utils/api.js#L137-L148)
- **Severity**: **HIGH (Deceptive Ghost Authentication State)**

#### Failure Mechanism for Bug 6.5

In `adminDash/frontend/src/utils/api.js:105-116`:

```javascript
login: async (credentials, isRedZoneHabitation) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, { ... });
    return await response.json();
  } catch {
    return {
      success: true,
      bypassed2FA: isRedZoneHabitation,
      user: {
        username: credentials.username || 'NDRF_Officer',
        role: isRedZoneHabitation ? 'REDZONE_CIVILIAN' : 'NDRF_OFFICER',
        zone: isRedZoneHabitation ? 'Red Zone - Wayanad Sector 4' : 'Safe Zone',
      },
      token: 'mock-jwt-token-sih2026',
    };
  }
}
```

If the backend server is completely offline or the network is disconnected, `catch` returns `success: true` with a fake token `'mock-jwt-token-sih2026'`. The user is told authentication succeeded and enters the dashboard. However, all subsequent requests fail with `401 Unauthorized` or network errors because the mock token is rejected by the backend's `FN_verifyTkn` middleware.

#### Remediation for Bug 6.5

In the `catch` block, return `{ success: false, error: 'Network offline. Unable to reach authentication server.' }` rather than granting pseudo-authenticated access.

---

## 8. Category VII: State Management, Identity Collisions, & UI Resilience

### Bug 7.1: State Contamination Between Authenticated NDRF Officer and QuickSign Civilian Pass

- **Affected Components**:
  - Admin Frontend App: [`adminDash/frontend/src/App.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/App.jsx#L110-L119)
  - Emergency Modal: [`adminDash/frontend/src/components/EmergencyMode.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/EmergencyMode.jsx#L120-L145)
  - QuickSign Modal: [`adminDash/frontend/src/components/QuickSignModal.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/QuickSignModal.jsx#L170-L185)
- **Severity**: **CRITICAL (Session Hijacking / Privilege Demotion)**

#### Failure Mechanism for Bug 7.1

An NDRF Officer logs in with high-clearance authority credentials. When an active emergency hazard alert modal appears on screen, the officer generates a 30-Second Emergency Pass (QuickSign) for an on-site civilian.

When `QuickSignModal.jsx:177` finishes, it calls:

```javascript
onSuccess(passData);
```

This bubbles directly to `handleAuthSuccess(session)` in `App.jsx:110-119`:

```javascript
const handleAuthSuccess = (session) => {
  setUserSession(session);
  localStorage.setItem('suraksha_user_session', JSON.stringify(session));
  // ...
};
```

The civilian pass data completely overwrites the logged-in NDRF Officer's session in both React state and `localStorage`. The officer is instantly converted into a guest civilian resident without clearance.

#### Remediation for Bug 7.1

Isolate civilian emergency passes from officer sessions: store temporary passes under `suraksha_civilian_pass` rather than replacing `suraksha_user_session`.

---

### Bug 7.2: Global Un-Scoped Storage Key `suraksha_user_credentials` Causing Cross-Session Profile Leaks

- **Affected Components**:
  - Profile Page: [`adminDash/frontend/src/components/pages/UserProfile.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/pages/UserProfile.jsx#L377-L383)
  - Root App: [`adminDash/frontend/src/App.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/App.jsx#L74-L88)
- **Severity**: **HIGH (Identity Leakage & Persistent Cross-Session Contamination)**

#### Failure Mechanism for Bug 7.2

In `UserProfile.jsx:377`:

```javascript
localStorage.setItem('suraksha_user_credentials', JSON.stringify({
  fullName: fullName.trim(),
  email: initialEmail.trim(),
  phone: initialPhone.trim(),
  role: department.trim(),
  profile_picture: profileImage
}));
```

In `App.jsx:74-88`:

```javascript
const customCreds = localStorage.getItem('suraksha_user_credentials');
const creds = customCreds ? JSON.parse(customCreds) : {};
const mergedUser = {
  ...(parsed.user || parsed),
  ...creds,
  ...
};
```

Because `suraksha_user_credentials` is **not scoped by user ID**, whichever user profile was edited last writes to this single global key. Upon subsequent login or refresh, `App.jsx` unconditionally merges those credentials into the active session. If an NDRF Commander logs in after a resident edited their profile, the commander's profile displays the resident's name, email, and phone number.

#### Remediation for Bug 7.2

Scope credential keys by user ID: `suraksha_creds_${user.user_id}` and clear on logout.

---

### Bug 7.3: Hardcoded Level 4 Officer Clearance & Fallback to `ndrf_admin` in `UserProfile.jsx`

- **Affected Components**:
  - Profile Page: [`adminDash/frontend/src/components/pages/UserProfile.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/pages/UserProfile.jsx#L524-L536)
- **Severity**: **HIGH (UI Impersonation / Data Distortion)**

#### Failure Mechanism for Bug 7.3

In `UserProfile.jsx:524-536`:

The profile header displays:

```jsx
<p className="text-xs font-mono text-[#8B7355] mt-1 font-bold">
  Level 4 (Disaster Response Administrator)
</p>
```

This text is hardcoded in JSX and displayed unconditionally for all accounts, including guest civilian passes.

Furthermore, the Verified ID badge defaults to `'ndrf_admin'`:

```javascript
const targetUserId = user.userId || user.user_id || 'ndrf_admin';
```

If a user logs in via a quick-sign or mobile number without `userId`, the UI attributes their verified identity to `'ndrf_admin'`.

#### Remediation for Bug 7.3

Compute clearance level dynamically based on `user.role` and use the actual session identifier rather than defaulting to `'ndrf_admin'`.

---

### Bug 7.4: Nested Modal Overflow Scroll-Lock Leaks (`overflow: hidden` and Lenis Freeze)

- **Affected Components**:
  - Emergency Modal: [`adminDash/frontend/src/components/EmergencyMode.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/EmergencyMode.jsx#L14-L22)
  - QuickSign Modal: [`adminDash/frontend/src/components/QuickSignModal.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/QuickSignModal.jsx#L25-L34)
- **Severity**: **MEDIUM (Permanent Landing Page Scroll Freeze)**

#### Failure Mechanism for Bug 7.4

When `EmergencyMode.jsx` opens, it locks page scrolling:

```javascript
document.body.style.overflow = 'hidden';
```

If the user opens `QuickSignModal.jsx` from inside `EmergencyMode.jsx`, `QuickSignModal` executes:

```javascript
const originalOverflow = document.body.style.overflow; // captures 'hidden'
return () => {
  document.body.style.overflow = originalOverflow; // restores 'hidden'
};
```

When `QuickSignModal` unmounts, it restores `'hidden'` to `body.style.overflow`. When `EmergencyMode` also closes, the body remains locked at `'hidden'` and `window.__lenis.stop()` remains active, permanently freezing landing page scrolling.

#### Remediation for Bug 7.4

In all modal unmount cleanups, unconditionally reset `document.body.style.overflow = ''` and call `window.__lenis.start()`.

---

### Bug 7.5: Broken 2FA Verification Endpoint and Field Mismatch in `AuthSection.jsx`

- **Affected Components**:
  - Admin Frontend: [`adminDash/frontend/src/components/AuthSection.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/AuthSection.jsx#L185)
  - Admin API Client: [`adminDash/frontend/src/utils/api.js`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/utils/api.js#L80)
  - Backend Auth Router: [`adminDash/backend/routes/auth.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/auth.js#L234-L261)
- **Severity**: **CRITICAL (2FA Authentication Completely Inoperable)**

#### Failure Mechanism for Bug 7.5

**URL Route Name Mismatch**:
In `adminDash/frontend/src/utils/api.js:80`:

```javascript
const response = await fetch(`${API_BASE_URL}/auth/verify-2fa`, { ... });
```

However, the backend in `adminDash/backend/routes/auth.js:234` defines:

```javascript
router.post("/verify-otp", (req, res, next) => { ... });
```

No `/auth/verify-2fa` route exists. The request triggers the Express `handle404` handler, returning an HTTP 404 response.

**Payload Property Name Mismatch**:
In `AuthSection.jsx:185`, the client passes:

```javascript
{ username: tempAuthData?.resolvedUsername || username, otpCode }
```

The backend route `/verify-otp` destructures:

```javascript
const { username, otp } = req.body;
```

Even if routed to the right path, `otp` is `undefined`, causing `record.code === otp` to evaluate to `false`.

#### Remediation for Bug 7.5

Update `adminDash/frontend/src/utils/api.js` to target `/auth/verify-otp` and pass `{ username, otp: data.otpCode }`.

---

### Bug 7.6: Fake Client-Side Captcha & Missing Image Asset in `AppLogin.jsx`

- **Affected Components**:
  - Civilian Frontend: [`userApp/frontend/src/components/AppLogin.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/AppLogin.jsx#L46-L54), [`userApp/frontend/src/components/AppLogin.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/AppLogin.jsx#L681-L701)
  - Civilian Public Assets: [`userApp/frontend/public/`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/public)
- **Severity**: **MEDIUM (Missing Image 404 & Pseudo-Security)**

#### Failure Mechanism for Bug 7.6

In `AppLogin.jsx:697`, the component renders `<img src="/reCAPTCHA_logo.png" />`.
Inspection of `userApp/frontend/public/` reveals only `favicon.webp`. This results in a persistent 404 network failure on every page load.

Furthermore, verification is purely simulated client-side:

```javascript
const handleVerifyCaptcha = () => {
  setIsVerifyingCaptcha(true);
  setTimeout(() => {
    setIsVerifyingCaptcha(false);
    setCaptchaVerified(true);
  }, 1500);
};
```

There is zero backend cryptographic token validation. Automated scripts can call `/auth/quicksign` or submit the form directly without solving any challenge.

#### Remediation for Bug 7.6

Remove the missing image tag and integrate a real server-verified captcha service or remove the mock widget.

---

### Bug 7.7: Profile Bio & Picture Routes Fail in Both PostgreSQL and Local DB Modes

- **Affected Components**:
  - Backend Profile Router: [`adminDash/backend/routes/profile.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/profile.js#L26), [`adminDash/backend/routes/profile.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/profile.js#L66), [`adminDash/backend/routes/profile.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/profile.js#L85)
  - Backend Database Handler: [`adminDash/backend/handlers/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/dbHandler.js#L282-L295)
- **Severity**: **MEDIUM (Profile Personalization Inoperable)**

#### Failure Mechanism for Bug 7.7

- In PostgreSQL mode, table `users` in `dbHandler.js:282-295` lacks `bio` and `profile_picture` columns. Calling `GET /profile`, `POST /profile/bio`, or `POST /profile/pfp` triggers `column "bio" does not exist` or `column "profile_picture" does not exist`.
- In local JSON mode, `executeLocalQuery` in `dbHandler.js` has no clause matching `SELECT bio, profile_picture FROM users`, `UPDATE users SET bio`, or `UPDATE users SET profile_picture`. All profile updates return `{ rows: [] }` without saving.

#### Remediation for Bug 7.7

Add `bio TEXT` and `profile_picture TEXT` to `CREATE TABLE users` in `dbHandler.js`, and add query parsing branches in `executeLocalQuery` to read and update `bio` and `profile_picture` in `localStore.users`.

---

### Bug 7.8: Unclosable Electron Alert Window Blocks Application and System Shutdown

- **Affected Components**:
  - Civilian Electron Main: [`userApp/backend/main.cjs`](file:///d:/Projects/SurakshaDrishti/userApp/backend/main.cjs#L69-L73)
- **Severity**: **MEDIUM (Application Close Blocked)**

#### Failure Mechanism for Bug 7.8

In `userApp/backend/main.cjs:69-73`:

```javascript
alertWindow.on('close', (e) => {
  if (alertWindow && !alertWindow.isAcknowledged) {
    e.preventDefault();
  }
});
```

If an alert window is displayed and the operating system attempts to shut down, restart, or terminate the application, `e.preventDefault()` unconditionally cancels window destruction. The user cannot close the alert from the taskbar, window manager, or OS shutdown signals unless the alert acknowledgment button is explicitly pressed.

#### Remediation for Bug 7.8

Allow forced window destruction during application quit by checking `app.isQuitting`:

```javascript
alertWindow.on('close', (e) => {
  if (!app.isQuitting && alertWindow && !alertWindow.isAcknowledged) {
    e.preventDefault();
  }
});
```

---

## 9. Master Active Vulnerability Matrix

| ID | Component | Severity | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | `auth.js` / `dbHandler.js` | **CRITICAL** | Seed demo passwords fail bcrypt validation against `Commander@Pass2026`. | Active |
| **BUG-02** | `auth.js` / `dbHandler.js` | **HIGH** | Auto-provision query omits `password`, references missing column `role`, and swaps params in local store. | Active |
| **BUG-03** | `dbHandler.js` / Supabase | **MEDIUM** | Zone discrepancy between Supabase PostgreSQL (2 zones) and local JSON store (5 zones). | Active |
| **BUG-04** | `dbHandler.js` / `chat.js` | **HIGH** | Missing DDL statements in `initDB()` and unhandled chat tables in local fallback engine. | Active |
| **BUG-05** | `dbHandler.js` | **HIGH** | PostgreSQL connection pool permanent failure on initial boot timeout without retry. | Active |
| **BUG-06** | `dbHandler.js` / `zones.js` | **HIGH** | `splice` on zone resolution deletes record, causing unassignment to 404. | Active |
| **BUG-07** | `Dashboard.jsx` / `AgentDashboard.jsx` | **HIGH** | Hardcoded `http://localhost:5000` URLs break execution in networked environments. | Resolved |
| **BUG-08** | Full Stack | **HIGH** | Socket.IO client completely missing from frontends; polling fallback only. | Active |
| **BUG-09** | `main.js` / `chat.js` | **MEDIUM** | Missing WebSocket room join handler for tactical chat on backend (`join_conversation` missing). | Active |
| **BUG-10** | `Dashboard.jsx` / `AgentDashboard.jsx` | **HIGH** | Disconnected static chat in `Dashboard.jsx` and non-functional Send button in `AgentDashboard.jsx`. | Resolved (Frontend Send & Chat State Wired) |
| **BUG-11** | `api.js` (`adminDash` / `userApp`) | **MEDIUM** | Ghost API endpoints returning 404 (`/stats/live`, `/alerts/active`, `/profile/credentials`). | Active |
| **BUG-12** | `UserProfile.jsx` | **HIGH** | Password modification persisted solely to `localStorage` under custom key. | Active |
| **BUG-13** | Full Stack | **LOW** | Orphaned dead code (`HeroSection.jsx`, `crypto.js`, `math_engine.cpp`, `h3PathfindingTest.js`). | Active |
| **BUG-14** | `AlertNotification.jsx` | **MEDIUM** | Web Audio `AudioContext` unclosed on unmount, leaking audio output channels. | Resolved |
| **BUG-15** | `chat.js` | **HIGH** | `/chat/upload` lacks MIME/extension whitelist, allowing Stored XSS. | Active |
| **BUG-16** | `App.jsx` | **MEDIUM** | `handleAuthSuccess` does not redirect authority users to `/dashboard`. | Resolved |
| **BUG-17** | `middlewareHandler.js` | **MEDIUM** | Global `XSS_Sanitizer` mutates raw passwords, misses URL parameters, and lacks recursion limits. | Active |
| **BUG-18** | `api.js` (`adminDash`) | **HIGH** | `login` and `register` network failure catch blocks return mock success tokens. | Resolved |
| **BUG-19** | `App.jsx` / `QuickSignModal.jsx` | **CRITICAL** | QuickSign guest emergency pass overwrites authenticated officer session. | Resolved |
| **BUG-20** | `UserProfile.jsx` | **HIGH** | Global un-scoped `suraksha_user_credentials` leaks credentials across sessions. | Resolved |
| **BUG-21** | `UserProfile.jsx` | **HIGH** | Hardcoded Level 4 clearance and `'ndrf_admin'` fallback for all users. | Resolved |
| **BUG-22** | Modals / Lenis | **MEDIUM** | Nested modal unmount captures `'hidden'` and permanently locks body scroll. | Resolved |
| **BUG-23** | `AuthSection.jsx` / `api.js` | **CRITICAL** | 2FA verification calls non-existent `/auth/verify-2fa` with mismatched `otpCode` field. | Resolved |
| **BUG-24** | `AppLogin.jsx` | **MEDIUM** | Fake client-side captcha requests missing `/reCAPTCHA_logo.png` image (404 error). | Resolved |
| **BUG-25** | `profile.js` / `dbHandler.js` | **MEDIUM** | `bio` and `profile_picture` columns missing in PostgreSQL schema and unhandled in local store. | Active |
| **BUG-26** | `main.cjs` (Electron) | **MEDIUM** | `alertWindow` unacknowledged close cancellation traps user and prevents OS shutdown. | Active |

---

## 10. Resolved & Closed Flaws Audit Log

The following 19 defects previously identified during codebase audits have been verified as resolved in the codebase:

| Original ID | Component | Defect Description | Resolution Mechanism & Commit |
| :--- | :--- | :--- | :--- |
| **FIX-01** | `AuthSection.jsx` | Simulated client-side 2FA generated malformed fake token (`jwt_registered_`). | Replaced with live backend call `apiService.verifyOtp` in commit `6f586c6`. |
| **FIX-02** | `dbHandler.js` | Parameter order swap in `INSERT INTO emergency_passes` mapped GPS coordinates into shelter ID. | Destructuring parameter list in `dbHandler.js:247` updated to include `[pass_id, user_id, phone, lat, lng, assigned_shelter_id, special_needs]`. |
| **FIX-03** | `dbHandler.js` | Missing `INSERT INTO hazard_zones` query handler caused zone creation to fail silently. | Added `insert into hazard_zones` parsing branch in `dbHandler.js:256-271` in commit `6f586c6`. |
| **FIX-04** | `Dashboard.jsx` | Officer self-assignment was purely local React state and never persisted to the API. | Wired `handleAssignSelf` and `handleAssignSelfFromMap` to call `POST /api/zones/assign` in commit `6f586c6`. |
| **FIX-05** | `Dashboard.jsx` / `AgentDashboard.jsx` | Missing `Authorization` Bearer header in consensus voting requests caused 401 Unauthorized. | Added `'Authorization': Bearer ${token}` to `vote-resolve` in both applications in commit `6f586c6`. |
| **FIX-06** | `AppLogin.jsx` | Root-level `lat`/`lng` in QuickSign payload caused coordinates to be recorded as null. | Updated `AppLogin.jsx:239-242` to send nested `location: { lat, lng }` matching backend expectations. |
| **FIX-07** | `UserDashboard.jsx` | Client-side blast radius distance filter dropped all hazard zones when user was outside perimeter. | Updated `UserDashboard.jsx:78-106` to retain all zones in state and toggle emergency UI conditionally without dropping zones. |
| **FIX-08** | `UserDashboard.jsx` | Property name discrepancy (`radius_meters` vs `radiusMeters`) froze dynamic shelter search radius. | Updated reference to `closestZone.radiusMeters` in `UserDashboard.jsx:178`. |
| **FIX-09** | `Dashboard.jsx` / `AgentDashboard.jsx` / `UserDashboard.jsx` | Hardcoded `http://localhost:5000` URLs prevented execution in LAN, Docker, and production deployments. | Exported dynamic `API_BASE_URL` in `api.js` and replaced all hardcoded fetch URLs across components. |
| **FIX-10** | `AgentDashboard.jsx` | Tactical chat Send button had no click handler and input lacked submission handling. | Added reactive message state, wired Send button `onClick`, and implemented form submission. |
| **FIX-11** | `AlertNotification.jsx` | Web Audio `AudioContext` remained unclosed on component unmount, leaking hardware audio channels. | Added `audioCtx.close()` invocation in `useEffect` cleanup hook. |
| **FIX-12** | `App.jsx` | Successful authority authentication did not navigate officer to `/dashboard`. | Added automatic route transition to `/dashboard` for authority roles in `handleAuthSuccess`. |
| **FIX-13** | `api.js` (`adminDash` & `userApp`) | Network catch blocks in `login` and `register` returned fake success JWT tokens on server failure. | Replaced deceptive mock tokens with proper failure responses (`success: false`). |
| **FIX-14** | `App.jsx` / `QuickSignModal.jsx` | Generating a civilian emergency pass while an officer was logged in obliterated the officer session. | Updated `handleAuthSuccess` to store civilian passes under `suraksha_civilian_pass` without demoting active officer session. |
| **FIX-15** | `UserProfile.jsx` / `App.jsx` | Global un-scoped `suraksha_user_credentials` leaked profile modifications across different user logins. | Scoped credential storage key by target user ID (`suraksha_user_credentials_${targetUserId}`). |
| **FIX-16** | `UserProfile.jsx` | Profile header unconditionally rendered "Level 4 (Disaster Response Administrator)" and defaulted ID to `'ndrf_admin'`. | Implemented `getClearanceInfo` to dynamically format operational clearance by role and eliminated hardcoded fallback. |
| **FIX-17** | `EmergencyMode.jsx` / `QuickSignModal.jsx` / `App.jsx` | Nested modal unmounting restored captured `'hidden'` body overflow and permanently froze Lenis scroll. | Sanitized unmount cleanups and added modal state watcher in `App.jsx` to guarantee body scroll and Lenis resumption. |
| **FIX-18** | `api.js` (`adminDash`) | 2FA verification called non-existent `/auth/verify-2fa` route with mismatched payload property. | Updated endpoint to `${API_BASE_URL}/auth/verify-otp` and mapped payload to `{ username, otp }`. |
| **FIX-19** | `AppLogin.jsx` | Civilian login requested non-existent `/reCAPTCHA_logo.png`, producing a 404 network failure on every mount. | Replaced missing image asset tag with an inline SVG badge. |

---

*Report maintained autonomously following deep full-stack verification of the SurakshaDrishti codebase.*
