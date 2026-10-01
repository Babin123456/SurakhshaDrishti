# SurakshaDrishti Feature & Architecture Map

This document outlines the core architectural components of the SurakshaDrishti system, detailing the features that have been successfully integrated and those that are pending implementation for future phases.

## Core Architecture

The system is built on a resilient, offline-first architecture designed for zero-internet disaster environments. The core pillars include:
*   **Edge-Compute First:** Heavy calculations (pathfinding, cryptography) are offloaded to the client devices to ensure survivability during infrastructure collapse.
*   **Hexagonal Spatial Indexing:** Utilization of Uber's H3 grid system for ultra-fast, deterministic spatial queries and obstacle avoidance.
*   **Cryptographic Verification:** ECDSA and degenerate tree structures for identity and secure communications without central authority.
*   **Multi-Tier Fallbacks:** Gradual degradation of services (Internet -> Mesh -> GSM) rather than outright failure.

---

## Feature Implementation Status

### 1. Communication & Security (E2EE)
*   [x] **Degenerate Tree Cryptography:** End-to-end encrypted tactical chat using dynamic group key chaining.
*   [x] **IndexedDB Offline Queue:** Asynchronous message caching and automatic syncing when connectivity is restored.
*   [x] **Multi-Agency Consensus Smart Contract:** Red zone clearance requiring both 80% majority votes and explicit representation from all assigned departments (e.g., NDRF, SDMA, Police).
*   [x] **Hardware-Level Override Alerts:** High-priority, un-closeable desktop siren windows utilizing Web Audio API oscillators (800Hz/600Hz toggle).

### 2. Spatial Routing & Evacuation
*   [x] **Local A* H3 Pathfinding:** Client-side pathfinding through hexagonal grids avoiding dynamic red zones, requiring zero server ping.
*   [x] **Dynamic Shelter Capacity Engine:** Real-time routing penalties for overcrowded relief hubs (>95% capacity).
*   [x] **Geometric Vector Fallbacks:** Straight-line routing overrides in the event of complex spatial algorithm timeouts.
*   [x] **Geo-Fallback Shelter Generation:** Deterministic coordinate-based shelter ID generation when OpenStreetMap APIs fail.

### 3. Identity & Access
*   [x] **Zero-Internet QuickSign:** Offline civilian credentialing using Web Crypto API to generate local ECDSA P-256 keypairs and unique cryptographic IDs.
*   [x] **JWT Session Management:** Secure token-based authentication for administrative and official endpoints.

### 4. Pending Hardware & Advanced Integrations (Phase 3)
*   [ ] **Physical OpenBTS / GSM 3.4 Integration:** Translating the software E-OTD stubs into physical radio multilateration using localized cell towers.
*   [ ] **Live Sentinel-2 Satellite Ingestion:** Replacing the mocked data layers with live multi-spectral feeds from ESA/Copernicus APIs for real-time terrain shift detection.
*   [ ] **Hardware Bluetooth/LoRa Mesh:** Bridging the offline cryptographic payloads into physical peer-to-peer hardware transmission protocols.
*   [ ] **On-Device Machine Learning:** Deploying the predictive hazard models directly onto edge devices via WebAssembly (expanding upon the current `math_engine.wasm` foundation).
