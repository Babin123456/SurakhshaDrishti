import React from 'react';
import { 
  Radio, 
  Lock, 
  MapPin, 
  Users, 
  Layers, 
  Route, 
  Sparkles, 
  Compass, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useScrollReveal } from '../utils/useScrollReveal';
import Interactive3DCard from './Interactive3DCard';

const FEATURES = [
  {
    id: 'gsm',
    num: '01',
    icon: Radio,
    image: '/feature_gsm_relay.webp',
    title: 'GSM 3.4 Telemetry Mesh',
    tagline: 'Zero-Broadband Emergency Relay',
    description: 'Broadcasts life-saving geohash evacuation alerts via localized cellular control channels without active internet.',
    color: 'text-[#8B7355]',
    glowColor: 'rgba(139, 115, 85, 0.12)',
    badge: 'Hardware Ready',
    spec: 'Sub-second SMS Packet Delivery'
  },
  {
    id: 'e2ee',
    num: '02',
    icon: Lock,
    image: '/feature_e2ee_lock.webp',
    title: 'E2EE Inter-Agency Rail',
    tagline: 'Zero-Knowledge Operations',
    description: 'Cryptographic channel connecting NDRF, SDMAs, and District Collectors with tamper-proof casualty & order authentication.',
    color: 'text-[#4A4238]',
    glowColor: 'rgba(74, 66, 56, 0.12)',
    badge: 'AES-GCM-256',
    spec: 'Ed25519 Signed Dispatch'
  },
  {
    id: 'geohash',
    num: '03',
    icon: Compass,
    image: '/feature_geohash_grid.webp',
    title: '8-Char Spatial Index',
    tagline: 'Sub-Meter Hazard Mapping',
    description: 'Hierarchical GeoHashes index perimeters for sub-second spatial queries across millions of vulnerable residents.',
    color: 'text-[#B85C38]',
    glowColor: 'rgba(184, 92, 56, 0.12)',
    badge: 'Sub-Meter Grid',
    spec: '8-Character Precision (#tdv2n19z)'
  },
  {
    id: 'dual-role',
    num: '04',
    icon: Users,
    image: '/feature_dual_roles.webp',
    title: 'Dual-Role Console',
    tagline: 'Citizen SOS & Commander HUD',
    description: 'Instant resident evacuation passes paired with incident commander GIS layer manipulation and consensus resolution.',
    color: 'text-[#2D7A4F]',
    glowColor: 'rgba(45, 122, 79, 0.12)',
    badge: 'RBAC Security',
    spec: 'Dynamic 30-Sec Emergency Pass'
  },
  {
    id: 'carrying-capacity',
    num: '05',
    icon: Layers,
    image: '/feature_carrying_capacity.webp',
    title: 'Safe Site Capacity AI',
    tagline: 'Multi-Objective Spatial Balancing',
    description: 'Balances terrain safety, shelter bed density, water logistics, and transit width to eliminate bottlenecking.',
    color: 'text-[#3E6B89]',
    glowColor: 'rgba(62, 107, 137, 0.12)',
    badge: 'Load Balancing',
    spec: 'Real-Time Shelter Occupancy'
  },
  {
    id: 'proactive-evac',
    num: '06',
    icon: Route,
    image: '/feature_proactive_evacuation.webp',
    title: 'Priority Evac Matrix',
    tagline: 'Vulnerability-First Dispatch',
    description: 'Combines slope shear indices with household demographics (elderly, infants) to sequence proactive convoy evacuations.',
    color: 'text-[#B85C38]',
    glowColor: 'rgba(184, 92, 56, 0.12)',
    badge: '48hr Advance',
    spec: 'Zero-Bottleneck Routing Corridors'
  }
];

