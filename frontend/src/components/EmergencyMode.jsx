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
} from 'lucide-react';
import { checkGeofenceRedZoneStatus } from '../utils/api';
import QuickSignModal from './QuickSignModal';

export default function EmergencyMode({ onClose, onAuthSuccess }) {
  const [showQuickSign, setShowQuickSign] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocationStatus({
            coords,
            inRedZone: true,
            name: 'Wayanad Hill Slope — Sector 4',
            hazard: 'Active Landslide & Cloudburst Risk',
          });
          setIsDetecting(false);
        },
        () => {
          setLocationStatus({
            coords: { lat: 11.6854, lng: 76.132 },
            inRedZone: true,
            name: 'Joshimath Subsidence Zone',
            hazard: 'Land Subsidence & Slope Failure',
          });
          setIsDetecting(false);
        }
      );
    } else {
      setLocationStatus({
        coords: { lat: 11.6854, lng: 76.132 },
        inRedZone: true,
        name: 'Simulated Red Zone',
        hazard: 'Multi-Hazard Alert Active',
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
      className="fixed inset-0 z-[100] bg-navy-950/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Emergency Mode"
    >
      <div className="w-full max-w-lg animate-scale-in">
        {/* Header alert bar */}
        <div className="flex items-center justify-between p-4 rounded-t-2xl bg-hazard-critical/15 border border-hazard-critical/30 border-b-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-hazard-critical/20">
              <Radio className="w-6 h-6 text-hazard-critical animate-pulse-fast" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-hazard-critical">
                EMERGENCY MODE ACTIVE
              </div>
              <div className="text-xs text-slate-400">
                {isDetecting ? 'Detecting location...' : locationStatus?.hazard}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close emergency mode"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Main content */}
        <div className="glass-card rounded-b-2xl rounded-t-none p-6 space-y-5 border border-glass-border border-t-0">
          {/* Current location */}
          {locationStatus && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-hazard-critical/8 border border-hazard-critical/20 text-xs">
              <MapPin className="w-4 h-4 text-hazard-critical shrink-0" />
              <div>
                <span className="text-white font-semibold">{locationStatus.name}</span>
                <span className="text-slate-400 ml-2 font-mono">
                  ({locationStatus.coords.lat.toFixed(4)}°N, {locationStatus.coords.lng.toFixed(4)}°E)
                </span>
              </div>
            </div>
          )}

          {/* Alert message */}
          <div className="p-4 rounded-xl bg-hazard-critical/10 border border-hazard-critical/25 glow-critical">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-hazard-critical shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  Landslide Warning — Your area is at high risk!
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Active landslide and cloudburst risk detected in your vicinity.
                  Evacuate immediately to the nearest shelter. Do not delay.
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-hazard-safe/10 border border-hazard-safe/30 hover:border-hazard-safe/60 transition-all group">
              <Home className="w-7 h-7 text-hazard-safe group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">Find Shelter</span>
              <span className="text-[10px] text-slate-500">3.2km away</span>
            </button>

            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-hazard-critical/10 border border-hazard-critical/30 hover:border-hazard-critical/60 transition-all group">
              <Siren className="w-7 h-7 text-hazard-critical group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">Request Help</span>
              <span className="text-[10px] text-slate-500">NDRF Alert</span>
            </button>

            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-hazard-info/10 border border-hazard-info/30 hover:border-hazard-info/60 transition-all group">
              <Compass className="w-7 h-7 text-hazard-info group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">Evacuate Now</span>
              <span className="text-[10px] text-slate-500">Route Guide</span>
            </button>
          </div>

          {/* QuickSign CTA */}
          <div className="pt-2 border-t border-glass-border">
            <button
              onClick={() => setShowQuickSign(true)}
              className="w-full btn-danger flex items-center justify-center gap-2 !py-3.5"
            >
              <Zap className="w-4 h-4" />
              QuickSign — Emergency Signup
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-2">
              No password needed. Your temporary emergency ID grants immediate access to evacuation resources.
            </p>
          </div>

          {/* Emergency number */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <Phone className="w-3 h-3" />
            NDRF Helpline: <span className="text-white font-semibold">1078</span> •
            Ambulance: <span className="text-white font-semibold">108</span>
          </div>
        </div>
      </div>
    </div>
  );
}
