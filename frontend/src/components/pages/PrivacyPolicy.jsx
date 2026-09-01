import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, FileText, Globe, Key, EyeOff, Server, RefreshCw } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#050914] text-slate-100 font-cambria py-6 sm:py-12 px-3.5 sm:px-6 lg:px-8 selection:bg-cyan-500/30 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Return Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-slate-800">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer btn-bottom-glow-slate hover:-translate-y-0.5 font-sans shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>OFFICIAL LEGAL COMPLIANCE • SIH 26191</span>
          </div>
        </div>

        {/* Title Header with Pure Floating 3D Compliance Shield WebP */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-900/90 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl transition-all duration-300 hover:border-slate-700 hover:shadow-cyan-950/20">
          <div className="w-16 h-16 flex items-center justify-center shrink-0 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            <img src="/legal_compliance_shield.webp" alt="Privacy Shield" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">Privacy Policy</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              SurakshaDrishti — AI Multi-Hazard Decision Support & Citizen Data Governance
            </p>
          </div>
        </div>

        {/* Policy Body with Rich Interactive Hover Effects */}
        <div className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          
          <section className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/30">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-sans">
              <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>1. Information Collection & Tactical Purpose</span>
            </h2>
            <p>
              SurakshaDrishti collects limited geospatial telemetry, geolocation coordinates (GPS with explicit user authorization), emergency contact numbers, and habitation safety reports exclusively for life-saving disaster response, real-time hazard notification, and proactive evacuation scheduling.
            </p>
          </section>

          <section className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/30">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-sans">
              <Key className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>2. End-to-End Cryptographic Encryption (E2EE)</span>
            </h2>
            <p>
              All resident emergency passes (QuickSign 30-sec tokens) and interdepartmental communications between NDRF battalions, State Disaster Management Authorities (SDMAs), and District Collectors are cryptographically signed using 256-bit AES-GCM and ECDH key exchange protocols. Citizen data is never monetized, traded, or shared with commercial entities.
            </p>
          </section>

          <section className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/30">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-sans">
              <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>3. Geohash Spatial Anonymization</span>
            </h2>
            <p>
              Spatial coordinates in public-facing aggregate viewports are converted into 8-character hierarchical GeoHashes (e.g. #tdv2n19z) to prevent individual dwelling profiling while preserving the high-resolution tactical hazard fidelity required by incident commanders.
            </p>
          </section>

          <section className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/30">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-sans">
              <Server className="w-4 h-4 text-blue-400 shrink-0" />
              <span>4. Open GIS Engine & Zero Third-Party Tracker Compliance</span>
            </h2>
            <p>
              Our geospatial map engine connects strictly to open-source public tile repositories (OpenStreetMap, CARTO, Esri). We do not load Google Analytics, tracking cookies, or commercial user profiling beacons on any part of the application.
            </p>
          </section>

          <section className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/30">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-sans">
              <RefreshCw className="w-4 h-4 text-purple-400 shrink-0" />
              <span>5. Automated Data Purging & Citizen Rights</span>
            </h2>
            <p>
              Temporary resident passes and GPS ping logs generated during disaster alerts are automatically scheduled for cryptographic shredding 30 days post incident closure, unless retained for statutory post-disaster audit under the Disaster Management Act, 2005. Citizens may request immediate deletion of their non-emergency profiles at any time.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] sm:text-xs text-slate-500 font-mono pt-4 border-t border-slate-900 text-center sm:text-left">
          <span>COMPLIANCE: MEITY / NDRF GUIDELINES</span>
          <span>LAST UPDATED: SEPTEMBER 2026</span>
        </div>

      </div>
    </div>
  );
}
