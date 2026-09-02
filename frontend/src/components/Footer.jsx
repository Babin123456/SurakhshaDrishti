import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Footer({ onReplayIntro }) {
  const handleSaveScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop || (window.__lenis ? window.__lenis.scroll : 0);
    sessionStorage.setItem('landing_scroll_pos', Math.round(scrollY).toString());
  };

  return (
    <footer id="footer" className="w-full border-t border-[#E8E1D5] py-8 sm:py-12 bg-[#F6F4F0]/80 text-[#2C2A29] scroll-mt-10" role="contentinfo">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Row 1: Brand, Navigation Links, System Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
          
          {/* Left Column: Brand Emblem & Title */}
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-1.5 rounded-lg bg-white border border-[#E8E1D5] shadow-xs">
              <Shield className="w-5 h-5 text-[#4A4238]" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#1A1A1A]">Suraksha<span className="text-[#8B7355]">Drishti</span></span>
              <span className="text-xs text-[#7A726A] ml-2 font-medium">Disaster Decision Support</span>
            </div>
          </div>

          {/* Center Column: Privacy, Terms, FAQs, Documentation */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium text-[#5C544D]">
            <Link
              to="/privacy"
              onClick={handleSaveScroll}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              Privacy Policy
            </Link>
            <span className="text-[#D9D0C1]">•</span>
            <Link
              to="/terms"
              onClick={handleSaveScroll}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              Terms of Service
            </Link>
            <span className="text-[#D9D0C1]">•</span>
            <Link
              to="/faqs"
              onClick={handleSaveScroll}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              FAQs
            </Link>
            <span className="text-[#D9D0C1]">•</span>
            <Link
              to="/documentation"
              onClick={handleSaveScroll}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              Documentation
            </Link>
          </div>

          {/* Right Column: Live System Status & Reference */}
          <div className="flex items-center justify-center md:justify-end gap-2 text-xs text-[#5C544D]">
            <span className="w-2 h-2 rounded-full bg-[#2D7A4F] animate-pulse"></span>
            <span className="text-[#4A4238] font-bold font-mono text-[11px]">SYSTEM ACTIVE • WGS84</span>
          </div>

        </div>

        {/* Row 2: Attributive Banner */}
        <div className="border-t border-[#E8E1D5]/80 pt-6 flex justify-center items-center w-full">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center px-6 py-2 rounded-full bg-white/70 border border-[#E8E1D5] shadow-xs">
            <span className="text-xs font-semibold text-[#5C544D]">
              Smart India Hackathon 2026
            </span>
            <span className="text-[#D9D0C1] font-bold">•</span>
            <span className="text-xs font-semibold text-[#8B7355]">
              Ministry of Home Affairs & NDRF DM Division
            </span>
            <span className="text-[#D9D0C1] font-bold">•</span>
            <span className="font-mono text-[11px] font-bold text-[#B85C38]">
              Problem Statement 26191
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
