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
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet GIS](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Lenis Scroll](https://img.shields.io/badge/Lenis-Smooth_Scroll-000000?style=for-the-badge)](https://lenis.darkroom.engineering/)

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=1,6,12,20&height=120&section=header&text=SurakshaDrishti%20Frontend&fontSize=32&fontColor=ffffff&animation=fadeIn" width="100%" />

</div>

---

## 🧭 Executive Overview

**SurakshaDrishti** (*Protection Vision*) is an enterprise-grade geospatial decision-support platform engineered for the **Ministry of Home Affairs (MHA)**, **National Disaster Response Force (NDRF)**, and **State Disaster Management Authorities (SDMAs)**.

The frontend client provides real-time multi-hazard stratification, high-precision sub-meter Geohash indexing, instant browser geolocation with Haversine distance-to-hazard analysis, capacity-aware safe relocation routing, and an encrypted dual-role citizen/authority portal.

---

## ⚡ Core Frontend Highlights

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SURAKSHADRISHTI CLIENT                           │
├────────────────────────┬─────────────────────────┬──────────────────────────┤
│ 🗺️ MacBook GIS Console │ 🎯 Exact GPS Locative   │ 🌊 Lenis Smooth Scroll   │
│ Leaflet + Satellite,   │ Sub-meter accuracy with │ Inertia momentum scroll  │
│ Topo & Street Layering │ Haversine risk analysis │ across all UI components │
├────────────────────────┼─────────────────────────┼──────────────────────────┤
│ 🔐 Dual Auth Portal    │ ⚡ 30-Sec QuickSign     │ 🎨 Zero-Emoji Palette    │
│ Role-Based Sign In &   │ Instant emergency pass  │ High-contrast tactical   │
│ Sign Up registration   │ with shelter allocation │ military/GIS dark design │
└────────────────────────┴─────────────────────────┴──────────────────────────┘
```

### 1. 💻 MacBook Pro Frame GIS Canvas
- Encased in a modern MacBook Pro hardware bezel with macOS traffic light window controls (Close, Minimize, Expand), a centered encrypted URL capsule (`surakshadrishti.mha.gov.in`), and top FaceTime notch.
- Real GIS tile engines:
  - **Map View:** CARTO Voyager road and boundary mapping.
  - **Satellite View:** Esri World Imagery high-resolution orbital captures.
  - **Topographic Terrain:** OpenTopoMap elevation contour lines.
- Dynamic visual overlays for **Critical Red Zones** (hazard perimeter circles), **Verified Safe Relocation Hubs**, and **Directional Evacuation Corridors**.

### 2. 🎯 Exact GPS Location Detection & Threat Assessment
- Direct integration with `navigator.geolocation` (`enableHighAccuracy: true`).
- Drops an animated pulsing GPS locator pin with an accuracy radius buffer ($\pm\text{meters}$).
- Computes real-time Haversine geodesic distance to all national hazard hotspots (Wayanad, Joshimath, Teesta, Puri) and delivers an automated **Safe / Immediate Relocation Advisory**.

### 3. 🌊 Lenis Smooth Momentum Scrolling
- Built with **Lenis** smooth scrolling engine for butter-smooth inertial navigation across the entire landing page.

### 4. 🔐 Dual-Role Authentication & Registration Portal
- **Sign In:** Authority (NDRF/SDMA) and Resident access with Geofence 2FA-bypass intelligence in active crisis sectors.
- **Sign Up / Register:** Complete onboarding with role selection, mobile/Aadhaar verification, 1-click GPS geohash detection, and household vulnerability profiling (elderly/infant/medical requirements).

---

## 🗂️ Component Hierarchy

```
frontend/src/
├── App.jsx                     # Core application orchestrator & Lenis engine
├── main.jsx                    # React 18 DOM mount entry point
├── index.css                   # Global CSS tokens, Leaflet themes & glassmorphism
│
├── components/
│   ├── Navbar.jsx              # Responsive header with smooth navigation links
│   ├── HeroSection.jsx         # Mission header, quick SOS, and MacBook GIS embed
│   ├── RealGoogleMap.jsx       # Leaflet map engine inside MacBook Pro frame
│   ├── LiveStatsStrip.jsx      # Telemetry ticker with animated digit count-ups
│   ├── FeaturesShowcase.jsx    # 6 core modules with subtle background hover glow
│   ├── HowItWorks.jsx          # 4-stage AI pipeline with interactive stage cards
│   ├── CTASection.jsx          # Decision support actions & QuickSign emergency pass
│   ├── AuthSection.jsx         # Dual Sign In & Sign Up registration modal
│   ├── EmergencyMode.jsx       # High-contrast instant civilian SOS HUD
│   ├── QuickSignModal.jsx      # 30-second rapid evacuation pass generator
│   ├── Dashboard.jsx           # Post-authentication command console
│   └── Footer.jsx              # Official SIH 2026 attribution & MHA compliance
│
└── utils/
    ├── api.js                  # Centralized REST API service & geofencing mocks
    ├── useCountUp.js           # Animated numeric telemetry hook
    └── useScrollReveal.js      # Intersection Observer reveal trigger
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

# Install dependencies (React, Vite, Leaflet, Lucide, Lenis, TailwindCSS)
npm install
```

### 3. Running Dev Server
```bash
npm run dev
```
> ⚡ Local Development Server launches on: **`http://localhost:3000`**

### 4. Production Build & Validation
```bash
npm run build
```
Generates optimized and minified bundles in `frontend/dist/`.

---

## 🎨 Typography & Design Tokens

| Font Family | Style / Role | Implementation Example |
| :--- | :--- | :--- |
| **Inter / System Sans** | Primary UI, controls, numbers, headings | `font-sans text-sm font-bold` |
| **Cambria Math** | Technical disaster specs, analytical body copy | `font-cambria text-xs text-slate-300` |
| **Italianno** | Subtle, elegant callout badges and subtitles | `font-italianno text-base text-cyan-300` |
| **JetBrains Mono** | GPS coordinates, Geohash IDs, timestamps | `font-mono text-xs text-cyan-400` |

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=1,6,12,20&height=90&section=footer" width="100%" />

**SurakshaDrishti** — Zero Compromise Disaster Decision Platform  
*Smart India Hackathon 2026 • Problem Statement #26191*

</div>
