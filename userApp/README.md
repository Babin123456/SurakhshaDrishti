<div align="center">

<!-- Animated Header Wave with Title -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0B192C,45:1E3E62,80:008DDA,100:41C9E2&height=220&section=header&text=SurakshaDrishti%20UserApp&fontSize=42&fontColor=ffffff&fontAlignY=36&desc=Civilian%20Incident%20Hub%20and%20Tactical%20Field%20Client&descSize=16&descColor=ACE2E1&descAlignY=58" width="100%" alt="SurakshaDrishti userApp Header"/>

<!-- Animated Dynamic Typing Subtitle -->
<img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=700&size=18&duration=3000&pause=1000&color=41C9E2&center=true&vCenter=true&width=650&lines=Civilian+Rapid+Evacuation+and+Alert+Client;Offline-Capable+Dynamic+OSRM+Corridor+Routing;Real-Time+Proximity+Geofencing+and+Audio+Siren;Cross-Platform+Electron+Desktop+and+Mobile+Web" alt="Typing Subtitle" />

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Electron_Desktop_%2F_Vite_Web-008DDA?style=for-the-badge&labelColor=0B192C" alt="Platform"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Routing-OSRM_Dynamic_Corridor-1E3E62?style=for-the-badge&labelColor=0B192C" alt="Routing"/>
  &nbsp;
  <img src="https://img.shields.io/badge/GIS-Leaflet_1.9_%2F_Multi--Layer-41C9E2?style=for-the-badge&labelColor=0B192C&logoColor=white" alt="GIS"/>
</p>

</div>

---

A cross-platform disaster response desktop and web client for civilians and field tactical personnel. Built on **Electron**, **React**, and **Leaflet GIS**, this application provides real-time multi-hazard proximity monitoring, dynamic evacuation corridor routing via OSRM, instant civil defense sirens, and zero-knowledge tactical field coordination.

---

## 1. System Architecture & Workflow

```mermaid
flowchart TD
    subgraph ClientBoot ["Application Initialization"]
        A["Electron Main Process (main.cjs)"] --> B["Preload Bridge (preload.cjs)"]
        B --> C["Intro Sequence (ISRO/Sentinel Telemetry)"]
        C --> D["Role Selection & Authentication"]
    end

    subgraph Authentication ["Authentication Pipeline"]
        D -->|"Citizen Mode"| E["Mobile Number Authentication (+91)"]
        D -->|"Field Authority Mode"| F["Command Credentials + 2FA Verification"]
        E & F --> G["Session Persistence (localStorage)"]
    end

    subgraph CoreEngine ["Active Operational Engine"]
        G --> H["Citizen Radar Console / Field Console"]
        H --> I["Dynamic GPS Geofencing"]
        I --> J{"Inside Red Zone Radius?"}
        J -->|"Yes"| K["Multi-Window Alert & Web Audio Siren"]
        J -->|"No"| L["Standby & Sector Monitoring"]
        H --> M["OSRM Routing Engine (project-osrm.org)"]
        M --> N["Real-Time Evacuation Corridor"]
    end
```

---

## 2. Core Working Principles

### 2.1 Civilian Proximity & Blast Radius Monitoring

- **Automated Geofencing:** Computes the Haversine distance between the user's detected coordinates and all active disaster perimeters (`ACTIVE_RED_ZONE` / `ACTIVE_WARNING_ZONE`).
- **Targeted Perimeter Filter:** Only renders active red zone danger buffers if the citizen is physically within the hazard radius, preventing panic in unaffected sectors.
- **Relief Hub Resolution:** Queries the backend dynamic shelter service (`/api/zones/shelters/dynamic`) to retrieve verified camps and high-capacity fallback centers (schools, hospitals) within reach.

### 2.2 Dynamic Evacuation Corridors (OSRM Engine)

- **Street-Level Polyline Generation:** Uses the Open Source Routing Machine (OSRM) driving API to plot actionable road routes from the user's location to the designated Relief Hub.
- **Failover Vector Fallback:** If external network routing is constrained or offline, gracefully draws a high-visibility direct evacuation corridor vector.
- **Camera Interpolation:** Smooth `flyToBounds` easing (1.8s, `easeLinearity: 0.25`) automatically aligns the viewport along the full path when switching hubs.

### 2.3 Standalone Emergency Warning Window & Siren

