import React from 'react';
import { ArrowRight, Zap, Shield, UserPlus } from 'lucide-react';
import { useScrollReveal } from '../utils/useScrollReveal';
import Interactive3DCard from './Interactive3DCard';

export default function CTASection({ onExplore, onEmergencyAccess, onSignUp, onQuickSign }) {
  const [ref, revealed] = useScrollReveal();

  return (
    <section id="cta" className="relative py-20 sm:py-28 scroll-mt-20" aria-label="Call to action">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3D Apple-Style Floating Call to Action Container */}
        <Interactive3DCard intensity={6}>
          <div
            ref={ref}
            className={`relative rounded-3xl p-8 sm:p-14 text-center bg-white/70 border border-[#E8E1D5] backdrop-blur-2xl shadow-2xl shadow-[#D9D0C1]/30 overflow-hidden reveal ${revealed ? 'revealed' : ''}`}
          >
            {/* Ambient warm glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E8E1D5]/40 rounded-full blur-3xl pointer-events-none"></div>

            {/* Floating Animated Shield Graphic (No Background) */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-5 flex items-center justify-center select-none pointer-events-none">
              <img 
                src="/shield_transparent.gif" 
                alt="Command Protocol Shield" 
                className="w-full h-full object-contain"
                style={{
                  animation: 'float 5s ease-in-out infinite',
                  filter: 'drop-shadow(0 15px 25px rgba(139, 115, 85, 0.2))'
                }}
              />
            </div>

            {/* Minimal Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6F4F0] border border-[#E8E1D5] mb-5 shadow-xs relative z-10">
              <Shield className="w-3.5 h-3.5 text-[#8B7355]" />
              <span className="text-xs text-[#4A4238] font-bold tracking-wide">
                NDRF & SDMA Rapid Command Protocol
              </span>
            </div>

            {/* High-Impact Headline */}
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-3 relative z-10 leading-[1.1]">
              <span className="gradient-text-stone">Deploy Rapid </span>
              <span className="gradient-text-gold">Safety Intelligence.</span>
            </h2>

            {/* Reduced Description */}
            <p className="text-sm text-[#5C544D] max-w-md mx-auto mb-9 leading-relaxed relative z-10 font-light">
              Real-time hazard telemetry, automated carrying capacity, and prioritized civilian relocation corridors.
            </p>

            {/* Primary Action Buttons */}
            <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
              <button
                type="button"
                onClick={onSignUp}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] font-semibold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <UserPlus className="w-4 h-4 opacity-80" />
                <span>Create Official / Resident Account</span>
              </button>

              <button
                type="button"
                onClick={onEmergencyAccess}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/80 border border-[#E8E1D5] hover:border-[#B85C38] text-[#B85C38] hover:bg-[#FFF5F2] font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:scale-[0.99] shadow-xs"
              >
                <Zap className="w-4 h-4" />
                <span>Emergency SOS</span>
              </button>
            </div>

            {/* Secondary QuickSign Link */}
            <div className="relative z-20 mt-7 flex items-center justify-center text-xs font-semibold text-[#5C544D]">
              <button
                type="button"
                onClick={onQuickSign}
                className="inline-flex items-center gap-2 hover:text-[#B85C38] transition-colors group cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-[#B85C38]" />
                <span>QuickSign — Generate 30-Sec Emergency Pass</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#B85C38]" />
              </button>
            </div>

          </div>
        </Interactive3DCard>

      </div>
    </section>
  );
}
