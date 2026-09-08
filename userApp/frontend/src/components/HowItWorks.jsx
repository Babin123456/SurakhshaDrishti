import React from 'react';
import {
  Satellite,
  Brain,
  Users,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useScrollReveal } from '../utils/useScrollReveal';
import Interactive3DCard from './Interactive3DCard';

const steps = [
  {
    icon: Satellite,
    image: '/satellite_transparent.gif',
    title: 'Data Ingestion',
    description: 'Fusing ISRO satellite telemetry, IMD precipitation radars, and terrain IoT sensors.',
    color: 'text-[#8B7355]',
    bg: 'bg-[#F6F4F0]',
    border: 'border-[#E8E1D5]',
    hoverBorder: 'group-hover:border-[#8B7355]/50',
    glowColor: 'rgba(139, 115, 85, 0.12)',
    metric: 'Real-Time Telemetry'
  },
  {
    icon: Brain,
    image: '/ai-art_transparent.gif',
    title: 'Hazard Scoring AI',
    description: 'Ensemble XGBoost models evaluate slope shear stress, flood vectors, and slip recurrence.',
    color: 'text-[#4A4238]',
    bg: 'bg-[#F6F4F0]',
    border: 'border-[#E8E1D5]',
    hoverBorder: 'group-hover:border-[#4A4238]/50',
    glowColor: 'rgba(74, 66, 56, 0.12)',
    metric: '0–100 Threat Index'
  },
  {
    icon: Users,
    image: '/demographic_transparent.gif',
    title: 'Vulnerability Overlay',
    description: 'Cross-indexes household demographics, access routes, and structural fragility in geohashes.',
    color: 'text-[#C05621]',
    bg: 'bg-[#F6F4F0]',
    border: 'border-[#E8E1D5]',
    hoverBorder: 'group-hover:border-[#C05621]/50',
    glowColor: 'rgba(192, 86, 33, 0.12)',
    metric: 'Sub-Meter Demographics'
  },
  {
    icon: MapPin,
    image: '/drone_transparent.gif',
    title: 'Relocation AI Matrix',
    description: 'Multi-objective carrying capacity allocation across safe shelters with zero bottlenecking.',
    color: 'text-[#2D7A4F]',
    bg: 'bg-[#F6F4F0]',
    border: 'border-[#E8E1D5]',
    hoverBorder: 'group-hover:border-[#2D7A4F]/50',
    glowColor: 'rgba(45, 122, 79, 0.12)',
    metric: 'Safe Hub Dispatch'
  },
];

function StepCard({ step, index }) {
  // Trigger independently when each card scrolls into the viewport
  const [ref, revealed] = useScrollReveal({ threshold: 0.18, rootMargin: '0px 0px -50px 0px' });

  // Alternate cinematic entrance directions:
  // Card 0: Fly in from left with a slight tilt (reveal-tilt-left)
  // Card 1: Descend smoothly from above with soft scale (reveal-drop)
  // Card 2: Rise up with deep focus unmask (reveal)
  // Card 3: Fly in from right with dynamic counter-tilt (reveal-tilt-right)
  const directionClasses = [
    'reveal-tilt-left',
    'reveal-drop',
    'reveal',
    'reveal-tilt-right'
  ];
  const animClass = directionClasses[index % directionClasses.length];

  return (
    <div 
      ref={ref}
      className={`flex-1 min-w-[240px] transition-all duration-700 ${animClass} ${revealed ? 'revealed' : ''}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <Interactive3DCard intensity={10} className="h-full">
        <div
          className={`h-full relative rounded-3xl p-6 bg-white/70 backdrop-blur-xl border ${step.border} hover:border-[#8B7355]/60 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl group cursor-default overflow-hidden`}
        >
          {/* Ambient radial glow on hover */}
          <div 
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 20%, ${step.glowColor} 0%, transparent 70%)`
            }}
          />

          <div className="relative z-10 space-y-4">
            
            <div className="flex items-center justify-between">
              {step.image ? (
                <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 drop-shadow-sm select-none pointer-events-none">
                  <img src={step.image} alt={step.title} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className={`p-3 rounded-2xl ${step.bg} border border-[#E8E1D5] transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>
              )}
              
              <span className="text-[10px] font-mono font-bold text-[#8C847A] group-hover:text-[#4A4238] transition-colors bg-[#F6F4F0] border border-[#E8E1D5] px-2.5 py-0.5 rounded-full">
                STAGE 0{index + 1}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1A1A1A] mb-1 group-hover:text-[#4A4238] transition-colors tracking-tight">
                {step.title}
              </h3>
              <p className="text-xs text-[#5C544D] leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-5 pt-3 border-t border-[#E8E1D5] flex items-center justify-between text-[11px] font-mono text-[#7A726A]">
            <span className="font-semibold text-[#4A4238]">{step.metric}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D7A4F] opacity-70 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </Interactive3DCard>
    </div>
  );
}

