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
  Activity
} from 'lucide-react';
import { useScrollReveal } from '../utils/useScrollReveal';

const FEATURES = [
  {
    id: 'gsm',
    num: '01',
    icon: Radio,
    image: '/feature_gsm_relay.webp',
    title: 'GSM 3.4 Telecommunication Relay',
    tagline: 'Resilient Offline Mesh & SMS Dispatch',
    description: 'When cellular data towers and power grids collapse during severe landslides or cyclones, our GSM 3.4 low-bandwidth protocol broadcasts life-saving geohash evacuation alerts via localized cellular towers without requiring active internet.',
    accent: 'from-cyan-500 to-blue-600',
    color: 'text-cyan-400',
    glowColor: 'rgba(6, 182, 212, 0.20)',
    badge: 'Hardware & Protocol Ready',
    interactivePreview: 'GSM 3.4 Active • Zero Internet Latency'
  },
  {
    id: 'e2ee',
    num: '02',
    icon: Lock,
    image: '/feature_e2ee_lock.webp',
    title: 'E2EE Interdepartmental Channels',
    tagline: 'Zero-Knowledge Secured Operations',
    description: 'End-to-End Encrypted (E2EE) cryptographic channels connecting NDRF battalions, State Disaster Management Authorities (SDMAs), and District Collectors. Guarantees authenticity of casualty reports and evacuation orders against tampering.',
    accent: 'from-purple-500 to-indigo-600',
    color: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.20)',
    badge: 'AES-GCM-256 + ECDH Handshake',
    interactivePreview: 'NDRF Battalion #04 ⇄ SDMA (Ed25519 Signed)'
  },
  {
    id: 'geohash',
    num: '03',
    icon: Compass,
    image: '/feature_geohash_grid.webp',
    title: 'GeoHashed Locatives for Accuracy',
    tagline: 'High-Precision 8-Char Spatial Indexing',
    description: 'Instead of ambiguous addresses or slow boundary queries, every habitation and hazard perimeter is indexed via hierarchical GeoHashes (e.g. #tdv2n19z). Enables sub-second spatial queries across millions of vulnerable citizens.',
    accent: 'from-amber-500 to-red-600',
    color: 'text-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.20)',
    badge: 'Sub-Meter Resolution',
    interactivePreview: 'Spatial Index: 8-Char Geohash Sub-Meter Precision'
  },
  {
    id: 'dual-role',
    num: '04',
    icon: Users,
    image: '/feature_dual_roles.webp',
    title: 'Dual Role Integrations',
    tagline: 'Citizen Portal & Administrator Console',
    description: 'Seamless role-based privilege isolation. Citizens get emergency one-touch SOS passes, safe route directions, and shelter availability. Command officers gain GIS layer manipulation, carrying capacity overrides, and evacuation dispatch consoles.',
    accent: 'from-emerald-500 to-teal-600',
    color: 'text-emerald-400',
    glowColor: 'rgba(168, 85, 129, 0.20)',
    badge: 'RBAC + Dynamic Pass Generator',
    interactivePreview: 'Active Sessions: 1,420 Citizens • 18 Incident Commanders'
  },
  {
    id: 'carrying-capacity',
    num: '05',
    icon: Layers,
    image: '/feature_carrying_capacity.webp',
    title: 'Dynamic Safe Site Capacity Allocation',
    tagline: 'Multi-Objective Spatial Relocation',
    description: 'Relocation algorithm balances terrain safety, shelter bed volume, water supplies, transit road capacity, and slope stabilization to prevent bottlenecking or overburdening secondary transit hubs during rapid evacuations.',
    accent: 'from-blue-500 to-cyan-600',
    color: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.20)',
    badge: 'Real-Time Capacity Balancing',
    interactivePreview: 'Nilambur Base Camp: 82% Safe Capacity • Pipalkoti: 44%'
  },
  {
    id: 'proactive-evac',
    num: '06',
    icon: Route,
    image: '/feature_proactive_evacuation.webp',
    title: 'Prioritized Proactive Evacuation Orders',
    tagline: 'Vulnerability-Indexed Dispatch Engine',
    description: 'Calculates high-priority evacuation sequences by combining real-time slope shear indices with household vulnerability data (elderly, infants, critical medical requirements). Dispatches verified convoy routes with clear waypoints.',
    accent: 'from-red-500 to-orange-600',
    color: 'text-red-400',
    glowColor: 'rgba(239, 68, 68, 0.20)',
    badge: 'Zero-Bottleneck Routing',
    interactivePreview: 'Evac Corridor #1: High Priority (Chooralmala ➔ Nilambur)'
  }
];

export default function FeaturesShowcase() {
  const [headerRef, headerRevealed] = useScrollReveal();

  return (
    <section 
      id="features" 
      className="relative py-20 bg-slate-950/40 scroll-mt-20 overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div 
          ref={headerRef}
          className={`text-center max-w-3xl mx-auto mb-14 reveal ${headerRevealed ? 'revealed' : ''}`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-cambria text-xs sm:text-sm text-cyan-300 font-bold tracking-wide">
              Cutting-Edge Disaster Intelligence Architecture
            </span>
          </div>

          <h2 
            id="features-heading"
            className="font-cambria text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight"
          >
            Capabilities Engineered for High-Stress Operations
          </h2>

          <p className="font-cambria text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
            From zero-broadband GSM mesh alerts to cryptographic interdepartmental channels — every module is built to operate when civilian infrastructure fails.
          </p>
        </div>

        {/* Features 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative rounded-3xl p-6 sm:p-7 bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-950/30 flex flex-col justify-between overflow-hidden cursor-default"
              >
                {/* Radial Glow on Hover */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 10%, ${feature.glowColor} 0%, transparent 70%)`
                  }}
                />

                <div className="relative z-10 space-y-4">
                  
                  {/* Top Bar: Pure Floating 3D WebP Icon + Module Number */}
                  <div className="flex items-center justify-between">
                    {feature.image ? (
                      <div className="w-14 h-14 flex items-center justify-center group-hover:scale-115 transition-transform duration-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                        <img src={feature.image} alt={feature.title} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className={`p-3 rounded-2xl bg-slate-950/90 border border-slate-800 ${feature.color} shadow-sm group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    )}
                    
                    <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
                      MODULE • {feature.num}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="font-cambria text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {feature.title}
                    </h3>
                    <div className="font-cambria text-xs font-semibold text-slate-400 mt-1">
                      {feature.tagline}
                    </div>
                  </div>

                  {/* Body Description */}
                  <p className="font-cambria text-xs text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Interactive Telemetry Strip */}
                <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
                    {feature.badge}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-cyan-400/80 group-hover:scale-125 group-hover:bg-cyan-300 transition-all"></div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
