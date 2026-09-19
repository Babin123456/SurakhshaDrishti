import React, { useState, useEffect } from 'react';
import AppLogin from './components/AppLogin';
import UserDashboard from './components/UserDashboard';
import AgentDashboard from './components/AgentDashboard';
import AlertNotification from './components/AlertNotification';
import IntroSequence from './components/IntroSequence';

import { mobileStorage } from './utils/storage';

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    // Show intro on initial application boot
    return !mobileStorage.getItem('suraksha_intro_shown');
  });

  const [session, setSession] = useState(() => {
    try {
      const saved = mobileStorage.getItem('suraksha_app_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname + window.location.hash;
  });

  // Listen for mobile back button, URL hash change, and push/popstate
  useEffect(() => {
    const handleRouteSync = () => {
      setCurrentPath(window.location.pathname + window.location.hash);
    };

    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);

    // Capacitor / React Native Android Hardware Back Button Hook
    const handleAndroidBackButton = (e) => {
      if (window.location.hash || window.location.pathname !== '/') {
        window.history.back();
      }
    };
    window.addEventListener('ionBackButton', handleAndroidBackButton);
    document.addEventListener('backbutton', handleAndroidBackButton);

    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
      window.removeEventListener('ionBackButton', handleAndroidBackButton);
      document.removeEventListener('backbutton', handleAndroidBackButton);
    };
  }, []);

  // Check if current route is emergency alert route
  const isAlertRoute = currentPath.includes('/alert') || currentPath.includes('#/alert');
  if (isAlertRoute) {
    return <AlertNotification />;
  }

  if (showIntro) {
    return (
      <IntroSequence 
        onComplete={() => {
          mobileStorage.setItem('suraksha_intro_shown', 'true');
          setShowIntro(false);
        }} 
      />
    );
  }

  const handleLogin = (userData) => {
    setSession(userData);
    try {
      mobileStorage.setItem('suraksha_app_session', JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to persist session', e);
    }
  };

  const handleLogout = () => {
    setSession(null);
    try {
      mobileStorage.removeItem('suraksha_app_session');
    } catch (e) {
      console.error('Failed to clear session', e);
    }
  };

  if (!session) {
    return <AppLogin onLogin={handleLogin} />;
  }

  const r = session.role?.toLowerCase() || 'user';
  if (r === 'user' || r === 'resident') {
    return <UserDashboard onLogout={handleLogout} session={session} />;
  }

  if (r === 'agent' || r === 'ndrf' || r === 'sdma' || r === 'police' || r === 'authority') {
    return <AgentDashboard onLogout={handleLogout} session={session} />;
  }

  // Fallback to UserDashboard instead of blank screen
  return <UserDashboard onLogout={handleLogout} session={session} />;
}