export default function HowItWorks() {
  const [titleRef, titleRevealed] = useScrollReveal();
  const sectionRef = React.useRef(null);
  
  // Track active stages (0 = none, 1 = stage 1, 2 = stage 1&2, 3 = stage 1-3, 4 = all)
  const [revealedCount, setRevealedCount] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Distance from when the section top enters until it is scrolled through
      const sectionTop = rect.top;
      
      // Calculate how far the section has advanced relative to the viewport:
      // When section top is at 78% of screen height, start revealing card 1
      const startTrigger = windowHeight * 0.52;
      // Balanced pacing: each card steps in smoothly, with card 4 completing as the section centers
      const stepDistance = Math.max(rect.height / 3.4, 150);

      if (sectionTop > startTrigger) {
        // Above the section
        setRevealedCount(0);
      } else {
        const scrolledIntoSection = startTrigger - sectionTop;
        const currentStage = Math.min(Math.max(Math.floor(scrolledIntoSection / stepDistance) + 1, 1), 4);
        setRevealedCount(currentStage);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 bg-transparent scroll-mt-20"
      aria-labelledby="how-it-works-heading"
      id="pipeline"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div
          ref={titleRef}
          className={`text-center max-w-2xl mx-auto mb-16 reveal ${titleRevealed ? 'revealed' : ''}`}
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#E8E1D5] mb-3.5 shadow-xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#8B7355]" />
            <span className="text-xs text-[#4A4238] font-bold uppercase tracking-wider">
              Automated Pipeline
            </span>
          </div>

          <h2
            id="how-it-works-heading"
            className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.15]"
          >
            <span className="gradient-text-stone">How Disaster Telemetry </span>
            <span className="gradient-text-gold">Resolves.</span>
          </h2>

          <p className="text-sm text-[#5C544D] mt-3 font-light leading-relaxed">
            From Raw Spatial Sensors to Zero-Casualty Relocation Orders.
          </p>

          {/* Live Pipeline Progression Counter Indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map((stageNum) => (
              <div 
                key={stageNum}
                className={`h-1.5 rounded-full transition-all duration-700 ${
                  revealedCount >= stageNum 
                    ? 'w-8 bg-[#8B7355]' 
                    : 'w-2 bg-[#E8E1D5]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 4-Stage Connected Pipeline Grid with Slower Sequential Scroll In / Reverse Out */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch relative">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const isCardRevealed = revealedCount >= index + 1;

            return (
              <React.Fragment key={index}>
                <div 
                  className={`relative flex-1 min-w-[240px] transition-all duration-900 ease-out will-change-transform ${
                    isCardRevealed 
                      ? 'opacity-100 translate-y-0 scale-100 filter blur-0 pointer-events-auto' 
                      : 'opacity-0 translate-y-16 scale-95 filter blur-sm pointer-events-none'
                  }`}
                  style={{
                    transitionDelay: isCardRevealed ? `${index * 120}ms` : '0ms'
                  }}
                >
                  <Interactive3DCard intensity={10} className="h-full">
                    <div
                      className={`h-full relative rounded-3xl p-6 bg-white/70 backdrop-blur-xl border ${step.border} hover:border-[#8B7355]/60 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl group cursor-default overflow-hidden`}
                    >
                      {/* Ambient radial glow on hover */}
                      <div 
                        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 50% 20%, ${step.glowColor} 0%, transparent 70%)`
                        }}
                      />

                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between">
                          {step.image ? (
                            <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 drop-shadow-sm select-none pointer-events-none">
                              <img src={step.image} alt={step.title} className="w-full h-full object-contain" />
                            </div>
                          ) : (
                            <div className={`p-3 rounded-2xl ${step.bg} border border-[#E8E1D5] transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                              <step.icon className={`w-5 h-5 ${step.color}`} />
                            </div>
                          )}
                          
                          <span className={`text-[10px] font-mono font-bold transition-colors border px-2.5 py-0.5 rounded-full ${
                            isCardRevealed 
                              ? 'text-[#4A4238] bg-[#F6F4F0] border-[#E8E1D5]' 
                              : 'text-stone-400 border-stone-200'
                          }`}>
                            STAGE 0{index + 1}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-[#1A1A1A] mb-1 group-hover:text-[#4A4238] transition-colors tracking-tight">
                            {step.title}
                          </h3>
                          <p className="text-xs text-[#5C544D] leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      <div className="relative z-10 mt-5 pt-3 border-t border-[#E8E1D5] flex items-center justify-between text-[11px] font-mono text-[#7A726A]">
                        <span className="font-semibold text-[#4A4238]">{step.metric}</span>
                        <CheckCircle2 className={`w-3.5 h-3.5 transition-all duration-300 ${
                          isCardRevealed ? 'text-[#2D7A4F] opacity-100' : 'text-stone-300 opacity-40'
                        }`} />
                      </div>
                    </div>
                  </Interactive3DCard>

                  {/* Animated Directional Transition Arrow Between Cards (Desktop View) */}
                  {!isLast && (
                    <div className={`hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-30 pointer-events-none items-center justify-center transition-all duration-500 ${
                      revealedCount >= index + 2 ? 'opacity-100 scale-100' : 'opacity-20 scale-75'
                    }`}>
                      <div className="w-7 h-7 rounded-full bg-white border border-[#E8E1D5] shadow-sm flex items-center justify-center text-[#8B7355] animate-arrow-pulse">
                        <ArrowRight className="w-3.5 h-3.5 text-[#8B7355]" />
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </section>
  );
}
