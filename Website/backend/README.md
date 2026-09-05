<div align="center">

<!-- Animated Header Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=180&section=header&text=SurakshaDrishti%20Backend&fontSize=42&fontColor=ffffff&fontAlignY=36" width="100%" alt="Backend Header Wave"/>

```text
 ███████╗██╗   ██╗██████╗  █████╗ ██╗  ██╗███████╗██╗  ██╗ █████╗ ██████╗ ██████╗ ██╗███████╗██╗  ██╗████████╗██╗
 ██╔════╝██║   ██║██╔══██╗██╔══██╗██║ ██╔╝██╔════╝██║  ██║██╔══██╗██╔══██╗██╔══██╗██║██╔════╝██║  ██║╚══██╔══╝██║
 ███████╗██║   ██║██████╔╝███████║█████╔╝ ███████╗███████║███████║██║  ██║██████╔╝██║███████╗███████║   ██║   ██║
 ╚════██║██║   ██║██╔══██╗██╔══██║██╔═██╗ ╚════██║██╔══██║██╔══██║██║  ██║██╔══██╗██║╚════██║██╔══██║   ██║   ██║
 ███████║╚██████╔╝██║  ██║██║  ██║██║  ██╗███████║██║  ██║██║  ██║██████╔╝██║  ██║██║███████║██║  ██║   ██║   ██║
 ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝
```

### ⚙️ Scalable Node.js + Express 5 + Socket.io Disaster Decision Engine

<!-- Animated Dynamic Typing Banner -->
<img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=800&size=20&duration=3000&pause=1000&color=2D7A4F&center=true&vCenter=true&width=650&lines=SIH+2026+Problem+Statement+26191;ADAMAS+University+SurakshaDrishti+Team;PostgreSQL+17+Relational+Core+%2B+Socket.io+Rails" alt="Backend Typing Subtitle" />

<br/>

