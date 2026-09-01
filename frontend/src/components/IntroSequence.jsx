import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

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
            setTimeout(() => {
              onComplete();
            }, 600);
          }, 800);
          return 100;
        }
        const next = prev + 1;
        const msg = statusMessages.find((m) => next >= m.at && prev < m.at);
        if (msg) setLoaderStatus(msg.text);
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 text-slate-100 transition-all duration-700 select-none ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Lighting Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-600/10 via-blue-600/5 to-red-600/10 rounded-full blur-[140px] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
      </div>

      {/* Skip Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleSkip}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-700/60 text-xs font-bold text-slate-400 hover:text-white transition-all shadow-md backdrop-blur-md flex items-center gap-1.5 group"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Radar Telemetry Loader */}
      <div className="relative z-10 max-w-lg w-full px-6 flex flex-col items-center text-center animate-fade-in-up">
        
        {/* Radar Scanner Animation with clean logo */}
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-30"></div>
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-500/50 animate-spin" style={{ animationDuration: '8s' }}></div>
          <div className="absolute inset-6 rounded-full border border-blue-500/40"></div>
          
          <img 
            src="/favicon.webp" 
            alt="Logo" 
            className="w-12 h-12 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" 
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 mb-3 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="font-cambria text-xs font-bold uppercase tracking-widest text-cyan-300">
            SurakshaDrishti Core System
          </span>
        </div>

        <h2 className="font-cambria text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
          Initializing Decision Engine
        </h2>

        <p className="text-xs text-slate-400 font-mono tracking-wide h-8 flex items-center justify-center max-w-md">
          {loaderStatus}
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-full h-2.5 mt-6 p-0.5 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 text-[11px] font-mono font-bold text-slate-500">
          TELEMETRY PROGRESS: <span className="text-cyan-400">{progress}%</span>
        </div>

        <div className="mt-6 text-[11px] text-slate-500 font-cambria">
          Smart India Hackathon 2026 • Ministry of Home Affairs • NDRF DM Division
        </div>
      </div>
    </div>
  );
}
