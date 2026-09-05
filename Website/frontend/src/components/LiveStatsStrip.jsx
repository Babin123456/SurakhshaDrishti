import React from 'react';
import {
  AlertTriangle,
  MapPin,
  Users,
  Home,
  Bell,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { useCountUp } from '../utils/useCountUp';
import { useScrollReveal } from '../utils/useScrollReveal';
import Interactive3DCard from './Interactive3DCard';

function StatCard({ icon: Icon, image, label, value, color, borderColor, glowColor }) {
  const [ref, count] = useCountUp(value, 1500);

  return (
    <Interactive3DCard intensity={6} className="h-full">
      <div
        ref={ref}
        className={`stat-card bg-white/70 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border ${borderColor} group cursor-default relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg h-full flex flex-col justify-between`}
        style={{ '--glow': glowColor }}
      >
        <div className="flex items-center gap-3 relative z-10">
          {image ? (
            <div className="w-11 h-11 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
              <img src={image} alt={label} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className={`p-2.5 rounded-xl ${color} bg-white shrink-0 group-hover:scale-110 transition-transform border border-[#E8E1D5]`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
          )}
          
          <div>
            <div className={`font-sans text-2xl sm:text-3xl font-black tabular-nums tracking-tight ${color}`}>
              {count.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#5C544D] font-semibold mt-0.5 leading-tight">{label}</div>
          </div>
        </div>
      </div>
    </Interactive3DCard>
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
      color: 'text-[#B85C38]',
      borderColor: 'border-[#FADED4] hover:border-[#B85C38]/50',
      glowColor: 'rgba(184, 92, 56, 0.15)',
    },
    {
      icon: MapPin,
      image: '/stat_high_risk_radar.webp',
      label: 'Vulnerable Habitations',
      value: 1420,
      color: 'text-[#C05621]',
      borderColor: 'border-[#FEEBC8] hover:border-[#C05621]/50',
      glowColor: 'rgba(192, 86, 33, 0.15)',
    },
    {
      icon: Users,
      image: '/stat_shelter_bunker.webp',
      label: 'Shelter Capacity',
      value: 8500,
      color: 'text-[#2D7A4F]',
      borderColor: 'border-[#D4EDDA] hover:border-[#2D7A4F]/50',
      glowColor: 'rgba(45, 122, 79, 0.15)',
    },
    {
      icon: Home,
      image: '/stat_biometric_shield.webp',
      label: 'Verified Relocations',
      value: 320,
      color: 'text-[#4A4238]',
      borderColor: 'border-[#E8E1D5] hover:border-[#4A4238]/50',
      glowColor: 'rgba(74, 66, 56, 0.15)',
    },
    {
      icon: Bell,
      image: '/stat_critical_bell.webp',
      label: 'Broadcast Alerts',
      value: 28,
      color: 'text-[#B85C38]',
      borderColor: 'border-[#FADED4] hover:border-[#B85C38]/50',
      glowColor: 'rgba(184, 92, 56, 0.20)',
    },
  ];

  return (
    <section
      className="relative py-8 sm:py-12 bg-transparent"
      aria-label="Live intelligence statistics"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Minimal Pill */}
        <div
          ref={ref}
          className={`flex items-center justify-center mb-7 reveal ${revealed ? 'revealed' : ''}`}
        >
          <div className="group relative inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/80 border border-[#E8E1D5] hover:border-[#8B7355]/40 transition-all duration-300 cursor-default shadow-xs backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B85C38] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B85C38]"></span>
            </span>

            <span className="text-xs text-[#2C2A29] font-bold tracking-wide">
              Live Geospatial Telemetry Feed
            </span>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F6F4F0] text-[#4A4238] border border-[#E8E1D5] font-bold">
              ISRO / IMD SYNC
            </span>
          </div>
        </div>

        {/* 5 KPI Stat Cards Grid with 3D Tilt & Staggered Scroll Parallax Reveal */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 reveal ${revealed ? 'revealed' : ''}`}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{ transitionDelay: `${idx * 80}ms` }} className="h-full">
              <StatCard {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
