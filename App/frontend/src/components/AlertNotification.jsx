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
      className="w-screen h-screen flex flex-col justify-center items-center text-center text-white bg-gradient-to-br from-[#cc0000] to-[#8b0000] border-[3px] border-[#ff4d4d] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8),_0_0_40px_rgba(255,0,0,0.4)] animate-[pulse-border_1s_infinite_alternate]"
      style={{ WebkitAppRegion: 'drag' }}
    >
      <h1 className="m-0 mb-2 text-2xl uppercase tracking-widest font-bold">🚨 RED ALERT 🚨</h1>
      <p className="m-0 mb-5 text-base opacity-90 font-mono max-w-[80%] mx-auto">{message}</p>
      <button 
        onClick={handleAcknowledge}
        disabled={isAcknowledging}
        className="bg-white text-[#cc0000] border-none py-3 px-8 text-lg font-bold rounded-lg cursor-pointer uppercase shadow-md transition-all hover:bg-[#ffe6e6] hover:scale-105"
        style={{ WebkitAppRegion: 'no-drag' }}
      >
        {isAcknowledging ? 'Closing...' : 'Acknowledge'}
      </button>
      
      <style>{`
        @keyframes pulse-border {
          0% { border-color: #ff4d4d; box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(255, 0, 0, 0.4); }
          100% { border-color: #ffb3b3; box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 60px rgba(255, 0, 0, 0.9); }
        }
        body { margin: 0; padding: 0; overflow: hidden; user-select: none; background: transparent; }
      `}</style>
    </div>
  );
}
