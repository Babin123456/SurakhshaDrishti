import React, { useState, useEffect } from 'react';
import RealGoogleMap from './components/RealGoogleMap';
import AlertNotification from './components/AlertNotification';
import { api } from './utils/api';

export default function App() {
  const [isEmergency, setIsEmergency] = useState(false);
  const [zones, setZones] = useState([]);
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname + window.location.hash);

  useEffect(() => {
    const handlePopState = () => setCurrentRoute(window.location.pathname + window.location.hash);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Poll for zones to see if there's an emergency
  useEffect(() => {
    // Only poll if on main view
    if (currentRoute.includes('/alert')) return;
    
    const fetchZones = async () => {
      try {
        const response = await api.get('/zones');
        const activeZones = response.data.filter(z => z.status === 'active');
        setZones(activeZones);
        setIsEmergency(activeZones.length > 0);
      } catch (err) {
        console.error("Failed to fetch zones for client app:", err);
      }
    };
    
    fetchZones();
    const interval = setInterval(fetchZones, 10000);
    return () => clearInterval(interval);
  }, [currentRoute]);

  // Trigger test alert manually for the Electron demo
  const handleTestAlert = () => {
    if (window.electronAPI) {
      window.electronAPI.triggerAlert('EMERGENCY: EVACUATE IMMEDIATELY');
    }
  };

  if (currentRoute.includes('/alert')) {
    return <AlertNotification />;
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[#F6F4F0]">
      {/* Absolute overlay for Testing in dev */}
      <div className="absolute top-4 left-4 z-[9999] bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-red-500 max-w-sm">
        <h2 className="text-red-600 font-bold mb-2 uppercase text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          SurakshaDrishti Client System
        </h2>
        <p className="text-xs text-stone-600 mb-3 font-mono">
          Status: {isEmergency ? 'EMERGENCY MODE' : 'STANDBY MODE'}
        </p>
        <button 
          onClick={handleTestAlert}
          className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs uppercase"
        >
          Trigger Push Alert Demo
        </button>
      </div>

      {/* The Map */}
      <RealGoogleMap
        standalone={true}
        // If emergency, show red zones, else show NO zones (just map)
        zones={isEmergency ? zones : []}
        zoom={isEmergency ? 11 : 14}
        // Will auto-center on user if no zones are selected
      />
    </div>
  );
}
