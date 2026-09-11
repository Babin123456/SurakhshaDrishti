<div align="center">

<!-- Standard Animated Header Wave with Title Directly on the Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:8B7355,70:B85C38,100:2D7A4F&height=200&section=header&text=SurakshaDrishti&fontSize=50&fontColor=ffffff&fontAlignY=38&desc=Intelligent%20Multi-Hazard%20Red%20Zone%20and%20Relocation%20Platform&descSize=16&descColor=f3ede2&descAlignY=58" width="100%" alt="SurakshaDrishti Header"/>
<!-- Animated Dynamic Typing Banner -->
<img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=800&size=20&duration=3000&pause=1000&color=D4AF37&center=true&vCenter=true&width=700&lines=SIH+2026+Problem+Statement+26191;ADAMAS+University+SurakshaDrishti+Team;AI-Powered+Hazard-Based+Red+Zone+Detection;Proactive+Relocation+%26+Dynamic+Shelter+Balancing" alt="Typing Subtitle" />

<pre align="center">
███████╗██╗   ██╗██████╗  █████╗ ██╗  ██╗███████╗██╗  ██╗ █████╗ ██████╗ ██████╗ ██╗███████╗██╗  ██╗████████╗██╗
██╔════╝██║   ██║██╔══██╗██╔══██╗██║ ██╔╝██╔════╝██║  ██║██╔══██╗██╔══██╗██╔══██╗██║██╔════╝██║  ██║╚══██╔══╝██║
███████╗██║   ██║██████╔╝███████║█████╔╝ ███████╗███████║███████║██║  ██║██████╔╝██║███████╗███████║   ██║   ██║
╚════██║██║   ██║██╔══██╗██╔══██║██╔═██╗ ╚════██║██╔══██║██╔══██║██║  ██║██╔══██╗██║╚════██║██╔══██║   ██║   ██║
███████║╚██████╔╝██║  ██║██║  ██║██║  ██╗███████║██║  ██║██║  ██║██████╔╝██║  ██║██║███████║██║  ██║   ██║   ██║
╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝
</pre>

<br/>

<!-- System Telemetry & Authority Badges -->
<p align="center">
  <a href="https://smartindiahackathon.gov.in">
    <img src="https://img.shields.io/badge/SIH_2026-Problem_Statement_26191-8B7355?style=for-the-badge&labelColor=2C2A29" alt="SIH 2026"/>
  </a>
  &nbsp;
  <a href="https://ndrf.gov.in">
    <img src="https://img.shields.io/badge/Authority-MHA_%2F_NDRF_%2F_SDMA-2D7A4F?style=for-the-badge&labelColor=1A1A1A" alt="NDRF SDMA"/>
  </a>
  &nbsp;
  <a href="#core-system-capabilities">
    <img src="https://img.shields.io/badge/Spatial_Index-8--Char_Geohash_Sub--Meter-B85C38?style=for-the-badge&labelColor=2C2A29" alt="Geohash Submeter"/>
  </a>
  &nbsp;
  <a href="https://github.com/Kashcx-dev/SurakshaDrishti">
    <img src="https://img.shields.io/badge/GitHub-Kashcx--dev%2FSurakshaDrishti-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository"/>
  </a>
</p>

<!-- Problem Statement Card -->
> **SIH Problem Statement 26191**: Intelligent Identification of Hazard-Based Red Zones, Dynamic Carrying Capacity Assessment of Safer Relocation Sites, and Immediate Prioritization of Vulnerable Habitations.

</div>

---

## Executive System Workflow

**SurakshaDrishti** is split into two physically distinct operating platforms to separate Central Authority commands from field operations.

### 1. `adminDash` (The Central Command Server & Dashboard)

The `adminDash` directory contains the core intelligence of the system.

