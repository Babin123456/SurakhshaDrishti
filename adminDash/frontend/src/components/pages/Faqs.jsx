import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  MapPin, 
  Radio, 
  Shield, 
  Users, 
  KeyRound, 
  Cpu, 
  Database, 
  Compass, 
  FileCheck2 
} from 'lucide-react';

const FAQS_DATA = [
  {
    category: '1. What is SurakshaDrishti?',
    q: 'What is SurakshaDrishti and what problem does it solve?',
    a: 'SurakshaDrishti is an intelligent disaster management platform created for Smart India Hackathon (Problem Statement 26191). It predicts natural hazard red zones such as landslides and flash floods, finds safe relocation centers with enough capacity, and guides citizens to safety without confusion.'
  },
  {
    category: '2. Difference Between Citizen and Officer Apps',
    q: 'What is the difference between the Admin Portal and the Citizen App?',
    a: 'The Admin Portal (Command Console) is used exclusively by disaster response authorities like NDRF and SDMA to monitor active hazard zones, manage resources, and coordinate rescue teams. The Citizen App (userApp) is designed for residents to view hazard alerts, request emergency assistance, and follow safe evacuation routes.'
  },
  {
    category: '3. Map & Navigation Without Paid APIs',
    q: 'Why does the map work without any Google Maps API keys or paid billing?',
    a: 'The entire interactive map runs on Leaflet.js using high-quality open map layers (OpenStreetMap, CARTO, and Esri). It does not require any paid Google API key or credit card billing, guaranteeing 100% free and uninterrupted availability during public emergencies.'
  },
  {
    category: '4. Red Zone Detection Logic',
    q: 'How does the system detect and mark high-risk Red Zones?',
    a: 'The platform analyzes slope steepness from Digital Elevation Models, real-time rainfall data, soil moisture levels, and past disaster records. When combined risk factors cross safe thresholds, the area is automatically highlighted on the map with a clear danger radius and evacuation recommendation.'
  },
  {
    category: '5. Working When Internet Fails',
    q: 'How does the system help people if mobile internet and power lines go down?',
    a: 'Once a user opens their route or downloads their pass, key map waypoints and shelter locations are stored directly on their device. In addition, the system supports emergency SMS alerts that carry short coordinate codes over standard cellular networks without requiring 4G/5G data.'
  },
  {
    category: '6. QuickSign 30-Second Pass',
    q: 'What is QuickSign and how does an affected resident use it in an emergency?',
    a: 'During a sudden disaster, people do not have time to fill long sign-up forms. QuickSign lets a resident generate an instant digital safety pass in just 30 seconds using their phone or GPS location. The pass immediately assigns their designated safe shelter and shows the nearest evacuation route.'
  },
  {
    category: '7. Safe Shelter Balancing',
    q: 'How does the platform ensure relief shelters do not get overcrowded?',
    a: 'The platform dynamically calculates the carrying capacity of each shelter, factoring in beds, medical facilities, clean water supplies, and road width. If one shelter reaches full capacity, incoming evacuees are smoothly redirected to the next nearest safe facility.'
  },
  {
    category: '8. Privacy & Personal Data',
    q: 'Is citizen and officer data kept private and secure?',
    a: 'Yes. All personal contact details, passwords, and location traces are securely encrypted. Individual private homes are never displayed publicly; only high-level hazard zones and rescue coordination points are shown to commanders.'
  },
  {
    category: '9. Officer Account Security & Password Changes',
    q: 'How are officer accounts protected when updating emails, phone numbers, or passwords?',
    a: 'Officer profiles require two-factor authorization for contact updates: a verification code is dispatched before any change is applied. When changing passwords, the officer must verify their current password, and once updated, the old password is immediately invalidated across all sessions.'
  },
  {
    category: '10. Who Coordinates the Disaster Response?',
    q: 'How do multiple disaster agencies (NDRF, SDMA, Police, Fire Services) coordinate?',
    a: 'All verified agencies log into a unified tactical view. Major decisions, such as closing a red zone after danger passes, use consensus verification where participating commanders confirm the ground situation is stable.'
  },
  {
    category: '11. Compatibility with Hardware Sensors',
    q: 'Can physical IoT sensors and field beacons connect to SurakshaDrishti?',
    a: 'Yes. The system is built with open connection interfaces that can receive live telemetry from rain gauges, soil tilt sensors, and battery-powered LoRa emergency beacons placed in remote mountain valleys.'
  },
  {
    category: '12. Real-Time Updates & Exports',
    q: 'Can district administrators export reports and maps for field teams?',
    a: 'Yes. District authorities can export incident rosters, shelter occupancy tables, and GIS map layers in standard formats (CSV, PDF summary reports, and GeoJSON files) for immediate printing or dispatch to field teams.'
  },
  {
    category: '13. How Far in Advance Are Warnings Issued?',
    q: 'What is the typical lead time for landslide and flash flood early warnings?',
    a: 'By continuously tracking IMD weather forecasts and soil saturation trends, the platform detects rising instability 6 to 24 hours in advance. This gives response teams valuable time to alert families and organize transport before roads become blocked.'
  },
  {
    category: '14. Preventing False Alarms',
    q: 'How does the platform avoid triggering panic or false alarms?',
    a: 'The system uses a multi-factor confirmation process. An alert is not triggered by high rainfall alone; it requires matching ground indicators such as high slope angle and critical soil moisture saturation before designating a zone as high-risk.'
  },
  {
    category: '15. Family Grouping & Vulnerable Individuals',
    q: 'How does the evacuation plan support elderly citizens, infants, and patients?',
    a: 'When residents register or use QuickSign, they can mark vulnerable family members. The system flags these households on the commanders desk so rescue battalions can prioritize them with specialized transport and medical shelters.'
  },
  {
    category: '16. Evacuation Route Safety',
    q: 'Does the system guarantee that evacuation paths do not cross another active hazard?',
    a: 'Yes. The route calculation engine constantly checks active red zones and automatically directs evacuees away from bridges or valleys that are in flood or landslide paths, choosing higher ground roads whenever available.'
  },
  {
    category: '17. Device & Battery Requirements',
    q: 'Can citizens use the system on low-end smartphones or with poor battery life?',
    a: 'Yes. The citizen interface is lightweight, requires minimal battery and data, and works smoothly on standard budget Android smartphones as well as desktop browsers without needing high-end graphics.'
  },
  {
    category: '18. What Does WGS84 GPS Mean in the Footer?',
    q: 'What does the "SYSTEM ACTIVE • WGS84" badge in the footer mean?',
    a: 'WGS84 (World Geodetic System 1984) is the global standard coordinate system used by GPS satellites, defense agencies, and aviation. The badge confirms that all map markers, shelter points, and rescue coordinates adhere to standard global coordinates without distortion.'
  },
  {
    category: '19. Working with Local Volunteers and NGOs',
    q: 'Can civil defense volunteers and relief NGOs use this platform?',
    a: 'Yes. Authorized relief volunteers and non-governmental aid groups can receive real-time shelter supply requirements (such as food, warm blankets, and medical kits) so aid reaches exactly where relief capacity is needed most.'
  },
  {
    category: '20. Scalability Across Different States',
    q: 'Can SurakshaDrishti be expanded to other disaster-prone states in India?',
    a: 'Yes. The architecture is modular and scalable. It is designed to work for Himalayan mountain landslides in Uttarakhand and Himachal Pradesh, coastal cyclone alerts in Odisha, and river flood plains across Kerala and Assam with zero core software changes.'
  }
];

