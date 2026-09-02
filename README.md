<div align="center">

<!-- Standard Animated Header Wave with Title Directly on the Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:8B7355,70:B85C38,100:2D7A4F&height=200&section=header&text=SurakshaDrishti&fontSize=50&fontColor=ffffff&fontAlignY=38&desc=Intelligent%20Multi-Hazard%20Red%20Zone%20and%20Relocation%20Platform&descSize=16&descColor=f3ede2&descAlignY=58" width="100%" alt="SurakshaDrishti Header"/>
<!-- Animated Dynamic Typing Banner -->
<img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=800&size=20&duration=3000&pause=1000&color=D4AF37&center=true&vCenter=true&width=700&lines=SIH+2026+Problem+Statement+26191;ADAMAS+University+SurakshaDrishti+Team;AI-Powered+Hazard-Based+Red+Zone+Detection;Proactive+Relocation+%26+Dynamic+Shelter+Balancing" alt="Typing Subtitle" />

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
  <a href="#-core-system-capabilities">
    <img src="https://img.shields.io/badge/Spatial_Index-8--Char_Geohash_Sub--Meter-B85C38?style=for-the-badge&labelColor=2C2A29" alt="Geohash Submeter"/>
  </a>
</p>

<!-- Problem Statement Card -->
> 🚨 **SIH Problem Statement 26191**: Intelligent Identification of Hazard-Based Red Zones, Dynamic Carrying Capacity Assessment of Safer Relocation Sites, and Immediate Prioritization of Vulnerable Habitations.

</div>

---

## ⚡ Tech Stack & Architecture

<div align="center">