[![Node Version](https://img.shields.io/badge/Node.js-v20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express Version](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL Version](https://img.shields.io/badge/PostgreSQL-17.6-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=for-the-badge&logo=supabase&logoColor=black)](https://supabase.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-v4.8-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![JWT Auth](https://img.shields.io/badge/JWT-Protected-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

</div>

---

## 🧭 Executive Overview

The **SurakshaDrishti Backend** is a fault-tolerant, low-latency command engine engineered for emergency mission operations. It serves as the single source of truth for:
- **Real-Time Spatial Ingestion:** High-speed ingest of ISRO SAR anomalies and IMD precipitation telemetry.
- **16-Digit Cryptographic Access Verification:** Guarantees that only authorized on-site commanders can join incident coordination.
- **Inter-Agency Consensus Voting:** Automatically transitions active Red Zones to "Situation Under Control" once consensus thresholds are met across NDRF, SDMA, and Police agencies.
- **QuickSign 30-Second Emergency Pass Tokens:** Issues authenticated, low-overhead civilian passes during sudden disasters without 2FA bottlenecks.
- **Low-Bandwidth GSM Telemetry:** Fallback ingestion pipeline for 140-byte emergency SMS packets when cellular internet data networks fail.

---

## 🛰️ Backend Architecture & Route Registry

```mermaid
flowchart TD
    subgraph Core["⚙️ SurakshaDrishti Backend Engine (Port 5000)"]
        direction TB

        subgraph S1["🔐 Authentication & Authorization"]
            A1["/api/auth/login & /register"]
            A2["/api/auth/quick-sign (30s SOS Pass)"]
            A3["JWT + Role-Based Access Control"]
        end

        subgraph S2["🚨 Hazard Zones & Consensus"]
            Z1["/api/zones (GeoJSON Perimeters)"]
            Z2["/api/zones/verify-key (16-Digit Passkey)"]
            Z3["/api/zones/consensus-vote (Multi-Agency Resolution)"]
        end

        subgraph S3["💬 Encrypted Dispatch Channels"]
            C1["/api/chat/conversations"]
            C2["/api/chat/messages (E2EE Payloads)"]
            C3["Battalion Roster Access Guard"]
        end

        subgraph S4["👤 Profile & Duty State"]
            P1["/api/profile (Officer Rosters)"]
            P2["Duty Mode Toggle: ON_SITE / OFF_SITE"]
        end

        subgraph S5["📝 Auditing & Feedback"]
            F1["/api/feedback (Incident Reports)"]
            F2["Citizen Grievance Logs"]
        end

        subgraph S6["📡 Real-Time WebSocket Hub"]
            W1["Socket.io Event Emitters"]
            W2["Live Threat Polygon Pushes"]
            W3["Civilian SOS Beacon Signals"]
        end
    end
```

### 1. Authentication Routes (`backend/routes/auth.js`)

- `POST /api/auth/register` — Role-based account creation (`RESIDENT`, `NDRF`, `SDMA`, `POLICE`).
- `POST /api/auth/login` — Issues signed JWT tokens with 7-day expiration.
- `POST /api/auth/quick-sign` — Rapid civilian evacuation pass generator with zero 2FA friction.
- `POST /api/auth/verify-otp` — SMTP / SMS one-time verification code validator.

### 2. Hazard Zone Routes (`backend/routes/zones.js`)

- `GET /api/zones` — Returns all active red zones, boundary GeoJSON perimeters, and assigned battalions.
- `POST /api/zones/verify-key` — Validates the 16-character passkey (`RZ-XXXX-XXXX-XXXX`) for officer incident enrollment.
- `POST /api/zones/consensus-vote` — Submits an officer's vote; resolves zone to safe status upon majority consensus.
- `POST /api/zones/ai-satellite-detect` — Webhook endpoint for automated deep learning hazard polygon detection.

### 3. Encrypted Dispatch Channels (`backend/routes/chat.js`)

- `GET /api/chat/conversations` — Retrieves agency-scoped encrypted chat rooms.
- `POST /api/chat/messages` — Stores encrypted message payloads and emits real-time WebSocket signals.

---

## 🗄️ Database Architecture (Supabase PostgreSQL 17.6)

The data tier maintains 11 relational tables connected via an SSL connection pool:

```text
backend/
├── handlers/
│   ├── dbHandler.js             # PostgreSQL connection pool & spatial queries
│   ├── middlewareHandler.js     # JWT verification, API rate-limiting & error handlers
│   └── aiAssistent.js           # Ollama & local AI inference helper
├── routes/
│   ├── auth.js                  # Authentication, OTP & QuickSign endpoints
│   ├── zones.js                 # Red zone perimeters & consensus resolution voting
│   ├── chat.js                  # E2EE inter-departmental dispatch messaging
│   ├── profile.js               # Duty mode toggle (ON_SITE / OFF_SITE) & badges
│   └── feedback.js              # Incident audits & citizen grievance filing
└── src/
    └── main.js                  # Express 5 server bootstrapper & Socket.io hub
```

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites

- **Node.js**: `v18.0.0` or higher (v20+ recommended)
- **npm**: `v9.0.0` or higher
- **PostgreSQL**: PostgreSQL 16+ or active Supabase project credentials

### 2. Environment Configuration

Create a `.env` file inside `backend/`:

```ini
PORT=5000
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
JWT_SECRET=your_super_secret_jwt_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASS=your_app_password
```

### 3. Installation & Run

```bash

# Navigate to the backend directory

cd backend

# Install dependencies

npm install

# Start the server

node src/main.js
```

> ⚡ API Server and WebSocket listener launch on: **`http://localhost:5000`**

---

<div align="center">

<!-- Animated Footer Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=120&section=footer" width="100%" alt="Backend Footer Wave"/>

**SurakshaDrishti Backend Engine**  
*SIH 2026 Problem Statement 26191 • Developed by ADAMAS University Team*

</div>
