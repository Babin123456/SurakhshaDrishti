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
} from 'lucide-react';
import { apiService } from '../utils/api';

export default function QuickSignModal({ locationStatus, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    peopleCount: '1',
    specialNeeds: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const specialNeedOptions = [
    { id: 'elderly', label: 'Elderly (60+)' },
    { id: 'disabled', label: 'Disabled' },
    { id: 'infant', label: 'Infant/Child' },
    { id: 'medical', label: 'Medical Need' },
    { id: 'pregnant', label: 'Pregnant' },
  ];

  const toggleSpecialNeed = (id) => {
    setFormData((prev) => ({
      ...prev,
      specialNeeds: prev.specialNeeds.includes(id)
        ? prev.specialNeeds.filter((n) => n !== id)
        : [...prev.specialNeeds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await apiService.quickSign({
      ...formData,
      location: locationStatus,
      timestamp: new Date().toISOString(),
    });

    setIsSubmitting(false);
    if (res.success) {
      setResult(res);
    }
  };

  // Success state
  if (result) {
    return (
      <div
        className="fixed inset-0 z-[100] bg-navy-950/95 backdrop-blur-sm flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Emergency registration success"
      >
        <div className="w-full max-w-md animate-scale-in glass-card rounded-2xl p-8 text-center space-y-5 border border-hazard-safe/30">
          <div className="mx-auto w-16 h-16 rounded-full bg-hazard-safe/15 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-hazard-safe" />
          </div>

          <div>
            <h3 className="text-xl font-black text-white mb-1">Emergency ID Created</h3>
            <div className="inline-block px-4 py-2 rounded-lg bg-hazard-safe/10 border border-hazard-safe/30 text-2xl font-mono font-black text-hazard-safe mt-2">
              {result.emergencyId}
            </div>
          </div>

          <div className="space-y-2 text-left text-xs">
            <div className="p-3 rounded-lg bg-white/5 border border-glass-border">
              <span className="text-slate-400">Assigned Shelter:</span>
              <span className="text-white font-semibold ml-2">{result.assignedShelter}</span>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-glass-border">
              <span className="text-slate-400">Shelter Capacity:</span>
              <span className="text-hazard-safe font-semibold ml-2">{result.shelterCapacity}</span>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-glass-border">
              <span className="text-slate-400">Evacuation Route:</span>
              <span className="text-hazard-info font-semibold ml-2">{result.evacuationRoute}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Save your Emergency ID. This temporary account will be merged with a permanent profile after the crisis.
          </p>

          <button
            onClick={() => onSuccess?.({
              success: true,
              isGuestAccount: true,
              guestId: result.emergencyId,
              status: 'QUICKSIGN_EMERGENCY',
            })}
            className="w-full btn-primary"
          >
            Access Emergency Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Registration form
  return (
    <div
      className="fixed inset-0 z-[100] bg-navy-950/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Emergency quick registration"
    >
      <div className="w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 rounded-t-2xl bg-hazard-high/10 border border-hazard-high/25 border-b-0">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-hazard-high" />
            <span className="text-sm font-bold text-white">QuickSign — Emergency Registration</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close registration"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="glass-card rounded-b-2xl rounded-t-none p-6 space-y-4 border border-glass-border border-t-0"
        >
          {/* Location auto-detected */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-hazard-info/8 border border-hazard-info/20 text-xs">
            <MapPin className="w-3.5 h-3.5 text-hazard-info shrink-0" />
            <span className="text-slate-300">
              <span className="text-white font-semibold">{locationStatus?.name || 'Detecting...'}</span>
              {locationStatus?.coords && (
                <span className="text-slate-500 font-mono ml-1">
                  ({locationStatus.coords.lat.toFixed(4)}°, {locationStatus.coords.lng.toFixed(4)}°)
                </span>
              )}
            </span>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Name <span className="text-hazard-critical">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                className="w-full bg-navy-800/80 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-hazard-info focus:ring-1 focus:ring-hazard-info/50 transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Mobile Number <span className="text-hazard-critical">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-navy-800/80 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-hazard-info focus:ring-1 focus:ring-hazard-info/50 transition-all"
              />
            </div>
          </div>

          {/* People Count */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              <Users className="w-3.5 h-3.5 inline mr-1" /> Number of People
            </label>
            <select
              value={formData.peopleCount}
              onChange={(e) => setFormData({ ...formData, peopleCount: e.target.value })}
              className="w-full bg-navy-800/80 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-hazard-info focus:ring-1 focus:ring-hazard-info/50 transition-all"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '10+'].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
              ))}
            </select>
          </div>

          {/* Special Needs */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              <Heart className="w-3.5 h-3.5 inline mr-1" /> Special Needs (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {specialNeedOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleSpecialNeed(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    formData.specialNeeds.includes(opt.id)
                      ? 'bg-hazard-high/15 border-hazard-high/40 text-hazard-high'
                      : 'bg-white/5 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-danger flex items-center justify-center gap-2 !py-3.5 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Emergency ID...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate Emergency ID
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-500">
            No password or email required. Your temporary profile will be securely migrated post-crisis.
          </p>
        </form>
      </div>
    </div>
  );
}
