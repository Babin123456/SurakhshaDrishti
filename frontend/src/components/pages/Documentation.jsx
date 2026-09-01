import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  ArrowLeft, 
  Terminal, 
  Cpu, 
  Database, 
  Network, 
  ShieldCheck, 
  Layers, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const DOCS_SECTIONS = [
  {
    id: 'overview',
    title: '1. Platform Overview',
    icon: Terminal,
    tag: 'SIH 26191',
    description: 'Executive summary, problem statement context (SIH 26191), and key objectives for NDRF and State Disaster Management Authorities.'
  },
  {
    id: 'gis-engine',
    title: '2. Open GIS Spatial Engine',
    icon: Layers,
    tag: 'ZERO KEYS',
    description: 'Leaflet.js mapping pipeline, zero Google API key architecture, OSM/CARTO/Esri tile services, and vector GeoJSON processing.'
  },
  {
    id: 'ai-models',
    title: '3. Multi-Hazard AI Pipeline',
    icon: Cpu,
    tag: 'ML ENSEMBLE',
    description: '4-stage machine learning architecture, slope instability, DEM digital elevation extraction, and carrying-capacity modeling.'
  },
  {
    id: 'mesh-protocol',
    title: '4. GSM 3.4 Resilient Relay',
    icon: Network,
    tag: 'HARDWARE MESH',
    description: 'Low-bandwidth cellular broadcast protocols, 160-character binary SMS frames, and LoRaWAN physical SOS node bridging.'
  },
  {
    id: 'quicksign',
    title: '5. QuickSign Pass & Security',
    icon: ShieldCheck,
    tag: 'E2EE AES-256',
    description: '30-second citizen emergency pass generation, AES-256-GCM encryption, Ed25519 signatures, and RBAC official clearance levels.'
  },
  {
    id: 'api-reference',
    title: '6. REST API & Webhooks',
    icon: Database,
    tag: 'REST / OAS 3',
    description: 'Express.js backend endpoints, NDMA portal webhook integration, GeoJSON shapefile export schemas, and incident logs.'
  }
];

