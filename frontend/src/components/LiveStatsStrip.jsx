import React from 'react';
import {
  AlertTriangle,
  MapPin,
  Users,
  Home,
  Bell,
} from 'lucide-react';
import { useCountUp } from '../utils/useCountUp';
import { useScrollReveal } from '../utils/useScrollReveal';

function StatCard({ icon: Icon, image, label, value, color, borderColor, glowColor }) {
  const [ref, count] = useCountUp(value, 1500);

  return (
    <div
      ref={ref}
      className={`stat-card glass-card rounded-2xl p-4 sm:p-5 border ${borderColor} group cursor-default relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl`}
      style={{ '--glow': glowColor }}
    >
      {/* Subtle bottom edge gradient glow line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex items-center gap-3 relative z-10">
        {image ? (
          <div className="w-12 h-12 flex items-center justify-center shrink-0 group-hover:scale-115 transition-transform duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            <img src={image} alt={label} className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 shrink-0 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        )}
        
        <div>
          <div className={`font-cambria text-2xl sm:text-3xl font-black tabular-nums tracking-tight ${color}`}>
            {count.toLocaleString()}
          </div>
          <div className="font-cambria text-xs text-slate-400 font-semibold mt-0.5 leading-tight">{label}</div>
        </div>
      </div>
    </div>
  );
}

export default function LiveStatsStrip() {
  const [ref, revealed] = useScrollReveal({ threshold: 0.2 });

  const stats = [
    {
      icon: AlertTriangle,
      image: '/stat_hazard_gauge.webp',
      label: 'Active Red Zones',
      value: 14,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/20 hover:border-amber-500/50',
      glowColor: 'rgba(245, 158, 11, 0.25)',
    },
    {
      icon: MapPin,
      image: '/stat_high_risk_radar.webp',
      label: 'High-Risk Areas',
      value: 23,
      color: 'text-orange-400',
      borderColor: 'border-orange-500/20 hover:border-orange-500/50',
      glowColor: 'rgba(251, 146, 60, 0.20)',
    },
    {
      icon: Users,
      image: '/stat_biometric_shield.webp',
      label: 'People at Risk (Protected)',
      value: 28450,
      color: 'text-white',
      borderColor: 'border-slate-700/50 hover:border-cyan-500/40',
      glowColor: 'rgba(6, 182, 212, 0.20)',
    },
    {
      icon: Home,
      image: '/stat_shelter_bunker.webp',
      label: 'Shelter Capacity',
      value: 12800,
      color: 'text-hazard-safe',
      borderColor: 'border-hazard-safe/20 hover:border-hazard-safe/40',
      glowColor: 'rgba(56, 161, 105, 0.20)',
    },
    {
      icon: Bell,
      image: '/stat_critical_bell.webp',
      label: 'Active Alerts',
      value: 7,
      color: 'text-red-500',
      borderColor: 'border-red-500/20 hover:border-red-500/50',
      glowColor: 'rgba(239, 68, 68, 0.25)',
    },
  ];

  return (
    <section
      className="relative py-8 sm:py-12"
      aria-label="Live intelligence statistics"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Pill with Lower Edge Gradient Shadow on Hover */}
        <div
          ref={ref}
          className={`flex items-center justify-center mb-8 reveal ${revealed ? 'revealed' : ''}`}
        >
          <div className="group relative inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 cursor-default hover:-translate-y-0.5 shadow-md hover:shadow-[0_12px_25px_-5px_rgba(6,182,212,0.35)]">
            
            {/* Pulsing Live Dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>

            {/* Header Text */}
            <span className="font-cambria text-xs sm:text-sm text-cyan-300 font-bold tracking-wide group-hover:text-cyan-200 transition-colors">
              Live Geospatial Intelligence Feed • SIH 26191
            </span>

            {/* Verified Indicator */}
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-emerald-400 border border-emerald-500/30 font-bold">
              ISRO / IMD SYNCHRONIZED
            </span>

            {/* Glowing bottom edge line effect */}
            <div className="absolute -bottom-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* 5 KPI Stat Cards Grid with Lower Edge Hover Glow Shadows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
