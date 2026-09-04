import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  AlertTriangle, 
  LogIn, 
  Menu, 
  X, 
  UserPlus, 
  Map, 
  Layers, 
  Cpu, 
  Activity, 
  Shield, 
  Sparkles,
  ArrowRight,
  Users,
  User,
  LogOut
} from 'lucide-react';

export default function Navbar({ 
  onSignIn, 
  onSignUp, 
  onEmergencyAccess,
  userSession,
  onNavigateDashboard,
  onNavigateProfile,
  onLogout
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop || (window.__lenis ? window.__lenis.scroll : 0);
      setIsScrolled(scrollPos > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    if (window.__lenis) {
      window.__lenis.on('scroll', (e) => {
        const scrollPos = e.scroll || window.scrollY;
        setIsScrolled(scrollPos > 40);
      });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Capabilities', href: '#features' },
    { name: 'AI Pipeline', href: '#pipeline' },
    { name: 'Deploy DSS', href: '#cta' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileOpen(false);

    if (location.pathname !== '/') {
      navigate('/' + href);
      return;
    }

    if (href === '#' || href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 });
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      const top = target.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top, behavior: 'smooth' });
      if (window.__lenis) window.__lenis.scrollTo(target, { offset: -90, duration: 1.2 });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-[9995] flex justify-center pointer-events-none transition-transform duration-300">
      
      {/* Container that dynamically shrinks, floats forward, and centers on scroll */}
      <div 
        className={`pointer-events-auto transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          isScrolled 
            ? 'w-[94%] max-w-5xl pt-3 px-0 scale-[0.98]' 
            : 'w-full max-w-7xl pt-4 px-4 sm:px-6 lg:px-8 scale-100'
        }`}
      >
        <nav
          className={`w-full transition-all duration-500 ease-out flex items-center justify-between ${
            isScrolled
              ? 'rounded-full bg-[#FDFBF7]/90 backdrop-blur-2xl border border-[#E8E1D5] shadow-2xl shadow-[#D9D0C1]/40 px-4 sm:px-6 py-2.5 text-[#2C2A29]'
              : 'rounded-2xl bg-white/80 backdrop-blur-md border border-[#E8E1D5] px-5 sm:px-8 py-3.5 shadow-xs text-[#2C2A29]'
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Brand Logo & Emblem */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, '#top')}
            className="flex items-center gap-2.5 group cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-[#2C2A29] text-[#FDFBF7] flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-[#1A1A1A] leading-none">
                Suraksha<span className="text-[#8B7355]">Drishti</span>
              </div>
              <span className="text-[9px] font-mono text-[#7A726A] font-semibold tracking-wider uppercase block mt-0.5">
                SIH 26191 DSS
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-[#F6F4F0] p-1 rounded-full border border-[#E8E1D5]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-1 rounded-full text-xs font-semibold text-[#5C544D] hover:text-[#1A1A1A] hover:bg-white transition-all cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={onEmergencyAccess}
              className="px-3.5 py-1.5 rounded-full bg-[#FFF5F2] hover:bg-[#B85C38] hover:text-white border border-[#FADED4] text-[#B85C38] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>

            {userSession ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onNavigateDashboard}
                  className="px-3.5 py-1.5 rounded-full bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] font-semibold text-xs transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                  title="Open GIS Command Console"
                >
                  <Map className="w-3.5 h-3.5 text-[#8B7355]" />
                  <span>Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={onNavigateProfile}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-[#F6F4F0] border border-[#E8E1D5] text-[#1A1A1A] font-semibold text-xs transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  title="View User Profile"
                >
                  {userSession.user?.profile_picture || userSession.user?.avatar || (typeof window !== 'undefined' && localStorage.getItem('suraksha_user_pfp')) ? (
                    <img 
                      src={userSession.user?.profile_picture || userSession.user?.avatar || localStorage.getItem('suraksha_user_pfp')} 
                      alt="User" 
                      className="w-4 h-4 rounded-full object-cover border border-[#8B7355]/40" 
                    />
                  ) : (
                    <User className="w-3.5 h-3.5 text-[#8B7355]" />
                  )}
                  <span>Profile</span>
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 rounded-full bg-transparent hover:bg-[#FFF5F2] text-[#B85C38] hover:text-[#A04D2D] transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="px-4 py-1.5 rounded-full bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] font-semibold text-xs transition-all shadow-xs flex items-center gap-1 cursor-pointer hover:-translate-y-0.5"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3 h-3 text-[#8B7355]" />
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle with Animated Three Lines */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden relative p-2.5 rounded-xl bg-white/90 hover:bg-white border border-[#E8E1D5] hover:border-[#8B7355]/50 text-[#1A1A1A] cursor-pointer shadow-xs transition-all duration-300 active:scale-95 flex flex-col items-center justify-center gap-1 w-9 h-9 overflow-hidden"
            aria-label="Toggle navigation menu"
          >
            <span 
              className={`w-4 h-0.5 bg-[#2C2A29] rounded-full transition-all duration-300 ease-out origin-center ${
                isMobileOpen ? 'rotate-45 translate-y-[6px]' : ''
              }`}
            />
            <span 
              className={`w-4 h-0.5 bg-[#2C2A29] rounded-full transition-all duration-200 ease-out ${
                isMobileOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
              }`}
            />
            <span 
              className={`w-4 h-0.5 bg-[#2C2A29] rounded-full transition-all duration-300 ease-out origin-center ${
                isMobileOpen ? '-rotate-45 -translate-y-[6px]' : ''
              }`}
            />
          </button>
        </nav>
      </div>

      {/* Mobile Drawer with Subtle Frosted Glass & Staggered Reveal */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 z-[9999] bg-[#1A1A1A]/40 backdrop-blur-md pointer-events-auto flex justify-end animate-mobile-backdrop"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-80 max-w-[85vw] bg-[#FDFBF7]/95 backdrop-blur-2xl border-l border-[#E8E1D5] p-6 flex flex-col justify-between shadow-2xl h-full animate-mobile-menu"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D5]">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-[#2C2A29] text-[#FDFBF7] shadow-xs">
                    <Shield className="w-4 h-4 text-[#8B7355]" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#1A1A1A] block leading-tight">SurakshaDrishti</span>
                    <span className="text-[10px] font-mono text-[#8C847A]">MOBILE DISPATCH HUD</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-xl border border-[#E8E1D5] hover:border-[#8B7355]/40 text-[#5C544D] hover:text-[#1A1A1A] bg-white/80 active:scale-95 transition-all"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 mt-6">
                {navLinks.map((link, idx) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    style={{ animationDelay: `${idx * 50}ms` }}
                    className="group flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-[#5C544D] hover:text-[#1A1A1A] hover:bg-white hover:border hover:border-[#E8E1D5] transition-all duration-200"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8B7355] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 pt-6 border-t border-[#E8E1D5]">
              <button
                onClick={() => { setIsMobileOpen(false); onEmergencyAccess(); }}
                className="w-full py-3 rounded-2xl bg-[#FFF5F2] hover:bg-[#FFEAE3] border border-[#FADED4] hover:border-[#B85C38] text-[#B85C38] font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-xs"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Emergency SOS Mode</span>
              </button>

              {userSession ? (
                <>
                  <button
                    onClick={() => { setIsMobileOpen(false); onNavigateDashboard(); }}
                    className="w-full py-3 rounded-2xl bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
                  >
                    <Map className="w-3.5 h-3.5 text-[#8B7355]" />
                    <span>Command Dashboard</span>
                  </button>

                  <button
                    onClick={() => { setIsMobileOpen(false); onNavigateProfile(); }}
                    className="w-full py-3 rounded-2xl bg-white hover:bg-[#F6F4F0] border border-[#E8E1D5] text-[#1A1A1A] font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-2xs"
                  >
                    {userSession.user?.profile_picture || userSession.user?.avatar || (typeof window !== 'undefined' && localStorage.getItem('suraksha_user_pfp')) ? (
                      <img 
                        src={userSession.user?.profile_picture || userSession.user?.avatar || localStorage.getItem('suraksha_user_pfp')} 
                        alt="User" 
                        className="w-4 h-4 rounded-full object-cover border border-[#8B7355]/40" 
                      />
                    ) : (
                      <User className="w-3.5 h-3.5 text-[#8B7355]" />
                    )}
                    <span>User Profile</span>
                  </button>

                  <button
                    onClick={() => { setIsMobileOpen(false); onLogout(); }}
                    className="w-full py-2.5 rounded-2xl bg-transparent text-[#B85C38] hover:bg-[#FFF5F2] font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setIsMobileOpen(false); onSignIn(); }}
                  className="w-full py-3 rounded-2xl bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
                >
                  <Users className="w-3.5 h-3.5 opacity-80" />
                  <span>Authorized Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
