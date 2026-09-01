# SurakshaDrishti — Intelligent Red Zone & Relocation Decision Platform

> **SIH Problem Statement 26191**: Intelligent Identification of Hazard-Based Red Zones, Carrying Capacity Assessment, and Immediate Relocation Needs for Vulnerable Habitations.  
> **Ministry of Home Affairs & NDRF Disaster Management Division**

---

## Tech Stack & Core Engine

![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js_v20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=black)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch_ConvLSTM-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)

---

## System Architecture Diagram

```mermaid
flowchart TD
    subgraph Data_Ingestion["AI Satellite & Telemetry Ingestion"]
        A["ISRO SAR / Thermal Time-Lapse Feeds"] --> B["PyTorch ConvLSTM Model"]
        B -->|"POST /api/zones/ai-satellite-detect"| C["Express.js API Engine"]
        GSM["GSM 3.4 Low-Bandwidth SMS Pings"] --> C
    end

    subgraph Backend_Core["Core Platform & Database"]
        C -->|"SSL Pool"| D[("Supabase PostgreSQL Database")]
        C -->|"Socket.io Telemetry"| E["WebSocket Alert Engine"]
        D --> Table1["hazard_zones (16-Digit Access Keys)"]
        D --> Table2["zone_assignments (Inter-Agency Roster)"]
        D --> Table3["emergency_passes (QuickSign SOS Tokens)"]
    end

    subgraph Applications["Dual-App Ecosystem"]
        E -->|"Real-Time Push"| F["Administrator Command Console (Web App)"]
        F -->|"Consensus Resolution Vote"| C
        F -->|"16-Digit Key Assignment"| C
        
        G["Resident Emergency App (Desktop / Mobile)"] -->|"QuickSign SOS Request"| C
        C -->|"Assigned Shelter & Route"| G
    end
```

---

## Core System Capabilities

### 1. Web Command Console (Administrator Only)
The Web Application is designed exclusively for NDRF Commanders, SDMA Regional Officers, Fire Chiefs, and Police Administrators.
- **16-Digit Security Access Keys**: Each hazard zone has a unique key (e.g. `RZ-89A4-91F2-3B7C`) required for officer assignment.
- **Consensus Resolution Voting**: A Red Zone transitions to "Situation Under Control" only when assigned inter-agency officers reach majority consensus.
- **Interactive GIS Map Overlay**: Renders real-time hazard perimeters alongside **blue pulsing markers** tracking citizens trapped inside Red Zones.
- **Browser Automatic GPS**: Captures live officer coordinates automatically via native browser geolocation.

### 2. Resident App Ecosystem (Electron / Mobile App)
- **QuickSign Emergency SOS Passes**: 30-second registration bypasses standard 2FA delays during active disasters.
- **GSM 3.4 Telecommunication Fallback**: Enables low-bandwidth location pings when mobile tower data networks fail.
- **Carrying Capacity Shelter Assignment**: Automatically assigns citizens to the nearest safe shelter with available capacity.

---

## Database Schema Highlights

The database is powered by Supabase PostgreSQL 17.6 and maintains 11 primary tables:
- `users`: Dual role accounts (`RESIDENT`, `NDRF`, `SDMA`, `POLICE`) and operating modes (`ON_SITE`, `OFF_SITE`).
- `hazard_zones`: AI hazard perimeters, risk scores, H3/S2 spatial geohashes, and 16-digit access keys.
- `zone_assignments`: Inter-agency officer roster and consensus resolution votes.
- `shelters`: Safe haven capacities, real-time occupancy, and evacuation corridors.
- `emergency_passes`: QuickSign priority digital SOS passes.
- `e2ee_conversations` & `e2ee_messages`: End-to-end encrypted inter-departmental channels.
- `gsm_telemetry_logs`: Low-bandwidth SMS disaster telemetry packets.

---

## Detailed Technical Documentation

For line-by-line code breakdowns, route specifications, and schema migration details, inspect:
- [BACKEND_ARCHITECTURE.md](file:///d:/Programming/Hackathon-SIH/BACKEND_ARCHITECTURE.md)
