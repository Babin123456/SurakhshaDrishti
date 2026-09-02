<div align="center">

<!-- Animated Header Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=180&section=header&text=SurakshaDrishti%20Backend%20Deep%20Dive&fontSize=38&fontColor=ffffff&fontAlignY=36" width="100%" alt="Backend Architecture Header Wave"/>

<!-- Animated Dynamic Typing Banner -->
<img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=800&size=20&duration=3000&pause=1000&color=4169E1&center=true&vCenter=true&width=650&lines=SIH+2026+Problem+Statement+26191;ADAMAS+University+SurakshaDrishti+Team;PostgreSQL+17+Schema+%2B+Atomic+Transaction+Migrations" alt="Backend Architecture Typing Subtitle" />

</div>

<br/>

> **SIH 2026 Problem Statement 26191:** AI-Driven Multi-Hazard Red Zone Identification, Dynamic Relocation, and Emergency Telemetry Decision Support System (DSS).  
> **Team**: ADAMAS University  

---

## 1. System Architecture Overview

The **SurakshaDrishti Backend Engine** is built using **Node.js, Express.js, PostgreSQL (Supabase Cloud), and Socket.io**. It handles real-time disaster alerts, AI satellite telemetry ingestion, cryptographic 16-digit Red Zone security key validation, multi-agency consensus voting, low-bandwidth GSM pings, and role-based authentication.

### Core Stack Components:
- **Runtime & Web Framework**: Node.js v20+ with Express.js (`http://localhost:5000`).
- **Database Engine**: PostgreSQL 17.6 hosted on Supabase Cloud (`postgres://...supabase.co:5432/postgres`) with native SSL connection pooling via node-postgres (`pg`).
- **Real-Time Telemetry**: Socket.io WebSocket server (`cors: origin: '*'`) bound to Node HTTP server instance.
- **Authentication & Cryptography**: JSON Web Tokens (JWT) + Bcrypt password hashing (`saltRounds = 10`) + AES-GCM E2EE key vaults.

---

## 2. Directory & Component Layout

```
backend/
├── .env                       # Database credentials, JWT Secret, Mailer tokens
├── package.json               # Dependencies (express, pg, socket.io, jwt, bcrypt)
├── handlers/
│   ├── dbHandler.js           # PostgreSQL pool setup & automated schema initialization
│   └── middlewareHandler.js   # JWT authentication, rate limiters, 404 & master error handler
├── routes/
│   ├── auth.js                # Login, Signup, 2FA, Emergency QuickSign, Role checks
│   ├── zones.js               # Red Zone CRUD, 16-Digit Key Assign, Consensus Vote, AI Satellite Feed
│   ├── profile.js             # User bio, public keys, and profile settings
│   ├── chat.js                # Inter-departmental E2EE chat logs
│   └── feedback.js            # User feedback and system telemetry logs
└── src/
    └── main.js                # Application entry point, Express configuration & Socket.io listeners
```

---

## 3. Database Schema Breakdown (`handlers/dbHandler.js`)

`handlers/dbHandler.js` initializes a resilient connection pool using `pg.Pool` and automatically runs an idempotent DDL migration script inside an atomic PostgreSQL transaction (`BEGIN ... COMMIT`).

### 3.1. `users` Table (Dual Role & Operating Mode)
Stores user accounts for both Citizens (`RESIDENT`) and Field/Command Officers (`NDRF`, `SDMA`, `FIRE_RESCUE`, `POLICE`).