| 🖥️ Frontend & Visualization | ⚙️ Backend & Engine | 🗄️ Database & Real-Time | 🛰️ AI & Spatial Telemetry |
| :---: | :---: | :---: | :---: |
| ![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black) | ![Node.js](https://img.shields.io/badge/Node.js_v20-339933?style=flat-square&logo=nodedotjs&logoColor=white) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL_17-4169E1?style=flat-square&logo=postgresql&logoColor=white) | ![PyTorch](https://img.shields.io/badge/PyTorch_ConvLSTM-EE4C2C?style=flat-square&logo=pytorch&logoColor=white) |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white) | ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=black) | ![Spatial GIS](https://img.shields.io/badge/GIS_Engine-Open_Spatial_Vectors-199900?style=flat-square&logoColor=white) |
| ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | ![JWT](https://img.shields.io/badge/JWT_Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white) | ![ISRO](https://img.shields.io/badge/ISRO_EOS--4-FF9933?style=flat-square&logoColor=white) |

</div>

---

## 🛰️ System Architecture Flow

```mermaid
flowchart TD
    subgraph Ingestion["🛰️ AI Satellite & Telemetry Ingestion Layer"]
        A["ISRO SAR / Sentinel-2 Thermal Feeds"] --> B["PyTorch ConvLSTM Hazard Engine"]
        B -->|"POST /api/zones/ai-satellite-detect"| C["Express.js Command Engine"]
        GSM["📡 GSM 3.4 Low-Bandwidth Telemetry SMS"] --> C
    end

    subgraph Core["🗄️ Secure Database & Real-Time Rail"]
        C -->|"SSL Connection Pool"| D[("Supabase PostgreSQL 17.6")]
        C -->|"WebSocket Emitter"| E["Socket.io Real-Time Alert Hub"]
        D --> T1["🚨 hazard_zones (16-Digit Access Keys)"]
        D --> T2["🛡️ zone_assignments (Inter-Agency Roster)"]
        D --> T3["⚡ emergency_passes (QuickSign SOS Tokens)"]
    end

    subgraph Ecosystem["🖥️ Dual-Role Operations Interface"]
        E -->|"Push Telemetry"| F["Command HUD (NDRF / SDMA Web Platform)"]
        F -->|"Consensus Resolution Vote"| C
        F -->|"16-Digit Zone Dispatch"| C
        
        G["Resident Emergency App (Desktop / Mobile)"] -->|"QuickSign 30-Sec SOS"| C
        C -->|"Allocated Shelter & Offline Route"| G
    end
```

---

## 💎 Core System Capabilities

### 🎖️ 1. Official Command & Consensus Console (NDRF / SDMA)

* 🔐 **16-Digit Cryptographic Zone Passkeys**: Each active red zone generates an isolated 16-character access key (e.g. `RZ-89A4-91F2-3B7C`) required for authorized battalion officers to join incident dispatch.
* 🗳️ **Inter-Agency Consensus Voting**: Red Zones transition to **"Situation Controlled"** only when all assigned multi-agency commanders (NDRF, SDMA, Fire, Police) cast an authenticated consensus vote.
* 🗺️ **Multi-Layer Tactical GIS HUD**: Open-source GIS rendering (OpenStreetMap, CARTO Dark, Esri Satellite) plotting red hazard perimeters alongside real-time civilian SOS coordinates.
* 📍 **Native Browser GPS Calibration**: Automated field officer coordinate sync without external geolocation API costs or failure points.

---

### 🚨 2. Resident Emergency & Evacuation Ecosystem

* ⚡ **QuickSign 30-Second Emergency Pass**: Generates authenticated digital evacuation passes instantly without standard 2FA bottlenecks during landslides or flash floods.
* 📡 **GSM 3.4 Offline Telemetry Mesh**: Dispatches low-bandwidth geohash SMS alerts through local towers when broadband/cellular internet grids collapse.
* 🏕️ **Dynamic Shelter Carrying Capacity**: Multi-objective spatial algorithms allocate residents across safe sites to avoid road bottlenecks or overloaded relief camps.
* 🧭 **8-Character Spatial Geohashing**: Sub-meter resolution indexing (`#tdv2n19z`) for instant hazard evaluation across millions of coordinates.

---

## 🗃️ Database Schema Architecture

The relational data backbone operates on **Supabase PostgreSQL 17.6** across 11 synchronized tables:

| Table | Primary Responsibility |
| :--- | :--- |
| `users` | Role-based accounts (`RESIDENT`, `NDRF`, `SDMA`, `POLICE`) & operating modes (`ON_SITE`, `OFF_SITE`). |
| `hazard_zones` | AI hazard perimeters, risk scores (0–100), H3/S2 spatial geohashes, and 16-digit access keys. |
| `zone_assignments` | Inter-agency battalion rosters, deployment tracking, and multi-officer consensus resolution votes. |
| `shelters` | Safe haven carrying capacities, real-time bed occupancy, food/medical supply indices, and corridors. |
| `emergency_passes` | QuickSign digital SOS evacuation tokens and offline passes. |
| `e2ee_conversations` | End-to-end encrypted dispatch channels between field battalions and district magistrates. |
| `e2ee_messages` | Zero-knowledge encrypted message payloads. |
| `gsm_telemetry_logs` | Low-bandwidth disaster SMS packet archives. |

---

## 🚀 Quick Start & Local Development

### Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0+

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Babin123456/SurakshaDrishti.git
cd SurakshaDrishti
```

### 2️⃣ Backend Configuration

```bash
cd backend
npm install
node src/main.js
```

> Server starts on port `5000` (or `process.env.PORT`) with active WebSocket listener.

### 3️⃣ Frontend Configuration

```bash
cd ../frontend
npm install
npm run dev
```

> 🌐 Access the live web interface at `http://localhost:5173`

---

## 📚 Project Documentation Hub

For granular architectural diagrams, file-by-file working principles, and subsystem manuals:

| Document | Description |
| :--- | :--- |
| 📖 [**INSTRUCTIONS.md**](./INSTRUCTIONS.md) | Comprehensive file-by-file breakdown explaining the exact working principle, inputs, and outputs of every component, handler, route, and utility. |
| 🏗️ [**ARCHITECTURE.md**](./ARCHITECTURE.md) | In-depth Mermaid sequence and flow diagrams detailing high-level topology, multi-agency consensus resolution voting, and shelter carrying capacity balancing. |
| 🧠 [**AI Prediction Architecture**](./ai_prediction_architecture.md) | Deep learning specifications for time-series ConvLSTM, ViViT spatio-temporal modeling, and H3/S2 geohash anomaly heatmaps. |
| 🗄️ [**Detailed Backend Architecture**](./BACKEND_ARCHITECTURE.md) | Line-by-line breakdown of Express route handlers, PostgreSQL DDL migrations, transaction integrity, and Socket.io channel topology. |
| 🖥️ [**Frontend README**](./frontend/README.md) | Client-side architecture, 3D tilt engine, shrinking capsule navbar, design system tokens, and component directory tree. |
| ⚙️ [**Backend README**](./backend/README.md) | Server-side command engine, Socket.io event channels, PostgreSQL schema matrix, and REST API route registry. |
| ⚖️ [**LICENSE**](./LICENSE) | Official Open-Source MIT License attributed to ADAMAS University (SIH 2026). |

---

## 📄 License & Acknowledgements

* **Hackathon**: Developed for Smart India Hackathon (SIH 2026) under Problem Statement **26191**.
* **Institution**: **ADAMAS University** — SurakshaDrishti Team.
* **Governing Body**: Ministry of Home Affairs (MHA), National Disaster Response Force (NDRF), and State Disaster Management Authorities (SDMA).
* **License**: Released under the permissive [MIT License](./LICENSE).

<br/>

<div align="center">

<!-- Standard Animated Footer Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2D7A4F,40:B85C38,100:8B7355&height=120&section=footer" width="100%" alt="SurakshaDrishti Footer Wave"/>

**SurakshaDrishti — Prepared for Crisis. Engineered for Survival.** 🇮🇳

</div>
