<!-- markdownlint-disable -->

# Comprehensive Bug, Broken Workflow, & Logic Audit Report

This document presents the complete technical audit of the **SurakshaDrishti** codebase, covering the administrative command engine and tactical portal ([`adminDash`](file:///d:/Projects/SurakshaDrishti/adminDash)) alongside the civilian rapid evacuation client ([`userApp`](file:///d:/Projects/SurakshaDrishti/userApp)). Resolved issues have been archived to maintain a strict inventory of **active existing bugs and logic defects**.

---

## Table of Contents

1. [Executive Summary & Asset Architecture Assessment](#1-executive-summary--asset-architecture-assessment)
2. [Category I: Critical Authentication, Identity & Session Failures](#2-category-i-critical-authentication-identity--session-failures)
3. [Category II: Database Persistence & Storage Logic Deficiencies](#3-category-ii-database-persistence--storage-logic-deficiencies)
4. [Category III: Real-Time Communications & WebSocket Disconnects](#4-category-iii-real-time-communications--websocket-disconnects)
5. [Category IV: Dead Code, Inoperative Handlers, & UX Disconnects](#5-category-iv-dead-code-inoperative-handlers--ux-disconnects)
6. [Category V: Resource Leaks, Memory Pitfalls, & Security Hazards](#6-category-v-resource-leaks-memory-pitfalls--security-hazards)
7. [Category VI: State Management, Credential Leaks, & Dynamic UI Resilience](#7-category-vi-state-management-credential-leaks--dynamic-ui-resilience)
8. [Category VII: Mobile / Android Migration Readiness & Platform Portability Blockers](#8-category-vii-mobile--android-migration-readiness--platform-portability-blockers)
9. [Active Vulnerability & Defect Matrix](#9-active-vulnerability--defect-matrix)
10. [Resolved Defects Matrix](#10-resolved-defects-matrix)
11. [Historical Closed Flaws Audit Log](#11-historical-closed-flaws-audit-log)

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

- **Total Audited Surface**: 36 Distinct System Findings
- **Resolved Issues**: 24 Verified Flaws (including recent upstream commits `18e9d22`, `62b79a3`, `d10474f`, and prior sprint resolutions)
- **Active Existing Bugs**: 12 Documented Defects requiring backend or full-stack architectural remediation

---

## 2. Category I: Critical Authentication, Identity & Session Failures

### Bug 1.1: Missing Initial Seed Officers in PostgreSQL Supabase Instance

- **Affected Components**:
  - Backend Database: [`adminDash/backend/handlers/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/dbHandler.js)
  - Backend DDL: [`adminDash/backend/database/schema.sql`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/database/schema.sql)
  - Backend Auth Router: [`adminDash/backend/routes/auth.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/auth.js#L67-L72)
- **Severity**: **HIGH (Clean Database Instance Auth Lockout)**

#### Failure Mechanism
While `DemoOfficerModal.jsx` and the flawed auto-provisioning queries were removed in recent commits, `dbHandler.js` now strictly runs `schema.sql` on startup against PostgreSQL and throws an error if PostgreSQL is offline (having removed the local fallback memory store).
`schema.sql` contains exclusively `CREATE TABLE` and `CREATE INDEX` statements; it contains **zero `INSERT INTO users` seed records**.
When connecting to a clean Supabase/PostgreSQL database, the `users` table is completely empty. Evaluators attempting to log in as `ndrf_admin` or `sdma_officer` receive an immediate rejection (`"Username/Email not found. Please register first."`) because no command officer accounts exist in the database until manual registration occurs.

#### Remediation
Add seed authority officer inserts to `schema.sql` with valid pre-hashed bcrypt credentials (e.g. for `ndrf_admin`, `sdma_officer`, and `officer_vikram_singh`) using `ON CONFLICT (user_id) DO NOTHING`.

---

### Bug 1.2: Client-Side-Only Password Modification in `UserProfile.jsx`

- **Affected Components**:
  - Frontend Profile: [`adminDash/frontend/src/components/pages/UserProfile.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/pages/UserProfile.jsx#L376)
  - Backend Auth Router: [`adminDash/backend/routes/auth.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/auth.js)
- **Severity**: **HIGH (Local Storage Credential Bypass & Cross-Device Auth Divergence)**

#### Failure Mechanism
In [`UserProfile.jsx:376`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/pages/UserProfile.jsx#L376), when an officer modifies their security passcode, the change is written exclusively to local storage:
```javascript
localStorage.setItem(`suraksha_pwd_${targetUserId}`, newPassword);
```
No HTTP request is dispatched to the backend. While `AuthSection.jsx` previously checked `localStorage.getItem('suraksha_pwd_...')` to allow local bypass, that backdoor was removed. Consequently:
1. The backend database never receives the updated password hash.
2. Any subsequent session sign-in using the new password fails with HTTP 401 `"Incorrect password"`.
3. The password change in `UserProfile.jsx` is entirely illusory and breaks officer authentication across devices and browser sessions.

#### Remediation
Implement an authenticated `POST /api/auth/change-password` endpoint in `auth.js` that compares current password with `bcrypt.compare`, hashes the new password with `Hash_Pass()`, and executes `UPDATE users SET password = $1 WHERE user_id = $2`. Update `UserProfile.jsx` to call this endpoint.

---

## 3. Category II: Database Persistence & Storage Logic Deficiencies

### Bug 2.1: Missing Initial Zone Seeds in PostgreSQL DDL

- **Affected Components**:
  - PostgreSQL DDL: [`adminDash/backend/database/schema.sql`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/database/schema.sql)
  - Database Handler: [`adminDash/backend/handlers/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/dbHandler.js#L40-L51)
- **Severity**: **MEDIUM (Inconsistent Evaluation State on Fresh Database)**

#### Failure Mechanism
The `suraksha_local_db.json` file contains 5 pan-India hazard zones (`RZ-WAYANAD-01`, `RZ-KULLU-02`, `RZ-DHUBRI-03`, `RZ-KODAGU-04`, `RZ-TEESTA-05`), but `schema.sql` contains no seed `INSERT INTO hazard_zones`.
Because `dbHandler.js` now connects directly to PostgreSQL without the JSON fallback, initializing a clean database results in zero hazard zones. When `/zones` is requested, an empty array is returned until an officer manually creates zones via `POST /zones/create` or triggers the satellite detection API.

#### Remediation
Append the 5 standard pan-India disaster zones into `schema.sql` with `INSERT INTO hazard_zones (...) VALUES (...) ON CONFLICT (zone_id) DO NOTHING`.

---

### Bug 2.2: Hard Failure Mode on Database Disconnect Crashing All Endpoints

- **Affected Components**:
  - Backend Database Handler: [`adminDash/backend/handlers/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/dbHandler.js#L79-L87)
- **Severity**: **HIGH (Total Application Denial of Service during Cold Starts)**

#### Failure Mechanism
In `dbHandler.js:79-87`:
```javascript
const dbWrapper = {
    query: async (text, params) => {
        if (!pgHealthy) {
            throw new Error("Database is currently offline. Please wait for reconnection.");
        }
        return await pool.query(text, params);
    },
    getPool: () => pool
};
```
While retry logic was added to `initDB()`, any query executed while `!pgHealthy` (such as during an initial 5-10 second cold start from Supabase or during temporary network timeouts) immediately throws an unhandled error. Because the resilient local fallback engine was stripped, the application provides zero offline demonstration capability during network drops or AWS/Supabase maintenance.

#### Remediation
Implement graceful fallback responses or queue queries with a short timeout window before throwing errors, and provide a mock/read-only mode when database connectivity is severed.

---

## 4. Category III: Real-Time Communications & WebSocket Disconnects

### Bug 3.1: Socket.IO Client Missing from Frontends (HTTP Polling Only)

- **Affected Components**:
  - Backend: [`adminDash/backend/src/main.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/src/main.js#L79-L127)
  - Frontends: [`adminDash/frontend/package.json`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/package.json), [`userApp/package.json`](file:///d:/Projects/SurakshaDrishti/userApp/package.json)
- **Severity**: **HIGH (High Alert Latency & Bandwidth Waste)**

#### Failure Mechanism
The backend sets up a Socket.IO server on `http.createServer(app)` and emits events like `ai_red_zone_detected`, `red_zone_alert`, and `new_message`.
However, neither frontend application has `socket.io-client` installed in `package.json`, nor do they instantiate a `socket.connect()` listener.
Both dashboards rely exclusively on `setInterval` HTTP polling (e.g. `setInterval(fetchZones, 10000)` in `AgentDashboard.jsx`). Real-time tactical emergency broadcasts advertised in the UI are subject to up to 10–15 seconds of polling latency.

#### Remediation
Install `socket.io-client` in `adminDash/frontend` and `userApp/frontend`, and connect listeners to update zone perimeters and alerts instantaneously.

---

### Bug 3.2: Missing WebSocket Room Join Handler for Tactical Chat on Backend

- **Affected Components**:
  - Backend Main: [`adminDash/backend/src/main.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/src/main.js#L107-L127)
  - Backend Chat Route: [`adminDash/backend/routes/chat.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/chat.js#L421), [`adminDash/backend/routes/chat.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/chat.js#L447)
- **Severity**: **MEDIUM (Broken Real-Time Chat Relay)**

#### Failure Mechanism
In `chat.js:447`:
```javascript
io.to(convo_id.toString()).emit("new_message", { ... });
```
In `main.js:107-127`, the registered socket event handlers on connection are only `join_sector` and `emergency_ping`. There is no `join_conversation` event listener.
Even if clients connect to Socket.IO, sockets are never added to the room matching `convo_id.toString()`, so messages emitted to `convo_id` are delivered to zero recipients.

#### Remediation
Add socket listener in `main.js`:
```javascript
socket.on("join_conversation", (convoId) => {
    socket.join(convoId.toString());
});
```

---

### Bug 3.3: Mock Tactical Chat in `Dashboard.jsx` Disconnected from Backend Chat Engine

- **Affected Components**:
  - Admin Frontend: [`adminDash/frontend/src/components/Dashboard.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/Dashboard.jsx#L341-L369)
  - Backend Chat Engine: [`adminDash/backend/routes/chat.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/chat.js#L369)
- **Severity**: **HIGH (Faked Inter-Agency Tactical Operations)**

#### Failure Mechanism
In `Dashboard.jsx:341-369`, when an officer sends a message in the TeamViewer-style tactical popup:
```javascript
const handleSendChatMessage = (e) => {
  // ...
  setChatMessages(prev => [...prev, newMsg]);
  setTimeout(() => {
    setChatMessages(prev => [...prev, { sender: 'NDRF Air Dispatch', ... }]);
  }, 1200);
};
```
The component bypasses the entire backend chat infrastructure (`/chat/message`, E2EE, and PostgreSQL `chat_logs`), simulating replies via `setTimeout`. True inter-officer cross-terminal communication does not function in the main dashboard.

#### Remediation
Wire `handleSendChatMessage` to call `POST /chat/message` with active zone conversation context and populate messages from `GET /chat/history/:conversation_id`.

---

## 5. Category IV: Dead Code, Inoperative Handlers, & UX Disconnects

### Bug 4.1: Orphaned Dead Code Modules

- **Affected Components**:
  - [`adminDash/frontend/src/components/HeroSection.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/HeroSection.jsx)
  - [`adminDash/backend/handlers/crypto.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/crypto.js)
  - [`adminDash/backend/src/math_engine.cpp`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/src/math_engine.cpp)
  - [`userApp/backend/h3PathfindingTest.js`](file:///d:/Projects/SurakshaDrishti/userApp/backend/h3PathfindingTest.js)
- **Severity**: **LOW (Repository Cleanliness & Technical Debt)**

#### Failure Mechanism
1. `HeroSection.jsx`: Legacy hero component completely superseded by `GovernmentLanding.jsx`. Never imported or mounted by `App.jsx`.
2. `crypto.js`: Unfinished custom AES cipher module unreferenced anywhere in the backend (built-in `crypto` and `bcrypt` are used instead).
3. `math_engine.cpp`: Uncompiled C++ file with no native Node binding (`node-gyp`).
4. `h3PathfindingTest.js`: Standalone script; H3 hexagonal pathfinding is not wired to `UserDashboard.jsx` (which relies on OSRM).

#### Remediation
Remove obsolete unreferenced files from the codebase.

---

### Bug 4.2: Unhandled Inoperative `onOpenDemo` Buttons in Navbar & CTASection

- **Affected Components**:
  - [`adminDash/frontend/src/App.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/App.jsx#L430), [`adminDash/frontend/src/App.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/App.jsx#L462)
  - [`adminDash/frontend/src/components/Navbar.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/Navbar.jsx#L161), [`adminDash/frontend/src/components/Navbar.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/Navbar.jsx#L341)
  - [`adminDash/frontend/src/components/CTASection.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/CTASection.jsx#L80)
- **Severity**: **MEDIUM (Dead UI Buttons / Non-Responsive User Interactions)**
- **Status**: **RESOLVED** (Logged in FIX-25)

#### Failure Mechanism
In commit `18e9d22`, `DemoOfficerModal.jsx` was deleted and `setShowDemoOfficer` was removed from `App.jsx`.
However:
1. `Navbar.jsx` still renders the `"Demo Access"` / `"Demo Officer Access (1-Click)"` buttons in both desktop header and mobile menu, binding `onClick={onOpenDemo}`.
2. `CTASection.jsx` still renders `"Demo Officer (1-Click)"`, binding `onClick={onOpenDemo}`.
3. In `App.jsx`, neither `<Navbar />` nor `<CTASection />` is passed an `onOpenDemo` prop. Clicking these buttons results in `undefined()` and produces zero UI feedback.

#### Remediation & Resolution
Connected `onOpenDemo={() => handleOpenAuth('signin')}` in [`App.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/App.jsx) across both `<Navbar />` and `<CTASection />`, routing clicks directly into the official command desk sign-in flow.

---

### Bug 4.3: Unreferenced Sign-Up Sub-View in `AuthSection.jsx`

- **Affected Components**:
  - [`adminDash/frontend/src/components/AuthSection.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/AuthSection.jsx#L31), [`adminDash/frontend/src/components/AuthSection.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/AuthSection.jsx#L185-L225)
- **Severity**: **LOW (Dead Code / Unreachable Handler)**
- **Status**: **RESOLVED** (Logged in FIX-26)

#### Failure Mechanism
`AuthSection.jsx` declares full state and a `handleSignUp` submission handler (`lines 185-225`) calling `apiService.register`.
However, the JSX template only branches on:
```jsx
{authMode === 'otp' ? ( /* OTP form */ ) : ( /* Official Sign In form */ )}
```
There is no `authMode === 'signup'` JSX branch rendered anywhere in `AuthSection.jsx`. Passing `initialMode="signup"` from `CTASection.jsx` renders the official command sign-in form instead of a sign-up form.

#### Remediation & Resolution
Added an Apple/Gov-styled tab toggle (`Command Sign In` / `Register Personnel`) and rendered the full registration form (Name, Official Email, Mobile Phone, Tactical Role dropdown, Assigned District, Password, and GPS Geolocation detection) wired to `handleSignUp`.

---

## 6. Category V: Resource Leaks, Memory Pitfalls, & Security Hazards

### Bug 5.1: Electron `alertWindow` Close Cancellation Traps User and Prevents OS Shutdown

- **Affected Components**:
  - Civilian Desktop Main: [`userApp/backend/main.cjs`](file:///d:/Projects/SurakshaDrishti/userApp/backend/main.cjs#L69-L73)
- **Severity**: **MEDIUM (Application Close Blocked & OS Shutdown Interference)**

#### Failure Mechanism
In `userApp/backend/main.cjs:69-73`:
```javascript
alertWindow.on('close', (e) => {
  if (alertWindow && !alertWindow.isAcknowledged) {
    e.preventDefault();
  }
});
```
When an alert window is active and the user or OS attempts to terminate the application (e.g. system reboot, SIGTERM, or task manager close), `e.preventDefault()` unconditionally cancels window destruction. The user cannot close the alert unless the acknowledgment button inside the DOM is clicked.

#### Remediation
Track `app.isQuitting` and permit close events during application termination:
```javascript
let isQuitting = false;
app.on('before-quit', () => { isQuitting = true; });
alertWindow.on('close', (e) => {
  if (!isQuitting && alertWindow && !alertWindow.isAcknowledged) {
    e.preventDefault();
  }
});
```

---

## 7. Category VI: State Management, Credential Leaks, & Dynamic UI Resilience

### Bug 6.1: Global Un-Scoped `suraksha_user_credentials` Key in `UserProfile.jsx` Email/Phone Verification

- **Affected Components**:
  - Profile Page: [`adminDash/frontend/src/components/pages/UserProfile.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/pages/UserProfile.jsx#L217), [`adminDash/frontend/src/components/pages/UserProfile.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/pages/UserProfile.jsx#L257)
- **Severity**: **MEDIUM (Identity Leak Across Sessions)**
- **Status**: **RESOLVED** (Logged in FIX-27)

#### Failure Mechanism
While the main profile save at line 394 was scoped to `suraksha_user_credentials_${targetUserId}`, the 2FA verification success callbacks for Email and Phone changes in `UserProfile.jsx:217` and `UserProfile.jsx:257` still execute:
```javascript
localStorage.setItem('suraksha_user_credentials', JSON.stringify({ ... }));
```
If an officer updates their contact phone or email via 2FA, it writes to the legacy un-scoped key, causing cross-session profile pollution when another user signs in on the same browser.

#### Remediation & Resolution
Updated lines 217 and 257 in [`UserProfile.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/pages/UserProfile.jsx) to write strictly to `suraksha_user_credentials_${targetUserId}`, isolating officer credentials from cross-session pollution.

---

## 8. Category VII: Mobile / Android Migration Readiness & Platform Portability Blockers

This section assesses the architectural feasibility of migrating `userApp` from its current Electron desktop container to native/hybrid Android (Capacitor or React Native). While the pure React business logic, Haversine geo-math, OSRM routing, and HTTP API layer are 100% portable, the following 4 structural platform dependencies must be refactored.

### Bug 7.1: Hard Platform Lock-in to Desktop Electron Runtime (`main.cjs` / IPC)

- **Affected Components**:
  - Runtime Layer: [`userApp/backend/main.cjs`](file:///d:/Projects/SurakshaDrishti/userApp/backend/main.cjs#L1-L114)
  - Preload Script: [`userApp/backend/preload.cjs`](file:///d:/Projects/SurakshaDrishti/userApp/backend/preload.cjs)
  - IPC Listeners: [`userApp/frontend/src/components/AlertNotification.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/AlertNotification.jsx)
- **Severity**: **CRITICAL (Platform Migration Blocker)**

#### Failure Mechanism
The application lifecycle, emergency priority display, and inter-window communications are coupled directly to Node.js/Electron modules:
- `main.cjs` instantiates two separate desktop `BrowserWindow` instances (`mainWindow` and `alertWindow`) using `screen.getPrimaryDisplay()`.
- Emergency alerts rely on Electron IPC channels (`trigger-alert`, `acknowledge-alert`, `alert-data`).
- Android has no concept of Electron `BrowserWindow` or Node.js IPC. Running this app on an Android device without replacing the runtime causes complete startup failure.

#### Remediation
- **For Capacitor / Cordova**: Replace the Electron main process with `@capacitor/core` and bridge the emergency alerts to native Android notifications via `@capacitor/push-notifications` or `@capacitor/local-notifications`.
- **For React Native / Expo**: Replace window management with React Navigation and Firebase Cloud Messaging (FCM) heads-up notifications.

---

### Bug 7.2: Web-Only Leaflet DOM Map Engine Incompatible with Native Android Runtimes

- **Affected Components**:
  - Map Engine: [`userApp/frontend/src/components/RealGoogleMap.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/RealGoogleMap.jsx#L1-L80)
  - Package Dependencies: [`userApp/package.json`](file:///d:/Projects/SurakshaDrishti/userApp/package.json#L16)
- **Severity**: **HIGH (Native Mobile Rendering Blocker)**
- **Status**: **RESOLVED** (Logged in FIX-28)

#### Failure Mechanism
`RealGoogleMap.jsx` (~1,300 lines) was built on top of standard browser Leaflet (`L.map`, `L.tileLayer`, `L.marker`, `L.polyline`, `L.geoJSON`).
- Leaflet strictly requires an active HTML DOM (`document.createElement`, CSS transform animations, DOM event propagation).
- If using Capacitor/WebView, Leaflet without hardware acceleration suffered from performance degradation (pinch-to-zoom lag, battery drain, tile memory pressure) on lower-end Android hardware during crisis events.

#### Remediation & Resolution
Configured Leaflet with `preferCanvas: true` for GPU-hardware-accelerated canvas rendering, enabled touch gestures (`touchZoom: true`, `tap: true`, `bounceAtZoomLimits: false`), and added clean `ResizeObserver` lifecycle management in [`RealGoogleMap.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/RealGoogleMap.jsx).

---

### Bug 7.3: Browser `sessionStorage` Volatility & Non-Portability on Native Mobile

- **Affected Components**:
  - Auth Flow & State: [`userApp/frontend/src/App.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/App.jsx#L14-L28)
  - Login Component: [`userApp/frontend/src/components/AppLogin.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/AppLogin.jsx)
- **Severity**: **MEDIUM (Session Loss & Mobile Storage Incompatibility)**
- **Status**: **RESOLVED** (Logged in FIX-29)

#### Failure Mechanism
`App.jsx` stored auth tokens and session profiles exclusively in browser `sessionStorage` (`suraksha_app_session`, `suraksha_intro_shown`).
- On Android, mobile operating systems aggressively kill background web processes and tasks to reclaim RAM. When an Android user switches to another app or the system pauses the app, `sessionStorage` was wiped, forcing citizens and rescue officers to re-authenticate during an evacuation.

#### Remediation & Resolution
Implemented a resilient multi-platform adapter in [`userApp/frontend/src/utils/storage.js`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/utils/storage.js) with native Capacitor Preferences, persistent `localStorage`, `sessionStorage`, and in-memory fallback tiers, integrated into [`userApp/frontend/src/App.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/App.jsx).

---

### Bug 7.4: Direct `window.location` URL/Hash Parsing Without Mobile Route Stack

- **Affected Components**:
  - Root Routing: [`userApp/frontend/src/App.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/App.jsx#L33)
  - Dashboard Navigation: [`userApp/frontend/src/components/UserDashboard.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/UserDashboard.jsx#L38), [`userApp/frontend/src/components/UserDashboard.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/UserDashboard.jsx#L54-L61)
- **Severity**: **MEDIUM (Broken Deep-Linking & Hardware Back Button Handling)**
- **Status**: **RESOLVED** (Logged in FIX-30)

#### Failure Mechanism
Routing decisions (such as launching the standalone emergency alert modal or detecting dashboard tab changes) were implemented via raw browser window queries:
```javascript
const isAlertRoute = window.location.pathname === '/alert' || window.location.hash === '#/alert';
```
- Android applications have no browser address bar. Relying on raw `window.location` failed to integrate with the Android hardware back button (`BackHandler`), back gesture navigation, and Android Intent deep linking.

#### Remediation & Resolution
Integrated responsive path change listeners (`popstate`, `hashchange`) along with native Android back-button hooks (`ionBackButton` and document `backbutton`) in [`userApp/frontend/src/App.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/App.jsx) and [`userApp/frontend/src/components/UserDashboard.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/UserDashboard.jsx).

## 9. Active Vulnerability & Defect Matrix

The following **7 active bugs and architectural blockers** remain in the codebase. Each entry details the exact code location, failure mechanism, and required remediation steps.

| Bug ID | Component & File Location | Severity | Defect Description | Root Cause & Failure Location | Remediation Plan (How to Fix) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | [`adminDash/backend/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/dbHandler.js#L141)<br/>[`adminDash/backend/schema.sql`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/schema.sql#L1-L20) | **HIGH** | Clean PostgreSQL instance has zero seed authority users, causing complete auth lockout. | `schema.sql` creates the `users` table without inserting initial command accounts. Bcrypt passwords are only checked against PostgreSQL; on a fresh database, login fails for all roles. | Add seed `INSERT INTO users (user_id, username, password, role, full_name, email) VALUES (...)` with pre-hashed bcrypt credentials (`$2a$10$...`) directly into `schema.sql`. |
| **BUG-02** | [`adminDash/frontend/src/components/pages/UserProfile.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/pages/UserProfile.jsx#L370-L405)<br/>[`adminDash/backend/routes/profile.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/profile.js#L35) | **HIGH** | Password modification is persisted solely to browser `localStorage`; server hash remains unchanged. | Lines 370–405 update `localStorage` and memory session, but do not execute `apiService.updateCredentials({ currentPassword, newPassword, ... })`. On server relogin or different terminal, the old password persists. | Call `await apiService.updateCredentials(...)` inside `handleSaveCredentials` and ensure `profile.js` re-hashes the new password with bcrypt before updating PostgreSQL `users`. |
| **BUG-03** | [`adminDash/backend/schema.sql`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/schema.sql#L35-L60)<br/>[`adminDash/backend/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/dbHandler.js#L268) | **MEDIUM** | `schema.sql` lacks seed hazard zones, returning empty array on clean database. | `schema.sql` defines the `hazard_zones` table structure but lacks default geo-zones. Unlike the removed local JSON store, a fresh database leaves the GIS map completely blank. | Add seed `INSERT INTO hazard_zones (id, name, hazard_type, risk_level, lat, lng, radius_meters, status) VALUES (...)` in `schema.sql` for Wayanad, Teesta, and Joshimath sectors. |
| **BUG-04** | [`adminDash/backend/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/dbHandler.js#L111-L121) | **HIGH** | Hard database crash on cold-start or temporary database outage due to removed fallback. | Lines 111–119 throw an unhandled `Error("Database is currently offline")` when `!pgHealthy`. Any query during Supabase's 5–10s cold-start or network glitch causes crashes. | Implement queueing with a short retry timeout before throwing errors, and provide a read-only mock snapshot fallback when database connectivity is severed. |
| **BUG-05** | [`adminDash/frontend/package.json`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/package.json)<br/>[`userApp/package.json`](file:///d:/Projects/SurakshaDrishti/userApp/package.json)<br/>[`adminDash/backend/src/main.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/src/main.js#L79-L127) | **HIGH** | Socket.IO client missing from frontends; alerts limited to HTTP polling intervals. | Backend emits `ai_red_zone_detected` and `red_zone_alert` via Socket.IO, but frontends lack `socket.io-client` in `package.json` and rely on 10s `setInterval` polling. | Run `npm install socket.io-client` in both frontends, instantiate a persistent socket connection, and bind event handlers (`on('red_zone_alert')`) for instant sub-second alert updates. |
| **BUG-06** | [`adminDash/backend/src/main.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/src/main.js#L107-L127)<br/>[`adminDash/backend/routes/chat.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/chat.js#L447) | **MEDIUM** | Backend lacks `join_conversation` WebSocket room listener for tactical messages. | In `chat.js:447`, `io.to(convo_id.toString()).emit("new_message", ...)` delivers messages to conversation rooms, but `main.js` only listens for `join_sector`. No clients ever join `convo_id`. | Add `socket.on("join_conversation", (convoId) => { socket.join(convoId.toString()); })` in `main.js:115` to register sockets into the appropriate chat broadcast rooms. |
| **BUG-07** | [`adminDash/frontend/src/components/Dashboard.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/Dashboard.jsx#L341-L369)<br/>[`adminDash/backend/routes/chat.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/chat.js#L415) | **HIGH** | Main dashboard tactical chat uses local `setTimeout` simulator instead of backend chat engine. | `Dashboard.jsx:341-369` mocks replies with `setTimeout(() => setChatMessages(...), 1200)` and never issues HTTP requests to `/chat/message` or stores history in PostgreSQL `chat_logs`. | Replace the local `setTimeout` dummy in `handleSendChatMessage` with an API call to `POST ${API_BASE_URL}/chat/message` and populate history via `GET ${API_BASE_URL}/chat/history/:convo_id`. |
| **BUG-08** | [`adminDash/backend/handlers/crypto.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/crypto.js)<br/>[`adminDash/backend/src/math_engine.cpp`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/src/math_engine.cpp)<br/>[`userApp/backend/h3PathfindingTest.js`](file:///d:/Projects/SurakshaDrishti/userApp/backend/h3PathfindingTest.js) | **LOW** | Orphaned backend dead code files cluttering the repository. | Unreferenced files: `crypto.js` (unfinished AES cipher superseded by built-in crypto), `math_engine.cpp` (uncompiled C++ with no node-gyp bindings), `h3PathfindingTest.js` (unwired test script). | Safely remove the 3 obsolete unreferenced backend/test files from the repository (`git rm`). |
| **BUG-11** | [`userApp/backend/main.cjs`](file:///d:/Projects/SurakshaDrishti/userApp/backend/main.cjs#L69-L73) | **MEDIUM** | Electron `alertWindow` unacknowledged close cancellation traps user and prevents OS shutdown. | `alertWindow.on('close', (e) => { if (!alertWindow.isAcknowledged) e.preventDefault(); })` traps the window and cancels system OS shutdown, SIGTERM, and app quitting events. | Track `let isQuitting = false;` via `app.on('before-quit', () => { isQuitting = true; });` and allow the close event when `isQuitting === true`. |
| **BUG-13** | [`userApp/backend/main.cjs`](file:///d:/Projects/SurakshaDrishti/userApp/backend/main.cjs#L1-L114)<br/>[`userApp/backend/preload.cjs`](file:///d:/Projects/SurakshaDrishti/userApp/backend/preload.cjs) | **CRITICAL** | Desktop Electron runtime & Node IPC are incompatible with native Android execution. | `main.cjs` creates desktop `BrowserWindow` instances using Electron screen dimensions and IPC channels (`trigger-alert`, `acknowledge-alert`). Android has no desktop windowing system. | Migrate the container wrapper to Capacitor (`@capacitor/core` + `@capacitor/android`) and bridge IPC alerts to native Android notifications via `@capacitor/local-notifications`. |

---

## 10. Resolved Defects Matrix

The following **6 frontend bugs** have been resolved, verified with clean production builds, and documented in this audit.

| Bug ID | Component & File Location | Severity | Original Defect Description | Where Root Cause Was Located | Resolution Implemented (How Fixed) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-09** | [`adminDash/frontend/src/App.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/App.jsx#L430)<br/>[`Navbar.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/Navbar.jsx#L161)<br/>[`CTASection.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/CTASection.jsx#L80) | **MEDIUM** | `onOpenDemo` buttons remained in UI with no handlers after modal removal. | `Navbar.jsx` and `CTASection.jsx` bound `onClick={onOpenDemo}`, but `App.jsx` never passed the `onOpenDemo` prop after `DemoOfficerModal.jsx` was removed. | Passed `onOpenDemo={() => handleOpenAuth('signin')}` in `App.jsx` to both `<Navbar />` and `<CTASection />`, routing clicks directly into the official command desk sign-in flow. |
| **BUG-10** | [`adminDash/frontend/src/components/AuthSection.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/AuthSection.jsx#L283-L370) | **LOW** | Form had dead `handleSignUp` handler without an active registration JSX branch. | `AuthSection.jsx:185-225` contained full registration logic calling `apiService.register`, but the JSX template only branched on `authMode === 'otp' ? ... : ...` with no tab toggle or sign-up form. | Added an Apple/Gov-styled tab toggle (**Command Sign In** / **Register Personnel**) and rendered the full registration form (Name, Email, Phone, Role, District, Password, GPS Geolocation detection) wired to `handleSignUp`. |
| **BUG-12** | [`adminDash/frontend/src/components/pages/UserProfile.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/pages/UserProfile.jsx#L217-L265) | **MEDIUM** | Email/phone 2FA verification success writes to un-scoped `suraksha_user_credentials`. | While profile edits at line 394 used a scoped key, the 2FA verification success callbacks at lines 217 and 257 wrote to the global un-scoped `suraksha_user_credentials` key, causing cross-session credential pollution. | Updated lines 217 and 257 to use `suraksha_user_credentials_${targetUserId}`, isolating contact updates to the specific authenticated officer. |
| **BUG-14** | [`userApp/frontend/src/components/RealGoogleMap.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/RealGoogleMap.jsx#L220-L275) | **HIGH** | Web Leaflet DOM map engine suffered from touch lag, lack of native mobile gesture support, and memory pressure. | `RealGoogleMap.jsx` relied on default DOM SVG rendering without hardware acceleration or touch zoom handling, causing frame drops and unresponsive controls on mobile devices. | Configured Leaflet with `preferCanvas: true` for GPU hardware-accelerated canvas rendering, enabled touch gestures (`touchZoom: true`, `tap: true`, `bounceAtZoomLimits: false`), and added clean `ResizeObserver` lifecycle unmount cleanup. |
| **BUG-15** | [`userApp/frontend/src/utils/storage.js`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/utils/storage.js)<br/>[`userApp/frontend/src/App.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/App.jsx#L7-L60) | **MEDIUM** | In-memory `sessionStorage` wiped on Android OS background task reclamation. | `App.jsx` stored active tokens solely in browser `sessionStorage`. On Android devices, background app suspension wipes `sessionStorage`, logging out users during emergency evacuations. | Created a multi-tier `mobileStorage` adapter supporting native Capacitor Preferences, persistent `localStorage`, `sessionStorage`, and in-memory fallbacks to prevent session loss during backgrounding. |
| **BUG-16** | [`userApp/frontend/src/App.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/App.jsx#L25-L48)<br/>[`userApp/frontend/src/components/UserDashboard.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/UserDashboard.jsx#L54-L72) | **MEDIUM** | Raw `window.location` routing ignores Android hardware back button and deep links. | `App.jsx` and `UserDashboard.jsx` evaluated routes via one-off `window.location` strings without capturing mobile back gestures, hardware back-key presses, or Android Intent deep links. | Registered synchronized routing listeners (`popstate`, `hashchange`) along with native Android back-button handlers (`ionBackButton` and Cordova/Capacitor `backbutton`) to manage navigation history cleanly. |

---

## 11. Historical Closed Flaws Audit Log

The following 30 defects previously identified during codebase audits have been verified as resolved in the codebase:

| Original ID | Component | Defect Description | Resolution Mechanism & Commit |
| :--- | :--- | :--- | :--- |
| **FIX-01** | `auth.js` / `DemoOfficerModal.jsx` | Seed demo passwords in dummy array failed bcrypt validation against `Commander@Pass2026`. | Flawed demo modal and dummy hashes completely removed in commit `18e9d22`. |
| **FIX-02** | `auth.js` | Auto-provision query omitted `password`, referenced non-existent column `role`, and corrupted records. | Flawed auto-provisioning query completely excised in commit `18e9d22`. |
| **FIX-03** | `dbHandler.js` | Missing table DDL in `initDB()` broke non-user tables on fresh database. | Directly executes full `schema.sql` file on boot inside `initDB()` in commit `18e9d22`. |
| **FIX-04** | `dbHandler.js` | PostgreSQL pool permanent failure on initial boot timeout without retry. | Added self-healing retry loop (10 attempts, 5s delay) to `initDB()` in commit `18e9d22`. |
| **FIX-05** | `dbHandler.js` / `zones.js` | Splicing hazard zones from local database destroyed records, breaking unassignment. | Local store splice removed; PostgreSQL transactions manage status in commit `18e9d22`. |
| **FIX-06** | `main.js` | Missing `/stats/live` and `/alerts/active` ghost endpoints returned 404. | Implemented live telemetry endpoints `/stats/live` and `/alerts/active` in commit `62b79a3`. |
| **FIX-07** | `chat.js` | `/chat/upload` lacked MIME and file extension validation, allowing arbitrary uploads. | Added strict `fileFilter` validating JPEG, PNG, GIF, and PDF types in commit `62b79a3`. |
| **FIX-08** | `middlewareHandler.js` | `XSS_Sanitizer` mutated plain-text passwords and corrupted credentials. | Added `if (key.toLowerCase().includes('password')) continue;` bypass in commit `62b79a3`. |
| **FIX-09** | `Dashboard.jsx` | Chat message text lacked XSS sanitization before rendering in HUD thread. | Added `DOMPurify.sanitize(msg.text)` with `dangerouslySetInnerHTML` in commit `62b79a3`. |
| **FIX-10** | `auth.js` | `/verify-otp` returned token without user profile payload, causing frontend crash. | Added user dossier retrieval query and returns complete `user` object in commit `d10474f`. |
| **FIX-11** | `AuthSection.jsx` | Simulated client-side 2FA generated malformed fake token (`jwt_registered_`). | Replaced with live backend call `apiService.verifyOtp`. |
| **FIX-12** | `dbHandler.js` | Parameter order swap in `INSERT INTO emergency_passes` mapped GPS coordinates into shelter ID. | Corrected parameter destructuring in `dbHandler.js`. |
| **FIX-13** | `Dashboard.jsx` | Officer self-assignment was purely local React state and never persisted to the API. | Wired `handleAssignSelf` and `handleAssignSelfFromMap` to call `POST /api/zones/assign`. |
| **FIX-14** | `Dashboard.jsx` / `AgentDashboard.jsx` | Missing `Authorization` Bearer header in consensus voting requests caused 401 Unauthorized. | Added `'Authorization': Bearer ${token}` to `vote-resolve` in both applications. |
| **FIX-15** | `AppLogin.jsx` | Root-level `lat`/`lng` in QuickSign payload caused coordinates to be recorded as null. | Updated `AppLogin.jsx` to send nested `location: { lat, lng }`. |
| **FIX-16** | `UserDashboard.jsx` | Client-side blast radius distance filter dropped all hazard zones when user was outside perimeter. | Updated `UserDashboard.jsx` to retain all zones in state and toggle emergency UI conditionally. |
| **FIX-17** | `UserDashboard.jsx` | Property name discrepancy (`radius_meters` vs `radiusMeters`) froze dynamic shelter search radius. | Updated reference to `closestZone.radiusMeters` in `UserDashboard.jsx`. |
| **FIX-18** | `Dashboard.jsx` / `AgentDashboard.jsx` | Hardcoded `http://localhost:5000` URLs prevented execution in LAN, Docker, and production deployments. | Exported dynamic `API_BASE_URL` in `api.js` and replaced hardcoded fetch URLs. |
| **FIX-19** | `AgentDashboard.jsx` | Tactical chat Send button had no click handler and input lacked submission handling. | Added reactive message state, wired Send button `onClick`, and form submission. |
| **FIX-20** | `AlertNotification.jsx` | Web Audio `AudioContext` remained unclosed on component unmount, leaking hardware audio channels. | Added `audioCtx.close()` invocation in `useEffect` cleanup hook. |
| **FIX-21** | `App.jsx` | Successful authority authentication did not navigate officer to `/dashboard`. | Added automatic route transition to `/dashboard` for authority roles in `handleAuthSuccess`. |
| **FIX-22** | `api.js` | Network catch blocks in `login` and `register` returned fake success JWT tokens on server failure. | Replaced deceptive mock tokens with proper failure responses (`success: false`). |
| **FIX-23** | `App.jsx` / `QuickSignModal.jsx` | Generating a civilian emergency pass while an officer was logged in obliterated the officer session. | Updated `handleAuthSuccess` to store civilian passes under `suraksha_civilian_pass`. |
| **FIX-24** | `AppLogin.jsx` | Civilian login requested non-existent `/reCAPTCHA_logo.png`, producing a 404 network failure on every mount. | Replaced missing image asset tag with an inline SVG badge. |
| **FIX-25** | `Navbar.jsx` / `CTASection.jsx` / `App.jsx` | `onOpenDemo` buttons remained in UI without props, throwing undefined or producing zero feedback. | Connected `onOpenDemo={() => handleOpenAuth('signin')}` in `App.jsx` across Navbar and CTASection. |
| **FIX-26** | `AuthSection.jsx` | `handleSignUp` logic existed but the component had no tab toggle or registration form rendered. | Added Apple/Gov-styled tab toggle (`Command Sign In` / `Register Personnel`) and rendered the registration form wired to `handleSignUp`. |
| **FIX-27** | `UserProfile.jsx` | Contact verification success handlers saved credentials under un-scoped `suraksha_user_credentials`. | Updated storage calls to use `suraksha_user_credentials_${targetUserId}`, isolating officer credentials. |
| **FIX-28** | `RealGoogleMap.jsx` | Mobile rendering lag and lack of touch gestures on Android/WebView. | Added hardware-accelerated `preferCanvas: true`, touchZoom, tap handling, and orientation ResizeObserver unbind cleanup. |
| **FIX-29** | `userApp/frontend/src/utils/storage.js` / `App.jsx` | Volatile browser `sessionStorage` was vulnerable to eviction upon Android background task reclamation. | Implemented multi-tier `mobileStorage` adapter fallback to persistent device storage. |
| **FIX-30** | `userApp/frontend/src/App.jsx` / `UserDashboard.jsx` | Raw `window.location` parsing ignored Android hardware back-button presses and deep link intents. | Added `popstate`, `hashchange`, `ionBackButton`, and Cordova/Capacitor `backbutton` event listeners. |

---

*Report maintained autonomously following deep full-stack verification of the SurakshaDrishti codebase.*
