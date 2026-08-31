import React from 'react';

export default function Footer() {
  return (
    <footer className="relative border-t border-glass-border py-8 sm:py-10 bg-navy-950" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/favicon.webp" alt="SurakshaDrishti Logo" className="w-7 h-7 object-contain" />
            <div>
              <span className="font-cambria text-sm font-bold text-slate-200">SurakshaDrishti</span>
              <span className="font-cambria text-xs text-cyan-400 ml-2 font-semibold">Disaster Decision Platform</span>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 leading-relaxed font-cambria">
            Smart India Hackathon 2026 • Problem Statement 26191
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> • </span>
            Ministry of Home Affairs & NDRF DM Division
          </div>

          <div className="font-cambria text-xs text-slate-400">
            WCAG AA Compliant • Reduced Motion Support
          </div>
        </div>
      </div>
    </footer>
  );
}
