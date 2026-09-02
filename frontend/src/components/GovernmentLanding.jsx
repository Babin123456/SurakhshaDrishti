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

      {/* ═══════════════════════════════════════════
          SPLIT HERO: Left = Text/CTA   Right = 3D
          ═══════════════════════════════════════════ */}
      <div className="relative z-20 max-w-7xl w-full px-5 sm:px-8">

        {/* Live Authority Status Pill (centered on mobile, left on desktop) */}
        <div className="flex justify-center lg:justify-start mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 border border-[#E8E1D5] shadow-xs backdrop-blur-md hover:border-[#8B7355]/40 transition-colors">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2D7A4F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2D7A4F]"></span>
            </span>
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#4A4238] uppercase">
              SIH 26191 • Real-Time Hazard Decision Protocol
            </span>
          </div>
        </div>

        {/* Two-Column Split: Hero Copy (Left) + 3D Globe (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* ─── LEFT COLUMN: Headlines, Description, Action Cards ─── */}
          <div className="flex flex-col text-center lg:text-left">
            
            {/* Minimal Hero Headlines with Still Gradient Typography */}
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight mb-5 leading-[1.08]">
              <span className="gradient-text-stone">Predict. Protect. </span>
              <span className="gradient-text-gold">Relocate.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-[#5C544D] max-w-xl mb-10 font-light leading-relaxed mx-auto lg:mx-0">
              AI decision support engine fusing multi-satellite telemetry and geohash carrying capacity for disaster mitigation.
            </p>

            {/* Dual Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              
              {/* Command Console */}
              <div 
                onClick={onSignIn}
                className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-[#E8E1D5] hover:border-[#8B7355] hover:bg-white transition-all duration-300 group/box cursor-pointer flex flex-col justify-between shadow-xs hover:-translate-y-1"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#F6F4F0] border border-[#E8E1D5] flex items-center justify-center text-[#4A4238] mb-3 group-hover/box:bg-[#2C2A29] group-hover/box:text-white transition-colors shadow-xs">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] mb-1 flex items-center gap-1.5">
                    Command Console
                    <ChevronRight className="w-3.5 h-3.5 text-[#8B7355] opacity-0 group-hover/box:opacity-100 group-hover/box:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-[11px] text-[#5C544D] leading-relaxed">
                    Tactical console for NDRF commanders and SDMA authorities.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#E8E1D5] flex items-center justify-between text-[10px] font-mono text-[#8C847A]">
                  <span>OFFICIAL ACCESS</span>
                  <span className="font-bold text-[#4A4238]">16-DIGIT KEY</span>
                </div>
              </div>

              {/* Civilian Evacuation SOS */}
              <div 
                onClick={onEmergencyAccess}
                className="p-5 rounded-2xl bg-[#FFF5F2]/80 backdrop-blur-xl border border-[#FADED4] hover:border-[#B85C38] hover:bg-white transition-all duration-300 group/box cursor-pointer flex flex-col justify-between shadow-xs hover:-translate-y-1"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#FADED4] flex items-center justify-center text-[#B85C38] mb-3 group-hover/box:bg-[#B85C38] group-hover/box:text-white transition-colors shadow-xs">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] mb-1 flex items-center gap-1.5">
                    Civilian Evacuation SOS
                    <ChevronRight className="w-3.5 h-3.5 text-[#B85C38] opacity-0 group-hover/box:opacity-100 group-hover/box:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-[11px] text-[#5C544D] leading-relaxed">
                    Instant 30-sec emergency pass with offline shelter routing.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#FADED4] flex items-center justify-between text-[10px] font-mono text-[#8C847A]">
                  <span>RESIDENT EMERGENCY</span>
                  <span className="font-bold text-[#B85C38]">ONE-TAP PASS</span>
                </div>
              </div>
            </div>

            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
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

          {/* ─── RIGHT COLUMN: Floating Tactical Location & Orbiting Satellite (No Background Box) ─── */}
          <div className="relative w-full aspect-square max-w-[520px] mx-auto lg:mx-0 lg:ml-auto flex items-center justify-center pointer-events-none select-none">
            {/* Main Location Earth Globe (Transparent, floating) */}
            <img 
              src="/location_transparent.gif" 
              alt="SurakshaDrishti Real-Time Location Telemetry" 
              className="relative z-10 w-full h-full object-contain select-none pointer-events-none"
              style={{ 
                animation: 'float 6s ease-in-out infinite',
                filter: 'drop-shadow(0 20px 35px rgba(74, 66, 56, 0.14))'
              }}
              draggable={false}
            />

            {/* Orbiting Satellite / Earth Telemetry Animation */}
            <div 
              className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-36 h-36 sm:w-48 sm:h-48 z-20"
              style={{ 
                animation: 'float 7s ease-in-out infinite reverse',
                filter: 'drop-shadow(0 15px 30px rgba(139, 115, 85, 0.22))'
              }}
            >
              <img 
                src="/satellite_earth_transparent.gif" 
                alt="ISRO Satellite Earth Telemetry Orbit" 
                className="w-full h-full object-contain select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
