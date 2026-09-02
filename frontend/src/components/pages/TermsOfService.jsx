import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, ArrowLeft, CheckCircle2, AlertTriangle, Shield, Radio, Flame, FileCheck2 } from 'lucide-react';

export default function TermsOfService() {
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
            <span className="w-2 h-2 rounded-full bg-[#8B7355] animate-pulse"></span>
            <span>OPERATIONAL TERMS & CONDITIONS • SIH 26191</span>
          </div>
        </div>

        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 bg-white/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#E8E1D5] shadow-xs">
          <div className="w-16 h-16 flex items-center justify-center shrink-0 drop-shadow-sm">
            <img src="/terms-and-services.webp" alt="Terms Shield" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">Terms of Service</h1>
            <p className="text-xs sm:text-sm text-[#5C544D] mt-1">
              Operational Mandates, Legal Protocols & Civil Protection Governance
            </p>
          </div>
        </div>

        {/* Terms Body */}
        <div className="space-y-4 text-xs sm:text-sm text-[#5C544D] leading-relaxed">
          
          <section className="bg-white/70 backdrop-blur-md border border-[#E8E1D5] rounded-3xl p-6 sm:p-7 space-y-2.5 shadow-xs">
            <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#8B7355] shrink-0" />
              <span>1. Authorized Public Safety Scope & Prohibition of False Alarms</span>
            </h2>
            <p>
              SurakshaDrishti is deployed for official civil defense, geological risk mitigation, and automated citizen evacuation coordination. Transmitting fabricated SOS beacons, impersonating civil response officials, or tampering with disaster sensor data is punishable under Section 54 of the Disaster Management Act, 2005.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-md border border-[#E8E1D5] rounded-3xl p-6 sm:p-7 space-y-2.5 shadow-xs">
            <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B85C38] shrink-0" />
              <span>2. Decision Support Systems (DSS) & Executive Command Hierarchy</span>
            </h2>
            <p>
              Automated hazard threat calculations (landslide slope instability, cloudburst run-off vectors, and carrying capacity scores) operate strictly as Decision Support Systems (DSS). Final on-ground evacuation declarations and statutory orders remain within the jurisdiction of District Magistrates, NDMA, and NDRF Incident Commanders.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-md border border-[#E8E1D5] rounded-3xl p-6 sm:p-7 space-y-2.5 shadow-xs">
            <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#2D7A4F] shrink-0" />
              <span>3. Telecommunication Resiliency & GSM 3.4 Fallback</span>
            </h2>
            <p>
              While the platform incorporates cellular broadcast failovers (GSM 3.4 binary SMS packet relays) for extreme conditions with zero broadband connectivity, residents are advised to maintain battery-powered radio receivers during severe multi-hazard calamities.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-md border border-[#E8E1D5] rounded-3xl p-6 sm:p-7 space-y-2.5 shadow-xs">
            <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#2E5B88] shrink-0" />
              <span>4. Safe Hub Allocations & Carrying Capacity Fair Use</span>
            </h2>
            <p>
              Designated safe transit hubs (e.g. Nilambur Foothill Base, Pipalkoti Relief Center) are allocated through real-time load balancing algorithms. Citizens and responders agree to adhere to allocated transit corridors to avoid road congestion during rapid evacuations.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] sm:text-xs text-[#7A726A] font-mono pt-4 border-t border-[#E8E1D5] text-center sm:text-left">
          <span>GOVERNING LAW: DISASTER MANAGEMENT ACT, 2005</span>
          <span>VERSION: 2.4 (2026)</span>
        </div>

      </div>
    </div>
  );
}
