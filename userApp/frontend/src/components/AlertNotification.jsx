import React, { useEffect, useState } from 'react';
import { ShieldAlert, BellRing, CheckCircle2 } from 'lucide-react';

export default function AlertNotification() {
  const [message, setMessage] = useState('Emergency detected in your immediate vicinity.');
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  useEffect(() => {
    // Web Audio API Synthesized Siren (Hi-Lo European Style)
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = null;
    let isHigh = true;
    let sirenInterval = null;

    function startSiren() {
      oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'square';
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      gainNode.gain.value = 0.15; // Volume
      oscillator.frequency.setValueAtTime(isHigh ? 800 : 600, audioCtx.currentTime);
      oscillator.start();

      sirenInterval = setInterval(() => {
        isHigh = !isHigh;
        // Glide frequency quickly for standard siren effect
        oscillator.frequency.setTargetAtTime(isHigh ? 800 : 600, audioCtx.currentTime, 0.05);
      }, 500); // Toggle every 500ms
    }

    startSiren();

    if (window.electronAPI) {
      window.electronAPI.onAlertData((data) => {
        if (data && data.message) {
          setMessage(data.message);
        }
      });
    }

    return () => {
      if (sirenInterval) clearInterval(sirenInterval);
      if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
      }
    };
  }, []);

  const handleAcknowledge = () => {
    setIsAcknowledging(true);
    if (window.electronAPI) {
      window.electronAPI.acknowledgeAlert();
    }
  };

  return (
    <div 
      className="w-screen h-screen flex flex-col justify-center items-center text-center bg-[#FDFBF7] border-[3px] border-[#B85C38] shadow-[0_20px_50px_rgba(184,92,56,0.35)] rounded-2xl relative overflow-hidden font-sans"
      style={{ WebkitAppRegion: 'drag' }}
    >
      {/* Flashing Warning Bar at Top */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#B85C38] via-[#DC2626] to-[#B85C38] animate-pulse"></div>
      
      <div className="flex flex-col items-center max-w-sm px-7 py-6 w-full">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF5F2] flex items-center justify-center border border-[#FADED4] shadow-sm">
            <ShieldAlert className="w-8 h-8 text-[#B85C38] animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#DC2626]"></span>
          </span>
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF5F2] border border-[#FADED4] text-[10px] font-mono font-bold tracking-wider text-[#B85C38] uppercase mb-2">
          <BellRing className="w-3 h-3" /> Priority Civil Defense Alert
        </div>

        <h1 className="text-xl text-[#2C2A29] font-black tracking-tight uppercase mb-2">
          Emergency Warning
        </h1>
        <p className="text-xs text-[#5C544D] font-medium mb-6 leading-relaxed bg-[#F6F4F0] p-3.5 rounded-xl border border-[#E8E1D5] w-full text-left">
          {message}
        </p>
        
        <button 
          onClick={handleAcknowledge}
          disabled={isAcknowledging}
          className="w-full bg-[#B85C38] hover:bg-[#A04D2E] text-white py-3 px-6 text-xs font-bold tracking-wider rounded-xl cursor-pointer uppercase shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isAcknowledging ? 'Acknowledging...' : 'Acknowledge & Dismiss'}</span>
        </button>
      </div>
      
      <style>{`
        body { margin: 0; padding: 0; overflow: hidden; user-select: none; background: transparent; }
      `}</style>
    </div>
  );
}
