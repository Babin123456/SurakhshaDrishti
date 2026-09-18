import React, { useState, useEffect } from 'react';
import AppLogin from './components/AppLogin';
import UserDashboard from './components/UserDashboard';
import AgentDashboard from './components/AgentDashboard';
import AlertNotification from './components/AlertNotification';
import IntroSequence from './components/IntroSequence';

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    // Show intro on initial application boot
    return !sessionStorage.getItem('suraksha_intro_shown');
  });

  const [session, setSession] = useState(() => {
    try {
      const saved = sessionStorage.getItem('suraksha_app_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Purge any stale localStorage session on boot to guarantee clean role & phone authentication
  useEffect(() => {
    try {
      localStorage.removeItem('suraksha_app_session');
    } catch (e) {}
  }, []);

  // If the Electron alert window loads this app at /alert, show the alert immediately
  // regardless of session state. This is critical — the alert window is a SEPARATE 
  // BrowserWindow that has no session context.
  const isAlertRoute = window.location.pathname === '/alert' || window.location.hash === '#/alert';
  if (isAlertRoute) {
    return <AlertNotification />;
  }

  if (showIntro) {
    return (
      <IntroSequence 
        onComplete={() => {
          sessionStorage.setItem('suraksha_intro_shown', 'true');
          setShowIntro(false);
        }} 
      />
    );
  }

  const handleLogin = (userData) => {
    setSession(userData);
    try {
      sessionStorage.setItem('suraksha_app_session', JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to persist session', e);
    }
  };

  const handleLogout = () => {
    setSession(null);
    try {
      sessionStorage.removeItem('suraksha_app_session');
      localStorage.removeItem('suraksha_app_session');
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
