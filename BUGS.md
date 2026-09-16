# Comprehensive Bug, Security, and Architectural Audit Report

**Project:** SurakshaDrishti (SIH 2026 — Problem Statement 26191)  
**Audit Date:** September 2026  
**Scope:** Full End-to-End Codebase Analysis (`adminDash/backend`, `adminDash/frontend`, `userApp/backend`, `userApp/frontend`, Database Schemas, Authentication Protocols, and System Documentation)

---

## Executive Summary

SurakshaDrishti is designed as a disaster management and decision support platform for natural hazard mitigation (landslides, flash floods, and debris flows), comprising an **Admin Command Dashboard (`adminDash`)** and a **Civilian / Field Agent Desktop App (`userApp`)**, backed by an Express/PostgreSQL API.

A thorough, ground-up audit of every file across the repository revealed **32 critical bugs, broken workflows, security backdoors, schema mismatches, and architectural discrepancies**. Multiple components suffer from complete client-side simulation, uncaught runtime exceptions that crash the application, plain-text credential leaks, and fatal infinite recursion loops.

---

## Table of Contents

1. [Critical Crash Bugs & Uncaught Runtime Exceptions](#1-critical-crash-bugs--uncaught-runtime-exceptions)
2. [Security Vulnerabilities, Backdoors & Credential Mismanagement](#2-security-vulnerabilities-backdoors--credential-mismanagement)
3. [Broken Workflows & Faked / Disconnected Features](#3-broken-workflows--faked--disconnected-features)
4. [Database & Schema Integrity Failures](#4-database--schema-integrity-failures)
5. [Logic Flaws, UI State Desynchronization & Math Errors](#5-logic-flaws-ui-state-desynchronization--math-errors)
6. [Architectural Discrepancies & Dead Code Bloat](#6-architectural-discrepancies--dead-code-bloat)
7. [Comprehensive Issue Matrix & Priority Remediation Plan](#7-comprehensive-issue-matrix--priority-remediation-plan)

---

## 1. Critical Crash Bugs & Uncaught Runtime Exceptions

### 1.1 Fatal Infinite Recursion / Denial of Service in `/auth/quick-signup`
* **File:** [`adminDash/backend/routes/auth.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/auth.js#L219-L221)
* **Lines:** 219–221
* **Severity:** **CRITICAL (PROCESS CRASH)**
* **Code Proof:**
  ```javascript
  // Line 219:
  router.post("/quick-signup", async (req, res, next) => {
      return router.handle(req, res, next);
  });
  ```
* **Failure Mechanism:**
  In Express, `router.handle(req, res, next)` re-executes the router's middleware stack matching `req.url`. Because `req.url` matches `/quick-signup`, Express re-invokes this exact route handler repeatedly with zero delay.
* **Proof of Failure:**
  When `apiService.quickSignupEmergency()` in [`adminDash/frontend/src/utils/api.js:143`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/utils/api.js#L143) or [`userApp/frontend/src/utils/api.js:159`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/utils/api.js#L159) triggers `POST /auth/quick-signup`, the Node.js event loop enters infinite synchronous recursion, instantly throwing:
  ```
  RangeError: Maximum call stack size exceeded
      at router.handle (d:\Projects\SurakshaDrishti\adminDash\backend\routes\auth.js:220:19)
  ```
  This crashes the entire backend server process, killing all live WebSocket streams and active API connections for all users.
* **Remediation:** Remove this handler or forward to the actual handler function directly without re-invoking `router.handle`.

---

### 1.2 `req.user.username` is Undefined Across ALL Protected Chat, Profile, and Feedback Routes
* **Files:**
  * [`adminDash/backend/routes/chat.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/chat.js#L28) (Lines: 28, 69, 105, 134, 161, 192, 232, 261, 286, 314, 333, 361, 511, 572, 608)
  * [`adminDash/backend/routes/profile.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/profile.js#L16) (Lines: 16, 26, 63, 75)
  * [`adminDash/backend/routes/feedback.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/feedback.js#L9) (Lines: 9, 10)
  * [`adminDash/backend/routes/auth.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/auth.js#L84) (Lines: 84–93, 134, 291)
* **Severity:** **CRITICAL (UNIVERSAL API FAILURE)**
* **Code Proof:**
  In `auth.js` line 84:
  ```javascript
  const token = jwt.sign(
      { 
          user_id: user.user_id, 
          email: user.email, 
          role: userRole,
          officer_mode: user.officer_mode || 'OFF_SITE' 
      }, 
      process.env.JWT_SECRET || 'suraksha_secret_jwt_2026_production', 
      { expiresIn: "24h" }
  );
  ```
  In `profile.js` lines 16, 26, 63:
  ```javascript
  const uniqueSuffix = req.user.username + path.extname(file.originalname);
  ...
  const result = await db.query(`SELECT bio, profile_picture FROM users WHERE user_id = $1`, [req.user.username]);
  ```
  In `chat.js` line 28, 361:
  ```javascript
  const currentUser = req.user.username;
  ...
  const sender_id = req.user.username;
  ```
* **Failure Mechanism:**
  When a user logs in, the JWT token payload stores `{ user_id, email, role }` (or `{ userId, email, role }` in line 134 & 291). **`username` is never defined in the token.**
  `FN_verifyTkn` in [`middlewareHandler.js:27`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/middlewareHandler.js#L27) decodes this into `req.user`. Therefore, `req.user.username` is `undefined` on every authenticated request.
* **Proof of Failure:**
  1. **Profile Picture Overwrite:** In `profile.js:16`, `req.user.username + ext` evaluates to `"undefined.png"`. Every single officer's uploaded profile picture is saved as `"undefined.png"`, overwriting the previous officer's photo on the filesystem.
  2. **Profile Retrieval Failure:** In `profile.js:26`, `WHERE user_id = undefined` returns 0 rows.
  3. **Total Chat Breakdown:** In `chat.js`, every participant check and message insertion executes with `user_id = undefined`, failing PostgreSQL foreign key constraints or querying `null`.
  4. **Feedback 404:** In `feedback.js:10`, `SELECT email FROM users WHERE user_id = undefined` returns 0 rows, throwing `404: User not found`.
* **Remediation:** Standardize JWT payload to `{ user_id, email, role, full_name }` and reference `req.user.user_id` consistently across all handlers.

---

### 1.3 `RealGoogleMap.jsx` Uncaught TypeError on `zone.safeSite.name`
* **File:** [`adminDash/frontend/src/components/RealGoogleMap.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/RealGoogleMap.jsx#L276)
* **Lines:** 275–278
* **Severity:** **HIGH (REACT RENDER CRASH)**
* **Code Proof:**
  ```javascript
  // Line 275-278 in popupContent template:
  <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 5px 6px; border-radius: 5px; font-size: 10px; color: #065f46;">
    <strong>Target Safe Hub:</strong> ${zone.safeSite.name}<br/>
    <span style="font-size: 9px; color: #047857;">Capacity: ${zone.safeSite.capacity} | ETA: ${zone.evacEta}</span>
  </div>
  ```
* **Failure Mechanism:**
  `RealGoogleMap.jsx` loops over `zones`. While line 296 guards marker creation with `if (showSafeSites && zone.safeSite)`, line 276 unconditionally evaluates `${zone.safeSite.name}` inside `popupContent`. When `zones` are fetched directly from the backend API `/api/zones` (which return database rows without a joined `safeSite` object), `zone.safeSite` is `undefined`.
* **Proof of Failure:**
  JavaScript evaluates `${zone.safeSite.name}` and throws:
  ```
  TypeError: Cannot read properties of undefined (reading 'name')
      at RealGoogleMap.jsx:276
  ```
  This triggers `ErrorBoundary` in [`main.jsx:26-37`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/main.jsx#L26-L37), replacing the map with a full-page red error block: `"Application Encountered a Render Error"`.
* **Remediation:** Use optional chaining: `${zone.safeSite?.name || 'Assigned Relief Hub'}`.

---

### 1.4 Blank Screen of Death in `userApp` on Unrecognized Role
* **File:** [`userApp/frontend/src/App.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/App.jsx#L64-L73)
* **Lines:** 64–72
* **Severity:** **HIGH (APPLICATION UNUSABLE)**
* **Code Proof:**
  ```javascript
  if (session.role === 'user') {
    return <UserDashboard onLogout={handleLogout} session={session} />;
  }

  if (session.role === 'agent') {
    return <AgentDashboard onLogout={handleLogout} session={session} />;
  }

  return null;
  ```
* **Failure Mechanism:**
  In [`adminDash/backend/routes/auth.js:75`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/auth.js#L75) and [`database/schema.sql:8`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/database/schema.sql#L8), backend user roles are stored in uppercase: `'RESIDENT'`, `'NDRF'`, `'SDMA'`, `'POLICE'`.
  If a user session contains `role: 'RESIDENT'` or `role: 'NDRF'`, both `session.role === 'user'` and `session.role === 'agent'` evaluate to `false`.
* **Proof of Failure:**
  `App.jsx` falls through to line 72: `return null;`. The entire React DOM unmounts, leaving an empty, unresponsive black or white window with no navigation, console logs, or UI recovery possible.
* **Remediation:** Normalize role casing: `const r = session?.role?.toLowerCase(); if (r === 'user' || r === 'resident') ... else if (r === 'agent' || r === 'ndrf' || r === 'sdma') ...`.

---

## 2. Security Vulnerabilities, Backdoors & Credential Mismanagement

### 2.1 Plaintext Password Comparison Backdoor in `Compare_Pass`
* **File:** [`adminDash/backend/routes/auth.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/auth.js#L22-L29)
* **Lines:** 22–29
* **Severity:** **CRITICAL (AUTHENTICATION BYPASS)**
* **Code Proof:**
  ```javascript
  async function Compare_Pass(password, hash) {
      if (!hash) return false;
      try {
          const result = await bcrypt.compare(password, hash);
          if (result) return true;
      } catch(e) {}
      return password === hash;
  }
  ```
* **Vulnerability Analysis:**
  If `bcrypt.compare(password, hash)` fails or throws, line 28 executes:
  `return password === hash;`
  This is a critical backdoor. If any user, script, or attacker supplies the raw bcrypt hash string as the password, `password === hash` evaluates to `true`, granting immediate authentication.

---

### 2.2 Hardcoded Bcrypt Hashes Used as Passwords in Demo Officer Modal
* **File:** [`adminDash/frontend/src/components/DemoOfficerModal.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/DemoOfficerModal.jsx#L42-L54)
* **Lines:** 42, 53
* **Severity:** **HIGH (EXPLOITATION OF BACKDOOR IN PRODUCTION)**
* **Code Proof:**
  ```javascript
  {
    id: 'sdma_kerala',
    name: 'SDMA Regional Officer',
    username: 'sdma_officer',
    password: '$2b$10$w09ZkF2xO59lU22qj4A24u7s2h/k8q5d/Z71d.a6f4s8b9c1d2e3f',
  },
  {
    id: 'ndrf_hq',
    name: 'NDRF Commander Chief',
    username: 'ndrf_admin',
    password: '$2b$10$w09ZkF2xO59lU22qj4A24u7s2h/k8q5d/Z71d.a6f4s8b9c1d2e3f',
  }
  ```
* **Failure Mechanism:**
  Instead of configuring valid demo passwords (e.g., `Password123`), the developers pasted the hashed database strings into the frontend modal and relied on the plaintext comparison backdoor in Section 2.1 to make the demo buttons work.

---

### 2.3 2FA Verification is 100% Client-Side Simulated & Accepts Any Arbitrary Code
* **File:** [`adminDash/frontend/src/components/AuthSection.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/AuthSection.jsx#L175-L200)
* **Lines:** 175–200
* **Severity:** **HIGH (2FA SECURITY ILLUSION)**
* **Code Proof:**
  ```javascript
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      addToast('Please enter a valid 6-digit OTP code.', 'error');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate OTP Verification (as backend may not have full verify route yet)
    setTimeout(() => {
      setIsLoading(false);
      addToast('2FA Verified! Initializing tactical session...', 'success');
      setTimeout(() => {
        onAuthSuccess({
          token: tempAuthData?.token || 'jwt_registered_' + Date.now(),
          user: tempAuthData?.user || { ... }
        });
      }, 700);
    }, 1000);
  };
  ```
* **Failure Mechanism:**
  The frontend claims to enforce email 2FA verification. However, `handleVerifyOTP` **never calls `/auth/verify-otp`**. It waits 1000ms via `setTimeout` and unconditionally authenticates the user regardless of what code was entered (e.g. `000000` or `ABCDEF`).

---

### 2.4 Unencrypted Plaintext Password Storage in Browser `localStorage`
* **Files:**
  * [`adminDash/frontend/src/components/pages/UserProfile.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/pages/UserProfile.jsx#L358-L360) (Lines: 358–360)
  * [`adminDash/frontend/src/components/AuthSection.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/AuthSection.jsx#L110-L135) (Lines: 110–135)
* **Severity:** **HIGH (CREDENTIAL EXPOSURE & STATE DESYNC)**
* **Code Proof:**
  In `UserProfile.jsx` line 359:
  ```javascript
  localStorage.setItem(`suraksha_pwd_${targetUserId}`, newPassword);
  ```
  In `AuthSection.jsx` lines 110–116:
  ```javascript
  const updatedCustomPassword = localStorage.getItem(`suraksha_pwd_${trimmedUsername}`);
  if (updatedCustomPassword) {
    if (password === updatedCustomPassword) {
      loginSuccessful = true;
      authResult = { success: true, token: 'jwt_officer_custom_' + Date.now(), ... };
    }
  }
  ```
* **Failure Mechanism:**
  When an officer updates their password in the Profile page, the app writes the new password in **plain unencrypted text** directly into browser `localStorage`. No update request is dispatched to the backend PostgreSQL database.
  Consequently:
  1. Any script or XSS vulnerability can read plaintext officer passwords via `localStorage.getItem()`.
  2. The password update is local to that single browser tab. Logging in from another browser, mobile device, or incognito window fails because the backend database retains the old password.

---

### 2.5 Live Production Database Credentials Committed in Version Control
* **File:** [`adminDash/backend/.env`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/.env#L1-L3)
* **Lines:** 1–3
* **Severity:** **HIGH (DATA BREACH RISK)**
* **Code Proof:**
  ```env
  SUPABASE_URL=https://rvmxbykrqllgaokcnvqc.supabase.co
  DATABASE_URL=postgres://postgres:KaushikAT2008@db.rvmxbykrqllgaokcnvqc.supabase.co:5432/postgres
  JWT_SECRET=suraksha_secret_jwt_2026_production
  ```
* **Vulnerability Analysis:**
  The production Supabase PostgreSQL connection string, including username `postgres` and password `KaushikAT2008`, is committed in plain text to the Git repository. Anyone with read access to the repo has direct administrative access to the remote database cluster.

---

### 2.6 Hardcoded OTP Backdoor in `userApp` API Client
* **File:** [`userApp/frontend/src/utils/api.js`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/utils/api.js#L112-L115)
* **Lines:** 112–115
* **Severity:** **MEDIUM (TESTING BACKDOOR LEFT IN PRODUCTION)**
* **Code Proof:**
  ```javascript
  verifyOtp: async (username, otp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, { ... });
      return await response.json();
    } catch {
      if (otp === '123456') {
        return { success: true, token: 'mock-token', message: 'Auth successful' };
      }
      return { success: false, error: 'Invalid OTP' };
    }
  }
  ```
* **Vulnerability Analysis:**
  Whenever network connectivity drops or the server returns an error, typing `123456` bypasses authentication and returns a mock authenticated session token.

---

### 2.7 JWT Secret Key Inconsistencies Leading to Random Token Verification Failures
* **Files:**
  * [`adminDash/backend/routes/auth.js:91`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/auth.js#L91): `'suraksha_secret_jwt_2026_production'`
  * [`adminDash/backend/routes/auth.js:155`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/auth.js#L155): `'secret'`
  * [`adminDash/backend/routes/auth.js:293`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/auth.js#L293): `'suraksha_secret_jwt_2026'` (missing `_production`)
  * [`adminDash/backend/handlers/middlewareHandler.js:26`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/middlewareHandler.js#L26): `'suraksha_secret_jwt_2026_production'`
* **Severity:** **MEDIUM (AUTHENTICATION INSTABILITY)**
* **Failure Mechanism:**
  When `process.env.JWT_SECRET` is not set or defaults are invoked, tokens issued during signup (line 293) are signed with key `'suraksha_secret_jwt_2026'`. However, `FN_verifyTkn` validates tokens against `'suraksha_secret_jwt_2026_production'`. Newly registered users attempting to access `/chat`, `/profile`, or `/feedback` are immediately rejected with `403: Invalid or Expired token`.

---

## 3. Broken Workflows & Faked / Disconnected Features

### 3.1 Officer Red Zone Assignment is Ephemeral (Never Saved to Database)
* **File:** [`adminDash/frontend/src/components/Dashboard.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/Dashboard.jsx#L250-L284)
* **Lines:** 250–284 & 287–316
* **Severity:** **HIGH (CORE FEATURE BROKEN)**
* **Code Proof:**
  ```javascript
  const handleAssignSelf = () => {
    ...
    // Lines 266-276: Purely local React state update
    setZones(prev => prev.map(z => {
      if (z.zone_id === selectedZoneId) {
        const officers = Array.isArray(z.assigned_officers) ? z.assigned_officers : [];
        const alreadyIn = officers.some(o => o.user_id === currentOfficerId);
        const updatedList = alreadyIn 
          ? officers 
          : [...officers, { user_id: currentOfficerId, officer_name: currentOfficerName, department: currentDept, vote_to_resolve: false }];
        return { ...z, assigned_officers: updatedList };
      }
      return z;
    }));

    const successMsg = `Assigned to ${activeZone.name}! Entered Deep Focus Mode & Team Dispatch.`;
    setAssignSuccessMsg(successMsg);
    addToast(successMsg, 'success');
    setInputKey('');
  };
  ```
* **Failure Mechanism:**
  Notice lines 263–265: there is **no `fetch()` or `apiService.assign()` call**. The assignment exists solely in the React component state of that single browser window. If the officer refreshes the page, switches tabs, or another commander views the zone on their screen, the assignment does not exist.

---

### 3.2 Zone Consensus Voting Always Fails Due to Unpersisted Assignment
* **File:** [`adminDash/frontend/src/components/Dashboard.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/Dashboard.jsx#L350-L380) vs [`adminDash/backend/routes/zones.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/zones.js#L271-L285)
* **Severity:** **HIGH (CONSENUS SYSTEM INOPERABLE)**
* **Code Proof:**
  In `zones.js` lines 272–282:
  ```javascript
  await db.query(
      `UPDATE zone_assignments SET vote_to_resolve = true, voted_at = CURRENT_TIMESTAMP WHERE zone_id = $1 AND user_id = $2`,
      [zone_id, user_id]
  );
  const voteCountRes = await db.query(
      `SELECT COUNT(*)::int AS total_votes FROM zone_assignments WHERE zone_id = $1 AND vote_to_resolve = true`,
      [zone_id]
  );
  ```
* **Failure Mechanism:**
  When the officer clicks "Vote to Resolve", `Dashboard.jsx:355` calls `POST /api/zones/vote-resolve`. However, because `handleAssignSelf` never inserted the officer into `zone_assignments` in the database (Section 3.1), the SQL `UPDATE` statement updates **0 rows**.
  `total_votes` evaluates to 0. Then `Dashboard.jsx:365` refetches `/api/zones`, which overwrites the local React state with the database records, immediately clearing the officer's assignment from the screen.

---

### 3.3 Trapped Citizens Telemetry is 100% Fake Client-Side Mock Data
* **File:** [`adminDash/frontend/src/components/Dashboard.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/Dashboard.jsx#L200-L205)
* **Lines:** 200–205 & 386
* **Severity:** **MEDIUM (MISLEADING TELEMETRY)**
* **Code Proof:**
  ```javascript
  // Line 200-205:
  const trappedCitizens = [
    { id: 'SOS-901', name: 'Citizen #104 (Elderly)', lat: activeZone.lat + 0.0012, lng: activeZone.lng + 0.0015, type: 'CRITICAL', specialNeeds: 'Wheelchair Assistance' },
    { id: 'SOS-902', name: 'Citizen #105 (Infant Family)', lat: activeZone.lat - 0.0018, lng: activeZone.lng - 0.0008, type: 'URGENT', specialNeeds: 'Medical Supplies' },
    { id: 'SOS-903', name: 'Citizen #106', lat: activeZone.lat + 0.0025, lng: activeZone.lng - 0.0021, type: 'EVACUATING', specialNeeds: 'None' },
    { id: 'SOS-904', name: 'Citizen #107', lat: activeZone.lat - 0.0009, lng: activeZone.lng + 0.0028, type: 'CRITICAL', specialNeeds: 'Stretcher Required' },
  ];
  ...
  // Line 386:
  { title: 'Trapped Citizens Monitored', value: `${trappedCitizens.length * 710}`, ... }
  ```
* **Failure Mechanism:**
  The Command Console claims to track live citizen GPS telemetry. In reality, it displays a static array of 4 hardcoded objects and literally calculates `4 * 710 = 2840`. The backend endpoint `GET /api/zones/:zoneId/trapped-citizens` is **never called anywhere in `Dashboard.jsx`**. Real SOS locations transmitted by civilians via `userApp` never appear on the command map.

---

### 3.4 Command Console Chat is a Fake Client-Side Simulation
* **File:** [`adminDash/frontend/src/components/Dashboard.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/Dashboard.jsx#L319-L347)
* **Lines:** 319–347
* **Severity:** **MEDIUM (DISCONNECTED MESSAGING)**
* **Code Proof:**
  ```javascript
  const handleSendChatMessage = (e) => {
    ...
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Simulate inter-agency confirmation
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'NDRF Air Dispatch',
          department: 'Emergency Airborne',
          text: `Acknowledged message for ${activeZone.name}. Drone corridor monitoring active.`,
          time: 'Just now'
        }
      ]);
    }, 1200);
  };
  ```
* **Failure Mechanism:**
  The Command Console does not connect to Socket.io or call `/chat/message`. It simply appends the typed text to a local React array and triggers a hardcoded `setTimeout` simulating a reply from `"NDRF Air Dispatch"`. Meanwhile, `adminDash/backend/routes/chat.js` contains 645 lines of backend chat logic that are completely orphaned.

---

### 3.5 Tactical Agent Dashboard Send Button Has No Action Handler
* **File:** [`userApp/frontend/src/components/AgentDashboard.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/AgentDashboard.jsx#L209-L224)
* **Lines:** 217–224
* **Severity:** **HIGH (DEAD UI INTERACTION)**
* **Code Proof:**
  ```jsx
  <input 
    type="text" 
    value={chatMessage}
    onChange={(e) => setChatMessage(e.target.value)}
    placeholder={chatMode === 'E2EE' ? "Transmit secured order..." : "Transmit GSM text..."}
    className="..."
  />
  <button 
    type="button"
    className="..."
    title="Transmit message"
  >
    <Send className="w-3.5 h-3.5" />
  </button>
  ```
* **Failure Mechanism:**
  The `<button>` has no `onClick` handler, and the `<input>` is not enclosed in a `<form onSubmit={...}>`. An agent typing a critical evacuation dispatch into the console cannot send it.

---

### 3.6 QuickSign SOS Pass Drops GPS Coordinates Completely
* **File:** [`adminDash/frontend/src/components/QuickSignModal.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/QuickSignModal.jsx#L126-L130) vs [`adminDash/backend/routes/auth.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/auth.js#L178-L196)
* **Severity:** **HIGH (CRITICAL SOS TELEMETRY LOSS)**
* **Code Proof:**
  In `QuickSignModal.jsx` line 126:
  ```javascript
  const res = await apiService.quickSign({
    ...formData,
    location: detectedLoc || locationStatus,
    timestamp: new Date().toISOString(),
  });
  ```
  In `auth.js` lines 179–196:
  ```javascript
  const { name, phone, email, role, district, peopleCount, coordinates, specialNeeds } = req.body;
  ...
  await db.query(
      `INSERT INTO emergency_passes (pass_id, user_id, phone, assigned_shelter_id, special_needs, status, bypassed_2fa) 
       VALUES ($1, $2, $3, $4, $5, 'ACTIVE_RED_ZONE', true)
       ON CONFLICT (pass_id) DO NOTHING`,
      [emergencyId, userId, phone, shelterId, specialNeeds || []]
  );
  ```
* **Failure Mechanism:**
  1. The frontend sends `location`, but the backend destructures `coordinates`.
  2. The SQL `INSERT` statement in `auth.js:191` **omits both `lat` and `lng` columns entirely**.
  Because `lat` and `lng` remain `NULL`, when `GET /api/zones/:zoneId/trapped-citizens` runs:
  `WHERE status = 'ACTIVE_RED_ZONE' AND lat IS NOT NULL AND lng IS NOT NULL`
  Every single citizen who uses QuickSign is excluded from the trapped citizens database.

---

### 3.7 Anonymous Civilians Promoted to Apex NDRF Commander Chief
* **File:** [`adminDash/frontend/src/components/QuickSignModal.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/QuickSignModal.jsx#L177-L186) vs [`adminDash/frontend/src/components/Dashboard.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/Dashboard.jsx#L141-L143)
* **Severity:** **HIGH (PRIVILEGE ESCALATION)**
* **Code Proof:**
  In `QuickSignModal.jsx` lines 177–183:
  ```javascript
  <button
    onClick={() => onSuccess?.({
      success: true,
      isGuestAccount: true,
      guestId: result.emergencyId,
      status: 'QUICKSIGN_EMERGENCY',
    })}
  >
    Access Emergency Command Dashboard
  </button>
  ```
  In `Dashboard.jsx` lines 141–143:
  ```javascript
  const currentOfficerId = user?.userId || user?.user_id || user?.username || 'ndrf_admin';
  const currentOfficerName = user?.fullName || user?.name || user?.username || 'NDRF Commander Chief';
  const currentDept = user?.role || 'NDRF Tactical Command';
  ```
* **Failure Mechanism:**
  The QuickSign success payload passes no `user` object and no `role`. When the citizen is redirected to `/dashboard`, `Dashboard.jsx` applies its default fallbacks: `'ndrf_admin'`, `'NDRF Commander Chief'`, and `'NDRF Tactical Command'`. An anonymous user fleeing a flood is instantly granted supreme authority to vote on zone resolutions and dispatch tactical units.

---

### 3.8 Ghost API Endpoints That 404 in Production
* **File:** [`adminDash/frontend/src/utils/api.js`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/utils/api.js#L36)
* **Lines:** 36, 51, 209
* **Severity:** **MEDIUM (DISCONNECTED BACKEND)**
* **Code Proof:**
  1. `fetch('${API_BASE_URL}/stats/live')`: Route `/stats/live` does not exist in `main.js`. It returns `404 NOT FOUND : /stats/live`, falling back to static catch-block numbers.
  2. `fetch('${API_BASE_URL}/alerts/active')`: Route `/alerts/active` does not exist in `main.js`. Returns `404 NOT FOUND : /alerts/active`, falling back to static catch-block alerts.
  3. `fetch('${API_BASE_URL}/profile/credentials')`: Route `/profile/credentials` does not exist in `routes/profile.js`. Returns `404 NOT FOUND : /profile/credentials`.

---

## 4. Database & Schema Integrity Failures

### 4.1 Missing NOT NULL Columns in Zone Creation Queries
* **File:** [`adminDash/backend/database/schema.sql`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/database/schema.sql#L27) vs [`adminDash/backend/routes/zones.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/zones.js#L131-L135)
* **Severity:** **HIGH (DATABASE INSERT REJECTION)**
* **Code Proof:**
  In `schema.sql` line 27:
  ```sql
  radius NUMERIC NOT NULL, --predicted affecting radius
  ```
  In `zones.js` line 131:
  ```sql
  INSERT INTO hazard_zones (zone_id, name, state, lat, lng, zone_type, hazard_type, risk_score, geohash, population_risk, radius_meters, access_key, status, resolution_votes_required) 
  VALUES ($1, $2, $3, $4, $5, 'RED', $6, 90, $7, $8, $9, $10, 'ACTIVE_RED_ZONE', $11)
  ```
* **Failure Mechanism:**
  Column `radius` is defined as `NUMERIC NOT NULL` with no default value. However, `POST /zones/create` inserts `radius_meters` and completely ignores `radius`. On a genuine PostgreSQL instance adhering to `schema.sql`, every attempt to create a zone fails with:
  ```
  error: null value in column "radius" of relation "hazard_zones" violates not-null constraint
  ```

---

### 4.2 Missing NOT NULL Column in `history_red_zones`
* **File:** [`adminDash/backend/database/schema.sql`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/database/schema.sql#L45) vs [`adminDash/backend/routes/zones.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/zones.js#L301-L304)
* **Severity:** **HIGH (ARCHIVAL FAILURE)**
* **Code Proof:**
  In `schema.sql` line 45:
  ```sql
  assigned_mem TEXT[] NOT NULL
  ```
  In `zones.js` line 301:
  ```javascript
  await db.query(
      `INSERT INTO history_red_zones (zone_id) VALUES ($1) ON CONFLICT DO NOTHING`,
      [zone_id]
  ).catch(() => {});
  ```
* **Failure Mechanism:**
  `assigned_mem` is defined as `NOT NULL`, but the SQL insert only supplies `zone_id`. PostgreSQL throws a not-null constraint violation, which is silently swallowed by `.catch(() => {})`. The zone is never archived into history.

---

### 4.3 Missing `bypassed_2fa` Column in `emergency_passes`
* **File:** [`adminDash/backend/database/schema.sql`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/database/schema.sql#L85-L95) vs [`adminDash/backend/routes/auth.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/auth.js#L191-L194)
* **Severity:** **HIGH (DATABASE REJECTION)**
* **Code Proof:**
  In `auth.js` line 191:
  ```sql
  INSERT INTO emergency_passes (pass_id, user_id, phone, assigned_shelter_id, special_needs, status, bypassed_2fa) 
  VALUES ($1, $2, $3, $4, $5, 'ACTIVE_RED_ZONE', true)
  ```
* **Failure Mechanism:**
  `schema.sql` defines `emergency_passes` with columns: `pass_id, user_id, phone, lat, lng, assigned_shelter_id, special_needs, status, created_at`. There is no `bypassed_2fa` column. PostgreSQL throws:
  ```
  error: column "bypassed_2fa" of relation "emergency_passes" does not exist
  ```
  This forces line 207 to catch the error and return a fallback mock object every time.

---

### 4.4 Incomplete PostgreSQL Schema Initialization in `dbHandler.js`
* **File:** [`adminDash/backend/handlers/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/dbHandler.js#L258-L291)
* **Lines:** 258–291
* **Severity:** **HIGH (SCHEMA MISSING ON FRESH DEPLOY)**
* **Code Proof:**
  ```javascript
  async function initDB() {
      ...
      await client.query(`
          CREATE TABLE IF NOT EXISTS users (
              user_id TEXT PRIMARY KEY,
              email TEXT UNIQUE NOT NULL,
              ...
          )
      `);
      ...
  }
  ```
* **Failure Mechanism:**
  `initDB()` is the only table generation code executed at server launch, and it **only creates the `users` table**. It never executes the rest of `schema.sql` (`hazard_zones`, `shelters`, `zone_assignments`, `history_red_zones`, `emergency_passes`, `conversations`, `chat_logs`). If deployed against a fresh PostgreSQL database, every query to `hazard_zones` crashes with `relation "hazard_zones" does not exist`.

---

### 4.5 Data Corruption in `suraksha_local_db.json` via Inverted Parameter Mapping
* **File:** [`adminDash/backend/database/suraksha_local_db.json`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/database/suraksha_local_db.json#L279-L293) vs [`adminDash/backend/handlers/dbHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/dbHandler.js#L247-L251)
* **Severity:** **MEDIUM (DATA CORRUPTION)**
* **Code Proof:**
  In `suraksha_local_db.json` lines 279–285:
  ```json
  {
    "pass_id": "LOC-test_citizen_sos_01",
    "user_id": "test_citizen_sos_01",
    "phone": 11.5583,
    "assigned_shelter_id": 76.1384,
    "status": "ACTIVE_RED_ZONE",
    "created_at": "2026-09-11T19:12:03.758Z"
  }
  ```
* **Failure Mechanism:**
  In `dbHandler.js:247`, when executing fallback inserts into `emergency_passes`, the parameter destructurer mapped:
  `const [pass_id, user_id, phone, assigned_shelter_id, special_needs] = params;`
  When an update-location query passed `[pass_id, user_id, lat, lng]`, the latitude (`11.5583`) was permanently stored into the `phone` field, and the longitude (`76.1384`) was stored into `assigned_shelter_id`.

---

## 5. Logic Flaws, UI State Desynchronization & Math Errors

### 5.1 Unconditional Global Hazard Designation in `EmergencyMode.jsx`
* **File:** [`adminDash/frontend/src/components/EmergencyMode.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/EmergencyMode.jsx#L48-L55)
* **Lines:** 48–55
* **Severity:** **MEDIUM (FALSE ALARM LOGIC)**
* **Code Proof:**
  ```javascript
  (pos) => {
    const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    setLocationStatus({
      coords,
      inRedZone: true,
      name: 'GPS Sector — Active Hazard Vicinity',
      hazard: 'Landslide & Flash Flood Warning',
    });
    setIsDetecting(false);
  },
  ```
* **Failure Mechanism:**
  `EmergencyMode.jsx` does not call `checkGeofenceRedZoneStatus()`. Regardless of where the user is physically located on Earth, it unconditionally declares that their coordinates are inside an active high-hazard landslide and flood red zone.

---

### 5.2 Field Officers Locked In (Cannot Unassign Unless Zone Already Cleared)
* **File:** [`adminDash/backend/routes/zones.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/routes/zones.js#L343-L346)
* **Lines:** 343–346
* **Severity:** **MEDIUM (IRREVERSIBLE STATE)**
* **Code Proof:**
  ```javascript
  if (zoneRes.rows[0].status !== 'SITUATION_UNDER_CONTROL') {
      res.statusCode = 403;
      return next(new Error("Cannot unassign: the area is not marked cleared. 80% of assigned officers must vote to resolve first."));
  }
  ```
* **Failure Mechanism:**
  An officer who assigns themselves to a zone cannot unassign themselves or reassign to another sector until the hazard is completely resolved by consensus. Furthermore, `dbHandler.js:255` contains no implementation for `DELETE FROM zone_assignments`, meaning that in local fallback mode, unassigning is mathematically impossible.

---

### 5.3 Mismatched Radius Property Name in `UserDashboard.jsx`
* **File:** [`userApp/frontend/src/components/UserDashboard.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/UserDashboard.jsx#L178-L182)
* **Lines:** 178–182
* **Severity:** **MEDIUM (DYNAMIC CALCULATION STALL)**
* **Code Proof:**
  ```javascript
  // Line 178:
  if (closestZone.radius_meters && closestZone.radius_meters !== currentRadius) {
    setCurrentRadius(closestZone.radius_meters);
  }
  ```
* **Failure Mechanism:**
  In lines 88–103 of `UserDashboard.jsx`, the zones array was mapped into objects with camelCase property `radiusMeters: parseFloat(z.radius_meters) || 7000`. `closestZone.radius_meters` is always `undefined`. The condition is never satisfied, and the dynamic shelter search radius remains hardcoded at 7000m forever.

---

### 5.4 Typo `sucess: false` in Rate Limiter and Master Error Handler
* **File:** [`adminDash/backend/handlers/middlewareHandler.js`](file:///d:/Projects/SurakshaDrishti/adminDash/backend/handlers/middlewareHandler.js#L9)
* **Lines:** 9, 49
* **Severity:** **LOW (CONTRACT MISMATCH)**
* **Code Proof:**
  ```javascript
  // Line 9:
  message: {
      sucess: false,
      status: 429,
      error: `Too many requests from this IP, please try again later.`
  }
  // Line 49:
  res.status(statusCode).json({
      sucess: false,
      status: statusCode,
      error: err.message || "Internal Server Error"
  });
  ```
* **Failure Mechanism:**
  Spelled with a single 'c' (`sucess: false`). Any frontend caller checking `if (response.success)` or `if (data.success)` evaluates to `undefined` (falsy) instead of inspecting the structured error.

---

### 5.5 Synthesized Audio Siren Muted by Browser/Electron Autoplay Policy
* **File:** [`userApp/frontend/src/components/AlertNotification.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/components/AlertNotification.jsx#L10)
* **Lines:** 10–35
* **Severity:** **MEDIUM (AUDIO SUPPRESSION)**
* **Code Proof:**
  ```javascript
  let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  ...
  function startSiren() {
    oscillator = audioCtx.createOscillator();
    ...
    oscillator.start();
  }
  ```
* **Failure Mechanism:**
  In modern Chromium/Electron environments, creating and starting an `AudioContext` without prior user interaction inside that specific `BrowserWindow` is blocked. `audioCtx.state` remains `'suspended'`. Because the emergency alert window opens autonomously without user interaction, the siren runs silently.

---

### 5.6 Electron Production Deep-Link Routing Failure with `BrowserRouter`
* **Files:** [`userApp/backend/main.cjs`](file:///d:/Projects/SurakshaDrishti/userApp/backend/main.cjs#L79) vs [`userApp/frontend/src/main.jsx`](file:///d:/Projects/SurakshaDrishti/userApp/frontend/src/main.jsx#L3)
* **Severity:** **MEDIUM (ROUTING CONFLICT)**
* **Code Proof:**
  In `main.cjs` line 79:
  ```javascript
  alertWindow.loadURL(`file://${path.join(__dirname, '../frontend/dist/index.html')}#/alert`);
  ```
  In `main.jsx` line 47:
  ```jsx
  <BrowserRouter>
    <ToastProvider>
      <App />
    </ToastProvider>
  </BrowserRouter>
  ```
* **Failure Mechanism:**
  Under the `file://` protocol in packaged Electron distributions, HTML5 History API (`BrowserRouter`) cannot resolve filesystem paths without hitting routing conflicts. `main.cjs` passes a hash route (`#/alert`), but the frontend is wrapped in a `BrowserRouter` instead of a `HashRouter`.

---

## 6. Architectural Discrepancies & Dead Code Bloat

### 6.1 Complete Absence of Claimed Python/PyTorch AI Microservice
* **Document Reference:** [`ai_prediction_architecture.md`](file:///d:/Projects/SurakshaDrishti/ai_prediction_architecture.md#L20-L55) & [`TECH_WOW_AND_NOVELTY.md`](file:///d:/Projects/SurakshaDrishti/TECH_WOW_AND_NOVELTY.md#L50-L58)
* **Discrepancy:**
  The documentation asserts the existence of:
  * A Python / FastAPI microservice.
  * PyTorch ConvLSTM and Video Vision Transformer (ViViT) models.
  * Real-time SAR/Copernicus satellite feeds running at 5–10 FPS.
  * Redis pub/sub pipelines.
* **Factual Codebase Reality:**
  There is **not a single Python file (`.py`)** anywhere in the repository. There is no FastAPI service, no PyTorch weights, no Redis queue, and no satellite ingestion pipeline. The actual implementation is a simple Node.js route (`POST /zones/ai-satellite-detect`) that inserts hardcoded coordinates into a database.

---

### 6.2 Dead Code: Unused Heavy 3D and Geographic Dependencies
* **Files:**
  * [`userApp/package.json`](file:///d:/Projects/SurakshaDrishti/userApp/package.json#L13-L15): Declares `three`, `@react-three/fiber`, and `@react-three/drei`. Grep search across `userApp/frontend/src` returns **0 imports**.
  * [`adminDash/frontend/src/components/HeroSection.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/HeroSection.jsx): 225 lines of legacy hero layout, completely orphaned and unreferenced in `App.jsx`.
  * [`adminDash/frontend/src/components/CinematicSatellite3D.jsx`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/src/components/CinematicSatellite3D.jsx): 7.8 KB Three.js component, completely unreferenced.
  * [`adminDash/frontend/math_engine.cpp`](file:///d:/Projects/SurakshaDrishti/adminDash/frontend/math_engine.cpp): Uncompiled C++ source file placed in the frontend directory.
  * [`userApp/backend/h3PathfindingTest.js`](file:///d:/Projects/SurakshaDrishti/userApp/backend/h3PathfindingTest.js): Standalone test script. The production application in `UserDashboard.jsx` delegates pathfinding to the public Open Source Routing Machine (OSRM) HTTP API (`router.project-osrm.org`).

---

## 7. Comprehensive Issue Matrix & Priority Remediation Plan

| ID | Issue Title | Subsystem | Severity | Impact |
|:---|:---|:---|:---:|:---|
| **1.1** | Recursive `router.handle` in `/quick-signup` | `adminDash/backend` | **CRITICAL** | Stack overflow crashes Node.js server process |
| **1.2** | Undefined `req.user.username` in JWT | Backend (All routes) | **CRITICAL** | Universal failure of Chat, Profile, and Feedback |
| **1.3** | Uncaught `zone.safeSite.name` in Leaflet popup | `adminDash/frontend` | **HIGH** | React `ErrorBoundary` crash on map rendering |
| **1.4** | Blank Screen of Death on role mismatch | `userApp/frontend` | **HIGH** | App renders `null` on valid uppercase roles |
| **2.1** | Plaintext password fallback in `Compare_Pass` | `adminDash/backend` | **CRITICAL** | Bcrypt hash string acts as authentication backdoor |
| **2.2** | Bcrypt hashes hardcoded in demo officer modal | `adminDash/frontend` | **HIGH** | Exposes and leverages password backdoor |
| **2.3** | 2FA verification simulated via `setTimeout` | `adminDash/frontend` | **HIGH** | Any arbitrary 6-character code bypasses 2FA |
| **2.4** | Plaintext password storage in `localStorage` | `adminDash/frontend` | **HIGH** | Plaintext credentials exposed; DB never updated |
| **2.5** | Supabase database password committed to Git | Backend Config | **HIGH** | Full public database exposure |
| **2.6** | Hardcoded OTP `123456` in API catch block | `userApp/frontend` | **MEDIUM** | Offline backdoor bypasses authentication |
| **2.7** | Mismatched JWT secrets across auth endpoints | `adminDash/backend` | **MEDIUM** | Tokens fail validation across routes |
| **3.1** | Officer Red Zone assignment is purely local | `adminDash/frontend` | **HIGH** | Lost on refresh; not shared with other officers |
| **3.2** | Zone resolution voting always fails | `adminDash` (Full Stack) | **HIGH** | Vote count remains 0; resets officer assignment |
| **3.3** | Trapped citizens count calculated as `4 * 710` | `adminDash/frontend` | **MEDIUM** | Fake telemetry; real citizen SOS GPS ignored |
| **3.4** | Tactical chat simulated with static `setTimeout` | `adminDash/frontend` | **MEDIUM** | Fake chat disconnected from backend / sockets |
| **3.5** | Agent Dashboard Comms Send button has no click | `userApp/frontend` | **HIGH** | Agent cannot send emergency messages |
| **3.6** | QuickSign SOS drops latitude/longitude | `adminDash` (Full Stack) | **HIGH** | Citizen coordinates stored as `NULL` |
| **3.7** | QuickSign guest promoted to NDRF Commander | `adminDash/frontend` | **HIGH** | Anonymous civilians gain apex command controls |
| **3.8** | Frontend calls non-existent endpoints | Frontend / Backend | **MEDIUM** | 404 errors on `/stats/live`, `/alerts/active` |
| **4.1** | `radius NUMERIC NOT NULL` omitted in INSERT | Backend DB | **HIGH** | PostgreSQL rejects new zone creation |
| **4.2** | `assigned_mem NOT NULL` omitted in INSERT | Backend DB | **HIGH** | Zone archival fails with constraint violation |
| **4.3** | Missing `bypassed_2fa` column in schema | Backend DB | **HIGH** | QuickSign fails; always triggers fallback |
| **4.4** | `initDB` only creates `users` table | Backend DB | **HIGH** | Fresh database missing all hazard & chat tables |
| **4.5** | Inverted parameter mapping in local store | Backend DB | **MEDIUM** | Latitude saved to phone, longitude to shelter ID |
| **5.1** | Unconditional red zone alert in EmergencyMode | `adminDash/frontend` | **MEDIUM** | False alarm triggers worldwide |
| **5.2** | Officer lockout on zone unassignment | `adminDash/backend` | **MEDIUM** | Officers cannot unassign during emergencies |
| **5.3** | `closestZone.radius_meters` property mismatch | `userApp/frontend` | **MEDIUM** | Dynamic shelter radius never updates |
| **5.4** | Typo `sucess: false` in error handlers | `adminDash/backend` | **LOW** | Breaks frontend checks expecting `res.success` |
| **5.5** | AudioContext siren blocked by autoplay policy | `userApp/frontend` | **MEDIUM** | Emergency siren window is silent |
| **5.6** | `BrowserRouter` used with `file://` in Electron | `userApp` (Full Stack) | **MEDIUM** | Packaging / routing conflicts in production |
| **6.1** | Claimed Python / PyTorch AI engine is absent | System Architecture | **HIGH** | Marketing claims contradict 0 Python files |
| **6.2** | Dead components & bloat dependencies | Full Repository | **LOW** | ~50MB of unused Three.js and unlinked files |

---

### Step-by-Step Priority Remediation Roadmap

1. **Phase 1: Critical Server Stability & Security (Day 1)**
   * Replace `return router.handle(req, res, next)` in `auth.js` with an explicit redirect or remove the route.
   * Standardize JWT payload to `{ user_id, email, role, full_name }` and refactor all routes to use `req.user.user_id`.
   * Remove `return password === hash` backdoor from `Compare_Pass` in `auth.js`.
   * Rotate Supabase database password in `.env` and remove secrets from version control.
   * Align JWT secrets across `auth.js` and `middlewareHandler.js`.

2. **Phase 2: Database Schema & API Alignment (Day 2)**
   * Execute full `schema.sql` inside `initDB()`.
   * Add default values to `radius` in `hazard_zones` and `assigned_mem` in `history_red_zones`.
   * Add `bypassed_2fa` to `schema.sql` under `emergency_passes`.
   * Align QuickSign parameters (`lat`, `lng`, `specialNeeds`) between frontend and backend.
   * Fix parameter mapping in `dbHandler.js` local query executor.

3. **Phase 3: Frontend Integrity & Workflow Hookup (Day 3)**
   * Add optional chaining `${zone.safeSite?.name || 'Safe Hub'}` in `RealGoogleMap.jsx`.
   * Dispatch real `POST /api/zones/assign` in `handleAssignSelf` in `Dashboard.jsx`.
   * Connect real `GET /api/zones/:zoneId/trapped-citizens` to `Dashboard.jsx` map pins.
   * Hook up `onClick` handler on Agent Dashboard send button.
   * Connect real password update API to `UserProfile.jsx` instead of `localStorage`.
   * Convert `userApp/frontend` router to `HashRouter` for reliable Electron file protocol support.

4. **Phase 4: Cleanup & Optimization (Day 4)**
   * Remove unused Three.js packages from `userApp/package.json`.
   * Delete orphaned components (`HeroSection.jsx`, `CinematicSatellite3D.jsx`, `math_engine.cpp`).
   * Add user interaction trigger to resume `AudioContext` in `AlertNotification.jsx`.
   * Correct typo `sucess` to `success` in `middlewareHandler.js`.
