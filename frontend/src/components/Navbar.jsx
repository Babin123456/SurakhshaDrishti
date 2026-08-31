import React, { useState } from 'react';
import { AlertTriangle, LogIn, Menu, X, UserPlus, Map, Layers, Cpu, HeartHandshake } from 'lucide-react';

export default function Navbar({ onSignIn, onSignUp, onEmergencyAccess }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    { name: 'GIS Map', href: '#map', icon: Map },
    { name: 'Capabilities', href: '#features', icon: Layers },
    { name: 'AI Pipeline', href: '#pipeline', icon: Cpu },
    { name: 'Decision Support', href: '#cta', icon: HeartHandshake },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileOpen(false);

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
        window.__lenis.scrollTo(target, { offset: -70, duration: 1.2 });
      } else {
        const top = target.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name with No Background Box */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, '#top')}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/favicon.webp" alt="SurakshaDrishti Logo" className="w-8 h-8 object-contain" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-950"></div>
            </div>
            <div>
              <h1 className="font-cambria font-black text-sm sm:text-base tracking-tight text-white leading-none">
                SurakshaDrishti
              </h1>
              <span className="font-cambria text-[10px] text-cyan-400 font-semibold tracking-wider uppercase block">
                SIH 26191 DSS
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Action Controls */}
          <div className="hidden md:flex items-center gap-2">
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/40 border border-red-500/30 text-[11px] font-semibold text-red-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>14 Active Red Zones</span>
            </div>

            <button
              onClick={onEmergencyAccess}
              className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              aria-label="Emergency Access"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              Emergency SOS
            </button>

            <button
              onClick={onSignIn}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
              aria-label="Sign In"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-400" />
              Sign In
            </button>

            <button
              onClick={onSignUp}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-900/40 flex items-center gap-1.5"
              aria-label="Sign Up"
            >
              <UserPlus className="w-3.5 h-3.5 text-white" />
              Sign Up
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="w-5 h-5 text-slate-300" /> : <Menu className="w-5 h-5 text-slate-300" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileOpen && (
          <div className="md:hidden bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 mt-1 space-y-3 animate-fade-in-down">
            <div className="space-y-1 pb-2 border-b border-slate-800">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    {link.name}
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs font-semibold text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>14 Active Hazard Red Zones</span>
            </div>
            
            <button
              onClick={() => { onEmergencyAccess(); setIsMobileOpen(false); }}
              className="w-full py-2.5 px-3 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Emergency Resident SOS
            </button>
            
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => { onSignIn(); setIsMobileOpen(false); }}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                Sign In
              </button>
              <button
                onClick={() => { onSignUp(); setIsMobileOpen(false); }}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
