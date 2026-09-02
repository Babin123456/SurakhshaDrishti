import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Pages & Sections
import GovernmentLanding from './components/GovernmentLanding';
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

  // If user is logged in, show dashboard
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

  // Static Pages Route rendering
  if (location.pathname === '/privacy') return <PrivacyPolicy />;
  if (location.pathname === '/terms') return <TermsOfService />;
  if (location.pathname === '/faqs') return <Faqs />;
  if (location.pathname === '/documentation') return <Documentation />;

  // Main Landing Page
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-stone-800/20 selection:text-stone-900 relative overflow-x-hidden">
      
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

      {/* Hero Section (Government Style) */}
      <GovernmentLanding 
        onSignIn={() => handleOpenAuth('signin')}
        onEmergencyAccess={() => setShowEmergency(true)}
      />

      {/* Restoring the scrolling features for "bragging" */}
      <div className="relative z-10 bg-[#FDFBF7]">
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

      {/* Modals for Auth and Emergency */}
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
