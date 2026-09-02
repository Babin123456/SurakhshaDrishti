import React, { useEffect, useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Lock, 
  Users, 
  ArrowRight, 
  Radio, 
  Compass, 
  Sparkles,
  ChevronRight,
  MapPin
} from 'lucide-react';
import Interactive3DCard from './Interactive3DCard';

export default function GovernmentLanding({ onSignIn, onEmergencyAccess }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-sans flex flex-col items-center justify-center relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      
      {/* Inline Keyframes */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-16px) scale(1.02); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.75; transform: scale(1.05); }
        }
      `}</style>

      {/* --- Apple-Style Ambient Lighting --- */}
      <div className="absolute inset-0 bg-creme-mesh opacity-90 pointer-events-none"></div>
      <div 
        className="absolute top-10 left-1/4 w-[36rem] h-[36rem] bg-[#E8E1D5]/50 rounded-full blur-[120px] pointer-events-none" 
        style={{ animation: 'pulseGlow 9s ease-in-out infinite' }}
      ></div>
      <div 
        className="absolute bottom-10 right-1/4 w-[38rem] h-[38rem] bg-[#F2EDE4]/60 rounded-full blur-[130px] pointer-events-none" 
        style={{ animation: 'float 12s ease-in-out infinite reverse' }}
      ></div>
      <div className="paper-texture"></div>

      <div className="relative z-20 max-w-6xl w-full px-5 sm:px-8 flex flex-col items-center text-center">
        
        {/* Live Authority Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 border border-[#E8E1D5] shadow-xs backdrop-blur-md mb-8 hover:border-[#8B7355]/40 transition-colors">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2D7A4F] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2D7A4F]"></span>
          </span>
          <span className="text-[11px] font-mono font-bold tracking-wider text-[#4A4238] uppercase">
            SIH 26191 • Real-Time Hazard Decision Protocol
          </span>
        </div>

        {/* Minimal Hero Headlines */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#1A1A1A] mb-5 max-w-4xl leading-[1.08]">
          Predict. Protect. <span className="text-[#8B7355]">Relocate.</span>
        </h1>
        
        <p className="text-base sm:text-xl text-[#5C544D] max-w-2xl mb-12 font-light leading-relaxed">
          AI decision support engine fusing multi-satellite telemetry and geohash carrying capacity for disaster mitigation.
        </p>

        {/* Interactive 3D Apple-Style Command Console Showcase */}
        <Interactive3DCard 
          intensity={8}
          className="w-full max-w-4xl mb-14 cursor-default"
        >
          <div className="bg-white/70 backdrop-blur-2xl border border-[#E8E1D5] rounded-3xl p-6 sm:p-10 shadow-2xl shadow-[#D9D0C1]/30 relative overflow-hidden group">
            
            {/* Ambient inner soft highlight */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#8B7355]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            {/* Top Bar Header inside Card */}
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-5 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#2C2A29] text-[#FDFBF7] shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm text-[#1A1A1A]">SurakshaDrishti Telemetry Core</div>
                  <div className="text-[11px] font-mono text-[#7A726A]">WGS84 Sub-Meter Geohash Grid Active</div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#2D7A4F] bg-[#EBF7EE] border border-[#2D7A4F]/20 px-3 py-1 rounded-full">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>ISRO / IMD SAT FEED ONLINE</span>
              </div>
            </div>

            {/* 2-Tier Modular Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              
              {/* Option A: Command Console */}
              <div 
                onClick={onSignIn}
                className="p-6 rounded-2xl bg-[#F6F4F0]/90 border border-[#E8E1D5] hover:border-[#8B7355] hover:bg-white transition-all duration-300 group/box cursor-pointer flex flex-col justify-between shadow-xs hover:-translate-y-1"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E1D5] flex items-center justify-center text-[#4A4238] mb-4 group-hover/box:bg-[#2C2A29] group-hover/box:text-white transition-colors shadow-xs">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-1.5">
                    Command Console
                    <ChevronRight className="w-4 h-4 text-[#8B7355] opacity-0 group-hover/box:opacity-100 group-hover/box:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-[#5C544D] leading-relaxed">
                    Tactical console for NDRF commanders and SDMA authorities to inspect Red Zones & trigger resolution consensus.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E8E1D5] flex items-center justify-between text-[11px] font-mono text-[#8C847A]">
                  <span>OFFICIAL ACCESS</span>
                  <span className="font-bold text-[#4A4238]">16-DIGIT KEY REQUIRED</span>
                </div>
              </div>

              {/* Option B: Civilian Evacuation SOS */}
              <div 
                onClick={onEmergencyAccess}
                className="p-6 rounded-2xl bg-[#FFF5F2]/90 border border-[#FADED4] hover:border-[#B85C38] hover:bg-white transition-all duration-300 group/box cursor-pointer flex flex-col justify-between shadow-xs hover:-translate-y-1"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#FADED4] flex items-center justify-center text-[#B85C38] mb-4 group-hover/box:bg-[#B85C38] group-hover/box:text-white transition-colors shadow-xs">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-1.5">
                    Civilian Evacuation SOS
                    <ChevronRight className="w-4 h-4 text-[#B85C38] opacity-0 group-hover/box:opacity-100 group-hover/box:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-[#5C544D] leading-relaxed">
                    Instant 30-sec emergency pass generation with offline routes and nearest shelter carrying capacity allocation.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#FADED4] flex items-center justify-between text-[11px] font-mono text-[#8C847A]">
                  <span>RESIDENT EMERGENCY</span>
                  <span className="font-bold text-[#B85C38]">ONE-TAP PASS</span>
                </div>
              </div>

            </div>

          </div>
        </Interactive3DCard>

        {/* Primary Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mx-auto z-20">
          <button 
            onClick={onSignIn}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] rounded-2xl font-semibold text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2.5 cursor-pointer hover:-translate-y-0.5 active:scale-[0.99] whitespace-nowrap group"
          >
            <Users className="w-4 h-4 opacity-80 shrink-0" />
            <span>Authorized Sign In</span>
            <ArrowRight className="w-4 h-4 text-[#8B7355] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
          
          <button 
            onClick={onEmergencyAccess}
            className="w-full sm:w-auto px-7 py-3.5 bg-white/80 hover:bg-[#FFF5F2] border border-[#E8E1D5] hover:border-[#B85C38] text-[#B85C38] rounded-2xl font-semibold text-sm transition-all duration-300 shadow-xs flex items-center justify-center gap-2.5 cursor-pointer hover:-translate-y-0.5 active:scale-[0.99] whitespace-nowrap"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Emergency Access</span>
          </button>
        </div>
        
      </div>
      
    </div>
  );
}