export default function Faqs() {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-sans py-8 sm:py-14 px-4 sm:px-6 lg:px-8 selection:bg-[#8B7355]/20 selection:text-[#1A1A1A] relative">
      <div className="paper-texture"></div>
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 relative z-20">
        
        {/* Top Return Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-[#E8E1D5]">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#F6F4F0] text-[#5C544D] hover:text-[#1A1A1A] border border-[#E8E1D5] text-xs font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#8B7355]" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-[#5C544D]">
            <span className="w-2 h-2 rounded-full bg-[#8B7355] animate-pulse"></span>
            <span>KNOWLEDGE BASE (10 FAQ MODULES) • SIH 26191</span>
          </div>
        </div>

        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 bg-white/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#E8E1D5] shadow-xs">
          <div className="w-16 h-16 flex items-center justify-center shrink-0 drop-shadow-sm">
            <img src="/faqs.webp" alt="FAQs Orb" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">Frequently Asked Questions</h1>
            <p className="text-xs sm:text-sm text-[#5C544D] mt-1">
              Comprehensive Technical Answers on GIS Telemetry, AI Scoring, GSM Mesh, and Carrying Capacity
            </p>
          </div>
        </div>

        {/* 10 FAQ Accordion Items */}
        <div className="space-y-3">
          {FAQS_DATA.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`group bg-white/80 border rounded-2xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 relative ${
                  isOpen 
                    ? 'border-[#8B7355]/70 bg-white ring-1 ring-[#8B7355]/20' 
                    : 'border-[#E8E1D5] hover:border-[#8B7355]/60 hover:bg-white'
                }`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full bg-[#8B7355] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>

                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-start sm:items-center justify-between text-left gap-3.5 cursor-pointer transition-colors select-none pl-5 sm:pl-6"
                  aria-expanded={isOpen}
                >
                  <div className="flex-1">
                    <span className="text-[10px] font-mono text-[#8B7355] font-bold uppercase tracking-wider block mb-1 group-hover:tracking-widest transition-all duration-300">
                      {item.category}
                    </span>
                    <h3 className={`font-bold text-xs sm:text-base transition-colors leading-snug ${
                      isOpen ? 'text-[#1A1A1A]' : 'text-[#2C2A29] group-hover:text-[#8B7355]'
                    }`}>
                      {item.q}
                    </h3>
                  </div>
                  <div className={`p-1.5 sm:p-2 rounded-xl border transition-all duration-300 shrink-0 mt-0.5 sm:mt-0 group-hover:scale-110 ${
                    isOpen 
                      ? 'bg-[#8B7355] border-[#8B7355] text-white rotate-180 shadow-xs' 
                      : 'bg-[#F6F4F0] border-[#E8E1D5] text-[#7A726A] rotate-0 group-hover:border-[#8B7355]/40 group-hover:text-[#1A1A1A]'
                  }`}>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </button>

                {/* Smooth Animated Height Container */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-4 sm:px-6 sm:pb-5 text-xs sm:text-sm text-[#5C544D] leading-relaxed border-t border-[#E8E1D5] pt-3.5 bg-[#FDFBF7]/60 pl-6">
                      {item.a}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] sm:text-xs text-[#7A726A] font-mono pt-4 border-t border-[#E8E1D5] text-center sm:text-left">
          <span>EMERGENCY HELPLINE: 1078 / 112</span>
          <span>SIH 26191 • SURAKSHADRISHTI DSS</span>
        </div>

      </div>
    </div>
  );
}
