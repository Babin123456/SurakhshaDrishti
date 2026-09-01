import React from 'react';
import {
  Satellite,
  Brain,
  Users,
  MapPin,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useScrollReveal } from '../utils/useScrollReveal';

const steps = [
  {
    icon: Satellite,
    image: '/pipeline_satellite.webp',
    title: 'Hazard Data Ingestion',
    description: 'Multi-source feeds from ISRO satellite imagery, IMD weather data, GSI geological surveys, and IoT sensor networks.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/50',
    border: 'border-slate-800',
    hoverBorder: 'group-hover:border-cyan-500/50',
    glowColor: 'rgba(6, 182, 212, 0.15)',
  },
  {
    icon: Brain,
    image: '/pipeline_ai_core.webp',
    title: 'AI Risk Engine',
    description: 'Multi-hazard scoring model evaluates landslide probability, flood risk, coastal erosion patterns, and cloudburst vulnerability.',
    color: 'text-purple-400',
    bg: 'bg-purple-950/50',
    border: 'border-slate-800',
    hoverBorder: 'group-hover:border-purple-500/50',
    glowColor: 'rgba(168, 85, 247, 0.15)',
  },
  {
    icon: Users,
    image: '/pipeline_vulnerability.webp',
    title: 'Vulnerability Analysis',
    description: 'Population density, socioeconomic factors, building fragility, access routes, and disaster history overlaid on hazard data.',
    color: 'text-amber-400',
    bg: 'bg-amber-950/50',
    border: 'border-slate-800',
    hoverBorder: 'group-hover:border-amber-500/50',
    glowColor: 'rgba(245, 158, 11, 0.15)',
  },
  {
    icon: MapPin,
    image: '/pipeline_rescue_drone.webp',
    title: 'Relocation Planning',
    description: 'Carrying capacity assessment of safe sites. Tiered prioritization: immediate, short-term, and medium-term relocation plans.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/50',
    border: 'border-slate-800',
    hoverBorder: 'group-hover:border-emerald-500/50',
    glowColor: 'rgba(16, 185, 129, 0.15)',
  },
];

function StepCard({ step, index, isLast }) {
  const [ref, revealed] = useScrollReveal({ threshold: 0.2 });

  return (
    <div className="flex items-stretch">
      <div
        ref={ref}
        className={`reveal flex-1 ${revealed ? 'revealed' : ''}`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <div
          className={`relative rounded-3xl p-5 sm:p-6 bg-slate-900/70 border ${step.border} ${step.hoverBorder} h-full flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-950/40 hover:bg-slate-900/90 group cursor-default overflow-hidden`}
        >
          <div 
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 20%, ${step.glowColor} 0%, transparent 70%)`
            }}
          />

          <div className="relative z-10 space-y-4">
            
            <div className="flex items-center justify-between">
              {step.image ? (
                <div className="w-14 h-14 flex items-center justify-center group-hover:scale-115 transition-transform duration-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                  <img src={step.image} alt={step.title} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className={`p-3 rounded-2xl ${step.bg} border border-slate-800 transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>
              )}
              
              <span className="text-[11px] font-mono font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
                STAGE • 0{index + 1}
              </span>
            </div>

            <div>
              <h3 className="font-cambria text-sm sm:text-base font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors tracking-tight">
                {step.title}
              </h3>
              <p className="font-cambria text-xs text-slate-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-slate-400">
            <span className="font-cambria">Phase 0{index + 1} Verified</span>
            <span className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors"></span>
          </div>
        </div>
      </div>

      {!isLast && (
        <div className="hidden lg:flex items-center px-1 text-slate-700">
          <ArrowRight className="w-4 h-4 text-slate-700" />
        </div>
      )}
    </div>
  );
}

export default function HowItWorks() {
  const [titleRef, titleRevealed] = useScrollReveal();

  return (
    <section
      className="relative py-16 sm:py-20 bg-slate-950/70 scroll-mt-20"
      aria-labelledby="how-it-works-heading"
      id="pipeline"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div
          ref={titleRef}
          className={`text-center mb-10 sm:mb-12 reveal ${titleRevealed ? 'revealed' : ''}`}
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-cambria text-xs sm:text-sm text-cyan-300 font-bold tracking-wide">
              AI-Driven Intelligence Pipeline
            </span>
          </div>
          
          <h2
            id="how-it-works-heading"
            className="font-cambria text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight"
          >
            How It Works
          </h2>
          
          <p className="font-cambria text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2 leading-relaxed">
            From raw hazard data to actionable relocation plans — a four-stage AI pipeline that transforms satellite feeds into life-saving decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2">
          {steps.map((step, idx) => (
            <StepCard
              key={idx}
              step={step}
              index={idx}
              isLast={idx === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
