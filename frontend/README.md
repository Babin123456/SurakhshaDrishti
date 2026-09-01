# 🌊 SurakshaDrishti — Frontend Architecture & Intelligence Console

<div align="center">

```
   ███████╗██╗   ██╗██████╗  █████╗ ██╗  ██╗███████╗██╗  ██╗ █████╗ 
   ██╔════╝██║   ██║██╔══██╗██╔══██╗██║ ██╔╝██╔════╝██║  ██║██╔══██╗
   ███████╗██║   ██║██████╔╝███████║█████╔╝ ███████╗███████║███████║
   ╚════██║██║   ██║██╔══██╗██╔══██║██╔═██╗ ╚════██║██╔══██║██╔══██║
   ███████║╚██████╔╝██║  ██║██║  ██║██║  ██╗███████║██║  ██║██║  ██║
   ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
```

### 🛰️ Next-Gen GIS Multi-Hazard Red Zone Identification & Relocation Decision Platform

[![Vite Version](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Version](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet GIS](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Lenis Scroll](https://img.shields.io/badge/Lenis-Smooth_Scroll-000000?style=for-the-badge)](https://lenis.darkroom.engineering/)

</div>

---

## 🧭 Executive Overview

**SurakshaDrishti** (*Protection Vision*) is an enterprise-grade geospatial decision-support platform engineered for the **National Disaster Response Force (NDRF)** and **State Disaster Management Authorities (SDMAs)** (Smart India Hackathon Problem Statement 26191).

The frontend client delivers:
- **Split-Screen Tactical Hero:** Textual briefings at left alongside a 3D DEM holographic terrain visualization at right.
- **Zero Google Maps API Key Dependency:** Native Leaflet.js GIS map engine powered by public OpenStreetMap, CARTO Dark Matter, and Esri World Imagery tiles.
- **Pure Floating 3D WebP Assets:** High-performance background-less WebP components for live gauges, capabilities, and pipeline phases.
- **Responsive Mobile Ecosystem:** Slide-over navigation drawer, bottom-sheet modal docking, centered dialogs, and background scroll locking.
- **Full Subpage Routing with Scroll Position Preservation:** Dedicated routes for `/documentation`, `/faqs`, `/privacy`, and `/terms` with exact pixel-scroll restoration upon return.

---

## ⚡ Core Frontend Features

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SURAKSHADRISHTI CLIENT                           │
├────────────────────────┬─────────────────────────┬──────────────────────────┤
│ 🗺️ Open GIS Canvas     │ 🛰️ 3D Tactical Terrain  │ 🌊 Lenis Smooth Scroll   │
│ Leaflet + Satellite,   │ ISRO Synthetic Radar    │ Inertia momentum scroll  │
│ Dark & Street Layers   │ & DEM elevation model   │ with scroll preservation │
├────────────────────────┼─────────────────────────┼──────────────────────────┤
│ 🔐 Centered Modals     │ ⚡ 30-Sec QuickSign     │ 📱 Mobile Drawer & HUD   │
│ Scroll-locked dialogs  │ Instant emergency pass  │ Slide-over mobile drawer │
│ with role-based auth   │ with shelter allocation │ & responsive map chassis │
└────────────────────────┴─────────────────────────┴──────────────────────────┘
```

### 1. 💻 Interactive macOS Frame GIS Canvas
- Housed inside a responsive macOS bezel with window controls, encrypted URL address capsule (`surakshadrishti.mha.gov.in`), and live GIS telemetry indicators.
- **Open Tile Engines:**
  - **Map View:** High-speed OpenStreetMap road networks.
  - **Satellite View:** Esri World Imagery high-resolution orbital captures.
  - **Terrain:** CARTO Dark Matter vector tile sets.
- **Interactive Layers:** Toggleable perimeters for **Active Red Zones**, **Verified Relief Shelters**, and **Convoy Evacuation Routes**.

### 2. 🎯 Exact GPS Location & Hazard Geofencing
- Direct integration with browser `navigator.geolocation` (`enableHighAccuracy: true`).
- Drops an animated pulsing GPS pin with an accuracy buffer ($\pm\text{meters}$).
- Computes Haversine geodesic distances to all national hazard hotspots (Wayanad, Joshimath, Teesta, Puri) and delivers an automated **Safe / Immediate Evacuation Advisory**.

### 3. 🌀 Satellite Radar Calibration Telemetry Loader
- Full-screen initialization sequence featuring rotating radar scanner rings, glowing central emblem, and smooth progress tracking through 5 operational milestones.
- Can be replayed anytime via session reset or the dedicated button in the footer.

### 4. 📱 Full-Screen Mobile Drawer & Centered Modals
- **Mobile Navigation:** Smooth slide-over drawer with backdrop blur, scroll locking, touchable targets, and cross-route transitions.
- **Centered Dialogs:** Auth, Emergency SOS, and QuickSign modals open centered on all screen sizes with background page scroll locking.

### 5. 📚 Dedicated Multi-Page Routing
- **System Documentation (`/documentation`):** Interactive chapter navigation with smooth anchor tracking, architecture blueprints, and API specifications.
- **Frequently Asked Questions (`/faqs`):** 10 technical Q&A modules with holographic visual headers.
- **Legal Compliance (`/privacy` & `/terms`):** Detailed clauses aligned with the Disaster Management Act, 2005.

---

## 🗂️ Component Architecture

```
frontend/
├── public/
│   ├── favicon.webp                     # Glowing brand logo
│   ├── hero_tactical_ai.webp            # 3D Himalayan DEM elevation visual
│   ├── stat_hazard_gauge.webp           # Active Red Zones gauge
│   ├── stat_high_risk_radar.webp        # High-Risk Areas radar
│   ├── stat_biometric_shield.webp       # Protected Population shield
│   ├── stat_shelter_bunker.webp         # Shelter Capacity bunker
│   ├── stat_critical_bell.webp          # Active Alerts bell
│   ├── feature_gsm_relay.webp           # GSM 3.4 Telecommunication mesh
│   ├── feature_e2ee_lock.webp           # E2EE Interdepartmental lock
│   ├── feature_geohash_grid.webp        # Geohash spatial index
│   ├── feature_dual_roles.webp          # Dual role privilege module
│   ├── feature_carrying_capacity.webp   # Capacity balance allocator
│   ├── feature_proactive_evacuation.webp# Priority dispatch corridor
│   ├── pipeline_satellite.webp          # Stage 1: Data Ingestion
│   ├── pipeline_ai_core.webp            # Stage 2: AI Risk Engine
│   ├── pipeline_vulnerability.webp      # Stage 3: Vulnerability Analysis
│   ├── pipeline_rescue_drone.webp       # Stage 4: Relocation & Dispatch
│   ├── cta_emergency_pass.webp          # QuickSign 3D emergency pass
│   ├── doc_architecture_blueprint.webp # Documentation blueprint
│   ├── faq_holographic_orb.webp         # FAQs holographic orb
│   └── legal_compliance_shield.webp     # Legal & Privacy shield
│
├── src/
│   ├── App.jsx                          # Root router, Lenis scroll & scroll restoration
│   ├── main.jsx                         # React 18 DOM mount point
│   ├── index.css                        # Design system tokens, matte grid & glow utilities
│   │
│   ├── components/
│   │   ├── Navbar.jsx                   # Desktop navigation & mobile slide-over drawer
│   │   ├── HeroSection.jsx              # Split-screen headline, dual CTA & 3D DEM visual
│   │   ├── RealGoogleMap.jsx            # Responsive Leaflet GIS engine in macOS bezel
│   │   ├── LiveStatsStrip.jsx           # 5 KPI telemetry cards with lower-edge glow
│   │   ├── FeaturesShowcase.jsx         # 6 core capability module cards
│   │   ├── HowItWorks.jsx               # 4-stage AI pipeline cards
│   │   ├── CTASection.jsx               # Floating emergency pass registration CTA
│   │   ├── AuthSection.jsx              # Centered Sign In & Sign Up modal with scroll-lock
│   │   ├── EmergencyMode.jsx            # Instant civilian SOS modal with hotline dock
│   │   ├── QuickSignModal.jsx           # 30-sec rapid evacuation pass generator
│   │   ├── IntroSequence.jsx            # Radar calibration telemetry loader
│   │   ├── Dashboard.jsx                # Post-authentication command console
│   │   ├── Footer.jsx                   # Legal navigation & scroll-offset persistence
│   │   │
│   │   └── pages/
│   │       ├── Documentation.jsx        # Dedicated Developer & Architecture manual
│   │       ├── Faqs.jsx                 # Dedicated 10-module technical FAQ page
│   │       ├── PrivacyPolicy.jsx        # Dedicated data governance policy page
│   │       └── TermsOfService.jsx       # Dedicated statutory civil defense terms page
│   │
│   └── utils/
│       ├── api.js                       # Centralized REST API client & geofencing utilities
│       ├── useCountUp.js                # Animated numeric telemetry counter hook
│       └── useScrollReveal.js           # Intersection Observer scroll trigger hook
│
├── index.html                           # HTML5 entry with metadata & font preloads
├── package.json                         # Project dependencies & build scripts
├── tailwind.config.js                   # TailwindCSS configuration & color tokens
└── vite.config.js                       # Vite development server & build bundle settings
```

---

## 🚀 Quick Start & Development

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 2. Installation
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (React, Vite, React Router, Leaflet, Lucide, Lenis, TailwindCSS)
npm install
```

### 3. Running Development Server
```bash
npm run dev
```
> ⚡ Local Development Server launches on: **`http://localhost:3000`** (or `http://localhost:5173`)

### 4. Production Build & Verification
```bash
npm run build
```
Generates minified, production-ready bundles in `frontend/dist/`.

---

## 🎨 Design System & Typography

| Font Family | Style / Role | Implementation Example |
| :--- | :--- | :--- |
| **System Sans** | Primary UI buttons, navigation links, and headings | `font-sans text-sm font-bold` |
| **Cambria Math** | Technical disaster descriptions and analytical copy | `font-cambria text-xs text-slate-300` |
| **Monospace** | GPS coordinates, Geohash codes, and timestamps | `font-mono text-xs text-cyan-400` |

### Color Palette (Matte Dark Theme)
- **Background:** Solid Matte Slate `#050914` with subtle grid lines (`bg-matte-grid`)
- **Primary Action:** Royal Blue (`#2563eb` / `#3b82f6`) with lower-edge laser glow (`btn-bottom-glow-blue`)
- **Emergency Critical:** Crimson Red (`#dc2626` / `#ef4444`) with pulsing glow (`btn-bottom-glow-red`)
- **Telemetry Cyan:** Neon Cyan (`#06b6d4` / `#22d3ee`) for satellite radar feeds
- **Safe Relocation:** Emerald Green (`#059669` / `#10b981`) for shelter bed capacity

---

<div align="center">

**SurakshaDrishti** — Zero Compromise Multi-Hazard Decision Platform  
*Smart India Hackathon 2026 • Problem Statement #26191 • NDRF & SDMA Mission Platform*

</div>
