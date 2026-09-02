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
    navigate('/');
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
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-sans py-8 sm:py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#8B7355]/20 selection:text-[#1A1A1A] relative">
      <div className="paper-texture"></div>
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6 relative z-20">
        
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8E1D5]">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#F6F4F0] text-[#5C544D] hover:text-[#1A1A1A] border border-[#E8E1D5] text-xs font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#8B7355]" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-[#5C544D]">
            <span className="w-2 h-2 rounded-full bg-[#8B7355] animate-pulse"></span>
            <span className="hidden sm:inline">SYSTEM DOCUMENTATION & DEVELOPER MANUAL • SIH 26191</span>
            <span className="sm:hidden">DOCS MANUAL • SIH 26191</span>
          </div>
        </div>

        {/* Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-[#E8E1D5] shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center shrink-0 drop-shadow-sm">
              <img src="/doc_architecture_blueprint.webp" alt="Documentation Blueprint" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">System Documentation</h1>
              <p className="text-xs sm:text-sm text-[#5C544D] mt-0.5">
                Technical Architecture, Open GIS Engine & Operational Protocols
              </p>
            </div>
          </div>

          {/* Mobile Index Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-white hover:bg-[#F6F4F0] border border-[#E8E1D5] text-xs font-semibold text-[#1A1A1A] flex items-center justify-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
          >
            {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>{mobileNavOpen ? 'Close Navigation' : 'Jump to Chapter'}</span>
          </button>
        </div>

        {/* Mobile Quick Navigation Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-white border border-[#E8E1D5] rounded-2xl p-3 shadow-xl space-y-1 animate-fade-in-down">
            <div className="text-[10px] font-mono font-bold text-[#8B7355] px-3 py-1 uppercase tracking-wider">
              Select Chapter
            </div>
            {DOCS_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToDoc(sec.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  activeSection === sec.id
                    ? 'bg-[#F6F4F0] text-[#1A1A1A] border border-[#E8E1D5]'
                    : 'text-[#5C544D] hover:bg-[#F6F4F0]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <sec.icon className="w-3.5 h-3.5 text-[#8B7355]" />
                  <span>{sec.title}</span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#FDFBF7] text-[#7A726A] border border-[#E8E1D5]">
                  {sec.tag}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Desktop Left Sidebar (Sticky) */}
          <aside className="hidden lg:block lg:col-span-4 bg-white/70 backdrop-blur-md border border-[#E8E1D5] rounded-3xl p-5 sticky top-6 shadow-xs space-y-2">
            <div className="text-[11px] font-mono font-bold text-[#8B7355] px-3 py-1.5 uppercase tracking-wider">
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
                    className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-300 flex items-center justify-between cursor-pointer group ${
                      isActive
                        ? 'bg-[#2C2A29] text-[#FDFBF7] shadow-sm scale-[1.01]'
                        : 'text-[#5C544D] hover:text-[#1A1A1A] hover:bg-[#F6F4F0] border border-transparent hover:border-[#E8E1D5]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#8B7355]' : 'text-[#7A726A] group-hover:text-[#1A1A1A]'}`} />
                      <span>{sec.title}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? 'text-[#8B7355] translate-x-1' : 'text-[#D9D0C1] opacity-0 group-hover:opacity-100'}`} />
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#E8E1D5] text-[11px] text-[#7A726A] font-mono px-3">
              GITHUB REPO: SIH-26191<br/>
              SPECIFICATION: OAS 3.0 / WGS84
            </div>
          </aside>

          {/* Right Content Stream */}
          <main className="lg:col-span-8 space-y-5 sm:space-y-6">
            
            {/* Section 1: Overview */}
            <article 
              id="overview" 
              className={`bg-white/70 backdrop-blur-md border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs scroll-mt-24 transition-all duration-300 ${
                activeSection === 'overview' ? 'border-[#8B7355]/60 shadow-md ring-1 ring-[#8B7355]/20' : 'border-[#E8E1D5]'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-[#8B7355] font-bold text-xs sm:text-sm">
                  <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>1. Platform Overview & Problem Mandate</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F6F4F0] border border-[#E8E1D5] text-[#4A4238]">SIH 26191</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                AI Multi-Hazard Red Zone Identification & Relocation DSS
              </h2>
              
              <p className="text-xs sm:text-sm text-[#5C544D] leading-relaxed">
                SurakshaDrishti addresses Smart India Hackathon Problem Statement 26191. In rugged Himalayan terrains and coastal river deltas, recurring landslides, glacial lake outburst floods (GLOF), and tectonic subsidence create recurring human catastrophes. The platform synthesizes multi-source spatial sensors to identify high-risk zones, balance carrying capacity at designated safe hubs, and dispatch prioritized proactive evacuation alerts.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 bg-[#F6F4F0] border border-[#E8E1D5] rounded-2xl text-xs">
                  <div className="font-bold text-[#2D7A4F] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A4F]"></span>
                    Target User Base
                  </div>
                  <div className="text-[#5C544D] text-[11px] mt-1.5 leading-normal">NDRF Battalions, SDMAs, District Emergency Operations Centers (DEOCs), and local habitations.</div>
                </div>
                <div className="p-4 bg-[#F6F4F0] border border-[#E8E1D5] rounded-2xl text-xs">
                  <div className="font-bold text-[#8B7355] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B7355]"></span>
                    Core Objectives
                  </div>
                  <div className="text-[#5C544D] text-[11px] mt-1.5 leading-normal">Zero casualties via 48-hour proactive warnings, bottleneck-free transit routing, and resilient mesh alerts.</div>
                </div>
              </div>
            </article>

            {/* Section 2: Open GIS Spatial Engine */}
            <article 
              id="gis-engine" 
              className={`bg-white/70 backdrop-blur-md border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs scroll-mt-24 transition-all duration-300 ${
                activeSection === 'gis-engine' ? 'border-[#2D7A4F]/60 shadow-md ring-1 ring-[#2D7A4F]/20' : 'border-[#E8E1D5]'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-[#2D7A4F] font-bold text-xs sm:text-sm">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>2. Open GIS Spatial Engine (Zero Google API Keys)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F6F4F0] border border-[#E8E1D5] text-[#2D7A4F]">OPENSOURCE GIS</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                Leaflet.js & Open Geospatial Architecture
              </h2>
              
              <p className="text-xs sm:text-sm text-[#5C544D] leading-relaxed">
                Unlike commercial systems that incur heavy per-request billing and quota exhaustion with proprietary Google Maps APIs, SurakshaDrishti operates on a 100% open-source spatial stack:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-[#F6F4F0] border border-[#E8E1D5] rounded-xl text-xs">
                  <strong className="text-[#1A1A1A] block mb-1">Map View (OpenStreetMap)</strong>
                  <span className="text-[#5C544D] text-[11px]">High-speed open raster tiles rendered through distributed regional CDNs.</span>
                </div>
                <div className="p-3.5 bg-[#F6F4F0] border border-[#E8E1D5] rounded-xl text-xs">
                  <strong className="text-[#1A1A1A] block mb-1">Satellite View (Esri)</strong>
                  <span className="text-[#5C544D] text-[11px]">High-resolution satellite imagery from Esri World Imagery (Maxar/Earthstar).</span>
                </div>
                <div className="p-3.5 bg-[#F6F4F0] border border-[#E8E1D5] rounded-xl text-xs">
                  <strong className="text-[#1A1A1A] block mb-1">Dark Terrain (CARTO)</strong>
                  <span className="text-[#5C544D] text-[11px]">CARTO Dark Matter vector tile sets for low-light command room viewing.</span>
                </div>
                <div className="p-3.5 bg-[#F6F4F0] border border-[#E8E1D5] rounded-xl text-xs">
                  <strong className="text-[#1A1A1A] block mb-1">Vector Math & GeoJSON</strong>
                  <span className="text-[#5C544D] text-[11px]">Client-side Haversine geodesic distance and bounding polygon calculations.</span>
                </div>
              </div>

              <div className="p-3 bg-[#F6F4F0] border border-[#E8E1D5] rounded-xl font-mono text-[10px] sm:text-[11px] text-[#4A4238] overflow-x-auto">
                <code>{`const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 });`}</code>
              </div>
            </article>

            {/* Section 3: AI Machine Learning Pipeline */}
            <article 
              id="ai-models" 
              className={`bg-white/70 backdrop-blur-md border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs scroll-mt-24 transition-all duration-300 ${
                activeSection === 'ai-models' ? 'border-[#C05621]/60 shadow-md ring-1 ring-[#C05621]/20' : 'border-[#E8E1D5]'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-[#C05621] font-bold text-xs sm:text-sm">
                  <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>3. Multi-Hazard AI Scoring & Carrying Capacity</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F6F4F0] border border-[#E8E1D5] text-[#C05621]">XGBOOST + DEM</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                4-Stage Machine Learning Predictive Framework
              </h2>
              
              <div className="space-y-3 text-xs sm:text-sm text-[#5C544D] leading-relaxed">
                <div className="p-3.5 bg-[#F6F4F0] border border-[#E8E1D5] rounded-xl">
                  <strong className="text-[#8B7355]">Stage 1 (Hazard Detection):</strong> Multi-spectral satellite band analysis (NDVI vegetation loss, NDWI water accumulation) combined with SRTM 30m Digital Elevation Models (slope angle &gt; 35°).
                </div>
                <div className="p-3.5 bg-[#F6F4F0] border border-[#E8E1D5] rounded-xl">
                  <strong className="text-[#B85C38]">Stage 2 (Risk Index Computation):</strong> An ensemble XGBoost model outputs a normalized 0–100 Threat Index by fusing precipitation intensity, soil moisture saturation, and historical slip recurrence.
                </div>
                <div className="p-3.5 bg-[#F6F4F0] border border-[#E8E1D5] rounded-xl">
                  <strong className="text-[#2D7A4F]">Stage 3 (Carrying Capacity Allocation):</strong> Relocation shelters are dynamically assessed on potable water volume, bed density, transit road width, and medical logistics to prevent transit bottlenecking.
                </div>
                <div className="p-3.5 bg-[#F6F4F0] border border-[#E8E1D5] rounded-xl">
                  <strong className="text-[#2E5B88]">Stage 4 (Priority Dispatch):</strong> Habitations with elderly, vulnerable populations and limited escape paths receive top-priority evacuation convoy assignments.
                </div>
              </div>
            </article>

            {/* Section 4: GSM 3.4 Telecommunication Mesh */}
            <article 
              id="mesh-protocol" 
              className={`bg-white/70 backdrop-blur-md border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs scroll-mt-24 transition-all duration-300 ${
                activeSection === 'mesh-protocol' ? 'border-[#2E5B88]/60 shadow-md ring-1 ring-[#2E5B88]/20' : 'border-[#E8E1D5]'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-[#2E5B88] font-bold text-xs sm:text-sm">
                  <Network className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>4. GSM 3.4 Cellular Fallback & LoRa Hardware Bridge</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F6F4F0] border border-[#E8E1D5] text-[#2E5B88]">ZERO BROADBAND</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                Zero-Broadband Emergency Communication Framework
              </h2>
              
              <p className="text-xs sm:text-sm text-[#5C544D] leading-relaxed">
                Catastrophic landslides and flash floods frequently sever optical fiber links and disable commercial 4G/5G base stations. SurakshaDrishti incorporates automated binary SMS packet compression over surviving 2G GSM control channels.
              </p>

              <div className="p-3.5 bg-[#F6F4F0] border border-[#E8E1D5] rounded-xl space-y-1.5 font-mono text-[10px] sm:text-[11px] overflow-x-auto">
                <div className="text-[#8B7355] font-bold">160-Character Compressed Frame Structure:</div>
                <div className="text-[#1A1A1A] text-[10px]">`[SOS][GEO:#tdv2n19z][POP:4820][EVAC_HUB:Nilambur][ROUTE:NH-766][ETA:38M][SIGN:ed25519]`</div>
              </div>
            </article>

            {/* Section 5: QuickSign Pass & Security */}
            <article 
              id="quicksign" 
              className={`bg-white/70 backdrop-blur-md border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs scroll-mt-24 transition-all duration-300 ${
                activeSection === 'quicksign' ? 'border-[#8B7355]/60 shadow-md ring-1 ring-[#8B7355]/20' : 'border-[#E8E1D5]'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-[#8B7355] font-bold text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>5. QuickSign Pass Generation & RBAC Security</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F6F4F0] border border-[#E8E1D5] text-[#8B7355]">AES-256 E2EE</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                30-Second Resident SOS & Cryptographic Clearances
              </h2>
              
              <p className="text-xs sm:text-sm text-[#5C544D] leading-relaxed">
                Residents in urgent hazard zones can generate an instant digital evacuation badge with zero typing friction. The pass embeds designated shelter allocations, GPS coordinates, and offline transit maps.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                <div className="p-3.5 bg-[#F6F4F0] border border-[#E8E1D5] rounded-2xl">
                  <div className="text-[#2E5B88] font-bold">Citizen Level</div>
                  <div className="text-[#5C544D] text-[10px] mt-1">SOS pass creation, live hazard alerts, and designated hub directions.</div>
                </div>
                <div className="p-3.5 bg-[#F6F4F0] border border-[#E8E1D5] rounded-2xl">
                  <div className="text-[#C05621] font-bold">Responder Level</div>
                  <div className="text-[#5C544D] text-[10px] mt-1">Convoy tracking, checkpoint check-in, and victim triage logging.</div>
                </div>
                <div className="p-3.5 bg-[#F6F4F0] border border-[#E8E1D5] rounded-2xl">
                  <div className="text-[#2D7A4F] font-bold">Commander Level</div>
                  <div className="text-[#5C544D] text-[10px] mt-1">Zone classification override, GIS shapefile exports, and broadcast trigger.</div>
                </div>
              </div>
            </article>

            {/* Section 6: API Reference */}
            <article 
              id="api-reference" 
              className={`bg-white/70 backdrop-blur-md border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs scroll-mt-24 transition-all duration-300 ${
                activeSection === 'api-reference' ? 'border-[#8B7355]/60 shadow-md ring-1 ring-[#8B7355]/20' : 'border-[#E8E1D5]'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-[#8B7355] font-bold text-xs sm:text-sm">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>6. REST API Endpoints & NDMA Webhook Schema</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F6F4F0] border border-[#E8E1D5] text-[#8B7355]">OPEN API 3.0</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                Developer Integration Reference
              </h2>
              
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 bg-[#F6F4F0] border border-[#E8E1D5] rounded-xl flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[#2D7A4F] font-bold">GET /api/hazard-zones</span>
                  <span className="text-[#5C544D] text-[11px]">Returns active red/orange hazard clusters & geohashes</span>
                </div>
                <div className="p-3 bg-[#F6F4F0] border border-[#E8E1D5] rounded-xl flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[#2E5B88] font-bold">POST /api/evacuation/quick-sign</span>
                  <span className="text-[#5C544D] text-[11px]">Generates 30-second encrypted resident pass</span>
                </div>
                <div className="p-3 bg-[#F6F4F0] border border-[#E8E1D5] rounded-xl flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[#B85C38] font-bold">GET /api/relocation/carrying-capacity</span>
                  <span className="text-[#5C544D] text-[11px]">Calculates shelter load balance and open units</span>
                </div>
              </div>
            </article>

          </main>

        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] sm:text-xs text-[#7A726A] font-mono pt-6 border-t border-[#E8E1D5] text-center sm:text-left">
          <span>SURAKSHADRISHTI DSS MANUAL • VERSION 2.4</span>
          <span>SIH 26191</span>
        </div>

      </div>
    </div>
  );
}
