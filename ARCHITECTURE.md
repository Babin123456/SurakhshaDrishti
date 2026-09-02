<div align="center">

<!-- Animated Header Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=180&section=header&text=SurakshaDrishti%20Architecture&fontSize=40&fontColor=ffffff&fontAlignY=36" width="100%" alt="Architecture Header Wave"/>

<!-- Animated Dynamic Typing Banner -->
<img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=800&size=20&duration=3000&pause=1000&color=B85C38&center=true&vCenter=true&width=650&lines=SIH+2026+Problem+Statement+26191;ADAMAS+University+SurakshaDrishti+Team;Interactive+Mermaid+System+Architectural+Blueprints" alt="Architecture Typing Subtitle" />

</div>

<br/>

> **SIH 2026 Problem Statement 26191**: Intelligent Identification of Hazard-Based Red Zones, Carrying Capacity Assessment, and Immediate Relocation Needs.  
> **Development Team**: ADAMAS University  
> **Target Authorities**: Ministry of Home Affairs (MHA), National Disaster Response Force (NDRF), State Disaster Management Authorities (SDMA).

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph Data_Layer["🛰️ Spatial Ingestion & Telemetry Rails"]
        A1["ISRO EOS-4 Synthetic Aperture Radar"]
        A2["Sentinel-2 Multi-Spectral Thermal Feeds"]
        A3["IMD Doppler Radar Precipitation Grids"]
        A4["GSM 3.4 Low-Bandwidth SMS Telemetry Mesh"]
    end

    subgraph AI_Engine["🧠 Deep Learning & Hazard Scoring Engine"]
        B1["PyTorch ConvLSTM Spatio-Temporal Predictor"]
        B2["XGBoost Soil Liquefaction & Shear Stress Classifier"]
        B3["8-Character Geohash Spatial Indexer (#tdv2n19z)"]
    end

    subgraph Backend_Core["⚙️ Express.js & Database Core (Port 5000)"]
        C1["Express.js Command Router"]
        C2["Socket.io WebSocket Event Hub"]
        C3[("Supabase PostgreSQL 17.6 Relational Pool")]
        C4["JWT & Role-Based Access Control (RBAC)"]
    end

    subgraph User_Ecosystem["🖥️ Dual-Role Frontend Ecosystem (Port 5173)"]
        D1["Official Command HUD (NDRF / SDMA)"]
        D2["Resident Emergency Console (Civilian SOS)"]
        D3["Multi-Layer Open GIS Engine (Leaflet)"]
    end

    A1 --> B1
    A2 --> B1
    A3 --> B2
    A4 --> C1

    B1 --> C1
    B2 --> C1
    B3 --> C3

    C1 <--> C3
    C1 --> C2
    C1 <--> C4

    C2 --> D1
    C2 --> D2
    C1 <--> D1
    C1 <--> D2
    D3 <--> D1
    D3 <--> D2
```

---

## 2. Multi-Agency Consensus Resolution Architecture

When an active Red Zone is declared by the AI engine, transitioning it to **"Situation Under Control"** requires consensus among multi-agency commanders deployed on site:

```mermaid
sequenceDiagram
    autonumber
    participant AI as AI ConvLSTM Engine
    participant DB as PostgreSQL Database
    participant Svr as Backend Command Engine
    participant NDRF as NDRF Battalion Lead
    participant SDMA as SDMA District Officer
    participant POLICE as Police Superintendent

    AI->>Svr: POST /api/zones/ai-satellite-detect (New Red Zone Delineated)
    Svr->>DB: Insert Red Zone & Generate 16-Digit Key (e.g. RZ-89A4-91F2-3B7C)
    Svr-->>NDRF: Push Real-Time Socket.io Alert & Map Polygon
    Svr-->>SDMA: Push Real-Time Socket.io Alert & Map Polygon

    Note over NDRF,POLICE: Officers authenticate with 16-Digit Access Key
    NDRF->>Svr: POST /api/zones/verify-key (Assign to Incident)
    SDMA->>Svr: POST /api/zones/verify-key (Assign to Incident)
    POLICE->>Svr: POST /api/zones/verify-key (Assign to Incident)

    Note over NDRF,POLICE: On-Site Rescue Operations Executed
    NDRF->>Svr: POST /api/zones/consensus-vote (VOTE: RESOLVED)
    Svr->>DB: Record Vote (1/3 Majority)
    SDMA->>Svr: POST /api/zones/consensus-vote (VOTE: RESOLVED)
    Svr->>DB: Record Vote (2/3 Majority Reached)
    POLICE->>Svr: POST /api/zones/consensus-vote (VOTE: RESOLVED)
    Svr->>DB: Update Zone Status to SITUATION_UNDER_CONTROL
    Svr-->>NDRF: Broadcast Status Update via WebSocket
    Svr-->>SDMA: Broadcast Status Update via WebSocket
