import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  MapPin, 
  Radio, 
  Shield, 
  Users, 
  KeyRound, 
  Cpu, 
  Database, 
  Compass, 
  FileCheck2 
} from 'lucide-react';

const FAQS_DATA = [
  {
    category: '1. General & Architecture',
    q: 'What is SurakshaDrishti and what challenge does it solve for NDRF / SDMA?',
    a: 'SurakshaDrishti is an AI-driven multi-hazard decision support platform built for Smart India Hackathon (SIH Problem 26191). It automates the detection of high-risk red zones (landslides, flash floods, subsidence), models the spatial carrying capacity of alternate relocation sites, and prioritizes habitations for rapid, structured evacuation.'
  },
  {
    category: '2. Open GIS Map Engine',
    q: 'Why does the GIS interactive map not require any Google Maps API Key or billing account?',
    a: 'The GIS engine is engineered natively on Leaflet.js with public, open tile layers (OpenStreetMap, CARTO Dark Matter, and Esri World Imagery). It requires ZERO proprietary API keys or paid billing accounts, ensuring 100% free, uninterrupted uptime for emergency response battalions in high-stress disaster situations.'
  },
  {
    category: '3. Hazard Detection AI',
    q: 'Which machine learning models are used to calculate the Hazard Threat Score (0–100)?',
    a: 'We synthesize Digital Elevation Models (DEM slope steepness), real-time IMD precipitation radars, Soil Moisture Active Passive (SMAP) saturation metrics, and historical landslide catalogs via an ensemble Random Forest & XGBoost model to generate normalized hazard indices for each geographical cluster.'
  },
  {
    category: '4. Cellular Mesh & Fallbacks',
    q: 'How does the emergency alert system function when broadband internet and power grids collapse?',
    a: 'We implement a low-bandwidth GSM 3.4 cellular broadcast and SMS relay protocol. If data networks go down, compressed 160-character binary SMS frames carrying vital geohash coordinates and evacuation routes are relayed across surviving base transceiver stations.'
  },
  {
    category: '5. QuickSign Emergency Pass',
    q: 'What is QuickSign and how do residents generate an emergency evacuation pass in 30 seconds?',
    a: 'QuickSign is a streamlined, one-tap resident safety pass for citizens inside hazard zones. By capturing GPS coordinates or geohashes without requiring lengthy registration forms, it instantly issues an encrypted digital badge displaying designated shelter names, offline corridor waypoints, and family head counts.'
  },
  {
    category: '6. Carrying Capacity Allocation',
    q: 'How does the carrying-capacity algorithm prevent overcrowding and transit bottlenecks?',
    a: 'The system computes dynamic carrying capacities by cross-referencing available shelter beds, medical provisions, potable water reserves, and road width constraints. Evacuees from high-risk habitations are automatically load-balanced across multiple safe hubs (e.g. Nilambur vs. Pipalkoti) to avoid single-point transit congestion.'
  },
  {
    category: '7. Geospatial Geohashes',
    q: 'What is the purpose of the 8-character GeoHash codes (e.g., #tdv2n19z) displayed on the HUD?',
    a: 'GeoHashes provide hierarchical spatial indexing that allows commanders to rapidly query, filter, and transmit bounding coordinates over low-bandwidth radios without transmitting bulky floating-point latitude and longitude strings.'
  },
  {
    category: '8. Privacy & Cryptography',
    q: 'How is citizen privacy and GPS telemetry protected during disaster operations?',
    a: 'All citizen coordinates and family records are encrypted with AES-256-GCM. Public viewports only render aggregated risk polygons and geohash clusters, ensuring individual dwelling privacy while delivering macro-level tactical clarity to disaster commanders.'
  },
  {
    category: '9. Integration with State Authorities',
    q: 'Can District Magistrates and SDMAs export relocation matrices and GIS layers?',
    a: 'Yes. The Command Console includes one-click export modules for GeoJSON shapefiles, CSV habitant rosters, PDF executive briefing dossiers, and automated REST webhooks compatible with NDMA portal standards.'
  },
  {
    category: '10. Hardware SOS Device Compatibility',
    q: 'Can physical IoT beacon nodes and SOS field radios connect to the platform?',
    a: 'Yes. SurakshaDrishti exposes an open hardware bridge that ingests telemetry from LoRaWAN field beacons, ESP32 microcontrollers, and satellite GPS trackers deployed along mountain ridges and river basins.'
  }
];

export default function Faqs() {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#050914] text-slate-100 font-cambria py-6 sm:py-12 px-3.5 sm:px-6 lg:px-8 selection:bg-amber-500/30 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Return Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-slate-800">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer btn-bottom-glow-slate hover:-translate-y-0.5 font-sans shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>KNOWLEDGE BASE (10 FAQ MODULES) • SIH 26191</span>
          </div>
        </div>

        {/* Title Header with Pure Floating 3D Holographic Orb WebP */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-900/90 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl transition-all duration-300 hover:border-slate-700 hover:shadow-amber-950/20">
          <div className="w-16 h-16 flex items-center justify-center shrink-0 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            <img src="/faq_holographic_orb.webp" alt="FAQs Orb" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">Frequently Asked Questions</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Comprehensive Technical Answers on GIS Telemetry, AI Scoring, GSM Mesh, and Carrying Capacity
            </p>
          </div>
        </div>

        {/* 10 FAQ Accordion Items */}
        <div className="space-y-3 sm:space-y-3.5">
          {FAQS_DATA.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-slate-900/90 border rounded-2xl overflow-hidden transition-all duration-300 shadow-lg ${
                  isOpen ? 'border-cyan-500/60 shadow-cyan-950/40 bg-slate-900' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/95'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-start sm:items-center justify-between text-left gap-3.5 cursor-pointer transition-colors select-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex-1">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h3 className={`font-bold text-xs sm:text-base transition-colors leading-snug ${
                      isOpen ? 'text-cyan-300' : 'text-white hover:text-cyan-200'
                    }`}>
                      {item.q}
                    </h3>
                  </div>
                  <div className={`p-1.5 sm:p-2 rounded-xl border transition-all duration-300 shrink-0 mt-0.5 sm:mt-0 ${
                    isOpen ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 rotate-180' : 'bg-slate-800 border-slate-700 text-slate-400 rotate-0'
                  }`}>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </button>

                {/* Smooth Animated Height Container */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-4 sm:px-6 sm:pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3.5 bg-slate-950/60">
                      {item.a}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] sm:text-xs text-slate-500 font-mono pt-4 border-t border-slate-900 text-center sm:text-left">
          <span>EMERGENCY HELPLINE: 1078 / 112</span>
          <span>SIH 26191 • SURAKSHADRISHTI DSS</span>
        </div>

      </div>
    </div>
  );
}
