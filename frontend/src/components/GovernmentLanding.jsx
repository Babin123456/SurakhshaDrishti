import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Activity, Lock, Users, ArrowRight } from 'lucide-react';

export default function GovernmentLanding({ onSignIn, onEmergencyAccess }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-sans flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* --- Inline Styles for Animations & Textures --- */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bg-creme-mesh {
          background-image: 
            radial-gradient(at 0% 0%, hsla(30, 40%, 94%, 1) 0, transparent 50%), 
            radial-gradient(at 100% 0%, hsla(45, 30%, 96%, 1) 0, transparent 50%);
        }
        .animate-slide-up-1 { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
        .animate-slide-up-2 { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        .animate-slide-up-3 { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards; opacity: 0; }
        
        .paper-texture {
          position: absolute;
          inset: 0;
          background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
          opacity: 0.05;
          pointer-events: none;
          z-index: 10;
        }
      `}</style>

      {/* --- Ambient Backgrounds --- */}
      <div className="absolute inset-0 bg-creme-mesh opacity-80 pointer-events-none"></div>
      
      {/* Animated floating subtle orbs (using warm taupe/sand colors) */}
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-[#E8E1D5]/40 rounded-full blur-[100px] pointer-events-none" style={{ animation: 'float 12s ease-in-out infinite' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-[#F2EDE4]/50 rounded-full blur-[100px] pointer-events-none" style={{ animation: 'float 15s ease-in-out infinite reverse' }}></div>
      <div className="paper-texture"></div>

      <div className="relative z-20 max-w-6xl w-full px-6 py-12 flex flex-col items-center text-center">
        
        {/* Emblem/Icon */}
        <div className="animate-slide-up-1 mb-10 p-5 bg-white/60 backdrop-blur-md border border-[#E8E1D5] rounded-2xl shadow-sm flex items-center justify-center transition-transform hover:scale-105 duration-500">
          <Shield className="w-12 h-12 text-[#4A4238]" strokeWidth={1.5} />
        </div>
        
        {/* Headlines */}
        <h1 className="animate-slide-up-1 text-5xl md:text-7xl font-bold tracking-tight text-[#1A1A1A] mb-6">
          Suraksha<span className="text-[#8B7355]">Drishti</span>
        </h1>
        <p className="animate-slide-up-2 text-xl md:text-2xl text-[#5C544D] max-w-3xl mb-14 leading-relaxed font-light">
          Intelligent Hazard Management &amp; Relocation Platform.
        </p>
        
        {/* Information Panel */}
        <div className="animate-slide-up-3 w-full max-w-5xl bg-white/40 backdrop-blur-xl border border-[#E8E1D5]/60 rounded-3xl p-10 md:p-14 shadow-xl shadow-[#D9D0C1]/20 mb-14 grid grid-cols-1 md:grid-cols-2 gap-12 text-left relative overflow-hidden group">
          
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-5 flex items-center tracking-tight">
              <Activity className="w-6 h-6 mr-3 text-[#8B7355]" />
              System Overview
            </h2>
            <p className="text-[#5C544D] leading-relaxed">
              An authoritative Decision Support System utilizing satellite telemetry for real-time risk assessment, inter-agency coordination, and structured civilian evacuation protocols.
            </p>
          </div>

          <div className="space-y-8 relative z-10">
            <div className="flex items-start group/item">
              <div className="bg-[#F6F4F0] text-[#4A4238] p-4 rounded-xl mr-5 border border-[#E8E1D5] group-hover/item:bg-[#4A4238] group-hover/item:text-[#FDFBF7] transition-all duration-300">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#1A1A1A] mb-1">Command Console</h3>
                <p className="text-sm text-[#7A726A]">Encrypted access for NDRF and State Authority management.</p>
              </div>
            </div>
            <div className="flex items-start group/item">
              <div className="bg-[#FFF5F2] text-[#B85C38] p-4 rounded-xl mr-5 border border-[#FADED4] group-hover/item:bg-[#B85C38] group-hover/item:text-white transition-all duration-300">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#1A1A1A] mb-1">Civilian SOS</h3>
                <p className="text-sm text-[#7A726A]">Direct geolocation pings and rapid shelter assignments.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="animate-slide-up-3 flex flex-col sm:flex-row gap-5 w-full max-w-xl mx-auto z-20">
          <button 
            onClick={onSignIn}
            className="flex-1 group relative px-8 py-4 bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] rounded-xl font-medium text-lg transition-all duration-300 shadow-md flex items-center justify-center overflow-hidden hover:-translate-y-1"
          >
            <span className="relative z-10 flex items-center">
              <Users className="w-5 h-5 mr-3 opacity-80" />
              Authorized Sign In
            </span>
          </button>
          
          <button 
            onClick={onEmergencyAccess}
            className="flex-1 group relative px-8 py-4 bg-transparent border-2 border-[#D9D0C1] hover:border-[#B85C38] text-[#B85C38] rounded-xl font-medium text-lg transition-all duration-300 hover:bg-[#FFF5F2] flex items-center justify-center hover:-translate-y-1"
          >
            <span className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-3 opacity-80" />
              Emergency Log In
            </span>
          </button>
        </div>
        
      </div>
      
    </div>
  );
}
