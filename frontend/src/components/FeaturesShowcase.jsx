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
    title: 'Dual Role Integrations',
    tagline: 'Citizen Portal & Administrator Console',
    description: 'Seamless role-based privilege isolation. Citizens get emergency one-touch SOS passes, safe route directions, and shelter availability. Command officers gain GIS layer manipulation, carrying capacity overrides, and evacuation dispatch consoles.',
    accent: 'from-emerald-500 to-teal-600',
    color: 'text-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.20)',
    badge: 'RBAC + Dynamic Pass Generator',
    interactivePreview: 'Role Isolation: Citizen SOS ⇄ Command Console'
  },
  {
    id: 'heatmaps',
    num: '05',
    icon: Layers,
    title: 'Dynamic Multi-Hazard Heatmaps',
    tagline: 'Red, Yellow & Green Risk Stratification',
    description: 'Autonomous AI synthesis of slope instability, rainfall thresholds, flood inundation models, and historical seismicity to generate real-time Red (Unfit for Habitation), Yellow (Buffer Alert), and Green (Safe Alternative) zones.',
    accent: 'from-red-500 to-rose-600',
    color: 'text-red-400',
    glowColor: 'rgba(239, 68, 68, 0.20)',
    badge: 'Real-Time GIS Synthesis',
    interactivePreview: 'Multi-Hazard Overlay: Red / Yellow / Green Stratification'
  },
  {
    id: 'wayroutes',
    num: '06',
    icon: Route,
    title: 'Custom Wayroutes & Reallocation',
    tagline: 'Capacity-Aware Evacuation Routing',
    description: 'Intelligent routing algorithm that computes safe evacuation corridors avoiding high-risk bridges or blocked passes while checking the real-time carrying capacity of receiving safe hubs to prevent secondary bottleneck disasters.',
    accent: 'from-blue-500 to-cyan-600',
    color: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.20)',
    badge: 'Carrying Capacity Optimization',
    interactivePreview: 'Dynamic Routing: Capacity-Aware Evacuation Corridor'
  }
];

export default function FeaturesShowcase() {
  const [titleRef, titleRevealed] = useScrollReveal();

  return (
    <section className="relative py-14 sm:py-20 overflow-hidden bg-slate-950/80 scroll-mt-20" id="features">
      
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-red-600/5 via-cyan-600/5 to-amber-600/5 blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div ref={titleRef} className={`text-center max-w-3xl mx-auto mb-10 sm:mb-12 reveal ${titleRevealed ? 'revealed' : ''}`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 mb-3 shadow-sm">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="font-cambria text-xs sm:text-sm text-cyan-300 font-bold tracking-wide">Next-Gen Multi-Hazard Decision Platform</span>
          </div>
          
          <h2 className="font-cambria text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Engineered for <span className="gradient-text">Zero Compromise</span> Disaster Response
          </h2>
          
          <p className="font-cambria text-xs sm:text-sm text-slate-300 mt-2.5 max-w-xl mx-auto leading-relaxed">
            Addressing recurring landslides, floods, and cloudbursts through real-time GIS intelligence, low-bandwidth GSM relays, and proactive carrying-capacity reallocation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;

            return (
              <div
                key={feat.id}
                className="group relative rounded-2xl p-5 sm:p-6 bg-slate-900/50 border border-slate-800/80 transition-all duration-300 ease-out cursor-default flex flex-col justify-between
                  hover:bg-slate-900/90 hover:border-slate-700 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-950/30"
              >
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 20%, ${feat.glowColor} 0%, transparent 70%)`
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${feat.accent} text-white shadow-md transition-transform duration-300 group-hover:scale-105`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
                      CORE • {feat.num}
                    </span>
                  </div>

                  <div className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800/80 border border-slate-700/60 text-slate-300 mb-2">
                    {feat.badge}
                  </div>

                  <h3 className="font-cambria text-base font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                    {feat.title}
                  </h3>
                  
                  <div className="font-cambria text-xs font-bold text-cyan-300 mt-0.5 mb-2 tracking-wide">
                    {feat.tagline}
                  </div>

                  <p className="font-cambria text-xs text-slate-300 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="relative z-10 mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400 group-hover:border-slate-700/80 transition-colors">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  <span className="font-cambria text-cyan-400/90 text-xs truncate">
                    {feat.interactivePreview}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
