# Team Plan: GSM & E-OTD Integration

## Overview
This document outlines the architecture and implementation plan for the **Offline GSM Fallback & E-OTD Location Engine**. 

When disaster strikes and the internet goes down, our solution relies on drone-deployed **Software Defined Radios (SDRs)** running OpenBTS. These drones act as portable "Networks in a Box". Citizens' phones automatically connect to them, allowing our app to communicate via SMS payloads. Furthermore, by measuring signal delays from multiple drones, we can calculate a user's position without GPS using **E-OTD (Enhanced Observed Time Difference)**.

---

## 1. Hardware Concept (For Presentation)
While we are a software team, we must accurately explain the hardware our software depends on:
* **The Drone Hubs**: Tethered drones flying at 400ft carrying an SDR (e.g., HackRF or USRP) running OpenBTS.
* **The Network**: The SDR broadcasts a completely open 2G/GSM network that accepts **any IMSI** from **any carrier** (Jio, Airtel, Vi) bypassing standard authentication.
* **The Uplink**: The drone possesses a satellite internet connection (e.g., Starlink) to bridge the offline GSM network back to our central Supabase database.

---

## 2. Software Implementation Phases (What We Build)

### Phase 1: The Drone Relay Bridge (Simulation)
We need to prove the concept works by writing a backend simulation of the drone relay.
* **Task 1.1**: Create a standalone script (`drone_relay.js` or `drone_relay.py`) simulating the drone's OpenBTS API.
* **Task 1.2**: Set up a custom TCP/UDP port or MQTT broker to accept simulated SMS payloads.
* **Task 1.3**: Write the parser to convert compressed strings (`SOS|11.55|76.13|BATT90`) back into JSON.
* **Task 1.4**: Forward the parsed data to the central Supabase database to instantly appear on the Admin Dashboard.

### Phase 2: App Offline Mode (GSM Fallback)
The User App must detect network loss and switch protocols.
* **Task 2.1**: Implement a network status listener in the React Native / PWA app.
* **Task 2.2**: When offline, disable HTTP `fetch()` calls and enable "GSM Mode".
* **Task 2.3**: Create a payload compressor that squashes location and status into a tiny string (max 160 characters).
* **Task 2.4**: Use native mobile APIs to send this string as an SMS to a hardcoded shortcode (e.g., `8888`), which is intercepted by the drone tower.

### Phase 3: E-OTD Math Engine (Location without GPS)
To impress the judges, we will demonstrate the mathematics behind E-OTD triangulation.
* **Task 3.1**: Utilize our existing `math_engine.cpp` (or port to JS) to write a Trilateration algorithm.
* **Task 3.2**: Simulate pings from 3 different drones (`t1`, `t2`, `t3`).
* **Task 3.3**: Calculate the Time Difference of Arrival (TDOA).
* **Task 3.4**: Output the exact Latitude and Longitude to the dashboard based purely on signal delay.

---

## Next Steps
- [ ] Assign team member to build the `drone_relay` simulator script.
- [ ] Assign team member to write the string compressor/decompressor.
- [ ] Integrate the Trilateration math into the Admin Dashboard map.