```sql
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,                       -- Unique identifier (username, email, or badge ID)
    email TEXT UNIQUE NOT NULL,                     -- Unique email address
    password TEXT NOT NULL,                         -- Bcrypt hashed password string
    full_name TEXT,                                 -- Official display name
    phone TEXT,                                     -- Primary contact telephone number
    user_role TEXT DEFAULT 'RESIDENT',              -- Role: 'RESIDENT', 'NDRF', 'SDMA', 'FIRE_RESCUE', 'POLICE'
    officer_mode TEXT DEFAULT 'OFF_SITE',           -- Mode: 'ON_SITE' (Mobile App), 'OFF_SITE' (Command Console)
    district TEXT DEFAULT 'Wayanad, Kerala',        -- Assigned administrative district
    family_members INTEGER DEFAULT 1,              -- Household size count for carrying capacity math
    has_vulnerable BOOLEAN DEFAULT false,           -- Priority evacuation flag (Elderly / Infant / Disabled)
    current_geohash TEXT,                           -- H3 / S2 precision spatial geohash index
    lat DOUBLE PRECISION,                           -- WGS84 Latitude coordinate
    lng DOUBLE PRECISION,                           -- WGS84 Longitude coordinate
    public_key TEXT DEFAULT NULL,                   -- ECDH / RSA E2EE Public Key for secure messaging
    encrypted_private_key TEXT DEFAULT NULL,        -- Client-side encrypted private key vault
    key_salt TEXT DEFAULT NULL,                     -- Key derivation salt
    key_iv TEXT DEFAULT NULL,                       -- Initialization Vector for private key vault
    bio TEXT DEFAULT '~SurakshaDrishti User~',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2. `hazard_zones` Table (AI Satellite Detections & 16-Digit Keys)
Stores active disaster perimeters dynamically generated by AI satellite analysis or manual command overrides.

```sql
CREATE TABLE IF NOT EXISTS hazard_zones (
    zone_id TEXT PRIMARY KEY,                       -- e.g. "RZ-WAYANAD-04" or "RZ-AI-89A4"
    name TEXT NOT NULL,                             -- e.g. "Wayanad Hill Slope (Sector 4)"
    state TEXT,                                     -- Administrative state (e.g. "Kerala")
    lat DOUBLE PRECISION NOT NULL,                  -- Center Latitude coordinate
    lng DOUBLE PRECISION NOT NULL,                  -- Center Longitude coordinate
    zone_type TEXT NOT NULL,                        -- 'RED' (Critical), 'YELLOW' (Warning), 'GREEN' (Safe)
    hazard_type TEXT NOT NULL,                      -- 'LANDSLIDE', 'SUBSIDENCE', 'GLOF', 'FLASH_FLOOD'
    risk_score INTEGER DEFAULT 0,                   -- AI Risk Index score (0 to 100)
    geohash TEXT NOT NULL,                          -- 8-character spatial geohash
    population_risk INTEGER DEFAULT 0,              -- Estimated population count inside zone
    radius_meters INTEGER DEFAULT 3000,             -- Hazard perimeter radius in meters
    access_key TEXT NOT NULL DEFAULT 'RZ-0000-0000-0000', -- Unique 16-Digit Cryptographic Security Key
    status TEXT NOT NULL DEFAULT 'ACTIVE_RED_ZONE', -- Status: 'ACTIVE_RED_ZONE' vs 'SITUATION_UNDER_CONTROL'
    resolution_votes_required INTEGER DEFAULT 2,    -- Mandatory officer consensus threshold count
    resolution_votes_cast INTEGER DEFAULT 0,        -- Total votes recorded to resolve sector
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3. `zone_assignments` Table (Multi-Agency Officer Roster & Consensus Votes)
Tracks administrator assignments to specific Red Zones using the 16-Digit Security Key, along with resolution votes.

```sql
CREATE TABLE IF NOT EXISTS zone_assignments (
    assignment_id SERIAL PRIMARY KEY,               -- Auto-incrementing assignment ID
    zone_id TEXT REFERENCES hazard_zones(zone_id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    officer_name TEXT,                              -- Display name of assigned officer
    department TEXT,                                -- Agency ('NDRF', 'SDMA', 'POLICE', etc.)
    assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    vote_to_resolve BOOLEAN DEFAULT false,          -- Consensus vote: true if officer votes situation under control
    voted_at TIMESTAMPTZ,                           -- Timestamp when vote was cast
    UNIQUE(zone_id, user_id)                        -- Prevents duplicate assignments per officer
);
```

### 3.4. `shelters` Table (Carrying Capacity & Safe Havens)
Stores safe evacuation shelters and tracks real-time carrying capacity to prevent overcrowding.

```sql
CREATE TABLE IF NOT EXISTS shelters (
    shelter_id TEXT PRIMARY KEY,                    -- e.g. "SH-S7-ALPHA"
    zone_id TEXT REFERENCES hazard_zones(zone_id) ON DELETE SET NULL,
    name TEXT NOT NULL,                             -- e.g. "Relief Camp Alpha — Sector 7"
    lat DOUBLE PRECISION NOT NULL,                  -- Latitude
    lng DOUBLE PRECISION NOT NULL,                  -- Longitude
    capacity_total INTEGER NOT NULL,                -- Total unit capacity
    capacity_occupied INTEGER DEFAULT 0,            -- Current real-time occupancy
    status TEXT DEFAULT 'OPEN',                     -- 'OPEN', 'FULL', 'STANDBY'
    evacuation_corridor TEXT                       -- Recommended safe travel route
);
```

### 3.5. `emergency_passes` Table (QuickSign SOS Digital Passes)
Tracks priority digital SOS passes generated for residents trapped in Red Zones.

```sql
CREATE TABLE IF NOT EXISTS emergency_passes (
    pass_id TEXT PRIMARY KEY,                       -- e.g. "QS-A9X2K"
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    phone TEXT,                                     -- Resident phone number
    geohash TEXT,                                   -- Resident spatial geohash
    lat DOUBLE PRECISION,                           -- Resident Latitude
    lng DOUBLE PRECISION,                           -- Resident Longitude
    assigned_shelter_id TEXT REFERENCES shelters(shelter_id) ON DELETE SET NULL,
    special_needs TEXT[],                           -- Array: ['elderly', 'wheelchair', 'infant']
    status TEXT DEFAULT 'ACTIVE_RED_ZONE',          -- 'ACTIVE_RED_ZONE', 'EVACUATED', 'RESOLVED'
    bypassed_2fa BOOLEAN DEFAULT false,             -- True if generated under 2FA emergency override
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### 3.6. Inter-Departmental E2EE Chat Tables (`e2ee_conversations` & `e2ee_messages`)
Zero-Knowledge E2EE encrypted channels between NDRF, SDMA, and Field Commanders.

```sql
CREATE TABLE IF NOT EXISTS e2ee_conversations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,                             -- Channel title
    department TEXT DEFAULT 'INTER_DEPARTMENTAL',
    is_red_alert BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS e2ee_messages (
    message_id SERIAL PRIMARY KEY,
    conversation_id TEXT REFERENCES e2ee_conversations(id) ON DELETE CASCADE,
    sender_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    encrypted_payload TEXT NOT NULL,               -- AES-GCM 256 ciphertext
    iv TEXT,                                        -- Initialization Vector
    signature TEXT,                                 -- Cryptographic sender signature
    timestamp BIGINT NOT NULL
);
```

---

## 4. Main Server Entry Point (`src/main.js`) — Line-by-Line Breakdown

- **Lines 1–16**: Imports environment variables (`dotenv.config()`), Express framework, CORS, path utilities, middleware handlers (`handle404`, `masterErrorHandler`, `FN_verifyTkn`, `API_Limiter`), database pool (`dbHandler`), and route modules (`auth`, `zones`, `chat`, `profile`, `feedback`).
- **Lines 17–19**: Initializes Express application instance `app`, configures `trust proxy` for reverse proxy rate-limiting headers, and sets default server port (`process.env.PORT || 5000`).
- **Lines 21–24**: Configures CORS middleware (`cors()`), JSON body parsing middleware (`express.json()`), and serves compiled production static frontend files from `../../frontend/dist` and static assets.
- **Lines 26–28**: Exposes GET `/` health check route returning API status JSON.
- **Lines 31–36**: Mounts route namespaces with rate limiting:
  - `/auth` & `/api/auth` -> `authRoutes` (Rate limit: 50 requests / 60 seconds).
  - `/zones` & `/api/zones` -> `zonesRoutes` (Red Zone management & AI satellite feed).
  - `/chat` -> `chatRoutes` (JWT verified).
  - `/profile` -> `profileRoutes` (JWT verified).
  - `/feedback` -> `feedbackRoutes` (JWT verified).
- **Lines 38–40**: Attaches Express 404 handler (`handle404`) and global master error handling middleware (`masterErrorHandler`).
- **Lines 43–49**: Creates an HTTP server using Node `http.createServer(app)` and initializes a Socket.io server instance (`new Server(server, { cors: { origin: '*' } })`).
- **Lines 51–69**: Socket.io Authentication Middleware. Intercepts incoming WebSocket handshake connections, extracts JWT token from `socket.handshake.auth.token`, and verifies signature using `process.env.JWT_SECRET`. If no token is passed, sets `socket.user = { role: 'GUEST' }` to allow guest emergency monitoring.
- **Lines 71–90**: Socket.io Event Listeners:
  - `join_sector`: Allows clients to dynamically join WebSocket sector rooms matching H3/S2 spatial geohashes.
  - `emergency_ping`: Receives emergency telemetry pings from field devices and broadcasts `red_zone_alert` to all connected clients.
  - `disconnect`: Logs client disconnection.
- **Lines 92–96**: Binds Socket.io instance to Express app (`app.set("socketio", io)`) and starts listening on port 5000 (`server.listen(PORT)`).

---

## 5. Authentication & Security Routes (`routes/auth.js`) — Line-by-Line Breakdown

- **Lines 10–29**: Utility functions `Hash_Pass` (generates bcrypt password hashes with salt rounds), `validatePassword`, and `Compare_Pass` (compares plaintext passwords against bcrypt hashes with fallback string comparison for seeded demo accounts).
- **Lines 60–140**: `POST /login` Route:
  - Queries `users` table for `user_id`, `email`, or `phone`.
  - Verifies password hash using `Compare_Pass`.
  - **CRITICAL SECURITY POLICY ENFORCEMENT**: Evaluates user role:
    ```javascript
    const userRole = (user.user_role || (loginType === 'authority' ? 'NDRF' : 'RESIDENT')).toUpperCase();
    const isAuthority = ['NDRF', 'SDMA', 'FIRE_RESCUE', 'POLICE', 'AUTHORITY', 'GOVT_ADMIN'].includes(userRole) || loginType === 'authority';
    const isResident = !isAuthority;
    const canBypass2FA = isResident && (redZoneBypass || trustedDevice);
    ```
  - **Residents**: If trapped inside an active Red Zone (`redZoneBypass: true`), 2FA is bypassed so they get an immediate JWT token without waiting for email OTP delays.
  - **Authorities (NDRF, SDMA, Police)**: **2FA IS NEVER BYPASSED.** Authorities must ALWAYS complete full email OTP verification.
- **Lines 142–186**: `POST /quicksign` Route:
  - Processes 30-second emergency registration for citizens trapped in Red Zones.
  - Generates an emergency ID (`QS-XXXXXX`).
  - Queries `shelters` table for nearest open shelter with available capacity.
  - Inserts record into `emergency_passes` with `bypassed_2fa = true`.
  - Returns shelter assignment and safe evacuation corridor route.
- **Lines 188–215**: `POST /verify-otp` Route:
  - Verifies 6-digit email OTP from `otpStore`. Issues a 24-hour signed JWT token (`jwt.sign`).
- **Lines 217–280**: `POST /signup` Route:
  - Checks if username/email already exists. Hashes password using bcrypt.
  - Inserts new user record into `users` table with specified `user_role`, `district`, `family_members`, and `has_vulnerable` flags.
  - Returns signed JWT token.

---

## 6. Red Zone & AI Telemetry Routes (`routes/zones.js`) — Line-by-Line Breakdown

- **Lines 7–11**: `generate16DigitZoneKey()` helper. Uses Node `crypto.randomBytes(6)` to generate a 16-character security key in format `RZ-XXXX-XXXX-XXXX`.
- **Lines 13–44**: `GET /zones` Route:
  - Executes a `LEFT JOIN` between `hazard_zones` and `zone_assignments`.
  - Aggregates active assigned officers into a JSON array (`assigned_officers`) and returns all zones ordered by `risk_score DESC`.
- **Lines 46–79**: `POST /zones/create` Route:
  - Manual creation of a Red Zone. Generates 16-Digit Access Key, geohash, and inserts into `hazard_zones`.
- **Lines 81–135**: `POST /zones/ai-satellite-detect` Route (Automated AI Feed Ingestion):
  - Ingests spatio-temporal hazard telemetry from Python ConvLSTM satellite analysis services.
  - Accepts `lat`, `lng`, `radius_meters`, `zone_type` (`RED` / `YELLOW`), `hazard_type`, and `risk_score`.
  - Automatically calculates 16-Digit Security Key (`access_key`) and geohash.
  - Inserts or updates `hazard_zones` table on Supabase.
  - Emits real-time WebSocket event (`ai_red_zone_detected`) via Socket.io to instantly update all active Command Consoles!
- **Lines 137–185**: `POST /zones/assign` Route:
  - Officer assigns self to a Red Zone using the 16-Digit Security Access Key.
  - Validates key against `hazard_zones.access_key`.
  - Inserts or updates assignment in `zone_assignments` table.
- **Lines 187–240**: `POST /zones/vote-resolve` Route:
  - Officer votes to resolve a Red Zone situation (`vote_to_resolve = true`).
  - Counts total positive votes cast by assigned inter-agency officers.
  - Compares `totalVotes` against `resolution_votes_required` (Majority Consensus).
  - When threshold is reached, automatically updates `hazard_zones.status` to `'SITUATION_UNDER_CONTROL'` and `zone_type` to `'GREEN'`.
- **Lines 242–275**: `GET /zones/:zoneId/trapped-citizens` Route:
  - Queries `emergency_passes` for active trapped citizens inside the Red Zone and returns coordinate telemetry for rendering blue pulsing map markers.

---

## 7. Security Policies & Verification

1. **Authentication Policy**: JWT tokens are signed with `JWT_SECRET` with 24-hour expiration.
2. **2FA Policy**: Emergency 2FA bypass is strictly restricted to Citizens (`RESIDENT`) trapped in Red Zones. All Authority role logins (`NDRF`, `SDMA`, `POLICE`) enforce mandatory 2FA.
3. **Database SSL & Resilience**: Supabase PostgreSQL connections enforce `ssl: { rejectUnauthorized: false }` with automated connection timeouts.

<div align="center">

<!-- Animated Footer Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=120&section=footer" width="100%" alt="Backend Architecture Footer Wave"/>

**SurakshaDrishti Backend Technical Architecture**  
*Smart India Hackathon 2026 • Problem Statement #26191 • Developed by ADAMAS University Team*  
*Repository: [`Babin123456/SurakshaDrishti`](https://github.com/Babin123456/SurakshaDrishti)*

</div>
