import React from 'react';
import { ArrowRight, Zap, Shield, UserPlus } from 'lucide-react';
import { useScrollReveal } from '../utils/useScrollReveal';

export default function CTASection({ onExplore, onEmergencyAccess, onSignUp, onQuickSign }) {
  const [ref, revealed] = useScrollReveal();

  return (
    <section id="cta" className="relative py-16 sm:py-24 scroll-mt-20" aria-label="Call to action">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`glass-card rounded-3xl p-8 sm:p-12 text-center gradient-border relative z-10 reveal ${revealed ? 'revealed' : ''}`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hazard-info/10 border border-hazard-info/20 mb-4 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-cambria text-xs sm:text-sm text-cyan-300 font-bold tracking-wide">NDRF & SDMA Decision Support</span>
          </div>

          <h2 className="font-cambria text-2xl sm:text-3xl font-black text-white tracking-tight mb-2.5">
            Ready to Protect Your Community?
          </h2>
          <p className="font-cambria text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
            Access real-time hazard intelligence, evaluate relocation sites, and coordinate evacuations with AI-powered precision. Every second counts.
          </p>

          <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onSignUp}
              className="btn-primary flex items-center gap-2 group text-sm font-bold px-8 py-3.5 cursor-pointer relative z-30 pointer-events-auto shadow-lg shadow-blue-900/50"
            >
              <UserPlus className="w-4 h-4" />
              Create Resident / Official Account
            </button>
            <button
              type="button"
              onClick={onEmergencyAccess}
              className="btn-danger flex items-center gap-2 text-sm font-bold px-8 py-3.5 cursor-pointer relative z-30 pointer-events-auto"
            >
              <Zap className="w-4 h-4" />
              Emergency Access
            </button>
          </div>

          <div className="relative z-20 mt-6 flex items-center justify-center gap-4 text-xs font-bold text-slate-300">
            <button
              type="button"
              onClick={onQuickSign}
              className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors group cursor-pointer relative z-30 pointer-events-auto"
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
