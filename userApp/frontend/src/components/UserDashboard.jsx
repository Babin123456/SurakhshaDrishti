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

  // Mock Safehouse Array
  const safehouses = [
    { id: 'SH1', name: 'Relief Camp Alpha — Sector 7', lat: 11.6850, lng: 76.1300 },
    { id: 'SH2', name: 'Govt. Hospital Safe Zone', lat: 11.6800, lng: 76.1250 },
    { id: 'SH3', name: 'High School Evacuation Point', lat: 11.6900, lng: 76.1400 },
    { id: 'SH4', name: 'Community Hall Shelter', lat: 11.6750, lng: 76.1150 }
  ];

  const [sortedSafehouses, setSortedSafehouses] = useState([]);
  const [selectedSafehouse, setSelectedSafehouse] = useState('');

  // Haversine distance helper
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  useEffect(() => {
    if (userLat && userLng) {
      const sorted = safehouses.map(sh => ({
        ...sh,
        distance: calculateDistance(userLat, userLng, sh.lat, sh.lng)
      })).sort((a, b) => a.distance - b.distance);
      setSortedSafehouses(sorted);
      setSelectedSafehouse(sorted[0].id); // Auto-select nearest
    } else {
      setSortedSafehouses(safehouses.map(sh => ({ ...sh, distance: 0 })));
    }
  }, [userLat, userLng]);

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
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-xs text-emerald-800 font-mono flex flex-col gap-1">
            <span>📍 {session.location.address || `${userLat.toFixed(4)}°N, ${userLng.toFixed(4)}°E`}</span>
          </div>
        )}

        {/* Safehouse Dropdown */}
        <div className="flex flex-col gap-1 mt-1">
          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Assigned Evacuation Route</label>
          <select 
            value={selectedSafehouse} 
            onChange={e => setSelectedSafehouse(e.target.value)}
            className="w-full bg-stone-100 border border-stone-300 text-stone-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {sortedSafehouses.map(sh => (
              <option key={sh.id} value={sh.id}>
                {sh.name} {sh.distance > 0 ? `(${sh.distance.toFixed(1)} km away)` : ''}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-stone-600 font-mono mt-1">
          Status: {isEmergency ? '🔴 EMERGENCY MODE' : '🟢 STANDBY MODE'}
        </p>
        <button 
          onClick={handleTestAlert}
          className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs uppercase transition-colors"
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
