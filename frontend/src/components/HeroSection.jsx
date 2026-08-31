import React from 'react';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import RealGoogleMap from './RealGoogleMap';

export default function HeroSection({ onExplore, onEmergencyAccess, onSelectZone }) {
  return (
    <section className="relative pt-24 pb-12 overflow-hidden bg-slate-950 text-slate-100" id="map-explorer">
      
      {/* Ambient Radial Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-gradient-to-b from-blue-600/15 via-cyan-600/5 to-transparent blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title & Context */}
        <div className="text-center max-w-4xl mx-auto mb-8 space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-cambria text-xs sm:text-sm text-cyan-300 font-semibold tracking-wide">NDRF & SDMA Mission Platform</span>
            <span className="text-slate-600 font-normal">|</span>
            <span className="text-[11px] font-bold text-emerald-400">Live Decision Support Active</span>
          </div>

          <h1 className="font-cambria text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Intelligent <span className="text-red-500">Red Zone</span> Identification & <span className="text-cyan-400">Relocation</span> Decision Platform
          </h1>

          <p className="font-cambria text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Real-time geospatial intelligence to detect recurring landslides, floods, and cloudburst hazard zones, compute carrying capacity for safer sites, and prioritize habitations for proactive evacuation.
          </p>

          <div className="font-cambria text-xs sm:text-sm text-cyan-300 font-semibold">
            Ministry of Home Affairs & National Disaster Response Force (NDRF) • SIH 26191
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onExplore}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-900/40 transition-all flex items-center gap-2"
            >
              Launch Command Console
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onEmergencyAccess}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-red-900/40 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Emergency Resident SOS
            </button>
          </div>

        </div>

        {/* Real Interactive Google Maps Type Component */}
        <div id="map" className="mb-10 scroll-mt-24">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2 px-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono">LIVE GIS MAP — SATELLITE & ROAD TILES</span>
            </div>
            <span className="hidden sm:inline font-cambria text-slate-400 text-xs">Click any marker or polygon to inspect risk telemetry</span>
          </div>

          <RealGoogleMap onZoneSelect={onSelectZone} />
        </div>

      </div>

    </section>
  );
}
