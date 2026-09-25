# SIH Idea Submission: SurakshaDrishti

## Idea Title (Max 100 Characters)
SurakshaDrishti: Predictive AI Hazard Detection & Offline Evacuation Protocol

---

## Abstract/Summary (Max 10000 Characters)
Recent catastrophic events, such as the severe floods in Assam and devastating landslides in Nepal, highlight a critical failure in modern disaster response: when infrastructure collapses, victims are left stranded without internet, and rescue teams are forced to search blindly. SurakshaDrishti solves this by shifting disaster management entirely from reactive rescue to predictive, proactive relocation. Our software ecosystem leverages multi-spectral satellite imagery (ESA/Copernicus Sentinel-2) and temporal AI models to predict and map out danger zones hours before they reach their destructive peak. The system then automatically routes civilians away from these Red Zones to the nearest safe relief hubs, intelligently balancing crowds based on real-time bed capacity to prevent fatal bottlenecks. Crucially, if cellular infrastructure is completely destroyed during the event, our custom software fallback allows the mobile app to automatically switch to an offline E-OTD protocol. It compresses the victim's SOS coordinates into a minimal payload that can be intercepted by our OpenBTS script, mobilized by on-demand SDR units or drones. Additionally, the system employs a localized peer-to-peer mesh network to trace even unregistered victims by bouncing their location data through the devices of signed-up users. This guarantees precise localization of trapped civilians even during a total internet blackout, acting as the ultimate digital lifeline for the unpredictable nature of the Indian subcontinent.

---

## Idea Description (Max 50000 Characters)
In critical geologic and meteorological disasters such as the Assam floods and Nepal landslides, the primary reason for delays in the response is the loss of communications. Conventional disaster software becomes redundant once there is no internet connection, and civilians get caught up in haphazard evacuations, resulting in overburdened relief camps and blocked roads. There is an immediate requirement for a software system that is not only capable of forecasting hazards ahead of time but also works well in scenarios where conventional technology becomes unusable. This is precisely what SurakshaDrishti seeks to fulfill as a mission-critical DSS.

To understand why SurakshaDrishti is profoundly novel and unmatched by any existing market solution, it is best to see how our software architecture explicitly solves the deadliest edge cases of modern disaster response:

**Edge Case 1: Total Cellular and Internet Infrastructure Collapse**
In events like the Assam floods, cell towers are entirely washed away. Standard SOS applications instantly fail because they rely on HTTP web requests. 
*Our Solution:* We engineered a "Zero-Internet" offline fallback script. When our mobile application detects a total internet blackout, it drops into an offline state. It extracts the user’s last known GPS coordinates and battery life, compressing them into a highly optimized 32-byte string. This payload is transmitted via a native SMS protocol. Rescue teams can then deploy our custom OpenBTS software script via portable SDR (Software Defined Radio) units or tethered drones. This creates an on-demand, open 2G/GSM cellular network that intercepts the SOS string, allowing agencies to triangulate and locate victims without requiring internet, 4G data, or a specific carrier network. 

**Edge Case 2: Post-Warning Stampedes and Resource Depletion**
When a standard alert is issued, civilians panic and all rush to the single closest high-ground structure, leading to stampedes, blocked roads, and immediate depletion of medical supplies at that specific shelter while others remain empty.
*Our Solution:* We integrated an Uber H3 hexagonal spatial grid and an OSRM routing engine. Instead of a generic alert, our AI engine draws precise Red Zones (using temporal satellite data to predict ground deformation hours in advance). As civilians are evacuated, the system calculates the real-time bed capacity of all nearby relief hubs. If "Shelter A" reaches 95% capacity, the software dynamically reroutes the next wave of incoming civilians to "Shelter B", utilizing live street geometry to guarantee a mathematically balanced, panic-free evacuation.

