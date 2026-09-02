<div align="center">

<!-- Animated Header Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=180&section=header&text=SurakshaDrishti%20AI%20Engine&fontSize=40&fontColor=ffffff&fontAlignY=36" width="100%" alt="AI Header Wave"/>

<!-- Animated Dynamic Typing Banner -->
<img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=800&size=20&duration=3000&pause=1000&color=EE4C2C&center=true&vCenter=true&width=650&lines=SIH+2026+Problem+Statement+26191;ADAMAS+University+SurakshaDrishti+Team;PyTorch+ConvLSTM+%2B+ViViT+Spatio-Temporal+Prediction" alt="AI Typing Subtitle" />

</div>

<br/>

> **SIH 2026 Problem Statement 26191**: Intelligent Identification of Hazard-Based Red Zones, Dynamic Carrying Capacity Assessment of Safer Relocation Sites, and Immediate Prioritization of Vulnerable Habitations.  
> **Team**: ADAMAS University  

## Overview
This document outlines the technical architecture for the predictive AI component of our disaster management solution (SIH Problem Statement **26191**). The goal is to shift from reactive anomaly detection to **proactive prediction** by analyzing time-series satellite imagery to forecast disaster zones (Red/Yellow Zones) before they occur.

## 1. System Architecture
The application uses a microservices architecture to separate the heavy AI workloads from the high-concurrency user traffic.
- **Backend (Node.js / Express):** Handles user auth, WebSockets (Socket.io) for real-time alerts, and routing.
- **AI Microservice (Python / FastAPI):** Dedicated to ingesting satellite imagery, running inference, and broadcasting predictive GeoHashes back to the Node backend.

## 2. Data Ingestion (The "5-10 FPS" Feed)
To predict geological (landslides) or meteorological (cyclones) events, the AI requires a sequence of images representing change over time.
- **Format:** The 5-10 FPS feed acts as a highly compressed time-lapse of historical satellite data (e.g., 48 hours of cloud/ocean data compressed into a 5-second video stream).
- **Data Bands Required:**
  - **SAR (Synthetic Aperture Radar):** Penetrates clouds to detect millimeter-level ground deformation (crucial for predicting landslides or structural failures).
  - **Thermal/Infrared:** Tracks ocean surface temperatures and heat signatures driving storm systems.
  - **Optical:** Visible spectrum for cloud density and water levels.

## 3. Model Selection: Spatio-Temporal Prediction
Standard image classification (like basic CNNs or YOLO) is insufficient because it only analyzes a single frame. We need models that understand **Time + Space**.

**Recommended Models:**
- **ConvLSTM (Convolutional Long Short-Term Memory):** The industry standard for weather and disaster prediction. It processes sequences of images and maintains an internal state of movement, allowing it to predict the *next* frames (e.g., the trajectory of a storm or the probability of slope failure).
- **ViViT (Video Vision Transformer):** A more modern alternative that excels at capturing long-range dependencies in time-series visual data.

**Output:** The model will output a probability matrix (heatmap) representing the likelihood of a disaster occurring in specific spatial coordinates over a target time horizon (e.g., next 6-12 hours).

## 4. GeoHashing Integration
Pixel coordinates from the AI output must be translated into real-world, queryable data.
- **H3 (Uber) or S2 (Google) Indexing:** Instead of handling raw Lat/Lng polygons, the AI will map the high-probability prediction areas into GeoHashes.
- **Process:**
  1. AI generates a probability heatmap mask.
  2. The Python service maps the mask's pixels to Lat/Lng using the satellite's bounding box metadata.
  3. Lat/Lng points are converted into H3 Hexagons (e.g., resolution 8 or 9).
  4. Hexagons exceeding the danger threshold are flagged as `RED` or `YELLOW` zones.

## 5. Communication Pipeline (Python -> Node.js)
1. **Inference:** The FastAPI service finishes processing a sequence and generates a list of dangerous GeoHashes.
2. **Transfer:** Python sends an HTTP POST request (or publishes to a Redis channel) to the Node.js backend:
   ```json
   {
     "event": "prediction_update",
     "timestamp": "2026-09-01T10:00:00Z",
     "eta_to_impact": 14400, // 4 hours in seconds
     "zones": {
       "red": ["88283082a9fffff", "88283082a9fcfff"],
       "yellow": ["88283082a9f1fff"]
     }
   }
   ```
3. **Broadcast:** Node.js receives the payload and uses Socket.io to instantly push the updated zones to the Administrator Dashboard and cross-references user GPS pings to send targeted alerts to affected users.

## 6. Hackathon Demo Execution Plan
To build a convincing prototype for the judges:
1. **Data Sourcing:** Use **Google Earth Engine (GEE)** or the **Copernicus Open Access Hub** to download a historical dataset of a past disaster (e.g., a specific cyclone or landslide).
2. **Simulation Script:** Write a Python script that streams this historical dataset at 5-10 FPS into your FastAPI server to simulate a live data feed.
3. **Pre-trained Weights:** Do not train from scratch. Look for pre-trained ConvLSTM models on datasets like `EarthNet2021` or weather prediction datasets, and fine-tune them minimally if necessary.
4. **The "Wow" Factor:** Ensure the Administrator Dashboard visually plots the AI's predictive trajectory (e.g., drawing the projected path of the storm *before* the time-lapse reaches that point in time).

<br/>

<div align="center">

<!-- Animated Footer Wave -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=120&section=footer" width="100%" alt="AI Footer Wave"/>

**SurakshaDrishti Predictive AI Architecture**  
*SIH 2026 Problem Statement 26191 • Developed by ADAMAS University Team*

</div>
