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

          {/* Center Column: Privacy, Terms, FAQs, Documentation (Clean Simple Links) */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 text-xs font-medium text-[#5C544D] whitespace-nowrap overflow-x-auto">
            <Link
              to="/privacy"
              onClick={() => {
                handleSaveScroll();
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
              }}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer shrink-0"
            >
              Privacy Policy
            </Link>
            <span className="text-[#D9D0C1] select-none">•</span>
            <Link
              to="/terms"
              onClick={() => {
                handleSaveScroll();
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
              }}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer shrink-0"
            >
              Terms of Service
            </Link>
            <span className="text-[#D9D0C1] select-none">•</span>
            <Link
              to="/faqs"
              onClick={() => {
                handleSaveScroll();
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
              }}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer shrink-0"
            >
              FAQs
            </Link>
            <span className="text-[#D9D0C1] select-none">•</span>
            <Link
              to="/documentation"
              onClick={() => {
                handleSaveScroll();
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
              }}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer shrink-0"
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

        {/* Row 2: Cinematic Monumental Typography "SURAKSHADRISHTI" - Guaranteed Single Line, Glass-Type with Wave Shimmer */}
        <div className="border-t border-[#E8E1D5]/80 pt-10 pb-4 text-center select-none overflow-hidden">
          <p className="text-[10px] font-mono tracking-[0.35em] text-[#8C847A] uppercase mb-5 opacity-75">
            National Red Zone Defense Matrix
          </p>

          <div className="flex flex-nowrap justify-between items-center w-full max-w-6xl mx-auto px-2 font-serif">
            {"SURAKSHADRISHTI".split("").map((letter, i) => (
              <span
                key={i}
                className="letter-wave-glow inline-block text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black select-none shrink-0"
                style={{
                  animationDelay: `${(i * 0.24).toFixed(2)}s`,
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* Row 3: Attributive Banner (Fully Mobile Responsive) */}
        <div className="border-t border-[#E8E1D5]/60 pt-6 flex justify-center items-center w-full px-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-center px-4 sm:px-6 py-2.5 sm:py-2 rounded-2xl sm:rounded-full bg-white/75 border border-[#E8E1D5] shadow-xs w-full sm:w-auto max-w-md sm:max-w-none">
            <span className="text-[11px] sm:text-xs font-semibold text-[#5C544D]">
              Smart India Hackathon 2026
            </span>
            <span className="hidden sm:inline text-[#D9D0C1] font-bold">•</span>
            <span className="text-[11px] sm:text-xs font-semibold text-[#8B7355]">
              Ministry of Home Affairs & NDRF DM Division
            </span>
            <span className="hidden sm:inline text-[#D9D0C1] font-bold">•</span>
            <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#B85C38] bg-[#FFF5F2] px-2.5 py-0.5 rounded-full border border-[#FADED4]">
              Problem Statement 26191
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
