import React, { useState } from 'react';
import AppLogin from './components/AppLogin';
import UserDashboard from './components/UserDashboard';
import AgentDashboard from './components/AgentDashboard';

export default function App() {
  const [session, setSession] = useState(null);

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
