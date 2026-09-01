import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Home,
  Siren,
  Compass,
  X,
  MapPin,
  Zap,
  Phone,
  Radio,
  CheckCircle2,
  Navigation,
  ShieldAlert,
  Loader2,
  ArrowRight
} from 'lucide-react';
import QuickSignModal from './QuickSignModal';

const SHELTERS = [
  { name: 'Nilambur Foothill Base Camp', dist: '3.2 km', lat: 11.2764, lng: 76.2241, cap: '1,420 Beds Open', route: 'Via SH-28 (Clearing Teams Active)' },
  { name: 'Pipalkoti Relief Center', dist: '4.5 km', lat: 30.4285, lng: 79.4312, cap: '850 Beds Open', route: 'Via NH-07 (Bypass Operational)' },
  { name: 'Meppadi High Ground Camp', dist: '2.1 km', lat: 11.5510, lng: 76.1280, cap: '620 Beds Open', route: 'Via Bypass Road #2' }
];

export default function EmergencyMode({ onClose, onAuthSuccess }) {
  const [showQuickSign, setShowQuickSign] = useState(false);
  const [activeModalAction, setActiveModalAction] = useState(null); // 'shelter' | 'help' | 'evacuate' | null
  const [locationStatus, setLocationStatus] = useState(null);
  const [isDetecting, setIsDetecting] = useState(true);
  const [helpRequested, setHelpRequested] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();

    return () => {
      document.body.style.overflow = originalOverflow;
      if (window.__lenis) window.__lenis.start();
    };
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocationStatus({
            coords,
            inRedZone: true,
            name: 'GPS Sector — Active Hazard Vicinity',
            hazard: 'Landslide & Flash Flood Warning',
          });
          setIsDetecting(false);
        },
        () => {
          setLocationStatus({
            coords: { lat: 11.5583, lng: 76.1384 },
            inRedZone: true,
            name: 'Wayanad Sector 4 (Chooralmala)',
            hazard: 'High Slope Landslide & Debris Flow',
          });
          setIsDetecting(false);
        },
        { timeout: 5000 }
      );
    } else {
      setLocationStatus({
        coords: { lat: 11.5583, lng: 76.1384 },
        inRedZone: true,
        name: 'Wayanad Sector 4 (Chooralmala)',
        hazard: 'High Slope Landslide & Debris Flow',
      });
      setIsDetecting(false);
    }
  }, []);

  if (showQuickSign) {
    return (
      <QuickSignModal
        locationStatus={locationStatus}
        onClose={() => setShowQuickSign(false)}
        onSuccess={onAuthSuccess}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans"
      role="dialog"
      aria-modal="true"
      aria-label="Emergency Mode"
    >
      <div className="w-full max-w-lg my-auto animate-scale-in max-h-[90vh] flex flex-col justify-center">
        
        {/* Header alert bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-t-2xl sm:rounded-t-3xl bg-red-950/80 border border-red-500/40 border-b-0 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 truncate">
            <div className="p-1.5 sm:p-2 rounded-xl bg-red-500/20 text-red-400 animate-pulse shrink-0">
              <Radio className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="truncate">
              <div className="text-[10px] sm:text-xs font-mono font-bold text-red-400 uppercase tracking-wider truncate">
                ● High Alert • Priority 1 Civil Defense
              </div>
              <h2 className="text-xs sm:text-sm font-black text-white truncate">
                SurakshaDrishti SOS Console
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close emergency mode"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-slate-900 border border-slate-800 border-t-0 rounded-b-none sm:rounded-b-3xl rounded-t-none p-4 sm:p-6 space-y-3.5 sm:space-y-4 shadow-2xl overflow-y-auto max-h-[85vh] sm:max-h-[80vh]">
          
          {/* Location alert card */}
          <div className="p-3 sm:p-4 rounded-2xl bg-red-950/40 border border-red-500/30 space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-red-400 truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{isDetecting ? 'Querying GPS satellites...' : locationStatus?.name}</span>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5 leading-snug">
                  Civil Alert — Active Hazard in Your Vicinity!
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed font-cambria">
                  Extreme slope runoff & geological instability detected. Proceed immediately to designated shelters or broadcast your rescue beacon.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Emergency Action Buttons (Responsive 3-Column / Stack) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            
            {/* 1. Find Shelter */}
            <button
              onClick={() => setActiveModalAction(activeModalAction === 'shelter' ? null : 'shelter')}
              className={`flex flex-col items-center text-center gap-1 sm:gap-1.5 p-2.5 sm:p-3.5 rounded-2xl border transition-all group cursor-pointer shadow-sm ${
                activeModalAction === 'shelter'
                  ? 'bg-emerald-950/90 border-emerald-400 shadow-emerald-950/50'
                  : 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/70'
              }`}
            >
              <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-white leading-tight">Find Shelter</span>
              <span className="text-[9px] sm:text-[11px] font-mono text-emerald-400 font-bold">3.2km</span>
            </button>

            {/* 2. Request Help */}
            <button
              onClick={() => setActiveModalAction(activeModalAction === 'help' ? null : 'help')}
              className={`flex flex-col items-center text-center gap-1 sm:gap-1.5 p-2.5 sm:p-3.5 rounded-2xl border transition-all group cursor-pointer shadow-sm ${
                activeModalAction === 'help'
                  ? 'bg-red-950/90 border-red-400 shadow-red-950/50'
                  : 'bg-red-950/40 border-red-500/40 hover:border-red-400 hover:bg-red-950/70'
              }`}
            >
              <div className="p-1.5 sm:p-2 rounded-xl bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
                <Siren className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-white leading-tight">Request Help</span>
              <span className="text-[9px] sm:text-[11px] font-mono text-red-400 font-bold">NDRF Alert</span>
            </button>

            {/* 3. Evacuate Now */}
            <button
              onClick={() => setActiveModalAction(activeModalAction === 'evacuate' ? null : 'evacuate')}
              className={`flex flex-col items-center text-center gap-1 sm:gap-1.5 p-2.5 sm:p-3.5 rounded-2xl border transition-all group cursor-pointer shadow-sm ${
                activeModalAction === 'evacuate'
                  ? 'bg-cyan-950/90 border-cyan-400 shadow-cyan-950/50'
                  : 'bg-cyan-950/40 border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/70'
              }`}
            >
              <div className="p-1.5 sm:p-2 rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-white leading-tight">Evacuate Now</span>
              <span className="text-[9px] sm:text-[11px] font-mono text-cyan-400 font-bold">Routes</span>
            </button>

          </div>

          {/* Action Modals / Expanding Overlays */}
          {activeModalAction === 'shelter' && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-2.5 sm:space-y-3 animate-fade-in text-xs font-cambria">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-emerald-400 font-sans text-xs sm:text-sm">
                  <Home className="w-4 h-4" />
                  <span>Available Evacuation Shelters</span>
                </div>
                <button 
                  onClick={() => setActiveModalAction(null)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                {SHELTERS.map((s, idx) => (
                  <div key={idx} className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="truncate">
                      <div className="font-bold text-white text-[11px] sm:text-xs truncate">{s.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{s.route}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-emerald-400 font-bold font-mono text-xs">{s.dist}</div>
                      <div className="text-[9px] text-slate-500">{s.cap}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setActiveModalAction(null); setShowQuickSign(true); }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
              >
                <span>Reserve Bed & Get QR Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {activeModalAction === 'help' && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-red-500/40 space-y-2.5 sm:space-y-3 animate-fade-in text-xs font-cambria">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-red-400 font-sans text-xs sm:text-sm truncate">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span className="truncate">Transmit Priority SOS to NDRF</span>
                </div>
                <button 
                  onClick={() => setActiveModalAction(null)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer shrink-0 ml-1"
                >
                  ✕ Close
                </button>
              </div>

              {helpRequested ? (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                  <div className="font-bold text-white font-sans text-xs sm:text-sm">SOS Beacon Broadcasted!</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300">NDRF Control Room #04 & District Collector dispatched alert token #NDRF-SOS-9821. Stay on high ground.</div>
                </div>
              ) : (
                <>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                    Broadcasts your real-time GPS telemetry directly to the nearest NDRF Quick Response Team (QRT) and State Emergency Ops Center (SEOC).
                  </p>
                  <button
                    onClick={() => setHelpRequested(true)}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer btn-bottom-glow-red font-sans shadow-lg"
                  >
                    <Siren className="w-4 h-4 text-white" />
                    <span>Broadcast Immediate Rescue SOS Beacon</span>
                  </button>
                </>
              )}
            </div>
          )}

          {activeModalAction === 'evacuate' && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-2.5 sm:space-y-3 animate-fade-in text-xs font-cambria">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-cyan-400 font-sans text-xs sm:text-sm">
                  <Navigation className="w-4 h-4" />
                  <span>Prioritized Evacuation Route Guidance</span>
                </div>
                <button 
                  onClick={() => setActiveModalAction(null)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-2 text-[11px] sm:text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-cyan-300">Primary Corridor: Chooralmala ➔ Nilambur (SH-28)</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5">Highland bypass clear of debris. Estimated transit: 38 mins.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-amber-400">Caution: Avoid Lowland River Bridge</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5">Submerged under 1.4m runoff. Heavy machinery deployed.</div>
                </div>
              </div>

              <button
                onClick={() => { setActiveModalAction(null); setShowQuickSign(true); }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
              >
                <span>Generate Evacuation Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Registration Button */}
          <div className="pt-1">
            <button
              onClick={() => setShowQuickSign(true)}
              className="w-full py-3 sm:py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>QuickSign — 30-Sec Emergency Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] sm:text-[11px] text-slate-400 text-center mt-2 font-mono">
              Zero typing required • Instant shelter bed allocation & offline routing
            </p>
          </div>

          {/* Emergency contacts */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              Emergency Direct Dispatch Hotlines
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
              <a
                href="tel:1078"
                className="p-2 sm:p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-center border border-slate-800 transition-colors block"
              >
                <div className="text-[10px] text-slate-400">NDRF Control</div>
                <div className="font-mono text-xs sm:text-sm font-black text-white mt-0.5">1078</div>
              </a>
              <a
                href="tel:1070"
                className="p-2 sm:p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-center border border-slate-800 transition-colors block"
              >
                <div className="text-[10px] text-slate-400">SDMA State</div>
                <div className="font-mono text-xs sm:text-sm font-black text-white mt-0.5">1070</div>
              </a>
              <a
                href="tel:112"
                className="col-span-2 sm:col-span-1 p-2 sm:p-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/40 text-center border border-red-500/30 transition-colors block"
              >
                <div className="text-[10px] text-red-400">All-India SOS</div>
                <div className="font-mono text-xs sm:text-sm font-black text-white mt-0.5">112</div>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
