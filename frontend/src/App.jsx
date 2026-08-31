import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LiveStatsStrip from './components/LiveStatsStrip';
import FeaturesShowcase from './components/FeaturesShowcase';
import HowItWorks from './components/HowItWorks';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import AuthSection from './components/AuthSection';
import EmergencyMode from './components/EmergencyMode';
import QuickSignModal from './components/QuickSignModal';
import Dashboard from './components/Dashboard';
import IntroSequence from './components/IntroSequence';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);
  const [userSession, setUserSession] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [showEmergency, setShowEmergency] = useState(false);
  const [showQuickSign, setShowQuickSign] = useState(false);
  const [quickSignLocation, setQuickSignLocation] = useState(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    // Lock scroll during intro
    if (showIntro) {
      lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis.start();
      document.body.style.overflow = '';
    }

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      window.__lenis = null;
      document.body.style.overflow = '';
      lenis.destroy();
    };
  }, [showIntro]);

  const handleOpenAuth = (mode = 'signin') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleAuthSuccess = (session) => {
    setUserSession(session);
    setShowAuth(false);
    setShowEmergency(false);
    setShowQuickSign(false);
  };

  const handleLogout = () => {
    setUserSession(null);
  };

  const handleSelectZoneFromHero = (zone) => {
    setQuickSignLocation({
      coords: { lat: zone.lat, lng: zone.lng },
      inRedZone: zone.type === 'red',
      name: `${zone.name} (${zone.hazard})`,
    });
    setShowQuickSign(true);
  };

  if (userSession) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
        <Dashboard
          user={userSession.user || userSession}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-red-600/40 selection:text-white relative overflow-hidden">
      
      {showIntro && (
        <IntroSequence
          onComplete={() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
            setShowIntro(false);
            requestAnimationFrame(() => setMainVisible(true));
          }}
        />
      )}

      {/* Ambient background particles and glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute top-2/3 left-1/3 w-[450px] h-[450px] bg-red-600/5 rounded-full blur-[130px] animate-pulse-slow"></div>
      </div>

      <div
        className="relative z-10"
        style={{
          opacity: mainVisible ? 1 : 0,
          transform: mainVisible ? 'translateY(0)' : 'translateY(18px)',
          transition: 'opacity 0.75s ease-out, transform 0.75s ease-out',
        }}
      >
        <Navbar
          onSignIn={() => handleOpenAuth('signin')}
          onSignUp={() => handleOpenAuth('signup')}
          onEmergencyAccess={() => setShowEmergency(true)}
        />

        <HeroSection
          onExplore={() => handleOpenAuth('signup')}
          onEmergencyAccess={() => setShowEmergency(true)}
          onSelectZone={handleSelectZoneFromHero}
        />

        <LiveStatsStrip />
        <FeaturesShowcase />
        <HowItWorks />

        <CTASection
          onExplore={() => handleOpenAuth('signin')}
          onSignUp={() => handleOpenAuth('signup')}
          onEmergencyAccess={() => setShowEmergency(true)}
          onQuickSign={() => setShowQuickSign(true)}
        />

        <Footer />
      </div>

      {showAuth && (
        <AuthSection
          initialMode={authMode}
          onClose={() => setShowAuth(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {showEmergency && (
        <EmergencyMode
          onClose={() => setShowEmergency(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {showQuickSign && (
        <QuickSignModal
          locationStatus={quickSignLocation || {
            coords: { lat: 11.5583, lng: 76.1384 },
            inRedZone: true,
            name: 'Red Zone — Wayanad Sector 4',
          }}
          onClose={() => {
            setShowQuickSign(false);
            setQuickSignLocation(null);
          }}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