- **The Backend (`adminDash/backend`)**: An Express.js & Socket.io server that powers the entire ecosystem. It connects to the Supabase PostgreSQL database, handles OTP and 2FA authentication logic, tracks global telemetry, and processes O(1) map locatives.
- **The Web Dashboard (`adminDash/frontend`)**: A React/Vite web platform locked down exclusively for Central Command Desk Access (NDRF / SDMA). It provides a bird's-eye tactical GIS view of all active red zones and allows inter-agency consensus voting.

### 2. `userApp` (The Field Officer & Civilian Client App)

The `userApp` directory contains a native Electron Desktop/Mobile application used by people physically on the ground.

- It connects remotely to the `adminDash` backend.
- **Citizen Access**: Civilians log in with an instant QuickSign OTP, which automatically geolocates their IP/GPS and assigns them an immediate evacuation route or safe shelter.
- **Field Officer Access**: Ground battalions log in securely using a 2-Step Email/Password + OTP flow to access the tactical GIS HUD and secure End-to-End Encrypted (E2EE) chat relay.

---

## Tech Stack & Architecture

<div align="center">

| Frontend & App | Backend & Engine | Database & Real-Time | AI & Spatial Telemetry |
| :---: | :---: | :---: | :---: |
| ![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black) | ![Node.js](https://img.shields.io/badge/Node.js_v20-339933?style=flat-square&logo=nodedotjs&logoColor=white) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL_17-4169E1?style=flat-square&logo=postgresql&logoColor=white) | ![PyTorch](https://img.shields.io/badge/PyTorch_ConvLSTM-EE4C2C?style=flat-square&logo=pytorch&logoColor=white) |
| ![Electron](https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white) | ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white) | ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=black) | ![Spatial GIS](https://img.shields.io/badge/GIS_Engine-Open_Spatial_Vectors-199900?style=flat-square&logoColor=white) |
| ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | ![JWT](https://img.shields.io/badge/JWT_Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white) | ![ISRO](https://img.shields.io/badge/ISRO_EOS--4-FF9933?style=flat-square&logoColor=white) |

</div>

---

## Core System Capabilities

### Central Command Console (NDRF / SDMA)

- **16-Digit Cryptographic Zone Passkeys**: Each active red zone generates an isolated 16-character access key required for authorized battalion officers to join incident dispatch.
- **Inter-Agency Consensus Voting**: Red Zones transition to "Situation Controlled" only when all assigned multi-agency commanders cast an authenticated consensus vote.
- **Multi-Layer Tactical GIS HUD**: Open-source GIS rendering (OpenStreetMap, CARTO Dark, Esri Satellite) plotting red hazard perimeters alongside real-time civilian SOS coordinates.
- **Officer Profile 2FA & Credential Security**: Official contact changes (email, mobile phone) require two-factor clearance codes dispatched to the registered address before updating. Password modifications strictly enforce current password validation, length matching, and real-time credential synchronization across all active sessions.

### Resident Emergency & Evacuation Ecosystem

- **QuickSign 30-Second Emergency Pass**: Generates authenticated digital evacuation passes instantly without standard 2FA bottlenecks during landslides or flash floods.
- **Multi-Strategy GPS Cascade**: Location detection uses a 3-tier fallback: Browser GPS → HTTPS IP Geolocation → Hardcoded default. This ensures the app works on phones (with GPS), laptops (via IP), and even air-gapped devices.
- **Red Zone Alarm System**: When the server detects that a user's coordinates fall inside a Red Zone circle (Haversine distance ≤ zone radius), it pushes a persistent Electron alert overlay with evacuation coordinates. The alert cannot be dismissed without acknowledgment.
- **H3 Geohash Pathfinding**: Evacuation routes are computed using Uber's H3 hexagonal grid. The backend sends the user a list of safehouse coordinates, and the app resolves an offline-capable path using H3 cell adjacency — no GPS required during transit, only the initial fix.
- **Dynamic Shelter Carrying Capacity**: Multi-objective spatial algorithms allocate residents across safe sites to avoid road bottlenecks or overloaded relief camps.
- **8-Character Spatial Geohashing**: Sub-meter resolution indexing (`#tdv2n19z`) for instant hazard evaluation across millions of coordinates.
- **GSM 3.4 Offline Telemetry** *(planned)*: Low-bandwidth geohash SMS alerts through local towers when broadband/cellular internet grids collapse.

### AI & Telemetry Infrastructure

- **AI Prediction History Logging**: Comprehensive PostgreSQL tracking of all proactive AI-generated Red Zone triggers. Logs include exact coordinate bounds, calculated hazard radii, trigger reasoning (e.g., 'Soil Moisture 88%'), and statistical confidence scores for human-in-the-loop validation and academic review.
- **Hybrid Dynamic Shelter Allocation**: A dual-layer resilient architecture. The backend actively polls the database for officially registered government shelters (SDMA). If a Red Zone triggers in an undocumented area, the system gracefully falls back to the **OpenStreetMap (Overpass) API**, dynamically scraping nearby schools and hospitals using physical Haversine distance based on the AI's generated radius, and rendering them on the Civilian's UI with realistic assumed capacities and warning overlays.

---

## Database Schema Architecture

The relational data backbone operates on **Supabase PostgreSQL 17.6** across synchronized tables:

| Table | Primary Responsibility |
| :--- | :--- |
| `users` | Role-based accounts (`RESIDENT`, `NDRF`, `SDMA`, `POLICE`) & operating modes. |
| `hazard_zones` | AI hazard perimeters, risk scores (0–100), H3/S2 spatial geohashes, and access keys. |
| `zone_assignments` | Inter-agency battalion rosters, and multi-officer consensus resolution votes. |
| `shelters` | Safe haven carrying capacities, real-time bed occupancy, and corridors. |
| `emergency_passes` | QuickSign digital SOS evacuation tokens and offline passes. |
| `e2ee_conversations` | End-to-end encrypted dispatch channels between field battalions. |

---

## Quick Start & Local Development

### 1. Start the Central Backend Server (adminDash)

The backend MUST be running for authentication, map data, and telemetry to work.

```bash
cd adminDash/backend
npm install
npm start
```

> Server starts on port `5000` with an active WebSocket listener.

### 2. Start the Civilian / Officer Client App (userApp)

Open a **second terminal window** to boot the Electron Desktop application.

```bash
cd userApp
npm install
npm run electron
```

> This concurrently serves Vite on `http://localhost:5173` and boots the native Electron window. Hardware acceleration is disabled by default in `main.cjs` to ensure compatibility across all Windows drivers.

*(Optional)* To start the Central Web Dashboard:

```bash
cd adminDash/frontend
npm install
npm run dev
```

---

## Project Documentation Hub

For granular architectural diagrams, file-by-file working principles, and subsystem manuals:

| Document | Description |
| :--- | :--- |
| [**AI Prediction Architecture**](./ai_prediction_architecture.md) | Deep learning specifications for time-series ConvLSTM, ViViT spatio-temporal modeling, and H3/S2 geohash anomaly heatmaps. |
| [**TECH WOW AND NOVELTY**](./TECH_WOW_AND_NOVELTY.md) | Novelty features detailing GSM Offline modes, Encrypted Mesh Nets, and the Custom 3D Tilt Graphics Engine. |
| [**Main Repository**](https://github.com/Kashcx-dev/SurakshaDrishti) | Official GitHub repository source code, issues, and release tracking. |
| [**LICENSE**](./LICENSE) | Official Open-Source MIT License attributed to ADAMAS University (SIH 2026). |

<br/>

<div align="center">

<!-- Standard Animated Footer Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2D7A4F,40:B85C38,100:8B7355&height=120&section=footer" width="100%" alt="SurakshaDrishti Footer Wave"/>

**SurakshaDrishti — Prepared for Crisis. Engineered for Survival.**

</div>
