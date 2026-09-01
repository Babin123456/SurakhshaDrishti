import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Zap,
  CheckCircle2,
  User,
  Phone,
  Users,
  Heart,
  Loader2,
  Crosshair,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { apiService } from '../utils/api';

const HAZARD_ZONES = [
  {
    id: 'wayanad',
    name: 'Wayanad Sector 4 (Chooralmala - Meppadi)',
    shortName: 'Wayanad Sector 4',
    lat: 11.5583,
    lng: 76.1384,
    hazard: 'High Slope Landslide & Debris Flow',
    type: 'red',
    radiusMeters: 4000
  },
  {
    id: 'joshimath',
    name: 'Joshimath Main Ridge (Sunil & Marwari)',
    shortName: 'Joshimath Ridge',
    lat: 30.5564,
    lng: 79.5664,
    hazard: 'Tectonic Subsidence & Slope Collapse',
    type: 'red',
    radiusMeters: 3200
  },
  {
    id: 'teesta',
    name: 'Teesta River Basin (Singtam & Rangpo)',
    shortName: 'Teesta River Basin',
    lat: 27.5029,
    lng: 88.5309,
    hazard: 'GLOF Moraine Breach & Flash Flood',
    type: 'orange',
    radiusMeters: 4500
  },
  {
    id: 'puri',
    name: 'Puri Coastal Lowland Shore',
    shortName: 'Puri Coastal Sector',
    lat: 19.8135,
    lng: 85.8312,
    hazard: 'Storm Surge & Coastal Inundation',
    type: 'orange',
    radiusMeters: 5000
  }
];

function getHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function QuickSignModal({ locationStatus, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    peopleCount: '1',
    specialNeeds: [],
  });
  
  const [detectedLoc, setDetectedLoc] = useState(locationStatus || null);
  const [isGpsLocating, setIsGpsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!locationStatus && navigator.geolocation) {
      setIsGpsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          let minDistance = Infinity;
          let nearest = HAZARD_ZONES[0];

          HAZARD_ZONES.forEach((zone) => {
            const dist = getHaversineDistanceKm(latitude, longitude, zone.lat, zone.lng);
            if (dist < minDistance) {
              minDistance = dist;
              nearest = zone;
            }
          });

          const isInside = minDistance * 1000 <= nearest.radiusMeters;
          const status = {
            coords: { lat: latitude, lng: longitude },
            accuracy: Math.round(accuracy),
            inRedZone: isInside,
            name: nearest.name,
            shortName: nearest.shortName,
            hazard: nearest.hazard,
            zoneId: nearest.id,
            distanceKm: minDistance.toFixed(1),
            isAutoDetected: true
          };

          setDetectedLoc(status);
          setIsGpsLocating(false);
        },
        () => {
          setDetectedLoc({
            coords: { lat: 11.5583, lng: 76.1384 },
            accuracy: 50,
            inRedZone: true,
            name: 'Wayanad Sector 4 (Chooralmala - Meppadi)',
            shortName: 'Wayanad Sector 4',
            hazard: 'High Slope Landslide & Debris Flow',
            zoneId: 'wayanad',
            distanceKm: '0.0',
            isAutoDetected: false
          });
          setIsGpsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else if (locationStatus) {
      setDetectedLoc(locationStatus);
    }
  }, [locationStatus]);

  const handleManualZoneSelect = (zoneId) => {
    const found = HAZARD_ZONES.find((z) => z.id === zoneId);
    if (found) {
      setDetectedLoc({
        coords: { lat: found.lat, lng: found.lng },
        accuracy: 10,
        inRedZone: true,
        name: found.name,
        shortName: found.shortName,
        hazard: found.hazard,
        zoneId: found.id,
        distanceKm: '0.0',
        isAutoDetected: false
      });
    }
  };

  const handleRefreshGPS = () => {
    if (!navigator.geolocation) return;
    setIsGpsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        let minDistance = Infinity;
        let nearest = HAZARD_ZONES[0];

        HAZARD_ZONES.forEach((zone) => {
          const dist = getHaversineDistanceKm(latitude, longitude, zone.lat, zone.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = zone;
          }
        });

        const isInside = minDistance * 1000 <= nearest.radiusMeters;
        setDetectedLoc({
          coords: { lat: latitude, lng: longitude },
          accuracy: Math.round(accuracy),
          inRedZone: isInside,
          name: nearest.name,
          shortName: nearest.shortName,
          hazard: nearest.hazard,
          zoneId: nearest.id,
          distanceKm: minDistance.toFixed(1),
          isAutoDetected: true
        });
        setIsGpsLocating(false);
      },
      () => {
        setIsGpsLocating(false);
      }
    );
  };

  const toggleSpecialNeed = (need) => {
    setFormData((prev) => ({
      ...prev,
      specialNeeds: prev.specialNeeds.includes(need)
        ? prev.specialNeeds.filter((n) => n !== need)
        : [...prev.specialNeeds, need],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await apiService.quickSign({
      ...formData,
      location: detectedLoc || locationStatus,
      timestamp: new Date().toISOString(),
    });

    setIsSubmitting(false);
    if (res.success) {
      setResult(res);
    }
  };

  if (result) {
    return (
      <div
        className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto font-sans"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 text-center space-y-3.5 sm:space-y-4 animate-scale-in text-white shadow-2xl overflow-y-auto max-h-[85vh]">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-black text-white mb-0.5">Emergency ID Created</h3>
            <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xl sm:text-2xl font-mono font-black text-emerald-400 mt-1.5 shadow-inner">
              {result.emergencyId}
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2 text-left text-xs font-cambria">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Assigned Shelter:</span>
              <span className="text-white font-semibold">{result.assignedShelter}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Shelter Capacity:</span>
              <span className="text-emerald-400 font-semibold">{result.shelterCapacity}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Evacuation Route:</span>
              <span className="text-cyan-400 font-semibold">{result.evacuationRoute}</span>
            </div>
          </div>

          <p className="text-[10px] sm:text-[11px] text-slate-500">
            Save your Emergency ID. This temporary pass will be validated upon arrival at the relief hub.
          </p>

          <button
            onClick={() => onSuccess?.({
              success: true,
              isGuestAccount: true,
              guestId: result.emergencyId,
              status: 'QUICKSIGN_EMERGENCY',
            })}
            className="w-full py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-md transition-all btn-bottom-glow-blue cursor-pointer"
          >
            Access Emergency Dashboard
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();

    return () => {
      document.body.style.overflow = originalOverflow;
      if (window.__lenis) window.__lenis.start();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans"
      role="dialog"
      aria-modal="true"
      aria-label="Emergency quick registration"
    >
      <div className="w-full max-w-md my-auto animate-scale-in max-h-[90vh] flex flex-col justify-center">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-t-2xl sm:rounded-t-3xl bg-amber-500/15 border border-amber-500/30 border-b-0 shrink-0">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-bold text-white">QuickSign — 30-Sec Emergency Pass</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-slate-400 hover:text-white"
            aria-label="Close registration"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 rounded-b-none sm:rounded-b-3xl rounded-t-none p-4 sm:p-6 space-y-3 sm:space-y-4 border border-slate-800 border-t-0 shadow-2xl overflow-y-auto max-h-[85vh] sm:max-h-[80vh]"
        >
          {/* Real-time Location Indicator */}
          <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            {isGpsLocating ? (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 animate-spin shrink-0" />
            ) : (
              <Crosshair className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>{isGpsLocating ? 'Detecting GPS...' : 'Location Locked'}</span>
                <button
                  type="button"
                  onClick={handleRefreshGPS}
                  className="text-[9px] text-cyan-400 hover:underline cursor-pointer"
                >
                  Refresh
                </button>
              </div>
              <div className="text-[11px] sm:text-xs text-white font-bold truncate">
                {detectedLoc?.name || 'Acquiring Nearest Sector...'}
              </div>
            </div>
          </div>

          {/* Sector Fallback Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Select/Verify Your Sector:
            </label>
            <select
              value={detectedLoc?.zoneId || 'wayanad'}
              onChange={(e) => handleManualZoneSelect(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 sm:py-2 text-xs text-white outline-none cursor-pointer hover:border-cyan-500 transition-colors"
            >
              {HAZARD_ZONES.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.shortName} ({zone.hazard})
                </option>
              ))}
            </select>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Resident Name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* People count */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Total Family Members with you
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {['1', '2', '3', '4', '5+'].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setFormData({ ...formData, peopleCount: count })}
                  className={`py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    formData.peopleCount === count
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm font-black'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Special needs */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
              Special Assistance Required (Prioritized Evac)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'elderly', label: 'Elderly / Senior' },
                { key: 'infant', label: 'Infant / Child' },
                { key: 'medical', label: 'Medical / Oxygen' },
                { key: 'mobility', label: 'Wheelchair / Injured' },
              ].map((need) => (
                <button
                  key={need.key}
                  type="button"
                  onClick={() => toggleSpecialNeed(need.key)}
                  className={`p-2 rounded-xl border text-[11px] font-medium transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                    formData.specialNeeds.includes(need.key)
                      ? 'bg-red-950/80 border-red-500 text-red-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 shrink-0 ${formData.specialNeeds.includes(need.key) ? 'text-red-400 fill-red-400' : 'text-slate-500'}`} />
                  <span className="truncate">{need.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Allocating Shelter & Encrypting Pass...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Generate Instant Emergency Pass</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