```

---

## 3. Dynamic Shelter Carrying Capacity Balancing

The platform prevents relief camp overload and road bottlenecks using a spatial carrying capacity optimization algorithm:

```mermaid
flowchart TD
    subgraph Citizens["🚨 Displaced Habitations"]
        P1["Habitation Cluster A<br/>#tdv2n19a (1,200 Residents)"]
        P2["Habitation Cluster B<br/>#tdv2n19b (2,400 Residents)"]
    end

    subgraph Engine["⚖️ Carrying Capacity Optimization Engine"]
        E1["Haversine Route Safety Matrix"]
        E2["Dynamic Safe Shelter Bed Availability Pool"]
        E3["Multi-Objective Convoy Load Balancer"]
    end

    subgraph Shelters["🏕️ Safe Haven Capacities"]
        S1["Nilambur Foothill Shelter<br/>Capacity: 3,000 | Occupancy: 600<br/>Status: 80% Available"]
        S2["Sector 4 Community Safe Hub<br/>Capacity: 2,000 | Occupancy: 1,800<br/>Status: 90% Full"]
        S3["District Stadium Emergency Camp<br/>Capacity: 5,000 | Occupancy: 1,200<br/>Status: 76% Available"]
    end

    P1 --> E1
    P2 --> E1
    E1 --> E3
    E2 <--> S1
    E2 <--> S2
    E2 <--> S3
    E3 -->|Assigns 1,200 Citizens| S1
    E3 -->|Reroutes away from S2 to avoid congestion| S3
```

---

## 4. Dual-Role Security & Isolation Architecture

The platform separates civilian and administrative privileges with strict role boundaries:

```mermaid
flowchart LR
    subgraph Clients["Users"]
        U1["Civilian / Resident"]
        U2["Field Battalion Officer"]
        U3["District Magistrate"]
    end

    subgraph Auth_Gateway["🔐 Gateway Security"]
        G1{"JWT Token Verification & RBAC"}
    end

    subgraph Access_Control["🛡️ Scoped Permissions"]
        R1["Civilian Scope<br/>• QuickSign 30-Sec SOS<br/>• Nearest Shelter Route<br/>• GSM SMS Fallback Pings"]
        R2["Official Battalion Scope<br/>• 16-Digit Zone Verification<br/>• Consensus Resolution Voting<br/>• Browser GPS Telemetry Sync"]
        R3["Command Administrative Scope<br/>• Inter-Agency Roster Assignment<br/>• E2EE Encrypted Channels<br/>• Incident Audit Logs"]
    end

    U1 -->|GUEST / RESIDENT Token| G1
    U2 -->|NDRF / POLICE Token| G1
    U3 -->|SDMA / ADMIN Token| G1

    G1 -->|Allowed| R1
    G1 -->|Allowed| R2
    G1 -->|Allowed| R3
```

---

## 5. Offline Fallback Architecture (GSM 3.4 Telemetry)

When commercial 4G/5G mobile tower grids collapse during extreme cloudbursts or landslides, SurakshaDrishti activates a resilient fallback:

```mermaid
flowchart TD
    Disaster["⚡ Severe Cloudburst / Mobile Grid Collapse"] --> Phone["Civilian Smartphone"]
    
    Phone --> Decision{"Broadband Internet Available?"}
    Decision -- Yes --> WebSocket["Standard Socket.io WebSocket Connection"]
    Decision -- No --> SMS["📡 GSM 3.4 Low-Bandwidth Telemetry Protocol"]

    SMS --> Packet["Compact 140-Byte SMS Packet<br/>Format: SOS|#tdv2n19z|H5|INF1|ELD2|12.971|77.594"]
    Packet --> Tower["Emergency Telecom Cell-on-Wheels (COW)"]
    Tower --> Webhook["POST /api/zones/gsm-webhook"]
    Webhook --> DB[("PostgreSQL gsm_telemetry_logs")]
    DB --> Dispatch["Live Pin Dropped on Command Map with GPS Precision Buffer"]
```

---

<div align="center">

<!-- Animated Footer Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=120&section=footer" width="100%" alt="Architecture Footer Wave"/>

**SurakshaDrishti Architectural Specification**  
*SIH 2026 Problem Statement 26191 • Developed by ADAMAS University Team*

</div>
