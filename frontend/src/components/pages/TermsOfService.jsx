import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, ArrowLeft, CheckCircle2, AlertTriangle, Shield, Radio, Flame, FileCheck2 } from 'lucide-react';

export default function TermsOfService() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#050914] text-slate-100 font-cambria py-6 sm:py-12 px-3.5 sm:px-6 lg:px-8 selection:bg-blue-500/30 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Return Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-slate-800">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer btn-bottom-glow-slate hover:-translate-y-0.5 font-sans shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>OPERATIONAL TERMS & CONDITIONS • SIH 26191</span>
          </div>
        </div>

        {/* Title Header with Pure Floating 3D Compliance Shield WebP */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-900/90 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl transition-all duration-300 hover:border-slate-700 hover:shadow-blue-950/20">
          <div className="w-16 h-16 flex items-center justify-center shrink-0 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            <img src="/legal_compliance_shield.webp" alt="Terms Shield" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">Terms of Service</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Operational Mandates, Legal Protocols & Civil Protection Governance
            </p>
          </div>
        </div>

        {/* Terms Body with Rich Interactive Hover Effects */}
        <div className="space-y-3.5 sm:space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          
          <section className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/30">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-sans">
              <Shield className="w-4 h-4 text-blue-400 shrink-0" />
              <span>1. Authorized Public Safety Scope & Prohibition of False Alarms</span>
            </h2>
            <p>
              SurakshaDrishti is deployed for official civil defense, geological risk mitigation, and automated citizen evacuation coordination. Transmitting fabricated SOS beacons, impersonating civil response officials, or tampering with disaster sensor data is punishable under Section 54 of the Disaster Management Act, 2005.
            </p>
          </section>

          <section className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/30">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-sans">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>2. Decision Support Systems (DSS) & Executive Command Hierarchy</span>
            </h2>
            <p>
              Automated hazard threat calculations (landslide slope instability, cloudburst run-off vectors, and carrying capacity scores) operate strictly as Decision Support Systems (DSS). Final on-ground evacuation declarations and statutory orders remain within the jurisdiction of District Magistrates, NDMA, and NDRF Incident Commanders.
            </p>
          </section>

          <section className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/30">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-sans">
              <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>3. Telecommunication Resiliency & GSM 3.4 Fallback</span>
            </h2>
            <p>
              While the platform incorporates cellular broadcast failovers (GSM 3.4 binary SMS packet relays) for extreme conditions with zero broadband connectivity, residents are advised to maintain battery-powered radio receivers during severe multi-hazard calamities.
            </p>
          </section>

          <section className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/30">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-sans">
              <FileCheck2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>4. Safe Hub Allocations & Carrying Capacity Fair Use</span>
            </h2>
            <p>
              Designated safe transit hubs (e.g. Nilambur Foothill Base, Pipalkoti Relief Center) are allocated through real-time load balancing algorithms. Citizens and responders agree to adhere to allocated transit corridors to avoid road congestion during rapid evacuations.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] sm:text-xs text-slate-500 font-mono pt-4 border-t border-slate-900 text-center sm:text-left">
          <span>GOVERNING LAW: DISASTER MANAGEMENT ACT, 2005</span>
          <span>VERSION: 2.4 (2026)</span>
        </div>

      </div>
    </div>
  );
}