export default function FeaturesShowcase() {
  const [headerRef, headerRevealed] = useScrollReveal();
  const sectionRef = React.useRef(null);
  const [revealedCount, setRevealedCount] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;

      // Start revealing card 1 when section top reaches 70% of screen height
      const startTrigger = windowHeight * 0.70;
      // Step distance per card for smooth, staggered unmasking
      const stepDistance = Math.max(rect.height / 5.2, 120);

      if (sectionTop > startTrigger) {
        setRevealedCount(0);
      } else {
        const scrolledIntoSection = startTrigger - sectionTop;
        const currentStage = Math.min(Math.max(Math.floor(scrolledIntoSection / stepDistance) + 1, 1), 6);
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
      id="features" 
      className="relative py-24 bg-transparent scroll-mt-20 overflow-hidden"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Punchy Section Header with Reduced Text */}
        <div 
          ref={headerRef}
          className={`text-center max-w-2xl mx-auto mb-16 reveal ${headerRevealed ? 'revealed' : ''}`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#E8E1D5] mb-4 shadow-xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#8B7355]" />
            <span className="text-xs text-[#4A4238] font-bold uppercase tracking-wider">
              Architecture & Capabilities
            </span>
          </div>

          <h2 
            id="features-heading"
            className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1]"
          >
            <span className="gradient-text-stone">Engineered for </span>
            <span className="gradient-text-gold">Extreme Stress.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#5C544D] mt-4 leading-relaxed font-light">
            When power grids and commercial cellular links fail, SurakshaDrishti's resilient stack activates.
          </p>

          {/* Module Progression Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {FEATURES.map((_, i) => (
              <div 
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  revealedCount >= i + 1 ? 'w-6 bg-[#8B7355]' : 'w-1.5 bg-[#E8E1D5]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Features 6-Card Grid with Sequential Scroll Reveal & Reverse Unmasking */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            const isCardRevealed = revealedCount >= idx + 1;

            return (
              <div 
                key={feature.id} 
                className={`h-full transition-all duration-800 ease-out will-change-transform ${
                  isCardRevealed 
                    ? 'opacity-100 translate-y-0 scale-100 filter blur-0 pointer-events-auto' 
                    : 'opacity-0 translate-y-14 scale-95 filter blur-sm pointer-events-none'
                }`}
                style={{ 
                  transitionDelay: isCardRevealed ? `${(idx % 3) * 100}ms` : '0ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <Interactive3DCard 
                  intensity={10}
                  className="h-full"
                >
                <div className="h-full rounded-3xl p-7 bg-white/70 backdrop-blur-xl border border-[#E8E1D5] hover:border-[#8B7355]/60 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden cursor-default group">
                  
                  {/* Subtle top corner ambient glow */}
                  <div 
                    className="absolute -top-16 -right-16 w-36 h-36 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${feature.glowColor} 0%, transparent 70%)`
                    }}
                  />

                  <div className="relative z-10 space-y-4">
                    
                    {/* Top Bar: Visual Asset + Module Code */}
                    <div className="flex items-center justify-between">
                      {feature.image ? (
                        <div className="w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 drop-shadow-sm select-none pointer-events-none">
                          <img src={feature.image} alt={feature.title} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="p-3 rounded-2xl bg-[#F6F4F0] border border-[#E8E1D5] transition-transform duration-300 group-hover:scale-110">
                          <Icon className={`w-6 h-6 ${feature.color}`} />
                        </div>
                      )}

                      <span className={`text-[11px] font-mono font-bold transition-colors border px-2.5 py-0.5 rounded-full ${
                        isCardRevealed 
                          ? 'text-[#4A4238] bg-[#F6F4F0] border-[#E8E1D5]' 
                          : 'text-stone-400 border-stone-200'
                      }`}>
                        MOD • {feature.num}
                      </span>
                    </div>

                    {/* Headline & Tagline */}
                    <div>
                      <h3 className="text-lg font-bold text-[#1A1A1A] group-hover:text-[#4A4238] transition-colors tracking-tight flex items-center justify-between">
                        <span>{feature.title}</span>
                        <ArrowUpRight className="w-4 h-4 text-[#8B7355] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </h3>
                      <p className="text-xs font-semibold text-[#8B7355] mt-0.5">
                        {feature.tagline}
                      </p>
                    </div>

                    {/* Short Concise Description */}
                    <p className="text-xs text-[#5C544D] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Clean Bottom Metric Bar */}
                  <div className="relative z-10 mt-6 pt-3.5 border-t border-[#E8E1D5] flex items-center justify-between text-[11px] font-mono text-[#7A726A]">
                    <span className="font-bold text-[#4A4238]">{feature.badge}</span>
                    <span className="text-[10px] text-[#8C847A]">{feature.spec}</span>
                  </div>

                </div>
              </Interactive3DCard>
            </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
