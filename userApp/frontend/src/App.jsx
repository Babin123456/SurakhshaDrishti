import React, { useState } from 'react';
import AppLogin from './components/AppLogin';
import UserDashboard from './components/UserDashboard';
import AgentDashboard from './components/AgentDashboard';
import AlertNotification from './components/AlertNotification';

export default function App() {
  const [session, setSession] = useState(null);

  // If the Electron alert window loads this app at /alert, show the alert immediately
  // regardless of session state. This is critical — the alert window is a SEPARATE 
  // BrowserWindow that has no session context.
  const isAlertRoute = window.location.pathname === '/alert' || window.location.hash === '#/alert';
  if (isAlertRoute) {
    return <AlertNotification />;
  }

  const handleLogin = (userData) => {
    setSession(userData);
  };

  const handleLogout = () => {
    setSession(null);
  };

  if (!session) {
    return <AppLogin onLogin={handleLogin} />;
  }

  if (session.role === 'user') {
    return <UserDashboard onLogout={handleLogout} session={session} />;
  }

  if (session.role === 'agent') {
    return <AgentDashboard onLogout={handleLogout} session={session} />;
  }

  return null;
}
