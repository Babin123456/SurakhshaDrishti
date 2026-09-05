import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, ArrowRight } from 'lucide-react';

export default function IntroSequence({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [loaderStatus, setLoaderStatus] = useState('CALIBRATING GIS TELEMETRY MATRIX...');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const statusMessages = [
      { at: 12, text: 'INITIALIZING SATELLITE TELEMETRY (ISRO-RISAT & SENTINEL-2)...' },
      { at: 32, text: 'GEOHASHING MULTI-HAZARD RISK BOUNDARIES (PRECISION: 8-CHAR)...' },
      { at: 55, text: 'COMPUTING SAFE-ZONE SPATIAL CARRYING CAPACITY INDEXES...' },
      { at: 78, text: 'ESTABLISHING ZERO-KNOWLEDGE E2EE REALLOCATION CHANNELS...' },
      { at: 94, text: 'SURAKSHADRISHTI AI DECISION ENGINE READY.' },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoaderStatus('SYSTEM SYNCHRONIZED • ENTERING COMMAND PLATFORM...');
          setTimeout(() => {
            setIsExiting(true);
            // Notify parent to start revealing landing page concurrently
            onComplete();
          }, 350);
          return 100;
        }
        const next = prev + 1;
        const msg = statusMessages.find((m) => next >= m.at && prev < m.at);
        if (msg) setLoaderStatus(msg.text);
        return next;
      });
    }, 22);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    onComplete();
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#FDFBF7] text-[#2C2A29] font-sans transition-all duration-1000 ease-out select-none overflow-hidden ${
        isExiting 
          ? 'opacity-0 backdrop-blur-none pointer-events-none scale-[1.03]' 
          : 'opacity-100 backdrop-blur-md scale-100'
      }`}
      style={{
        transitionProperty: 'opacity, transform, filter, backdrop-filter'
      }}
    >
      {/* Paper texture overlay */}
      <div className="paper-texture"></div>

      {/* Subtle warm animated ambient background orbs */}
      <div className="absolute inset-0 bg-creme-mesh opacity-80 pointer-events-none"></div>
      <div 
        className="absolute top-1/4 left-1/4 w-[32rem] h-[32rem] bg-[#E8E1D5]/50 rounded-full blur-[110px] pointer-events-none animate-pulse-slow"
      ></div>
      <div 
        className="absolute bottom-1/4 right-1/4 w-[36rem] h-[36rem] bg-[#F2EDE4]/60 rounded-full blur-[120px] pointer-events-none"
      ></div>

      {/* Skip Button */}
      <div className="absolute top-6 right-6 z-30">
        <button
          onClick={handleSkip}
          className="px-4 py-2 rounded-xl bg-white/70 hover:bg-white border border-[#E8E1D5] text-xs font-semibold text-[#5C544D] hover:text-[#1A1A1A] transition-all shadow-sm backdrop-blur-md flex items-center gap-1.5 group cursor-pointer hover:-translate-y-0.5"
        >
          <span>Skip Initialization</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#8B7355]" />
        </button>
      </div>

      {/* Main Radar Telemetry Loader */}
      <div className="relative z-20 max-w-lg w-full px-6 flex flex-col items-center text-center animate-fade-in-up">
        
        {/* Radar Scanner Animation with Cream / Sand Rings & Shield */}
        <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#8B7355]/20 animate-ping opacity-40"></div>
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#8B7355]/40 animate-spin" style={{ animationDuration: '9s' }}></div>
          <div className="absolute inset-6 rounded-full border border-[#D9D0C1]/60"></div>
          
          <div className="w-16 h-16 flex items-center justify-center relative z-10 transition-transform hover:scale-105">
            <img 
              src="/favicon.webp" 
              alt="SurakshaDrishti Core Emblem" 
              className="w-full h-full object-contain drop-shadow-md" 
            />
          </div>
        </div>

        {/* System Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[#E8E1D5] mb-4 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#8B7355] animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-xs font-bold uppercase tracking-wider text-[#4A4238]">
            SurakshaDrishti Telemetry Core
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight mb-2">
          Initializing Decision Engine
        </h2>

        <p className="text-xs text-[#7A726A] font-mono tracking-wide h-8 flex items-center justify-center max-w-md">
          {loaderStatus}
        </p>

        {/* Cream Styled Progress Bar */}
        <div className="w-full max-w-xs bg-[#E8E1D5]/60 border border-[#D9D0C1] rounded-full h-3 mt-6 p-0.5 overflow-hidden shadow-inner backdrop-blur-sm">
          <div 
            className="bg-gradient-to-r from-[#8B7355] via-[#4A4238] to-[#2C2A29] h-full rounded-full transition-all duration-75 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 text-[11px] font-mono font-bold text-[#7A726A]">
          TELEMETRY PROGRESS: <span className="text-[#2C2A29]">{progress}%</span>
        </div>

        <div className="mt-8 text-[11px] text-[#8C847A] font-medium">
          Smart India Hackathon 2026 • Ministry of Home Affairs • NDRF DM Division
        </div>
      </div>
    </div>
  );
}
