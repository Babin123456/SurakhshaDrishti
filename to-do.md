# Phase 2 Development: Major Features To-Do

This document tracks the heavy-hitting architectural features that we pitched in the SIH Phase 1 Idea Submission but need to actually implement in code for the finals.

## 1. Satellite Data Ingestion (The AI Backbone)
- [ ] Build a Python microservice to interface with the **Copernicus Open Access Hub API**.
- [ ] Automate the fetching of Sentinel-2 multi-spectral TIFF images based on target bounding boxes (e.g., Assam/Nepal coordinates).
- [ ] Integrate soil moisture and elevation datasets (ISRO / Bhuvan APIs) to act as secondary parameters.

## 2. Spatio-Temporal AI Pipeline
- [ ] Replace the mocked Red Zone generation in the backend.
- [ ] Integrate a **PyTorch ConvLSTM** model that takes the temporal satellite TIFFs and outputs predicted ground deformation.
- [ ] Write a script to convert the AI's output tensors into geospatial polygons (GeoJSON/H3 Geohashes) and push them to the Supabase `hazard_zones` table.

## 3. P2P Mesh Tracking (Unregistered Civilians)
- [ ] Implement **Bluetooth Low Energy (BLE)** or **Wi-Fi Direct** native modules in the `userApp`.
- [ ] Create a background service that emits and listens for low-energy pings to detect nearby devices.
- [ ] Write the logic to bounce (relay) a generic "unregistered presence" payload through connected devices until it reaches a user with an active internet/GSM uplink.

## 4. Hardware-Level Siren (Bypass Do Not Disturb)
- [ ] Transition the Web Audio API 800Hz oscillator to a native background service.
- [ ] Implement native OS hooks (via Android/iOS native bridging in the mobile client or Electron APIs on desktop) to forcibly override silent/"Do Not Disturb" profiles during a critical Red Zone alert.

## 5. OpenBTS / SDR Drone Integration
- [ ] Write the actual **OpenBTS / OsmoTRX** configuration files for the Linux drone payload.
- [ ] Configure the SDR (HackRF/USRP) to broadcast an open GSM network accepting any IMSI.
- [ ] Write a Python/C++ listener script that parses raw GSM 3.4 Um interface packets to intercept the 32-byte SMS SOS payloads sent by the `userApp`.

## 6. E2EE Degenerate Tree Structure
- [ ] Upgrade the current AES-256/ECDH implementation in `crypto.js`.
- [ ] Implement a hierarchical key derivation function (a cryptographic degenerate tree) that allows dynamic key rotation based on agency roles (e.g., NDRF commander revoking keys from local police without re-keying the entire network).