**Edge Case 3: Administrative Miscommunication and Premature "All Clears"**
Historically, miscommunication between local police and national disaster teams (NDRF) leads to zones being declared safe prematurely, putting returning civilians in severe danger from secondary landslides.
*Our Solution:* SurakshaDrishti enforces a Multi-Agency Cryptographic Consensus protocol. A Red Zone is cryptographically locked by the system. It cannot be downgraded to "All Clear" by a single entity. It explicitly requires 80% consensus—meaning verified officers from the NDRF, SDMA, and local Police must all digitally authorize and vote to lift the hazard perimeter before the application permits civilians to return. 

**Edge Case 4: Night-Time Disasters and Suppressed Device Notifications**
A massive flaw in traditional SMS warnings or app notifications is that they arrive at 3 AM when civilians are asleep, and their phones are on "Do Not Disturb" mode, causing fatal delays in evacuation.
*Our Solution:* We bypass the standard OS notification limitations by utilizing the Web Audio API and native hardware hooks. If a critical AI-detected Red Zone triggers while the user is asleep, the SurakshaDrishti app spawns a frameless, always-on-top alert window that forcefully emits a high-decibel, oscillating 800Hz square-wave siren directly through the hardware speakers. It cannot be ignored or silenced by standard volume toggles—it requires explicit manual acknowledgment, ensuring civilians wake up instantly.

**Edge Case 5: Map Blackouts During Evacuation Transit**
Civilians relying on cloud-based navigation (like Google Maps) are often stranded mid-route when their 4G signal drops out due to severe weather interference.
*Our Solution:* The SurakshaDrishti app does not rely on a constant server connection for navigation. The entire Uber H3 spatial grid, shelter locations, and A* pathfinding algorithms are executed **100% locally on the user's device**. Even if the network drops completely while the civilian is fleeing, the on-device engine instantly utilizes its pre-cached vector tiles to compute offline, straight-line vector fallbacks. The app continues to guide the citizen step-by-step to their assigned shelter without missing a beat—proving that our ecosystem works flawlessly even in a total spatial disconnect.

**Edge Case 6: Locating Unregistered or Unreachable Civilians**
During mass casualties, not every victim will have the app installed or be signed up, making them completely invisible to traditional rescue dashboards.
*Our Solution:* We developed a localized Peer-to-Peer (P2P) Mesh Tracking protocol. Devices with the SurakshaDrishti app act as active mesh nodes. Through low-energy localized pings (like Bluetooth BLE/Wi-Fi Direct), our network detects the generic presence of nearby unregistered or disconnected devices. The app anonymously triangulates these pings and bounces the estimated location data through the mesh of signed-up users until it hits an active uplink. This effectively turns every signed-up civilian into a passive radar node, allowing rescue teams to trace the density of unregistered victims with maximum efficiency.

### Underlying Technical Novelties
Beyond the primary logic flows, SurakshaDrishti's backend is armed with highly specific, low-level technical integrations to guarantee absolute security and operability. 
- **Cryptographic Degenerate Tree Structure:** All inter-agency communications (e.g., between NDRF and SDMA) are secured using a custom End-to-End Encryption (E2EE) degenerate tree structure, ensuring that unauthorized intercepts are mathematically impossible while allowing dynamic hierarchical key distribution during chaos.
- **Custom OpenBTS & GSM 3.4 Telemetry:** The drone-mesh fallback does not rely on off-the-shelf APIs. We implemented a custom OpenBTS configuration heavily intertwined with GSM 3.4 specifications, allowing raw binary payload parsing over the Um interface. This ensures that even legacy mobile hardware can successfully broadcast E-OTD SOS pings directly to our software without needing an active data plan or internet configuration.

### The Unmatched Value Proposition
By combining predictive satellite ML models, dynamic on-device H3 routing, multi-agency cryptography, and our proprietary P2P mesh network, SurakshaDrishti is unparalleled. But what truly makes it invincible is our **custom E-OTD (Enhanced Observed Time Difference) and GSM fallback protocol**. When physical towers fall, we dynamically replace them by mobilizing our OpenBTS script via NDRF drones—creating an instant, unbreakable cellular mesh directly over the disaster zone. It ensures that no civilian is caught off-guard, no evacuation is bottlenecked, and absolutely no victim is left untraceable even in a total communication blackout. It is the ultimate fail-safe ecosystem built explicitly to outlast the disasters it predicts.
