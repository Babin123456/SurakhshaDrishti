import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
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
import UserProfile from './components/pages/UserProfile';

export default function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Only show intro loader on home page if user is not already logged in
  const [showIntro, setShowIntro] = useState(() => {
    try {
      const saved = localStorage.getItem('suraksha_user_session');
      if (saved) return false;
    } catch {}
    return isHomePage;
  });
  const [isBlurTransitioning, setIsBlurTransitioning] = useState(false);

  // Restore scroll position when navigating back to home
  useEffect(() => {
    if (isHomePage) {
      const savedPos = sessionStorage.getItem('landing_scroll_pos');
      if (savedPos) {
        const top = parseInt(savedPos, 10);
        setTimeout(() => {
          window.scrollTo({ top, behavior: 'smooth' });
          if (window.__lenis) window.__lenis.scrollTo(top, { immediate: false });
        }, 80);
      }
    }
  }, [isHomePage]);
  
  const [userSession, setUserSession] = useState(() => {
    try {
      const saved = localStorage.getItem('suraksha_user_session');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      const customCreds = localStorage.getItem('suraksha_user_credentials');
      const customPfp = localStorage.getItem('suraksha_user_pfp');
      const creds = customCreds ? JSON.parse(customCreds) : {};
      
      const mergedUser = {
        ...(parsed.user || parsed),
        ...creds,
        ...(customPfp ? { profile_picture: customPfp, avatar: customPfp } : {})
      };

      return {
        ...parsed,
        ...mergedUser,
        user: mergedUser
      };
    } catch {
      return null;
    }
  });

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
    try {
      localStorage.setItem('suraksha_user_session', JSON.stringify(session));
    } catch {}
    setShowAuth(false);
    setShowEmergency(false);
    setShowQuickSign(false);
  };

  const handleLogout = () => {
    setUserSession(null);
    try {
      localStorage.removeItem('suraksha_user_session');
    } catch {}
  };

  const handleIntroComplete = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    // Start the landing page blur reveal immediately
    setIsBlurTransitioning(true);
    // Delay removing the loader from the DOM until its 1000ms CSS fade-out finishes
    setTimeout(() => {
      setShowIntro(false);
    }, 1000);
  }, []);

  const [activeView, setActiveView] = useState('dashboard');
  const [isSectionLoading, setIsSectionLoading] = useState(false);

  // Trigger minimal 1-second circle loader when redirecting between sections
  useEffect(() => {
    setIsSectionLoading(true);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }

    const timer = setTimeout(() => {
      setIsSectionLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeView, location.pathname]);

  // Minimal Circular In-App Section Transition Loader
  const SectionLoaderOverlay = isSectionLoading ? (
    <div className="fixed inset-0 z-[99999] bg-[#FDFBF7]/85 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto transition-opacity duration-300 animate-in fade-in">
      <div className="relative flex items-center justify-center">
        {/* Outer Circular Track */}
        <div className="w-14 h-14 rounded-full border-2 border-[#E8E1D5]"></div>
        {/* Spinning Circular Accent */}
        <div className="w-14 h-14 rounded-full border-2 border-transparent border-t-[#8B7355] border-r-[#2D7A4F] animate-spin absolute"></div>
        {/* Inner Subtle Pulsing Core */}
        <div className="w-4 h-4 rounded-full bg-[#2C2A29] animate-ping opacity-25 absolute"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#8B7355] absolute"></div>
      </div>
      <div className="mt-4 flex flex-col items-center text-center">
        <span className="text-[11px] font-bold text-[#1A1A1A] tracking-wider uppercase">
          Suraksha<span className="text-[#8B7355]">Drishti</span>
        </span>
        <span className="text-[9px] font-mono text-[#7A726A] mt-0.5">
          Connecting Secure Sector Nodes...
        </span>
      </div>
    </div>
  ) : null;

  // Static Pages Route rendering (Accessible from anywhere including Dashboard)
  if (location.pathname === '/privacy') {
    return (
      <>
        {SectionLoaderOverlay}
        <PrivacyPolicy />
      </>
    );
  }
  if (location.pathname === '/terms') {
    return (
      <>
        {SectionLoaderOverlay}
        <TermsOfService />
      </>
    );
  }
  if (location.pathname === '/faqs') {
    return (
      <>
        {SectionLoaderOverlay}
        <Faqs />
      </>
    );
  }
  if (location.pathname === '/documentation') {
    return (
      <>
        {SectionLoaderOverlay}
        <Documentation />
      </>
    );
  }

  // If user is logged in, handle views: 'dashboard', 'profile', or 'home'
  if (userSession && activeView !== 'home') {
    const currentUser = userSession.user || userSession;

    if (activeView === 'profile') {
      return (
        <>
          {SectionLoaderOverlay}
          <UserProfile
            user={currentUser}
            onUpdateUser={(updated) => {
              const nextSession = {
                ...userSession,
                ...updated,
                user: {
                  ...(userSession.user || {}),
                  ...updated
                }
              };
              setUserSession(nextSession);
              try {
                localStorage.setItem('suraksha_user_session', JSON.stringify(nextSession));
              } catch {}
            }}
            onBack={() => {
              setActiveView('dashboard');
            }}
            onNavigateHome={() => {
              setActiveView('home');
            }}
            onLogout={handleLogout}
          />
        </>
      );
    }

    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-sans relative flex flex-col justify-between">
        {SectionLoaderOverlay}
        <div className="paper-texture"></div>
        <div className="flex-1">
          <Dashboard
            user={currentUser}
            onNavigateProfile={() => {
              setActiveView('profile');
            }}
            onNavigateHome={() => {
              setActiveView('home');
            }}
            onLogout={handleLogout}
          />
        </div>
        {/* Footer in the Dashboard with smooth navigation to legal, FAQs, and docs */}
        <div className="relative z-20 mt-10">
          <Footer />
        </div>
      </div>
    );
  }

  // Main Landing Page (Accessible when logged out OR when logged-in user clicks 'Home Portal')
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-stone-800/20 selection:text-stone-900 relative overflow-x-hidden">
      {SectionLoaderOverlay}
      
      {/* 1. Intro Sequence Loader */}
      {showIntro && (
        <IntroSequence
          onComplete={handleIntroComplete}
        />
      )}

      {/* 2. Floating Apple-Style Shrinking Navbar (Hidden when Modals are open) */}
      {!showAuth && !showEmergency && !showQuickSign && (
        <Navbar 
          onSignIn={() => handleOpenAuth('signin')}
          onSignUp={() => handleOpenAuth('signup')}
          onEmergencyAccess={() => setShowEmergency(true)}
          userSession={userSession}
          onNavigateDashboard={() => setActiveView('dashboard')}
          onNavigateProfile={() => setActiveView('profile')}
          onLogout={handleLogout}
        />
      )}

      {/* 3. Main Landing Page Content with Smooth Blur Reveal */}
      <div className={isBlurTransitioning ? 'animate-blur-reveal' : ''}>
        {/* Hero Section (Government Style) */}
        <GovernmentLanding 
          onSignIn={() => {
            if (userSession) {
              setActiveView('dashboard');
            } else {
              handleOpenAuth('signin');
            }
          }}
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
