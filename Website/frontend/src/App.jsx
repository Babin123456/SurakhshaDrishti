import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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

  // Only show intro loader once per session when arriving at home page and not logged in
  const [showIntro, setShowIntro] = useState(() => {
    try {
      const saved = localStorage.getItem('suraksha_user_session');
      if (saved) return false;
      const introAlreadyShown = sessionStorage.getItem('suraksha_intro_shown');
      if (introAlreadyShown) return false;
    } catch {}
    return isHomePage;
  });
  const [isBlurTransitioning, setIsBlurTransitioning] = useState(false);

  // Set scroll restoration to manual and ensure home page refresh stays at the top
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (isHomePage) {
      // If user is refreshing or loading the top of the Home page, ensure it starts at top 0
      const hasHash = window.location.hash;
      const savedPos = sessionStorage.getItem('landing_scroll_pos');

      if (!hasHash && !savedPos) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
      } else if (savedPos) {
        // Once consumed from footer subpage back-navigation, clear it immediately
        sessionStorage.removeItem('landing_scroll_pos');
        const top = parseInt(savedPos, 10);
        if (!isNaN(top) && top > 0) {
          setTimeout(() => {
            window.scrollTo({ top, behavior: 'smooth' });
            if (window.__lenis) window.__lenis.scrollTo(top, { immediate: false });
          }, 80);
        }
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
    setIsSectionLoading(true);
    setLoaderMessage('Closing session & returning to Home Portal...');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });

    setTimeout(() => {
      setUserSession(null);
      try {
        localStorage.removeItem('suraksha_user_session');
      } catch {}
      navigate('/', { replace: true });
      setIsSectionLoading(false);
    }, 700);
  };

  const handleIntroComplete = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    try {
      sessionStorage.setItem('suraksha_intro_shown', 'true');
    } catch {}
    // Start the landing page blur reveal immediately
    setIsBlurTransitioning(true);
    // Delay removing the loader from the DOM until its 1000ms CSS fade-out finishes
    setTimeout(() => {
      setShowIntro(false);
    }, 1000);
  }, []);

  const navigate = useNavigate();

  // Route path to view mapping
  // /dashboard -> Dashboard, /profile -> UserProfile, / -> Home
  const currentPath = location.pathname;

  // Track path and refreshing:
  // First time entering: Main IntroSequence loader runs (and marks sessionStorage 'suraksha_intro_shown')
  // For all refreshes (including Home, Dashboard, subpages) or page switches: In-App circular loader runs
  const prevPathRef = useRef(currentPath);
  const [isSectionLoading, setIsSectionLoading] = useState(() => {
    // If intro sequence is already running, don't show the in-app loader simultaneously
    try {
      const introAlreadyShown = sessionStorage.getItem('suraksha_intro_shown');
      // If intro has already been shown once, this is a subsequent visit or refresh: show the snappy in-app loader
      if (introAlreadyShown) {
        return true;
      }
    } catch {}
    return false;
  });
  const [loaderMessage, setLoaderMessage] = useState('Synchronizing GIS Decision Network...');

  // Auto-dismiss the refresh loader on initial mount if active
  useEffect(() => {
    if (isSectionLoading) {
      const initialTimer = setTimeout(() => {
        setIsSectionLoading(false);
      }, 500);
      return () => clearTimeout(initialTimer);
    }
  }, []);

  useEffect(() => {
    const isSamePath = prevPathRef.current === currentPath;
    prevPathRef.current = currentPath;

    // Set contextual loader message based on destination section
    let msg = 'Synchronizing GIS Decision Network...';
    if (currentPath === '/') msg = 'Refining GIS Multi-Hazard Topography...';
    else if (currentPath === '/dashboard') msg = 'Initializing Command Telemetry HUD...';
    else if (currentPath === '/profile') msg = 'Retrieving Officer Security Dossier...';
    else if (currentPath === '/privacy') msg = 'Verifying Legal & Data Protection Compliance...';
    else if (currentPath === '/terms') msg = 'Loading Operating Protocol Governance...';
    else if (currentPath === '/faqs') msg = 'Querying Knowledge Base & Triage Records...';
    else if (currentPath === '/documentation') msg = 'Accessing Technical API Architecture...';

    // If navigating between different paths, show the snappy circular transition loader
    if (!isSamePath) {
      setIsSectionLoading(true);
      setLoaderMessage(msg);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      }

      const timer = setTimeout(() => {
        setIsSectionLoading(false);
      }, 450);

      return () => clearTimeout(timer);
    }
  }, [currentPath]);

  // Clean navigation helper
  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  // Minimal Circular In-App Loader (Used for all refreshes and route transitions)
  const SectionLoaderOverlay = isSectionLoading ? (
    <div className="fixed inset-0 z-[99999] bg-[#FDFBF7]/85 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto transition-opacity duration-300 animate-in fade-in">
      <div className="relative flex items-center justify-center">
        {/* Outer Circular Track */}
        <div className="w-16 h-16 rounded-full border-2 border-[#E8E1D5]"></div>
        {/* Spinning Circular Accent */}
        <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-[#8B7355] border-r-[#2D7A4F] animate-spin absolute"></div>
        {/* Inner Brand Emblem (Clean, No box) */}
        <div className="w-10 h-10 flex items-center justify-center absolute">
          <img 
            src="/favicon.webp" 
            alt="SurakshaDrishti Emblem" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center text-center">
        <span className="text-[11px] font-bold text-[#1A1A1A] tracking-wider uppercase">
          Suraksha<span className="text-[#8B7355]">Drishti</span>
        </span>
        <span className="text-[9px] font-mono text-[#7A726A] mt-0.5">
          {loaderMessage}
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

  // Profile Route: accessible when on /profile
  if (location.pathname === '/profile') {
    if (!userSession) {
      // Non-authenticated user accessing /profile -> redirect to home
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <div className="text-center p-6 max-w-sm">
            <h2 className="text-base font-bold text-[#1A1A1A] mb-2">Authentication Required</h2>
            <p className="text-xs text-[#5C544D] mb-4">Please sign in to access officer profile credentials.</p>
            <button
              onClick={() => {
                navigate('/');
                handleOpenAuth('signin');
              }}
              className="px-4 py-2 rounded-xl bg-[#2C2A29] text-[#FDFBF7] text-xs font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      );
    }

    const currentUser = userSession.user || userSession;
    return (
      <>
        {SectionLoaderOverlay}
        <UserProfile
          user={currentUser}
          onUpdateUser={(updated) => {
            const currentPfp = updated.profile_picture || updated.avatar || localStorage.getItem('suraksha_user_pfp');
            const nextUserData = {
              ...(userSession.user || userSession),
              ...updated,
              profile_picture: currentPfp,
              avatar: currentPfp
            };
            const nextSession = {
              ...userSession,
              ...nextUserData,
              user: nextUserData
            };
            setUserSession(nextSession);
            try {
              localStorage.setItem('suraksha_user_session', JSON.stringify(nextSession));
            } catch {}
          }}
          onBack={() => {
            navigate('/dashboard');
          }}
          onNavigateHome={() => {
            navigate('/');
          }}
          onLogout={handleLogout}
        />
      </>
    );
  }

  // Dashboard Route: accessible when on /dashboard
  if (location.pathname === '/dashboard') {
    if (!userSession) {
      // Non-authenticated user accessing /dashboard -> redirect to home
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <div className="text-center p-6 max-w-sm">
            <h2 className="text-base font-bold text-[#1A1A1A] mb-2">Authentication Required</h2>
            <p className="text-xs text-[#5C544D] mb-4">Please authenticate to open the GIS Command Console.</p>
            <button
              onClick={() => {
                navigate('/');
                handleOpenAuth('signin');
              }}
              className="px-4 py-2 rounded-xl bg-[#2C2A29] text-[#FDFBF7] text-xs font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      );
    }

    const currentUser = userSession.user || userSession;
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-sans relative flex flex-col justify-between">
        {SectionLoaderOverlay}
        <div className="paper-texture"></div>
        <div className="flex-1">
          <Dashboard
            user={currentUser}
            onNavigateProfile={() => {
              navigate('/profile');
            }}
            onNavigateHome={() => {
              navigate('/');
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

  // Main Landing Page (Explicitly mapped to route '/')
  // Refreshing on Home portal STAY ON '/' and will NEVER push to dashboard
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-stone-800/20 selection:text-stone-900 relative overflow-x-hidden">
      {/* Circular In-App Loader (Used on page refreshes and route transitions) */}
      {SectionLoaderOverlay}

      {/* 1. Intro Sequence Loader (Only for very first entry into the portal) */}
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
          onNavigateDashboard={() => navigate('/dashboard')}
          onNavigateProfile={() => navigate('/profile')}
          onLogout={handleLogout}
        />
      )}

      {/* 3. Main Landing Page Content with Smooth Blur Reveal */}
      <div className={isBlurTransitioning ? 'animate-blur-reveal' : ''}>
        {/* Hero Section (Government Style) */}
        <GovernmentLanding 
          userSession={userSession}
          onSignIn={() => {
            if (userSession) {
              navigate('/dashboard');
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
