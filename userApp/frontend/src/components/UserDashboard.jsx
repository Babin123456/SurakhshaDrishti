import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  MapPin, 
  Navigation, 
  LogOut, 
  Building2, 
  Compass, 
  Radio, 
  Activity, 
  Route, 
  AlertTriangle, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
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
  const [isHudCollapsed, setIsHudCollapsed] = useState(false);

  // Extract user's GPS from the session that was passed from login, allow updates from live GPS
  const [userLat, setUserLat] = useState(session?.location?.lat);
  const [userLng, setUserLng] = useState(session?.location?.lng);

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
          const mappedZones = activeZones.map(z => ({
            id: z.zone_id,
            name: z.name,
            shortName: z.name,
            lat: parseFloat(z.lat),
            lng: parseFloat(z.lng),
            radiusMeters: parseFloat(z.radius_meters) || 7000,
            type: z.zone_type?.toLowerCase() || 'red',
            riskScore: z.risk_score || 95,
            hazard: z.hazard_type || 'Hazard Detected',
            populationRisk: z.population_risk || 0,
            safeSite: { name: 'Scanning for Hubs...', capacity: '...', lat: parseFloat(z.lat) + 0.05, lng: parseFloat(z.lng) + 0.05 },
            evacEta: 'Calculating...',
            geohash: z.geohash || 'gxxxx',
            state: z.state || 'Local Sector'
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
  const [routeTrigger, setRouteTrigger] = useState(0);

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

    transmitLocation();
    const pingInterval = setInterval(transmitLocation, 30000);
    return () => clearInterval(pingInterval);
  }, [isEmergency, userLat, userLng, session]);

  useEffect(() => {
    if (zones && zones.length > 0 && userLat && userLng) {
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

  if (currentRoute.includes('/alert')) {
    return <AlertNotification />;
  }

  const [routeCoordinates, setRouteCoordinates] = useState(null);

  // Fetch real road GPS polyline using OSRM
  useEffect(() => {
    const fetchRoute = async () => {
      const safehouse = sortedSafehouses.find(sh => sh.shelter_id === selectedSafehouse) || sortedSafehouses[0];
      if (!safehouse || !userLat || !userLng) return;

      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${safehouse.lng},${safehouse.lat}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setRouteCoordinates(coords);
        } else {
          setRouteCoordinates([[parseFloat(userLat), parseFloat(userLng)], [parseFloat(safehouse.lat), parseFloat(safehouse.lng)]]);
        }
      } catch (err) {
        setRouteCoordinates([[parseFloat(userLat), parseFloat(userLng)], [parseFloat(safehouse.lat), parseFloat(safehouse.lng)]]);
      }
    };

    fetchRoute();
  }, [selectedSafehouse, sortedSafehouses, userLat, userLng]);

  const zonesWithSafehouse = React.useMemo(() => {
    const safehouse = sortedSafehouses.find(sh => sh.shelter_id === selectedSafehouse) || sortedSafehouses[0];
    
    // If user is inside an emergency zone, augment those zones
    if (zones && zones.length > 0) {
      if (!safehouse) return zones;
      return zones.map(z => ({
        ...z,
        safeSite: { 
          name: safehouse.name, 
          capacity: safehouse.capacity_total, 
          lat: parseFloat(safehouse.lat), 
          lng: parseFloat(safehouse.lng) 
        },
        wayroute: routeCoordinates,
        corridorName: safehouse.evacuation_corridor || 'Designated Evacuation Corridor',
        evacEta: safehouse.distance ? `${Math.ceil(safehouse.distance * 15)} mins` : 'Immediate'
      }));
    }

    // When standby/all-clear: generate a safe relocation zone with route from user's current GPS to the chosen safehouse
    if (safehouse && userLat && userLng) {
      return [{
        id: 'STANDBY-SAFEHOUSE-CORRIDOR',
        name: 'Designated Safe Hub Sector',
        shortName: safehouse.name,
        lat: parseFloat(safehouse.lat),
        lng: parseFloat(safehouse.lng),
        radiusMeters: 500,
        type: 'safe',
        riskScore: 0,
        hazard: 'Safe Zone Active',
        populationRisk: 0,
        safeSite: {
          name: safehouse.name,
          capacity: safehouse.capacity_total,
          lat: parseFloat(safehouse.lat),
          lng: parseFloat(safehouse.lng)
        },
        wayroute: routeCoordinates,
        corridorName: safehouse.evacuation_corridor || 'Primary Evacuation Route',
        evacEta: safehouse.distance ? `${Math.ceil(safehouse.distance * 15)} mins` : 'Immediate'
      }];
    }

    return [];
  }, [zones, sortedSafehouses, selectedSafehouse, userLat, userLng, routeCoordinates]);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[#FDFBF7] font-sans select-none">
      {/* Civilian Status HUD Floating Card (Collapsible & Non-blocking) */}
      <div className={`absolute top-14 left-10 sm:left-12 z-[1000] bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_15px_35px_rgba(44,42,41,0.12)] border border-[#E8E1D5] transition-all duration-300 ${
        isHudCollapsed ? 'p-2 max-w-fit' : 'p-3.5 max-w-xs sm:max-w-sm w-full'
      }`}>
        
        {isHudCollapsed ? (
          /* Collapsed Pill View */
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsHudCollapsed(false)}
              className="flex items-center gap-2 text-left cursor-pointer hover:opacity-80 transition-opacity"
              title="Expand Citizen Radar Console"
            >
              <div className="w-7 h-7 rounded-xl bg-[#F6F4F0] border border-[#E8E1D5] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8B7355]" />
              </div>
              <div className="flex items-center gap-1.5 pr-1">
                <span className={`w-2 h-2 rounded-full ${isEmergency ? 'bg-[#B85C38] animate-ping' : 'bg-[#2D7A4F]'}`} />
                <span className="text-[11px] font-bold text-[#1A1A1A] tracking-tight">
                  {isEmergency ? 'Hazard Active' : 'Standby'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsHudCollapsed(false)}
              className="p-1 rounded-lg hover:bg-[#F6F4F0] text-[#7A726A] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              title="Expand Details"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Expanded Full Console View */
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-[#F6F4F0] border border-[#E8E1D5] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#8B7355]" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-[#1A1A1A] font-bold text-xs tracking-tight truncate">
                    Citizen Radar Console
                  </h2>
                  <p className="text-[10px] text-[#7A726A] font-mono truncate">
                    {session?.phone ? `+91 ${session.phone}` : (session?.email || 'Live Connected')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsHudCollapsed(true)}
                  className="p-1 rounded-lg bg-[#F6F4F0] hover:bg-[#E8E1D5] text-[#5C544D] hover:text-[#1A1A1A] border border-[#E8E1D5] text-[10px] transition-colors cursor-pointer"
                  title="Minimize to pill"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button 
                  type="button"
                  onClick={onLogout}
                  className="px-2 py-1 rounded-lg bg-[#F6F4F0] hover:bg-[#2C2A29] text-[#5C544D] hover:text-white border border-[#E8E1D5] text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  title="Sign out from session"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
            
            {/* Detected Location Badge */}
            {userLat && userLng && (
              <div className="bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl p-2 text-xs text-[#2C2A29] font-mono flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#8B7355] shrink-0" />
                <span className="truncate text-[11px]">
                  {session?.location?.address || `${userLat.toFixed(4)}°N, ${userLng.toFixed(4)}°E`}
                </span>
              </div>
            )}

            {/* Operational Status Pill */}
            <div className={`px-2.5 py-1.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
              isEmergency 
                ? 'bg-[#FFF5F2] border-[#FADED4] text-[#B85C38]' 
                : 'bg-[#EBF7EE] border-[#D4EDDA] text-[#2D7A4F]'
            }`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isEmergency ? 'bg-[#B85C38] animate-ping' : 'bg-[#2D7A4F]'}`} />
                <span className="text-[11px] tracking-wide uppercase">
                  {isEmergency ? 'Active Hazard Perimeter' : 'All Clear / Standby'}
                </span>
              </div>
              {isEmergency && (
                <span className="text-[10px] font-mono bg-[#B85C38] text-white px-1.5 py-0.5 rounded">
                  EVACUATE
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* The GIS Map Viewport */}
      <RealGoogleMap
        standalone={true}
        zones={zonesWithSafehouse}
        zoom={isEmergency ? 11 : 13}
        center={userLat && userLng ? [userLat, userLng] : undefined}
        userLocationOverride={userLat && userLng ? { lat: userLat, lng: userLng, address: session?.location?.address } : null}
        forceRoutesTrigger={routeTrigger}
        onLocationDetect={(loc) => {
          if (loc?.lat && loc?.lng) {
            setUserLat(loc.lat);
            setUserLng(loc.lng);
          }
        }}
        topBarAccessory={
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#8B7355] shrink-0 hidden sm:inline" />
            <span className="text-[10px] text-[#5C544D] font-bold uppercase tracking-wider hidden md:inline">Relief Hub:</span>
            <div className="relative flex items-center">
              <select 
                value={selectedSafehouse} 
                onClick={() => setRouteTrigger(prev => prev + 1)}
                onChange={e => {
                  setSelectedSafehouse(e.target.value);
                  setRouteTrigger(prev => prev + 1);
                }}
                className="bg-white border border-[#E8E1D5] text-[#1A1A1A] text-xs font-semibold rounded-xl pl-2.5 pr-6 py-1 focus:outline-none focus:border-[#8B7355] transition-all shadow-2xs max-w-[140px] sm:max-w-[220px] appearance-none truncate cursor-pointer"
              >
                {sortedSafehouses.length === 0 && <option>Locating Hubs...</option>}
                {sortedSafehouses.map(sh => {
                  const isFull = sh.status === 'FULL' || sh.capacity_occupied >= sh.capacity_total;
                  return (
                    <option key={sh.shelter_id} value={sh.shelter_id} className={isFull ? "text-red-700 bg-white" : "bg-white"}>
                      {sh.name.substring(0, 24)}{sh.name.length > 24 ? '...' : ''} {isFull ? ' [FULL]' : ''}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-3 h-3 text-[#8B7355] absolute right-2 pointer-events-none" />
            </div>
          </div>
        }
      />
    </div>
  );
}
