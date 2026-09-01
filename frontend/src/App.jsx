import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

import PrivacyPolicy from './components/pages/PrivacyPolicy';
import TermsOfService from './components/pages/TermsOfService';
import Faqs from './components/pages/Faqs';
import Documentation from './components/pages/Documentation';

export default function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const [showIntro, setShowIntro] = useState(false);
  
  const [userSession, setUserSession] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [showEmergency, setShowEmergency] = useState(false);
  const [showQuickSign, setShowQuickSign] = useState(false);
  const [quickSignLocation, setQuickSignLocation] = useState(null);

  useEffect(() => {
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    if (isHomePage) {
      const savedScrollPos = sessionStorage.getItem('landing_scroll_pos');
      if (savedScrollPos !== null) {
        const targetPos = parseInt(savedScrollPos, 10);
        const restoreScroll = () => {
          if (window.__lenis) {
            window.__lenis.scrollTo(targetPos, { immediate: true });
          } else {
            window.scrollTo({ top: targetPos, behavior: 'instant' });
          }
        };

        restoreScroll();
        const t1 = setTimeout(restoreScroll, 30);
        const t2 = setTimeout(restoreScroll, 120);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    }
  }, [isHomePage]);

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

  const handleLaunchAdminConsole = () => {
    setUserSession({
      user: {
        user_id: 'ndrf_command_chief',
        username: 'NDRF Command Chief',
        name: 'NDRF Commander (Admin)',
        role: 'NDRF',
        officer_mode: 'OFF_SITE',
        district: 'Wayanad Sector 4'
      }
    });
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

  if (location.pathname === '/privacy') {
    return <PrivacyPolicy />;
  }

  if (location.pathname === '/terms') {
    return <TermsOfService />;
  }

  if (location.pathname === '/faqs') {
    return <Faqs />;
  }

  if (location.pathname === '/documentation') {
    return <Documentation />;
  }

  return (
    <div className="min-h-screen bg-matte-grid text-slate-200 font-sans selection:bg-blue-600/40 selection:text-white relative overflow-x-hidden">
      
      {showIntro && (
        <IntroSequence
          onComplete={() => {
            sessionStorage.setItem('intro_shown', 'true');
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
            setShowIntro(false);
          }}
        />
      )}

      {/* Ambient background particles and glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-2/3 left-1/3 w-[450px] h-[450px] bg-red-600/5 rounded-full blur-[130px]"></div>
      </div>

      {/* Global Fixed Navbar */}
      <Navbar
        onSignIn={() => handleOpenAuth('signin')}
        onSignUp={() => handleOpenAuth('signup')}
        onEmergencyAccess={() => setShowEmergency(true)}
      />

      <div className="relative z-10">
        <HeroSection
          onExplore={handleLaunchAdminConsole}
          onEmergencyAccess={() => setShowEmergency(true)}
          onSelectZone={handleSelectZoneFromHero}
        />

        <LiveStatsStrip />
        <FeaturesShowcase />
        <HowItWorks />

        <CTASection
          onExplore={handleLaunchAdminConsole}
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
          locationStatus={quickSignLocation}
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
