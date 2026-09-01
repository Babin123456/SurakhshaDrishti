import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const handleSaveScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop || (window.__lenis ? window.__lenis.scroll : 0);
    sessionStorage.setItem('landing_scroll_pos', Math.round(scrollY).toString());
  };

  return (
    <footer id="footer" className="w-full border-t border-slate-800/80 py-8 sm:py-10 bg-slate-950 text-slate-100 scroll-mt-10" role="contentinfo">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Row 1: Brand (Left), Navigation Links (Center), Status (Right) with true 3-column equal grid alignment */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
          
          {/* Left Column: Brand Logo & Title */}
          <div className="flex items-center justify-center md:justify-start gap-3">
            <img src="/favicon.webp" alt="SurakshaDrishti Logo" className="w-7 h-7 object-contain" />
            <div>
              <span className="font-cambria text-sm font-bold text-slate-100">SurakshaDrishti</span>
              <span className="font-cambria text-xs text-cyan-400 ml-2 font-semibold">Disaster Decision Support</span>
            </div>
          </div>

          {/* Center Column: Privacy, Terms, FAQs, Documentation */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-cambria font-semibold text-slate-400">
            <Link
              to="/privacy"
              onClick={handleSaveScroll}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Privacy Policy
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              to="/terms"
              onClick={handleSaveScroll}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Terms of Service
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              to="/faqs"
              onClick={handleSaveScroll}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              FAQs
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              to="/documentation"
              onClick={handleSaveScroll}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Documentation
            </Link>
          </div>

          {/* Right Column: Live System Status & WGS84 Reference */}
          <div className="flex items-center justify-center md:justify-end gap-2 font-cambria text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-semibold font-mono text-[11px]">SYSTEM ACTIVE • WGS84</span>
          </div>

        </div>

        {/* Row 2: Perfectly Centered Attributive Pill Banner */}
        <div className="border-t border-slate-900/90 pt-5 flex justify-center items-center w-full">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center px-6 py-2 rounded-full bg-slate-900/90 border border-slate-800 shadow-md">
            <span className="font-cambria text-xs font-semibold text-slate-300">
              Smart India Hackathon 2026
            </span>
            <span className="text-slate-600 font-bold">•</span>
            <span className="font-cambria text-xs font-semibold text-cyan-400">
              Ministry of Home Affairs & NDRF DM Division
            </span>
            <span className="text-slate-600 font-bold">•</span>
            <span className="font-mono text-[11px] font-bold text-amber-400">
              Problem Statement 26191
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
