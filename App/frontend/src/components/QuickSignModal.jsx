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

export default function QuickSignModal({ locationStatus, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    familyCount: '1',
    specialNeeds: [],
    zoneId: HAZARD_ZONES[0].id,
  });

  const [isLocating, setIsLocating] = useState(false);
  const [detectedLoc, setDetectedLoc] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (locationStatus?.coords) {
      setDetectedLoc(locationStatus.coords);
    }
  }, [locationStatus]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectedLoc({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        });
        setIsLocating(false);
      },
      () => {
        setDetectedLoc({ lat: 11.5583, lng: 76.1384, accuracy: 25 });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
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
        className="fixed inset-0 z-[100] bg-[#2C2A29]/65 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto font-sans"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full max-w-md bg-white border border-[#E8E1D5] rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 text-center space-y-4 animate-scale-in text-[#2C2A29] shadow-2xl overflow-y-auto max-h-[85vh]">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#EBF7EE] border border-[#2D7A4F]/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#2D7A4F]" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-0.5">Emergency Pass Verified</h3>
            <div className="inline-block px-4 py-2 rounded-xl bg-[#F6F4F0] border border-[#E8E1D5] text-2xl font-mono font-bold text-[#B85C38] mt-2 shadow-xs">
              {result.emergencyId}
            </div>
          </div>

          <div className="space-y-2 text-left text-xs">
            <div className="p-3 rounded-xl bg-[#F6F4F0] border border-[#E8E1D5] flex items-center justify-between">
              <span className="text-[#5C544D]">Assigned Shelter:</span>
              <span className="text-[#1A1A1A] font-bold">{result.assignedShelter}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F6F4F0] border border-[#E8E1D5] flex items-center justify-between">
              <span className="text-[#5C544D]">Shelter Capacity:</span>
              <span className="text-[#2D7A4F] font-bold">{result.shelterCapacity}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F6F4F0] border border-[#E8E1D5] flex items-center justify-between">
              <span className="text-[#5C544D]">Evacuation Route:</span>
              <span className="text-[#2E5B88] font-bold">{result.evacuationRoute}</span>
            </div>
          </div>

          <p className="text-[11px] text-[#7A726A]">
            Save your Emergency ID or keep this screen open. This pass will be validated upon arrival at the relief hub.
          </p>

          <button
            onClick={() => onSuccess?.({
              success: true,
              isGuestAccount: true,
              guestId: result.emergencyId,
              status: 'QUICKSIGN_EMERGENCY',
            })}
            className="w-full py-3.5 rounded-xl bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] font-medium text-xs tracking-wide shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
          >
            Access Emergency Command Dashboard
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
      className="fixed inset-0 z-[100] bg-[#2C2A29]/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans"
      role="dialog"
      aria-modal="true"
      aria-label="Emergency quick registration"
    >
      <div className="w-full max-w-md my-auto animate-scale-in max-h-[90vh] flex flex-col justify-center">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 rounded-t-2xl sm:rounded-t-3xl bg-[#FFF5F2] border border-[#FADED4] border-b-0 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#B85C38]/15 text-[#B85C38]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-[#B85C38] uppercase">
                30-Second Priority Pass
              </div>
              <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                QuickSign Emergency Pass
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white border border-[#E8E1D5] hover:bg-[#F6F4F0] text-[#5C544D] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E8E1D5] border-t-0 rounded-b-2xl sm:rounded-b-3xl p-5 sm:p-7 space-y-4 shadow-2xl overflow-y-auto max-h-[85vh] sm:max-h-[80vh]"
        >
          {/* Target Zone Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#2C2A29] mb-1">
              Active Hazard Zone
            </label>
            <select
              value={formData.zoneId}
              onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
              className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl py-2 px-3 text-xs sm:text-sm text-[#1A1A1A] focus:outline-none focus:border-[#8B7355]"
            >
              {HAZARD_ZONES.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name & Phone */}
          <div>
            <label className="block text-xs font-semibold text-[#2C2A29] mb-1">Full Name</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-3.5 top-3 text-[#7A726A]" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Head of Household Name"
                className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl py-2.5 pl-9 pr-3 text-xs sm:text-sm text-[#1A1A1A] placeholder-[#8C847A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C2A29] mb-1">Mobile Contact</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-3.5 top-3 text-[#7A726A]" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl py-2.5 pl-9 pr-3 text-xs sm:text-sm text-[#1A1A1A] placeholder-[#8C847A] focus:outline-none focus:border-[#8B7355]"
              />
            </div>
          </div>

          {/* Family Count & GPS */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-[#2C2A29] mb-1">Total Family</label>
              <div className="relative">
                <Users className="w-3.5 h-3.5 absolute left-3.5 top-3 text-[#7A726A]" />
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={formData.familyCount}
                  onChange={(e) => setFormData({ ...formData, familyCount: e.target.value })}
                  className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl py-2.5 pl-9 pr-3 text-xs sm:text-sm text-[#1A1A1A] focus:outline-none focus:border-[#8B7355]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C2A29] mb-1">GPS Location</label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="w-full py-2.5 px-2 rounded-xl bg-[#F6F4F0] hover:bg-[#E8E1D5] border border-[#E8E1D5] text-xs font-semibold text-[#4A4238] flex items-center justify-center gap-1.5 transition-colors cursor-pointer truncate"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Locating...</span>
                  </>
                ) : (
                  <>
                    <Crosshair className="w-3 h-3 text-[#8B7355]" />
                    <span className="truncate">
                      {detectedLoc ? `${detectedLoc.lat?.toFixed(3)}°N` : 'Acquire GPS'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-xs font-semibold text-[#2C2A29] mb-1.5">
              Special Assistance Needs
            </label>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['Wheelchair Required', 'Infant Care', 'Medical Oxygen', 'Stretcher / Critical'].map((need) => (
                <button
                  key={need}
                  type="button"
                  onClick={() => toggleSpecialNeed(need)}
                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                    formData.specialNeeds.includes(need)
                      ? 'bg-[#B85C38] text-white border-[#B85C38] shadow-xs'
                      : 'bg-[#F6F4F0] text-[#5C544D] border-[#E8E1D5] hover:bg-[#E8E1D5]'
                  }`}
                >
                  {need}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] font-medium text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5"
          >
            {isSubmitting ? 'Generating Emergency Pass...' : 'Issue Emergency Relocation Pass'}
          </button>
        </form>

      </div>
    </div>
  );
}
