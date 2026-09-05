import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Compass, ArrowUp } from 'lucide-react';

export default function Footer({ onReplayIntro }) {
  const handleSaveScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop || (window.__lenis ? window.__lenis.scroll : 0);
    sessionStorage.setItem('landing_scroll_pos', Math.round(scrollY).toString());
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.4 });
    }
  };

  return (
    <footer id="footer" className="relative w-full py-10 sm:py-14 bg-[#F6F4F0]/80 text-[#2C2A29] scroll-mt-10 overflow-hidden" role="contentinfo">
      
      {/* ─── COOL HIGH-TECH STARTING DIVIDER LINE AT THE VERY TOP OF FOOTER ─── */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden select-none pointer-events-none">
        {/* Subtle baseline track fading out on both edges */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#E8E1D5] to-transparent"></div>
        
        {/* Soft Ambient Gold Glow beneath the line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#8B7355]/20 to-transparent blur-[1px]"></div>
        
        {/* Continuous Dynamic Laser Pulse sweeping smoothly across the top starting edge */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-center">
          <div className="w-64 sm:w-96 h-[2px] bg-gradient-to-r from-transparent via-[#8B7355] to-transparent blur-[0.5px] footer-telemetry-beam"></div>
        </div>

        {/* Elegant Central Diamond Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rotate-45 border border-[#8B7355]/40 bg-[#FDFBF7] shadow-xs"></div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7 relative z-10">
        
        {/* Row 1: Brand, Navigation Links, System Status & Interactive Radar Beacon */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
          
          {/* Left Column: Brand Emblem & Title (Clean, No background box) */}
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <img 
                src="/favicon.webp" 
                alt="SurakshaDrishti Emblem" 
                className="w-full h-full object-contain"
              />
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

          {/* Right Column: Live System Status & Interactive Back-To-Top Radar Beacon */}
          <div className="flex items-center justify-center md:justify-end gap-3 text-xs text-[#5C544D]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-[#E8E1D5] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#2D7A4F] animate-pulse"></span>
              <span className="text-[#4A4238] font-bold font-mono text-[10px] sm:text-[11px] tracking-wider">
                SYSTEM ACTIVE • WGS84
              </span>
            </div>

            {/* Floating Quick Back-To-Top Radar Beacon Button */}
            <button
              type="button"
              onClick={handleScrollToTop}
              className="group relative p-2 rounded-full bg-white hover:bg-[#2C2A29] border border-[#E8E1D5] hover:border-[#2C2A29] text-[#5C544D] hover:text-[#FDFBF7] transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center"
              title="Return to Peak Position"
              aria-label="Back to top"
            >
              {/* Subtle radar sweep ring on hover */}
              <div className="w-4 h-4 relative flex items-center justify-center">
                <Compass className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180 group-hover:opacity-0 absolute" />
                <ArrowUp className="w-4 h-4 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-translate-y-0.5 absolute text-[#8B7355]" />
              </div>
            </button>
          </div>

        </div>

        {/* Sleek Minimalist Geometric Divider Line (Clean, No Text) */}
        <div className="relative w-full py-2 overflow-hidden select-none">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#E8E1D5] to-transparent"></div>
          {/* Subtle center geometric diamond pip */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-1.5 h-1.5 rotate-45 bg-[#8B7355]/50"></div>
          </div>
        </div>

        {/* Row 2: Monumental Typography "SURAKSHADRISHTI" - Stable Letters with Smooth Theme Color Reveal on Hover */}
        <div className="pt-2 pb-4 text-center select-none overflow-hidden">
          <p className="text-[10px] font-mono tracking-[0.35em] text-[#8C847A] uppercase mb-5 opacity-75">
            National Red Zone Defense Matrix
          </p>

          <div className="flex flex-nowrap justify-between items-center w-full max-w-6xl mx-auto px-2 font-serif">
            {"SURAKSHADRISHTI".split("").map((letter, i) => (
              <span
                key={i}
                className="letter-interactive inline-block text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black select-none shrink-0 cursor-default hover:text-[#8B7355]"
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
