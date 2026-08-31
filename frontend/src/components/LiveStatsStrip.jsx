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

function StatCard({ icon: Icon, label, value, color, borderColor, glowColor }) {
  const [ref, count] = useCountUp(value, 1500);

  return (
    <div
      ref={ref}
      className={`stat-card glass-card rounded-xl p-4 sm:p-5 border ${borderColor} group cursor-default`}
      style={{ '--glow': glowColor }}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div>
          <div className={`font-cambria text-2xl sm:text-3xl font-black tabular-nums tracking-tight ${color}`}>
            {count.toLocaleString()}
          </div>
          <div className="font-cambria text-xs text-slate-400 font-semibold mt-0.5">{label}</div>
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
      label: 'Active Red Zones',
      value: 14,
      color: 'text-hazard-critical',
      borderColor: 'border-hazard-critical/20 hover:border-hazard-critical/40',
      glowColor: 'rgba(229, 62, 62, 0.15)',
    },
    {
      icon: MapPin,
      label: 'High-Risk Areas',
      value: 23,
      color: 'text-hazard-high',
      borderColor: 'border-hazard-high/20 hover:border-hazard-high/40',
      glowColor: 'rgba(245, 158, 11, 0.12)',
    },
    {
      icon: Users,
      label: 'People at Risk',
      value: 28450,
      color: 'text-white',
      borderColor: 'border-slate-700/50 hover:border-slate-600',
      glowColor: 'rgba(255, 255, 255, 0.05)',
    },
    {
      icon: Home,
      label: 'Shelter Capacity',
      value: 12800,
      color: 'text-hazard-safe',
      borderColor: 'border-hazard-safe/20 hover:border-hazard-safe/40',
      glowColor: 'rgba(56, 161, 105, 0.12)',
    },
    {
      icon: Bell,
      label: 'Active Alerts',
      value: 7,
      color: 'text-hazard-critical',
      borderColor: 'border-hazard-critical/20 hover:border-hazard-critical/40',
      glowColor: 'rgba(229, 62, 62, 0.12)',
    },
  ];

  return (
    <section
      className="relative py-8 sm:py-12"
      aria-label="Live intelligence statistics"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`flex items-center gap-2 mb-6 reveal ${revealed ? 'revealed' : ''}`}
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
          <span className="font-cambria text-sm text-cyan-400 font-bold tracking-wide px-3">
            Live Geospatial Intelligence Feed • SIH 26191
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
