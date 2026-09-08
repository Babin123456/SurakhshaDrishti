import React, { useState, useEffect } from 'react';
import RealGoogleMap from './RealGoogleMap';
import AlertNotification from './AlertNotification';
import { apiService } from '../utils/api';

export default function UserDashboard({ onLogout, session }) {
  const [isEmergency, setIsEmergency] = useState(false);
  const [zones, setZones] = useState([]);
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname + window.location.hash);

  // Extract user's GPS from the session that was passed from login
  const userLat = session?.location?.lat;
  const userLng = session?.location?.lng;

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
    if (currentRoute.includes('/alert')) return;
    
    const fetchZones = async () => {
      try {
        const response = await apiService.fetchZones();
        if (response.success && response.zones) {
          const activeZones = response.zones.filter(z => z.status === 'active');
          setZones(activeZones);
          setIsEmergency(activeZones.length > 0);
        } else if (Array.isArray(response)) {
          const activeZones = response.filter(z => z.status === 'active');
          setZones(activeZones);
          setIsEmergency(activeZones.length > 0);
        }
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
      {/* User Status Overlay */}
      <div className="absolute top-20 left-4 z-[9999] bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-stone-200 max-w-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-teal-700 font-bold uppercase text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SurakshaDrishti User
          </h2>
          <button 
            onClick={onLogout}
            className="text-xs text-stone-500 hover:text-red-500 font-bold underline"
          >
            Logout
          </button>
        </div>
        
        {/* Show detected location */}
        {userLat && userLng && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-xs text-emerald-800 font-mono">
            📍 {session.location.address || `${userLat.toFixed(4)}°N, ${userLng.toFixed(4)}°E`}
          </div>
        )}

        <p className="text-xs text-stone-600 font-mono">
          Status: {isEmergency ? '🔴 EMERGENCY MODE' : '🟢 STANDBY MODE'}
        </p>
        <button 
          onClick={handleTestAlert}
          className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs uppercase"
        >
          Trigger Push Alert Demo
        </button>
      </div>

      {/* The Map — centered on user's location */}
      <RealGoogleMap
        standalone={true}
        zones={isEmergency ? zones : []}
        zoom={isEmergency ? 11 : 14}
        center={userLat && userLng ? [userLat, userLng] : undefined}
        userLocationOverride={userLat && userLng ? { lat: userLat, lng: userLng, address: session?.location?.address } : null}
      />
    </div>
  );
}
