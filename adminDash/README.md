<div align="center">

<!-- Animated Header Wave with Title -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1F2937,40:8B7355,80:B85C38,100:2D7A4F&height=220&section=header&text=SurakshaDrishti%20AdminDash&fontSize=40&fontColor=ffffff&fontAlignY=36&desc=Central%20Command%20Hub%20and%20Tactical%20Operations%20Server&descSize=16&descColor=F3EDE2&descAlignY=58" width="100%" alt="SurakshaDrishti adminDash Header"/>

<!-- Animated Dynamic Typing Subtitle -->
<img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=700&size=18&duration=3000&pause=1000&color=D4AF37&center=true&vCenter=true&width=700&lines=Central+Authority+Disaster+Decision+Support+Platform;Multi+Agency+Consensus+Resolution+and+Voting+Matrix;Real+Time+Socket+io+Alert+Hub+and+AI+Satellite+Telemetry;PostgreSQL+and+Supabase+Real+Time+State+Engine" alt="Typing Subtitle" />

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/Authority-NDRF_%2F_SDMA_%2F_MHA-2D7A4F?style=for-the-badge&labelColor=1A1A1A" alt="Authority"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Engine-Express_v5_%2F_Socket.io-B85C38?style=for-the-badge&labelColor=1A1A1A" alt="Engine"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Database-Supabase_PostgreSQL-8B7355?style=for-the-badge&labelColor=1A1A1A" alt="Database"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Console-React_18_%2F_Vite-1F2937?style=for-the-badge&labelColor=1A1A1A" alt="Console"/>
</p>

</div>

---

**SurakshaDrishti AdminDash** serves as the central brain and tactical command console of the SurakshaDrishti disaster management ecosystem. It unites the central REST & real-time WebSocket backend with the command desk frontend, allowing authorized authorities (NDRF, SDMA, District Administration) to monitor AI-predicted hazard perimeters, execute inter-agency consensus votes, coordinate field battalions, and dispatch critical evacuation directives.

---

## 1. System Architecture & Workflow

```mermaid
flowchart TD
    subgraph AuthorityAccess ["Command Access & Authentication"]
        A["Official Command Desk (NDRF / SDMA / Police)"] --> B["2-Step Authority Login"]
        B --> C["Credential Validation + OTP Verification"]
        C --> D["JWT Token + Cryptographic Role Assignment"]
    end

    subgraph CommandDesk ["Central Tactical Frontend (React + Vite)"]
        D --> E["Command Dashboard HUD"]
        E --> F["Multi-Layer Tactical GIS Map (OSM, CARTO, Esri)"]
        E --> G["Live Hazard Zone Roster & Red Zone Geometry"]
        E --> H["Shelter Carrying Capacity & Occupancy Matrix"]
        E --> I["Inter-Agency Consensus Voting Console"]
    end

    subgraph CentralEngine ["Backend Core Engine (Express.js + Socket.io)"]
        J["REST API Gateway (/api/zones, /api/shelters, /api/auth)"]
        K["Socket.io Real-Time Telemetry Hub"]
        L["Local JSON Fallback Engine (dbHandler.js)"]
        M["PostgreSQL Client Pool (Supabase)"]
    end

    subgraph ExternalFeeds ["Ingestion & Client Mesh"]
        N["AI Hazard Detection Pipeline (ConvLSTM Feeds)"]
        O["userApp Clients (Civilians & Field Units)"]
    end

    E <-->|"HTTP REST + WebSockets"| J & K
    N -->|"POST /api/zones/ai-satellite-detect"| J
    J <--> M
    J <-->|"Fallback Storage"| L
    K <-->|"Real-Time Push / Listen"| O
    K <-->|"Instant Dispatch"| E
```

---

## 2. Core Working Principles

### 2.1 Multi-Agency Consensus Voting Matrix
- **Cryptographic Access Keys:** Every triggered hazard zone generates a unique 16-character passkey required for authorized battalion officers to join an incident dispatch channel.
- **Democratic Incident De-escalation:** Red zones cannot be arbitrarily cleared by a single entity. They transition from `ACTIVE_RED_ZONE` to `SITUATION_CONTROLLED` only when designated multi-agency commanders (NDRF, SDMA, Fire, Police) cast authenticated consensus resolution votes.
- **Audit Logging:** Every consensus vote and state transition is immutably timestamped and recorded in PostgreSQL for post-crisis audits.

### 2.2 Dual-Layer Database Architecture
- **Primary Rail (Supabase PostgreSQL 17.6):** Fully relational schema with 11 synchronized tables managing zone geometries, spatial coordinates, user permissions, shelters, and emergency passes.
- **Fail-Safe Offline Local Rail (`dbHandler.js`):** If upstream cloud database connections encounter latency, SSL timeouts, or network loss during natural disasters, the system automatically degrades gracefully to atomic, lock-protected local JSON database files (`suraksha_local_db.json`), ensuring uninterrupted command operations.

### 2.3 Real-Time Bi-Directional Telemetry Mesh
- **WebSocket Broadcasts:** When an AI alert or official red zone perimeter triggers, the backend emits high-priority socket events (`zone_created`, `emergency_alert`, `consensus_update`) simultaneously to the command web dashboard and connected `userApp` field devices.
- **Zone Geometry Propagation:** Full polygon bounds, hazard radii, and severity indices are streamed to the GIS map with sub-meter spatial precision.

