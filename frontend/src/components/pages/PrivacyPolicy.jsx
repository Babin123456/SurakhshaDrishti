import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, FileText, Globe, Key, EyeOff, Server, RefreshCw } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-sans py-8 sm:py-14 px-4 sm:px-6 lg:px-8 selection:bg-[#8B7355]/20 selection:text-[#1A1A1A] relative">
      <div className="paper-texture"></div>
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 relative z-20">
        
        {/* Top Return Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-[#E8E1D5]">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#F6F4F0] text-[#5C544D] hover:text-[#1A1A1A] border border-[#E8E1D5] text-xs font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#8B7355]" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-[#5C544D]">
            <span className="w-2 h-2 rounded-full bg-[#2D7A4F] animate-pulse"></span>
            <span>OFFICIAL LEGAL COMPLIANCE • SIH 26191</span>
          </div>
        </div>

        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 bg-white/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#E8E1D5] shadow-xs">
          <div className="w-16 h-16 flex items-center justify-center shrink-0 drop-shadow-sm">
            <img src="/legal_compliance_shield.webp" alt="Privacy Shield" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">Privacy Policy</h1>
            <p className="text-xs sm:text-sm text-[#5C544D] mt-1">
              SurakshaDrishti — AI Multi-Hazard Decision Support & Citizen Data Governance
            </p>
          </div>
        </div>

        {/* Policy Body */}
        <div className="space-y-4 text-xs sm:text-sm text-[#5C544D] leading-relaxed">
          
          <section className="bg-white/70 backdrop-blur-md border border-[#E8E1D5] rounded-3xl p-6 sm:p-7 space-y-2.5 shadow-xs">
            <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#8B7355] shrink-0" />
              <span>1. Information Collection & Tactical Purpose</span>
            </h2>
            <p>
              SurakshaDrishti collects limited geospatial telemetry, geolocation coordinates (GPS with explicit user authorization), emergency contact numbers, and habitation safety reports exclusively for life-saving disaster response, real-time hazard notification, and proactive evacuation scheduling.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-md border border-[#E8E1D5] rounded-3xl p-6 sm:p-7 space-y-2.5 shadow-xs">
            <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#2D7A4F] shrink-0" />
              <span>2. End-to-End Cryptographic Encryption (E2EE)</span>
            </h2>
            <p>
              All resident emergency passes (QuickSign 30-sec tokens) and interdepartmental communications between NDRF battalions, State Disaster Management Authorities (SDMAs), and District Collectors are cryptographically signed using 256-bit AES-GCM and ECDH key exchange protocols. Citizen data is never monetized, traded, or shared with commercial entities.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-md border border-[#E8E1D5] rounded-3xl p-6 sm:p-7 space-y-2.5 shadow-xs">
            <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-[#C05621] shrink-0" />
              <span>3. Geohash Spatial Anonymization</span>
            </h2>
            <p>
              Spatial coordinates in public-facing aggregate viewports are converted into 8-character hierarchical GeoHashes (e.g. #tdv2n19z) to prevent individual dwelling profiling while preserving the high-resolution tactical hazard fidelity required by incident commanders.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-md border border-[#E8E1D5] rounded-3xl p-6 sm:p-7 space-y-2.5 shadow-xs">
            <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#2E5B88] shrink-0" />
              <span>4. Open GIS Engine & Zero Third-Party Tracker Compliance</span>
            </h2>
            <p>
              Our geospatial map engine connects strictly to open-source public tile repositories (OpenStreetMap, CARTO, Esri). We do not load Google Analytics, tracking cookies, or commercial user profiling beacons on any part of the application.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-md border border-[#E8E1D5] rounded-3xl p-6 sm:p-7 space-y-2.5 shadow-xs">
            <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#8B7355] shrink-0" />
              <span>5. Automated Data Purging & Citizen Rights</span>
            </h2>
            <p>
              Temporary resident passes and GPS ping logs generated during disaster alerts are automatically scheduled for cryptographic shredding 30 days post incident closure, unless retained for statutory post-disaster audit under the Disaster Management Act, 2005. Citizens may request immediate deletion of their non-emergency profiles at any time.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] sm:text-xs text-[#7A726A] font-mono pt-4 border-t border-[#E8E1D5] text-center sm:text-left">
          <span>COMPLIANCE: MEITY / NDRF GUIDELINES</span>
          <span>LAST UPDATED: SEPTEMBER 2026</span>
        </div>

      </div>
    </div>
  );
}
