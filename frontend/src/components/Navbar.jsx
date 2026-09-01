import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, LogIn, Menu, X, UserPlus, Map, Layers, Cpu, HeartHandshake, ChevronRight, ShieldCheck } from 'lucide-react';

export default function Navbar({ onSignIn, onSignUp, onEmergencyAccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || (window.__lenis ? window.__lenis.scroll : 0);
      setIsScrolled(scrollPos > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    if (window.__lenis) {
      window.__lenis.on('scroll', (e) => {
        const scrollPos = e.scroll || window.scrollY;
        setIsScrolled(scrollPos > 30);
      });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const navLinks = [
    { name: 'GIS Map', href: '#map', icon: Map },
    { name: 'Capabilities', href: '#features', icon: Layers },
    { name: 'AI Pipeline', href: '#pipeline', icon: Cpu },
    { name: 'Decision Support', href: '#cta', icon: HeartHandshake },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileOpen(false);

    if (location.pathname !== '/') {
      navigate('/' + href);
      return;
    }

    if (href === '#' || href === '#top') {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { offset: -90, duration: 1.2 });
      } else {
        const top = target.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-[9999] transition-all duration-300 ease-out flex justify-center pointer-events-none">
      <div 
        className={`transition-all duration-500 ease-out pointer-events-auto ${
          isScrolled 
            ? 'w-[94%] max-w-5xl pt-3 px-0' 
            : 'w-full max-w-full pt-0 px-0'
        }`}
      >
        <nav
          className={`w-full transition-all duration-500 ease-out ${
            isScrolled
              ? 'rounded-full bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_20px_rgba(6,182,212,0.2)] px-4 sm:px-7 py-2.5 text-slate-100'
              : 'rounded-none bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/90 px-4 sm:px-8 lg:px-12 py-3.5 shadow-lg text-slate-100'
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between h-11 max-w-7xl mx-auto">
            
            {/* Brand Logo & Name */}
            <a
              href="#"
              onClick={(e) => handleNavClick(e, '#top')}
              className="flex items-center gap-2.5 group cursor-pointer shrink-0"
            >
              <div className="relative flex items-center justify-center transition-transform group-hover:scale-105">
                <img src="/favicon.webp" alt="SurakshaDrishti Logo" className="w-7 h-7 object-contain" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-950"></div>
              </div>
              <div>
                <h1 className="font-cambria font-black text-sm tracking-tight text-white leading-none">
                  SurakshaDrishti
                </h1>
                <span className="font-cambria text-[9px] text-cyan-400 font-semibold tracking-wider uppercase block">
                  SIH 26191 DSS
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className={`hidden lg:flex items-center gap-1 transition-all duration-300 ${
              isScrolled ? 'bg-slate-950/80 px-2.5 py-1 rounded-full border border-white/5' : 'bg-slate-900/70 px-3 py-1 rounded-xl border border-white/5'
            }`}>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3.5 py-1 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Action Controls */}
            <div className="hidden md:flex items-center gap-2.5 shrink-0">
              <button
                onClick={onEmergencyAccess}
                className="px-3.5 py-1.5 rounded-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer btn-bottom-glow-red shadow-sm"
                aria-label="Emergency Access"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Emergency SOS</span>
              </button>

              <button
                onClick={onSignIn}
                className="px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer btn-bottom-glow-slate"
                aria-label="Sign In"
              >
                <LogIn className="w-3 h-3 text-cyan-400" />
                <span>Sign In</span>
              </button>

              <button
                onClick={onSignUp}
                className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-900/40 flex items-center gap-1 cursor-pointer btn-bottom-glow-blue"
                aria-label="Sign Up"
              >
                <UserPlus className="w-3 h-3 text-white" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 hover:text-white transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-slate-200" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer (Smooth Sliding Drawer with Backdrop Transition) */}
      <div 
        className={`md:hidden fixed inset-0 z-[10000] transition-all duration-300 ${
          isMobileOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none delay-200'
        }`}
      >
        {/* Dark Blurred Backdrop Overlay */}
        <div 
          onClick={() => setIsMobileOpen(false)}
          className={`absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 ease-out ${
            isMobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Sliding Panel from Right */}
        <div 
          className={`absolute top-0 right-0 bottom-0 w-full max-w-sm bg-slate-950 border-l border-slate-800 flex flex-col justify-between p-5 sm:p-6 shadow-2xl transition-transform duration-300 ease-out text-slate-100 overflow-y-auto ${
            isMobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <img src="/favicon.webp" alt="SurakshaDrishti" className="w-7 h-7 object-contain" />
              <div>
                <span className="font-cambria font-black text-sm text-white block leading-none">SurakshaDrishti</span>
                <span className="font-cambria text-[9px] text-cyan-400 font-bold uppercase">SIH 26191 DSS</span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="py-5 space-y-2 flex-1">
            <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider px-3 mb-2">
              Navigation Menu
            </div>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-200 hover:text-white bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </a>
              );
            })}

            {/* Quick Links to Legal & Documentation on Mobile */}
            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2">
              <button
                onClick={() => { navigate('/documentation'); setIsMobileOpen(false); }}
                className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white text-center cursor-pointer hover:border-slate-700 transition-colors"
              >
                Documentation
              </button>
              <button
                onClick={() => { navigate('/faqs'); setIsMobileOpen(false); }}
                className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white text-center cursor-pointer hover:border-slate-700 transition-colors"
              >
                FAQs
              </button>
            </div>
          </div>

          {/* Mobile Actions Bottom Section */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] font-bold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>14 Active Red Hazard Zones Active</span>
            </div>

            <button
              onClick={() => { onEmergencyAccess(); setIsMobileOpen(false); }}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/60 btn-bottom-glow-red"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency Resident SOS</span>
            </button>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { onSignIn(); setIsMobileOpen(false); }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 btn-bottom-glow-slate"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => { onSignUp(); setIsMobileOpen(false); }}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer btn-bottom-glow-blue shadow-md"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
