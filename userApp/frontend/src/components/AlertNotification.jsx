import React, { useEffect, useState } from 'react';

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
      className="w-screen h-screen flex flex-col justify-center items-center text-center bg-stone-100 border-[4px] border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.5)] rounded-lg relative overflow-hidden"
      style={{ WebkitAppRegion: 'drag' }}
    >
      {/* Flashing Warning Bar at Top */}
      <div className="absolute top-0 left-0 w-full h-2 bg-red-600 animate-[pulse_1s_infinite]"></div>
      
      <div className="flex flex-col items-center max-w-sm px-6">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 border-2 border-red-200">
          <svg className="w-8 h-8 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        
        <h1 className="text-xl text-stone-900 font-extrabold tracking-tight uppercase mb-2">Emergency Alert</h1>
        <p className="text-sm text-stone-600 font-medium mb-6 leading-relaxed">
          {message}
        </p>
        
        <button 
          onClick={handleAcknowledge}
          disabled={isAcknowledging}
          className="w-full bg-red-600 hover:bg-red-700 text-white border-none py-3 px-6 text-sm font-bold rounded-xl cursor-pointer uppercase shadow-md transition-colors"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          {isAcknowledging ? 'Acknowledging...' : 'Acknowledge & Close'}
        </button>
      </div>
      
      <style>{`
        body { margin: 0; padding: 0; overflow: hidden; user-select: none; background: transparent; }
      `}</style>
    </div>
  );
}
