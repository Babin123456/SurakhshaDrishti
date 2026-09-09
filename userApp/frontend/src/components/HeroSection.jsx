import React from 'react';
import { ArrowRight, Zap, ShieldCheck, Activity, Satellite, Sparkles, MapPin, Eye, AlertTriangle, Clock, Globe, Shield, Lock, Layers } from 'lucide-react';
import RealGoogleMap from './RealGoogleMap';

export default function HeroSection({ onExplore, onEmergencyAccess, onSelectZone }) {
  const scrollToMap = () => {
    const mapElem = document.getElementById('map');
    if (mapElem) {
      if (window.__lenis) {
        window.__lenis.scrollTo(mapElem, { offset: -90, duration: 1.2 });
      } else {
        const top = mapElem.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative pt-20 sm:pt-28 pb-12 sm:pb-16 overflow-hidden bg-transparent text-slate-100" id="map-explorer">
      
      {/* Ambient Radial Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-blue-600/15 via-cyan-600/5 to-transparent blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-16">
        
        {/* ========================================================================= */}
        {/* ROW 1: Split Screen Hero Header (Left: Texts & CTAs | Right: Tactical AI Visual) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Headlines & Call to Actions (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
            
            {/* Top Mission Pill */}
            <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 shadow-md max-w-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0"></span>
              <span className="font-cambria text-[11px] sm:text-xs text-cyan-300 font-semibold tracking-wide truncate">
                NDRF & SDMA Multi-Hazard DSS
              </span>
              <span className="text-slate-600 font-normal hidden sm:inline">|</span>
              <span className="text-[9px] sm:text-[10px] font-bold text-emerald-400 font-mono uppercase shrink-0">SIH 26191</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-cambria text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.2] sm:leading-[1.15]">
              Intelligent <span className="text-red-500 underline decoration-red-500/40 decoration-wavy decoration-2">Red Zone</span> Identification & <span className="text-cyan-400">Relocation</span> Decision Platform
            </h1>

            {/* Description */}
            <p className="font-cambria text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Automated multi-hazard intelligence for recurring landslides, glacial bursts, and flash floods. Fuses ISRO satellite telemetry, slope digital elevation models (DEM), and carrying-capacity modeling to orchestrate proactive, zero-bottleneck civil evacuations.
            </p>

            {/* Attribution Footnote */}
            <div className="font-cambria text-[11px] sm:text-xs font-semibold text-cyan-300/90 flex items-center gap-1.5 sm:gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ministry of Home Affairs & NDRF Disaster Division</span>
            </div>

            {/* Action Buttons with Dual Power Layout & Bottom Glow */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1.5 sm:pt-2 max-w-xl">
              <button
                onClick={onExplore}
                className="flex-1 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-950/70 transition-all flex items-center justify-center gap-2.5 cursor-pointer btn-bottom-glow-blue hover:-translate-y-0.5"
              >
                <span>Launch Command Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onEmergencyAccess}
                className="flex-1 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-950/70 transition-all flex items-center justify-center gap-2.5 cursor-pointer btn-bottom-glow-red hover:-translate-y-0.5"
              >
                <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Emergency Resident SOS</span>
              </button>
            </div>

            {/* Upgraded Vector Icon Telemetry Cards with Progress Bars & Dynamic Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 max-w-xl">
              
              {/* Card 1: 14 Active Red Zones */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-950/40 group relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping"></span>
                    ACTIVE
                  </span>
                </div>
                <div className="font-mono text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                  14 <span className="text-xs text-amber-400 font-sans font-bold">Zones</span>
                </div>
                <div className="text-[10px] text-slate-400 font-cambria font-semibold mt-0.5 leading-tight">
                  High-Slope Red Perimeters
                </div>
                {/* Mini Telemetry Progress Bar */}
                <div className="w-full bg-slate-950 rounded-full h-1 mt-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full w-[78%]"></div>
                </div>
              </div>

              {/* Card 2: QuickSign SOS Pass */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-950/40 group relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                    <Clock className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                    E2EE 256
                  </span>
                </div>
                <div className="font-mono text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                  &lt; 30 <span className="text-xs text-cyan-400 font-sans font-bold">Sec</span>
                </div>
                <div className="text-[10px] text-slate-400 font-cambria font-semibold mt-0.5 leading-tight">
                  QuickSign SOS Token
                </div>
                {/* Mini Telemetry Progress Bar */}
                <div className="w-full bg-slate-950 rounded-full h-1 mt-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full w-[95%] animate-pulse"></div>
                </div>
              </div>

              {/* Card 3: Zero Map API Keys */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-950/40 group relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                    <Layers className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                    100% OPEN
                  </span>
                </div>
                <div className="font-mono text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                  Zero <span className="text-xs text-emerald-400 font-sans font-bold">Keys</span>
                </div>
                <div className="text-[10px] text-slate-400 font-cambria font-semibold mt-0.5 leading-tight">
                  OpenStreetMap / CARTO / Esri
                </div>
                {/* Mini Telemetry Progress Bar */}
                <div className="w-full bg-slate-950 rounded-full h-1 mt-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full w-[100%]"></div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Holographic 3D Tactical AI Visualization (5 Cols) */}
          <div className="lg:col-span-5 relative group mt-2 lg:mt-0">
            
            {/* Ambient Back Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>

            <div className="relative rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-700/80 p-1.5 sm:p-2 shadow-2xl overflow-hidden transition-all duration-300 group-hover:border-cyan-500/50">
              
              {/* Tactical Image Header HUD */}
              <div className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-950/90 rounded-t-xl sm:rounded-t-2xl border-b border-slate-800 flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                <div className="flex items-center gap-1.5 sm:gap-2 text-cyan-400 font-bold truncate">
                  <Satellite className="w-3.5 h-3.5 animate-spin-slow shrink-0" />
                  <span className="truncate">ISRO EOS-4 SYNTHETIC RADAR</span>
                </div>
                <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE DEM
                </span>
              </div>

              {/* Converted WebP Tactical 3D Illustration */}
              <div className="relative overflow-hidden rounded-b-xl sm:rounded-b-2xl aspect-[16/10] bg-slate-950">
                <img 
                  src="/hero_tactical_ai.webp" 
                  alt="3D Holographic Himalayan Digital Elevation & Hazard Map" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Floating HUD Badge Over Image */}
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 p-1.5 sm:p-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center justify-between text-xs font-cambria">
                  <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                    <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 animate-pulse shrink-0" />
                    <div className="truncate">
                      <div className="text-[10px] sm:text-[11px] font-bold text-white leading-tight truncate">Landslide & Subsidence Matrix</div>
                      <div className="text-[8px] sm:text-[9px] font-mono text-cyan-400 truncate">Himalayan Ops Sector 03 (Joshimath)</div>
                    </div>
                  </div>
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 font-mono text-[9px] sm:text-[10px] font-bold shrink-0 ml-1">
                    CRITICAL
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* ROW 2: Full-Width Real Interactive Open GIS Map Engine */}
        {/* ========================================================================= */}
        <div id="map" className="pt-4 sm:pt-6 scroll-mt-20 sm:scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <h2 className="font-cambria text-xs sm:text-base font-bold text-white">
                Interactive Multi-Hazard Command Viewport (OpenStreetMap / CARTO / Esri)
              </h2>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-400 font-cambria hidden md:inline">
              Click any red polygon or relief camp marker to inspect real-time risk scores
            </span>
          </div>

          <RealGoogleMap onZoneSelect={onSelectZone} />
        </div>

      </div>

    </section>
  );
}
