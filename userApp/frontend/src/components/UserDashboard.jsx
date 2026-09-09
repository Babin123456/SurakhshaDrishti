import React, { useState, useEffect } from 'react';
import RealGoogleMap from './RealGoogleMap';
import AlertNotification from './AlertNotification';
import { apiService } from '../utils/api';

// Haversine distance helper (km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

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
        let activeZones = [];
        if (response.success && response.zones) {
          activeZones = response.zones.filter(z => z.status === 'ACTIVE_RED_ZONE' || z.status === 'ACTIVE_WARNING_ZONE');
        } else if (Array.isArray(response)) {
          activeZones = response.filter(z => z.status === 'ACTIVE_RED_ZONE' || z.status === 'ACTIVE_WARNING_ZONE');
        }

        // Civilian filter: Only show the Red Zone if the user is actually inside its blast radius
        if (activeZones.length > 0 && userLat && userLng) {
          activeZones = activeZones.filter(z => {
            const distKm = calculateDistance(userLat, userLng, parseFloat(z.lat), parseFloat(z.lng));
            const radiusMeters = parseFloat(z.radius_meters) || 7000;
            return distKm * 1000 <= radiusMeters;
          });
        }

        if (activeZones.length > 0) {
          // Map backend snake_case to frontend camelCase expected by RealGoogleMap
          const mappedZones = activeZones.map(z => ({
            id: z.zone_id,
            name: z.name,
            shortName: z.name,
            lat: parseFloat(z.lat),
            lng: parseFloat(z.lng),
            radiusMeters: parseFloat(z.radius_meters) || 7000,
            type: z.zone_type?.toLowerCase() || 'red',
            riskScore: z.risk_score || 95,
            hazard: z.hazard_type || 'Unknown Threat',
            populationRisk: z.population_risk || 0,
            safeSite: { name: 'Scanning for Hubs...', capacity: '...', lat: parseFloat(z.lat) + 0.05, lng: parseFloat(z.lng) + 0.05 },
            evacEta: 'Calculating...',
            geohash: z.geohash || 'gxxxx',
            state: z.state || 'Local Area'
          }));
          setZones(mappedZones);
          setIsEmergency(true);
        } else {
          setZones([]);
          setIsEmergency(false);
        }
      } catch (err) {
        console.error("Failed to fetch zones for client app:", err);
      }
    };
    
    fetchZones();
    const interval = setInterval(fetchZones, 10000);
    return () => clearInterval(interval);
  }, [currentRoute]);

  const [sortedSafehouses, setSortedSafehouses] = useState([]);
  const [selectedSafehouse, setSelectedSafehouse] = useState('');

  const [currentRadius, setCurrentRadius] = useState(7000);
  const [hasAlerted, setHasAlerted] = useState(false);

  // Auto-trigger the siren/Electron popup if user is inside a red zone
  useEffect(() => {
    if (zones && zones.length > 0 && userLat && userLng && !hasAlerted) {
      const closestZone = zones[0];
      const distKm = calculateDistance(userLat, userLng, closestZone.lat, closestZone.lng);
      if (distKm * 1000 <= (closestZone.radiusMeters || 7000)) {
        if (window.electronAPI) {
          window.electronAPI.triggerAlert(`EMERGENCY: EVACUATE ${closestZone.name.toUpperCase()} IMMEDIATELY`);
        }
        setHasAlerted(true);
      }
    }
  }, [zones, userLat, userLng, hasAlerted]);

  // Background GPS transmission during active emergency
  useEffect(() => {
    if (!isEmergency || !userLat || !userLng) return;

    const transmitLocation = async () => {
      try {
        await fetch('http://localhost:5000/api/zones/update-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session?.email || session?.phone || `user_${Date.now()}`,
            lat: userLat,
            lng: userLng
          })
        });
      } catch (err) {
        console.warn("Failed to transmit SOS location.");
      }
    };

    // Immediate ping, then every 30 seconds
    transmitLocation();
    const pingInterval = setInterval(transmitLocation, 30000);
    return () => clearInterval(pingInterval);
  }, [isEmergency, userLat, userLng, session]);

  useEffect(() => {
    if (zones && zones.length > 0 && userLat && userLng) {
      // Find closest active zone to determine search radius
      let closestZone = zones[0];
      let minDist = calculateDistance(userLat, userLng, closestZone.lat, closestZone.lng);
      for (let i = 1; i < zones.length; i++) {
        let dist = calculateDistance(userLat, userLng, zones[i].lat, zones[i].lng);
        if (dist < minDist) {
          minDist = dist;
          closestZone = zones[i];
        }
      }
      if (closestZone.radius_meters && closestZone.radius_meters !== currentRadius) {
        setCurrentRadius(closestZone.radius_meters);
      }
    }
  }, [zones, userLat, userLng, currentRadius]);

  useEffect(() => {
    if (userLat && userLng) {
      apiService.fetchDynamicShelters(userLat, userLng, currentRadius).then(res => {
        if (res.success && res.shelters) {
          const sorted = res.shelters.map(sh => ({
            ...sh,
            distance: calculateDistance(userLat, userLng, sh.lat, sh.lng)
          })).sort((a, b) => a.distance - b.distance);
          setSortedSafehouses(sorted);
          if (sorted.length > 0) setSelectedSafehouse(sorted[0].shelter_id);
        }
      });
    }
  }, [userLat, userLng, currentRadius]);

  // Trigger test alert manually for the Electron demo
  const handleTestAlert = () => {
    if (window.electronAPI) {
      window.electronAPI.triggerAlert('EMERGENCY: EVACUATE IMMEDIATELY');
    }
  };

  if (currentRoute.includes('/alert')) {
    return <AlertNotification />;
  }

  const [routeCoordinates, setRouteCoordinates] = useState(null);

  // Fetch real road GPS polyline using Open Source Routing Machine (OSRM)
  useEffect(() => {
    const fetchRoute = async () => {
      const safehouse = sortedSafehouses.find(sh => sh.shelter_id === selectedSafehouse) || sortedSafehouses[0];
      if (!safehouse || !userLat || !userLng) return;

      try {
        // OSRM expects: longitude,latitude
        const url = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${safehouse.lng},${safehouse.lat}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          // OSRM returns [longitude, latitude], Leaflet needs [latitude, longitude]
          const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setRouteCoordinates(coords);
        } else {
          // Fallback to straight line
          setRouteCoordinates([[parseFloat(userLat), parseFloat(userLng)], [parseFloat(safehouse.lat), parseFloat(safehouse.lng)]]);
        }
      } catch (err) {
        setRouteCoordinates([[parseFloat(userLat), parseFloat(userLng)], [parseFloat(safehouse.lat), parseFloat(safehouse.lng)]]);
      }
    };

    fetchRoute();
  }, [selectedSafehouse, sortedSafehouses, userLat, userLng]);

  // Dynamically attach the selected safehouse and polyline route to the map data
  const zonesWithSafehouse = React.useMemo(() => {
    if (!zones || zones.length === 0) return [];
    const safehouse = sortedSafehouses.find(sh => sh.shelter_id === selectedSafehouse) || sortedSafehouses[0];
    if (!safehouse) return zones;

    return zones.map(z => {
      return {
        ...z,
        safeSite: { 
          name: safehouse.name, 
          capacity: safehouse.capacity_total, 
          lat: parseFloat(safehouse.lat), 
          lng: parseFloat(safehouse.lng) 
        },
        wayroute: routeCoordinates,
        corridorName: safehouse.evacuation_corridor || 'Dynamic Relief Route',
        evacEta: safehouse.distance ? `${Math.ceil(safehouse.distance * 15)} mins` : 'Immediate'
      };
    });
  }, [zones, sortedSafehouses, selectedSafehouse, userLat, userLng]);

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
              <span>📍 {session?.location?.address || `${userLat.toFixed(4)}°N, ${userLng.toFixed(4)}°E`}</span>
            </div>
          )}

          <p className="text-xs text-stone-600 font-mono mt-1">
            Status: {isEmergency ? '🔴 EMERGENCY MODE' : '🟢 STANDBY MODE'}
          </p>
        </div>

      {/* The Map — centered on user's location */}
      <RealGoogleMap
        standalone={true}
        zones={isEmergency ? zonesWithSafehouse : []}
        zoom={isEmergency ? 11 : 14}
        center={userLat && userLng ? [userLat, userLng] : undefined}
        userLocationOverride={userLat && userLng ? { lat: userLat, lng: userLng, address: session?.location?.address } : null}
        topBarAccessory={
          <div className="flex items-center gap-1.5 ml-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest hidden md:inline">Safehouse:</span>
            <select 
              value={selectedSafehouse} 
              onChange={e => setSelectedSafehouse(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-[10px] sm:text-[11px] rounded px-1.5 py-0.5 focus:outline-none focus:border-emerald-500 max-w-[120px] sm:max-w-[200px]"
            >
              {sortedSafehouses.length === 0 && <option>Scanning...</option>}
              {sortedSafehouses.map(sh => {
                const isFull = sh.status === 'FULL' || sh.capacity_occupied >= sh.capacity_total;
                return (
                  <option key={sh.shelter_id} value={sh.shelter_id} className={isFull ? "text-red-400 bg-slate-900" : "bg-slate-900"}>
                    {sh.is_officially_registered ? '🏛️' : '🗺️'} {sh.name.substring(0, 25)}{sh.name.length > 25 ? '...' : ''} {isFull ? ' (FULL)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
        }
      />
    </div>
  );
}