export default function Documentation() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const sectionElements = DOCS_SECTIONS.map((sec) => document.getElementById(sec.id)).filter(Boolean);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-15% 0px -60% 0px',
        threshold: 0.1
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      sectionElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const scrollToDoc = (id) => {
    setActiveSection(id);
    setMobileNavOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050914] text-slate-100 font-cambria py-6 sm:py-8 px-3.5 sm:px-6 lg:px-8 selection:bg-cyan-500/30 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer btn-bottom-glow-slate hover:-translate-y-0.5 shadow-md font-sans"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="hidden sm:inline">SYSTEM DOCUMENTATION & DEVELOPER MANUAL • SIH 26191</span>
            <span className="sm:hidden">DOCS MANUAL • SIH 26191</span>
          </div>
        </div>

        {/* Title Banner with Pure Floating 3D Architecture Blueprint WebP */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl transition-all duration-300 hover:border-slate-700 hover:shadow-cyan-950/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center shrink-0 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              <img src="/doc_architecture_blueprint.webp" alt="Documentation Blueprint" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">System Documentation</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Technical Architecture, Open GIS Engine & Operational Protocols
              </p>
            </div>
          </div>

          {/* Mobile Index Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-cyan-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
          >
            {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>{mobileNavOpen ? 'Close Navigation' : 'Jump to Chapter'}</span>
          </button>
        </div>

        {/* Mobile Quick Navigation Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl space-y-1 animate-fade-in-down">
            <div className="text-[10px] font-mono font-bold text-cyan-400 px-3 py-1 uppercase tracking-wider">
              Select Chapter
            </div>
            {DOCS_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToDoc(sec.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeSection === sec.id
                    ? 'bg-blue-600/30 text-white border border-blue-500/50'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <sec.icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{sec.title}</span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {sec.tag}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Desktop Left Sidebar (Sticky) */}
          <aside className="hidden lg:block lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sticky top-6 shadow-xl space-y-2">
            <div className="text-[11px] font-mono font-bold text-cyan-400 px-3 py-1.5 uppercase tracking-wider">
              Documentation Index
            </div>

            <nav className="space-y-1.5" aria-label="Documentation Sidebar">
              {DOCS_SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToDoc(sec.id)}
                    className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between cursor-pointer group ${
                      isActive
                        ? 'bg-blue-600/30 text-white border border-blue-500/60 shadow-lg shadow-blue-950/50 scale-[1.02]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 hover:translate-x-1'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-300' : 'text-slate-500 group-hover:text-cyan-400'}`} />
                      <span>{sec.title}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? 'text-cyan-400 translate-x-1' : 'text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'}`} />
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono px-3">
              GITHUB REPO: SIH-26191<br/>
              SPECIFICATION: OAS 3.0 / WGS84
            </div>
          </aside>

          {/* Right Content Stream */}
          <main className="lg:col-span-8 space-y-5 sm:space-y-6">
            
            {/* Section 1: Overview */}
            <article 
              id="overview" 
              className={`bg-slate-900/90 border rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 shadow-xl scroll-mt-24 transition-all duration-300 ${
                activeSection === 'overview' ? 'border-cyan-500/50 shadow-cyan-950/30 ring-1 ring-cyan-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-xs sm:text-sm">
                  <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>1. Platform Overview & Problem Mandate</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">SIH 26191</span>
              </div>
              
              <h2 className="text-lg sm:text-xl font-black text-white font-sans">
                AI Multi-Hazard Red Zone Identification & Relocation DSS
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                SurakshaDrishti addresses Smart India Hackathon Problem Statement 26191. In rugged Himalayan terrains and coastal river deltas, recurring landslides, glacial lake outburst floods (GLOF), and tectonic subsidence create recurring human catastrophes. The platform synthesizes multi-source spatial sensors to identify high-risk zones, balance carrying capacity at designated safe hubs, and dispatch prioritized proactive evacuation alerts.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-950/30">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Target User Base
                  </div>
                  <div className="text-slate-300 text-[11px] mt-1.5 leading-normal">NDRF Battalions, SDMAs, District Emergency Operations Centers (DEOCs), and local habitations.</div>
                </div>
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-950/30">
                  <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    Core Objectives
                  </div>
                  <div className="text-slate-300 text-[11px] mt-1.5 leading-normal">Zero casualties via 48-hour proactive warnings, bottleneck-free transit routing, and resilient mesh alerts.</div>
                </div>
              </div>
            </article>

            {/* Section 2: Open GIS Spatial Engine */}
            <article 
              id="gis-engine" 
              className={`bg-slate-900/90 border rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 shadow-xl scroll-mt-24 transition-all duration-300 ${
                activeSection === 'gis-engine' ? 'border-emerald-500/50 shadow-emerald-950/30 ring-1 ring-emerald-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs sm:text-sm">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>2. Open GIS Spatial Engine (Zero Google API Keys)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">OPENSOURCE GIS</span>
              </div>
              
              <h2 className="text-lg sm:text-xl font-black text-white font-sans">
                Leaflet.js & Open Geospatial Architecture
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Unlike commercial systems that incur heavy per-request billing and quota exhaustion with proprietary Google Maps APIs, SurakshaDrishti operates on a 100% open-source spatial stack:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-0.5">
                  <strong className="text-white block mb-1">Map View (OpenStreetMap)</strong>
                  <span className="text-slate-400 text-[11px]">High-speed open raster tiles rendered through distributed regional CDNs.</span>
                </div>
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-0.5">
                  <strong className="text-white block mb-1">Satellite View (Esri)</strong>
                  <span className="text-slate-400 text-[11px]">High-resolution satellite imagery from Esri World Imagery (Maxar/Earthstar).</span>
                </div>
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-0.5">
                  <strong className="text-white block mb-1">Dark Terrain (CARTO)</strong>
                  <span className="text-slate-400 text-[11px]">CARTO Dark Matter vector tile sets for low-light command room viewing.</span>
                </div>
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-0.5">
                  <strong className="text-white block mb-1">Vector Math & GeoJSON</strong>
                  <span className="text-slate-400 text-[11px]">Client-side Haversine geodesic distance and bounding polygon calculations.</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[10px] sm:text-[11px] text-cyan-300 overflow-x-auto">
                <code>{`const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 });`}</code>
              </div>
            </article>

            {/* Section 3: AI Machine Learning Pipeline */}
            <article 
              id="ai-models" 
              className={`bg-slate-900/90 border rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 shadow-xl scroll-mt-24 transition-all duration-300 ${
                activeSection === 'ai-models' ? 'border-amber-500/50 shadow-amber-950/30 ring-1 ring-amber-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs sm:text-sm">
                  <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>3. Multi-Hazard AI Scoring & Carrying Capacity</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-500/30 text-amber-300">XGBOOST + DEM</span>
              </div>
              
              <h2 className="text-lg sm:text-xl font-black text-white font-sans">
                4-Stage Machine Learning Predictive Framework
              </h2>
              
              <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-0.5">
                  <strong className="text-amber-300">Stage 1 (Hazard Detection):</strong> Multi-spectral satellite band analysis (NDVI vegetation loss, NDWI water accumulation) combined with SRTM 30m Digital Elevation Models (slope angle &gt; 35°).
                </div>
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl transition-all duration-300 hover:border-red-500/40 hover:-translate-y-0.5">
                  <strong className="text-red-300">Stage 2 (Risk Index Computation):</strong> An ensemble XGBoost model outputs a normalized 0–100 Threat Index by fusing precipitation intensity, soil moisture saturation, and historical slip recurrence.
                </div>
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-0.5">
                  <strong className="text-emerald-300">Stage 3 (Carrying Capacity Allocation):</strong> Relocation shelters are dynamically assessed on potable water volume, bed density, transit road width, and medical logistics to prevent transit bottlenecking.
                </div>
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-0.5">
                  <strong className="text-cyan-300">Stage 4 (Priority Dispatch):</strong> Habitations with elderly, vulnerable populations and limited escape paths receive top-priority evacuation convoy assignments.
                </div>
              </div>
            </article>

            {/* Section 4: GSM 3.4 Telecommunication Mesh */}
            <article 
              id="mesh-protocol" 
              className={`bg-slate-900/90 border rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 shadow-xl scroll-mt-24 transition-all duration-300 ${
                activeSection === 'mesh-protocol' ? 'border-blue-500/50 shadow-blue-950/30 ring-1 ring-blue-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-blue-400 font-bold text-xs sm:text-sm">
                  <Network className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>4. GSM 3.4 Cellular Fallback & LoRa Hardware Bridge</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-950/80 border border-blue-500/30 text-blue-300">ZERO BROADBAND</span>
              </div>
              
              <h2 className="text-lg sm:text-xl font-black text-white font-sans">
                Zero-Broadband Emergency Communication Framework
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Catastrophic landslides and flash floods frequently sever optical fiber links and disable commercial 4G/5G base stations. SurakshaDrishti incorporates automated binary SMS packet compression over surviving 2G GSM control channels.
              </p>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 font-mono text-[10px] sm:text-[11px] transition-all duration-300 hover:border-blue-400/40 overflow-x-auto">
                <div className="text-amber-400 font-bold">160-Character Compressed Frame Structure:</div>
                <div className="text-slate-300 text-[10px]">`[SOS][GEO:#tdv2n19z][POP:4820][EVAC_HUB:Nilambur][ROUTE:NH-766][ETA:38M][SIGN:ed25519]`</div>
              </div>
            </article>

            {/* Section 5: QuickSign Pass & Security */}
            <article 
              id="quicksign" 
              className={`bg-slate-900/90 border rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 shadow-xl scroll-mt-24 transition-all duration-300 ${
                activeSection === 'quicksign' ? 'border-purple-500/50 shadow-purple-950/30 ring-1 ring-purple-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-purple-400 font-bold text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>5. QuickSign Pass Generation & RBAC Security</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-950/80 border border-purple-500/30 text-purple-300">AES-256 E2EE</span>
              </div>
              
              <h2 className="text-lg sm:text-xl font-black text-white font-sans">
                30-Second Resident SOS & Cryptographic Clearances
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Residents in urgent hazard zones can generate an instant digital evacuation badge with zero typing friction. The pass embeds designated shelter allocations, GPS coordinates, and offline transit maps.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-950/30">
                  <div className="text-cyan-400 font-bold">Citizen Level</div>
                  <div className="text-slate-400 text-[10px] mt-1">SOS pass creation, live hazard alerts, and designated hub directions.</div>
                </div>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-950/30">
                  <div className="text-amber-400 font-bold">Responder Level</div>
                  <div className="text-slate-400 text-[10px] mt-1">Convoy tracking, checkpoint check-in, and victim triage logging.</div>
                </div>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-950/30">
                  <div className="text-emerald-400 font-bold">Commander Level</div>
                  <div className="text-slate-400 text-[10px] mt-1">Zone classification override, GIS shapefile exports, and broadcast trigger.</div>
                </div>
              </div>
            </article>

            {/* Section 6: API Reference */}
            <article 
              id="api-reference" 
              className={`bg-slate-900/90 border rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 shadow-xl scroll-mt-24 transition-all duration-300 ${
                activeSection === 'api-reference' ? 'border-cyan-500/50 shadow-cyan-950/30 ring-1 ring-cyan-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-xs sm:text-sm">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>6. REST API Endpoints & NDMA Webhook Schema</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">OPEN API 3.0</span>
              </div>
              
              <h2 className="text-lg sm:text-xl font-black text-white font-sans">
                Developer Integration Reference
              </h2>
              
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-2 transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-0.5">
                  <span className="text-emerald-400 font-bold">GET /api/hazard-zones</span>
                  <span className="text-slate-400 text-[11px]">Returns active red/orange hazard clusters & geohashes</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-2 transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-0.5">
                  <span className="text-blue-400 font-bold">POST /api/evacuation/quick-sign</span>
                  <span className="text-slate-400 text-[11px]">Generates 30-second encrypted resident pass</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-2 transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-0.5">
                  <span className="text-amber-400 font-bold">GET /api/relocation/carrying-capacity</span>
                  <span className="text-slate-400 text-[11px]">Calculates shelter load balance and open units</span>
                </div>
              </div>
            </article>

          </main>

        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] sm:text-xs text-slate-500 font-mono pt-6 border-t border-slate-900 text-center sm:text-left">
          <span>SURAKSHADRISHTI DSS MANUAL • VERSION 2.4</span>
          <span>SIH 26191</span>
        </div>

      </div>
    </div>
  );
}
