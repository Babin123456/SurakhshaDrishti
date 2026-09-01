import React from 'react';
import { ArrowRight, Zap, Shield, UserPlus } from 'lucide-react';
import { useScrollReveal } from '../utils/useScrollReveal';

export default function CTASection({ onExplore, onEmergencyAccess, onSignUp, onQuickSign }) {
  const [ref, revealed] = useScrollReveal();

  return (
    <section id="cta" className="relative py-16 sm:py-24 scroll-mt-20" aria-label="Call to action">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Modern SaaS Gradient Border Box with subtle ambient glow */}
        <div
          ref={ref}
          className={`relative rounded-3xl p-8 sm:p-12 text-center bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden reveal ${revealed ? 'revealed' : ''}`}
        >
          {/* Subtle glowing radial background */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Pure Floating 3D Emergency Pass WebP without background box */}
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center animate-bounce-slow drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
            <img src="/cta_emergency_pass.webp" alt="Emergency Pass" className="w-full h-full object-contain" />
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 mb-4 shadow-sm relative z-10">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-cambria text-xs sm:text-sm text-cyan-300 font-bold tracking-wide">
              NDRF & SDMA Rapid Command Deployment
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="font-cambria text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 relative z-10">
            Ready to Protect Vulnerable Habitations?
          </h2>

          {/* Description */}
          <p className="font-cambria text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-8 leading-relaxed relative z-10">
            Access real-time hazard intelligence, evaluate relocation sites, and coordinate evacuations with AI-powered geospatial precision.
          </p>

          {/* Primary Action Buttons with Bottom Glow */}
          <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onSignUp}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all btn-bottom-glow-blue"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Resident / Official Account</span>
            </button>

            <button
              type="button"
              onClick={onEmergencyAccess}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all btn-bottom-glow-red"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Emergency Resident SOS</span>
            </button>
          </div>

          {/* Secondary QuickSign Link */}
          <div className="relative z-20 mt-6 flex items-center justify-center gap-4 text-xs font-bold text-slate-300">
            <button
              type="button"
              onClick={onQuickSign}
              className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors group cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-cambria">QuickSign — 30-Sec Emergency Pass (for Red Zone Residents)</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