- **Dedicated Electron BrowserWindow:** Employs an independent, frameless, always-on-top window spawned via IPC (`trigger-alert`).
- **Web Audio API Siren:** Synthesizes an emergency civil defense siren tone (`800Hz <-> 600Hz` square-wave oscillation) directly through hardware speakers without relying on external audio assets.
- **Safe Teardown:** Closes cleanly upon citizen acknowledgment via `acknowledge-alert` IPC.

---

## 3. Directory Structure

```text
userApp/
├── backend/
│   ├── main.cjs            # Electron main process (window management, IPC handlers)
│   └── preload.cjs         # Context-isolated IPC bridge (electronAPI)
├── frontend/
│   ├── public/             # Static assets (favicon, branding)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AgentDashboard.jsx      # Field tactical unit console
│   │   │   ├── AlertNotification.jsx   # Standalone emergency alert popup
│   │   │   ├── AppLogin.jsx            # Citizen phone login & Authority 2FA
│   │   │   ├── IntroSequence.jsx       # Initial GIS telemetry loader
│   │   │   ├── RealGoogleMap.jsx       # Leaflet GIS map with OSRM corridors
│   │   │   └── UserDashboard.jsx       # Citizen Radar Console & HUD
│   │   ├── utils/
│   │   │   └── api.js                  # Centralized backend HTTP communication
│   │   ├── App.jsx                     # Root application coordinator
│   │   ├── index.css                   # Tailwind base & custom design tokens
│   │   └── main.jsx                    # React DOM entry point
│   ├── index.html                      # HTML template
│   └── vite.config.js                  # Vite bundler configuration
├── package.json                        # Scripts and dependency specifications
├── postcss.config.cjs                  # PostCSS plugin settings
└── tailwind.config.js                  # Custom palette, typography, and animations
```

---

## 4. Prerequisites

- **Node.js:** v18.x or v20.x LTS
- **npm:** v9.x or higher
- **Backend API:** `adminDash/backend` running on `http://localhost:5000`

---

## 5. Setup & Installation

Navigate to the `userApp` directory:

```bash
cd d:/Projects/SurakshaDrishti/userApp
```

Install dependencies:

```bash
npm install
```

---

## 6. Execution Modes

### 6.1 Desktop App (Electron Development Mode)

Runs Vite dev server and launches the Electron desktop shell concurrently:

```bash
npm run electron
```

### 6.2 Browser Web Mode

Runs the client as a browser application accessible at `http://localhost:5173`:

```bash
npm run dev
```

### 6.3 Production Build

Compiles and bundles the frontend into `frontend/dist`:

```bash
npm run build
```

---

## 7. Operational Workflow

```mermaid
sequenceDiagram
    autonumber
    participant U as Citizen / Field Officer
    participant L as AppLogin
    participant S as Session Storage
    participant D as UserDashboard / Map
    participant O as OSRM Router
    participant B as Core Backend

    U->>L: Enter 10-Digit Mobile / Authority Auth
    L->>B: POST /auth/quicksign or /auth/login
    B-->>L: Session Token & Assigned Sector
    L->>S: Store session in localStorage
    L->>D: Mount Dashboard Interface
    D->>B: Fetch Active Hazard Zones (/api/zones)
    D->>O: Request Driving Route to Safe Hub
    O-->>D: Street Coordinates & Turn Geometry
    D->>D: Render Blue Evacuation Corridor & Markers
    opt Hazard Detected in Sector
        D->>U: Spawn Emergency Window & Play Siren
        U->>D: Click "Acknowledge & Dismiss"
    end
```

---

## 8. Technology Stack

- **Desktop Framework:** Electron v44
- **UI Framework:** React v18 + Vite v5
- **Mapping & GIS:** Leaflet v1.9, OpenStreetMap, CARTO Dark Tiles, Esri World Imagery
- **Routing:** OSRM (Open Source Routing Machine)
- **Styling:** TailwindCSS v3 (Dark Matte / Warm Creme Palette)
- **Icons:** Lucide React
- **Audio Engine:** Web Audio API (OscillatorNode Synthesizer)

<br/>

<div align="center">

<!-- Animated Footer Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:41C9E2,35:008DDA,70:1E3E62,100:0B192C&height=120&section=footer" width="100%" alt="SurakshaDrishti userApp Footer Wave"/>

**SurakshaDrishti UserApp — Rapid Civil Defense. Direct Evacuation. Built for Resilient Survival.**

</div>
