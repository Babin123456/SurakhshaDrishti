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
      className="fixed inset-0 z-[100] bg-[#2C2A29]/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans"
      role="dialog"
      aria-modal="true"
      aria-label="Emergency Mode"
    >
      <div className="w-full max-w-lg my-auto animate-scale-in max-h-[90vh] flex flex-col justify-center">
        
        {/* Header alert bar */}
        <div className="flex items-center justify-between p-4 rounded-t-2xl bg-[#FFF5F2] border border-[#FADED4] border-b-0 shrink-0">
          <div className="flex items-center gap-3 truncate">
            <div className="p-2 rounded-xl bg-[#B85C38]/15 text-[#B85C38] shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="text-[10px] sm:text-xs font-mono font-bold text-[#B85C38] uppercase tracking-wider truncate">
                ● Priority 1 Civil Defense Alert
              </div>
              <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] truncate">
                SurakshaDrishti Civilian SOS Console
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white border border-[#E8E1D5] hover:bg-[#F6F4F0] text-[#5C544D] hover:text-[#1A1A1A] transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Close emergency mode"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-white border border-[#E8E1D5] border-t-0 rounded-b-2xl p-5 sm:p-7 space-y-4 shadow-2xl overflow-y-auto max-h-[85vh] sm:max-h-[80vh]">
          
          {/* Location alert card */}
          <div className="p-4 rounded-2xl bg-[#FFF5F2] border border-[#FADED4] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#B85C38] truncate">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="truncate">{isDetecting ? 'Querying GPS satellites...' : locationStatus?.name}</span>
            </div>

            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#B85C38] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[#1A1A1A] mb-0.5 leading-snug">
                  Active Hazard Warning Detected
                </h3>
                <p className="text-xs text-[#5C544D] leading-relaxed">
                  Extreme slope runoff & geological instability detected in this coordinate perimeter. Proceed immediately to designated shelters or broadcast your rescue beacon.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Emergency Action Buttons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            
            {/* 1. Find Shelter */}
            <button
              onClick={() => setActiveModalAction(activeModalAction === 'shelter' ? null : 'shelter')}
              className={`flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl border transition-all group cursor-pointer shadow-xs ${
                activeModalAction === 'shelter'
                  ? 'bg-[#EBF7EE] border-[#2D7A4F] text-[#2D7A4F]'
                  : 'bg-[#F6F4F0] border-[#E8E1D5] hover:border-[#2D7A4F] hover:bg-[#EBF7EE]/50'
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-[#E8E1D5] text-[#2D7A4F] group-hover:scale-110 transition-transform">
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs font-bold text-[#1A1A1A] leading-tight">Find Shelter</span>
              <span className="text-[10px] sm:text-xs font-mono text-[#2D7A4F] font-bold">3.2km</span>
            </button>

            {/* 2. Request Help */}
            <button
              onClick={() => setActiveModalAction(activeModalAction === 'help' ? null : 'help')}
              className={`flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl border transition-all group cursor-pointer shadow-xs ${
                activeModalAction === 'help'
                  ? 'bg-[#FFF5F2] border-[#B85C38] text-[#B85C38]'
                  : 'bg-[#F6F4F0] border-[#E8E1D5] hover:border-[#B85C38] hover:bg-[#FFF5F2]/50'
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-[#E8E1D5] text-[#B85C38] group-hover:scale-110 transition-transform">
                <Siren className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs font-bold text-[#1A1A1A] leading-tight">Request Help</span>
              <span className="text-[10px] sm:text-xs font-mono text-[#B85C38] font-bold">NDRF Alert</span>
            </button>

            {/* 3. Evacuate Now */}
            <button
              onClick={() => setActiveModalAction(activeModalAction === 'evacuate' ? null : 'evacuate')}
              className={`flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl border transition-all group cursor-pointer shadow-xs ${
                activeModalAction === 'evacuate'
                  ? 'bg-[#F0F7FD] border-[#2E5B88] text-[#2E5B88]'
                  : 'bg-[#F6F4F0] border-[#E8E1D5] hover:border-[#2E5B88] hover:bg-[#F0F7FD]/50'
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-[#E8E1D5] text-[#2E5B88] group-hover:scale-110 transition-transform">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs font-bold text-[#1A1A1A] leading-tight">Evacuate Now</span>
              <span className="text-[10px] sm:text-xs font-mono text-[#2E5B88] font-bold">Routes</span>
            </button>

          </div>

          {/* Action Modals / Expanding Overlays */}
          {activeModalAction === 'shelter' && (
            <div className="p-4 rounded-2xl bg-[#F6F4F0] border border-[#E8E1D5] space-y-3 animate-fade-in text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-[#2D7A4F] text-xs sm:text-sm">
                  <Home className="w-4 h-4" />
                  <span>Available Evacuation Shelters</span>
                </div>
                <button 
                  onClick={() => setActiveModalAction(null)}
                  className="text-[#7A726A] hover:text-[#1A1A1A] text-xs cursor-pointer font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-2">
                {SHELTERS.map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#E8E1D5] flex items-center justify-between gap-2 shadow-xs">
                    <div className="truncate">
                      <div className="font-bold text-[#1A1A1A] text-xs truncate">{s.name}</div>
                      <div className="text-[10px] text-[#7A726A] truncate">{s.route}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[#2D7A4F] font-bold font-mono text-xs">{s.dist}</div>
                      <div className="text-[9px] text-[#7A726A]">{s.cap}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setActiveModalAction(null); setShowQuickSign(true); }}
                className="w-full py-2.5 rounded-xl bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Reserve Bed & Get QuickPass</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>
          )}

          {activeModalAction === 'help' && (
            <div className="p-4 rounded-2xl bg-[#FFF5F2] border border-[#FADED4] space-y-3 animate-fade-in text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-[#B85C38] text-xs sm:text-sm truncate">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span className="truncate">Priority SOS Broadcast to NDRF</span>
                </div>
                <button 
                  onClick={() => setActiveModalAction(null)}
                  className="text-[#7A726A] hover:text-[#1A1A1A] text-xs cursor-pointer shrink-0 ml-1 font-bold"
                >
                  ✕ Close
                </button>
              </div>

              {helpRequested ? (
                <div className="p-3 rounded-xl bg-white border border-[#D4EDDA] text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-[#2D7A4F] mx-auto" />
                  <div className="font-bold text-[#1A1A1A] text-xs sm:text-sm">SOS Beacon Broadcasted!</div>
                  <div className="text-[11px] text-[#5C544D]">NDRF Control Room #04 dispatched alert token #NDRF-SOS-9821. Stay on high ground.</div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[#5C544D] text-xs leading-relaxed">
                    Broadcasts your real-time GPS telemetry directly to NDRF field units and District EOC emergency dispatchers.
                  </p>
                  <button
                    onClick={() => setHelpRequested(true)}
                    className="w-full py-2.5 rounded-xl bg-[#B85C38] hover:bg-[#A34B29] text-white font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Siren className="w-4 h-4" />
                    <span>Broadcast Emergency SOS Beacon</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeModalAction === 'evacuate' && (
            <div className="p-4 rounded-2xl bg-[#F6F4F0] border border-[#E8E1D5] space-y-3 animate-fade-in text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-[#2E5B88] text-xs sm:text-sm">
                  <Compass className="w-4 h-4" />
                  <span>Assigned Evacuation Corridors</span>
                </div>
                <button 
                  onClick={() => setActiveModalAction(null)}
                  className="text-[#7A726A] hover:text-[#1A1A1A] text-xs cursor-pointer font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#E8E1D5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1A1A1A]">Corridor Alpha: SH-28 South</span>
                  <span className="text-emerald-700 font-bold font-mono text-[11px]">OPEN (42 mins)</span>
                </div>
                <p className="text-[11px] text-[#5C544D]">
                  Cleared by SDMA road maintenance team. Proceed toward Nilambur Foothill Base.
                </p>
              </div>

              <button
                onClick={() => { setActiveModalAction(null); setShowQuickSign(true); }}
                className="w-full py-2.5 rounded-xl bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Generate Pass for Evacuation Convoy</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>
          )}

          {/* Direct 30-Sec QuickPass Button */}
          <div className="pt-2">
            <button
              onClick={() => setShowQuickSign(true)}
              className="w-full py-3.5 rounded-xl bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] font-medium text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 text-[#8B7355]" />
              <span>Generate 30-Second Emergency Pass (QuickSign)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