### 2.4 Shelter Carrying Capacity Optimization
- Evaluates real-time occupancy vs. theoretical maximum safe site capacity.
- Balances resident inflows dynamically across surrounding relief camps to prevent local infrastructure bottlenecks.

---

## 3. Directory Layout

```
adminDash/
├── backend/                                # Central Server & API Gateway
│   ├── database/
│   │   └── suraksha_local_db.json          # Fail-safe local database store
│   ├── handlers/
│   │   └── dbHandler.js                    # Dual-rail DB interface (Postgres + Local JSON)
│   ├── routes/
│   │   ├── auth.js                         # Authentication, OTP, & QuickSign routes
│   │   ├── e2ee.js                         # End-to-end encrypted dispatch channels
│   │   ├── shelters.js                     # Safe site carrying capacity endpoints
│   │   └── zones.js                        # Hazard zones, consensus voting, AI triggers
│   ├── src/
│   │   └── main.js                         # Server entry point, middleware, Socket.io setup
│   ├── uploads/                            # Stored telemetry & incident files
│   ├── .env.example                        # Template for environment configuration
│   └── package.json                        # Backend scripts & dependency specifications
├── frontend/                               # Tactical Web Command Console
│   ├── public/                             # Static visual assets & badges
│   ├── src/
│   │   ├── components/                     # Dashboard HUD, GIS maps, consensus modals
│   │   ├── utils/                          # API connectors & spatial calculation utilities
│   │   ├── App.jsx                         # Main application routing & session manager
│   │   ├── index.css                       # TailwindCSS styles & theme tokens
│   │   └── main.jsx                        # React root entry point
│   ├── index.html                          # HTML shell with custom fonts
│   ├── package.json                        # Frontend dependencies & build commands
│   ├── postcss.config.cjs                  # PostCSS configuration
│   ├── tailwind.config.js                  # Color palette & custom typography rules
│   └── vite.config.js                      # Vite bundler configuration
└── README.md                               # Project documentation
```

---

## 4. Sequence Workflow

```mermaid
sequenceDiagram
    autonumber
    participant A as NDRF / SDMA Officer
    participant F as Command Dashboard (Frontend)
    participant B as Express API Backend
    participant DB as Supabase PostgreSQL / Local DB
    participant S as Socket.io Alert Hub
    participant U as userApp (Field Units)

    A->>F: Log in with Authority Credentials + 2FA
    F->>B: POST /api/auth/login
    B->>DB: Validate Officer Credentials & Role
    DB-->>B: Authenticated Token & Role Data
    B-->>F: Return JWT Session
    F->>B: GET /api/zones (Fetch Active Incidents)
    B->>DB: Query Active Red Zones
    DB-->>B: Zone Coordinates & Threat Levels
    B-->>F: Render Tactical GIS Map & Threat Perimeters
    opt Consensus Voting Procedure
        A->>F: Cast Resolution Vote for Sector
        F->>B: POST /api/zones/:id/vote-resolve
        B->>DB: Record Vote & Evaluate Threshold
        alt Consensus Reached (All Agencies Voted)
            B->>DB: Update Status to SITUATION_CONTROLLED
            B->>S: Emit "zone_resolved" Event
            S-->>F: Update Command HUD Instantly
            S-->>U: Clear Emergency Standby for Sector
        else Consensus Pending
            B-->>F: Update Vote Counter (e.g., 2/3 Agencies)
        end
    end
```

---

## 5. Prerequisites

- **Node.js:** v18.x or v20.x LTS
- **npm:** v9.x or higher
- **PostgreSQL Database:** Supabase PostgreSQL instance (or local JSON fallback mode)

---

## 6. Setup & Installation

### 6.1 Backend Configuration

1. Navigate to the backend directory:
   ```bash
   cd adminDash/backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and configure credentials:
   ```bash
   cp .env.example .env
   ```
   Required keys:
   - `PORT=5000`
   - `SUPABASE_URL=https://your-supabase-project-id.supabase.co`
   - `DATABASE_URL=postgres://postgres:your-db-password@db.your-supabase-project-id.supabase.co:5432/postgres`
   - `JWT_SECRET=your_super_secret_jwt_key`

4. Launch the backend server:
   ```bash
   npm start
   ```
   > The server starts on `http://localhost:5000` with active WebSocket listener.

---

### 6.2 Frontend Configuration

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd adminDash/frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   > The web interface will be accessible at `http://localhost:5173`.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 7. Technology Stack

- **Backend Runtime:** Node.js v20+ with Express.js v5
- **Real-Time Mesh:** Socket.io v4.8
- **Database:** Supabase PostgreSQL 17.6 with `pg` connection pooling & atomic local JSON fallback
- **Authentication:** JWT (JSON Web Tokens) with 2-Factor OTP verification and bcrypt password hashing
- **Frontend Framework:** React v18 + Vite v5
- **Mapping & GIS:** Leaflet v1.9, OpenStreetMap, CARTO Dark, Esri Satellite imagery
- **Styling:** TailwindCSS v3 (Warm Creme & Matte Dark Slate palette)
- **Icons:** Lucide React

<br/>

<div align="center">

<!-- Animated Footer Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2D7A4F,40:B85C38,80:8B7355,100:1F2937&height=120&section=footer" width="100%" alt="SurakshaDrishti adminDash Footer Wave"/>

**SurakshaDrishti AdminDash — Tactical Intelligence. Multi-Agency Consensus. Disaster Defense.**

</div>
