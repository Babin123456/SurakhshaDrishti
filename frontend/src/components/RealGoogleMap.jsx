import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Navigation, 
  AlertTriangle, 
  CheckCircle2, 
  Layers,
  Compass,
  RotateCcw,
  Search,
  Crosshair,
  Locate,
  Loader2,
  ShieldCheck,
  Radio,
  Lock,
  Globe,
  Zap
} from 'lucide-react';

const TILE_LAYERS = {
  streets: {
    name: 'Map View',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics'
  },
  terrain: {
    name: 'Terrain',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
  }
};

const HAZARD_ZONES = [
  {
    id: 'wayanad',
    name: 'Wayanad Sector 4 (Chooralmala - Meppadi)',
    shortName: 'Wayanad Sector 4',
    state: 'Kerala',
    lat: 11.5583,
    lng: 76.1384,
    type: 'red',
    hazard: 'High Slope Landslide & Debris Flow',
    riskScore: 94,
    geohash: 'tdv2n19z',
    populationRisk: 4820,
    radiusMeters: 4000,
    safeSite: {
      name: 'Nilambur Foothill Safe Hub',
      lat: 11.2762,
      lng: 76.2254,
      capacity: '8,400 / 12,000 Available',
      units: '8,400 Units Open'
    },
    evacEta: '38 mins',
    corridorName: 'NH-766 Southward Bypass',
    wayroute: [
      [11.5583, 76.1384],
      [11.5120, 76.1550],
      [11.4500, 76.1750],
      [11.3700, 76.2050],
      [11.2762, 76.2254]
    ]
  },
  {
    id: 'joshimath',
    name: 'Joshimath Main Ridge (Sunil & Marwari)',
    shortName: 'Joshimath Ridge',
    state: 'Uttarakhand',
    lat: 30.5564,
    lng: 79.5664,
    type: 'red',
    hazard: 'Tectonic Subsidence & Slope Collapse',
    riskScore: 89,
    geohash: 'tvk3d2w8',
    populationRisk: 3150,
    radiusMeters: 3200,
    safeSite: {
      name: 'Pipalkoti Highland Relief Base',
      lat: 30.4283,
      lng: 79.4312,
      capacity: '5,200 / 7,500 Available',
      units: '5,200 Units Open'
    },
    evacEta: '45 mins',
    corridorName: 'Alaknanda West Spur Road',
    wayroute: [
      [30.5564, 79.5664],
      [30.5100, 79.5200],
      [30.4700, 79.4700],
      [30.4283, 79.4312]
    ]
  },
  {
    id: 'teesta',
    name: 'Teesta River Basin (Singtam & Rangpo)',
    shortName: 'Teesta River Basin',
    state: 'Sikkim',
    lat: 27.5029,
    lng: 88.5309,
    type: 'orange',
    hazard: 'GLOF Moraine Breach & Flash Flood',
    riskScore: 76,
    geohash: 'tuyf29pk',
    populationRisk: 6400,
    radiusMeters: 4500,
    safeSite: {
      name: 'Siliguri Highlands Transit Camp',
      lat: 26.7271,
      lng: 88.3953,
      capacity: '11,200 / 15,000 Available',
      units: '11,200 Units Open'
    },
    evacEta: '60 mins',
    corridorName: 'NH-10 Elevated Southern Corridor',
    wayroute: [
      [27.5029, 88.5309],
      [27.2500, 88.4800],
      [26.9800, 88.4400],
      [26.7271, 88.3953]
    ]
  },
  {
    id: 'puri',
    name: 'Puri Coastal Lowland Shore',
    shortName: 'Puri Coastal Sector',
    state: 'Odisha',
    lat: 19.8135,
    lng: 85.8312,
    type: 'orange',
    hazard: 'Storm Surge & Coastal Inundation',
    riskScore: 68,
    geohash: 'tgyc4q9s',
    populationRisk: 5200,
    radiusMeters: 5000,
    safeSite: {
      name: 'Bhubaneswar West Safe Relief Center',
      lat: 20.2961,
      lng: 85.8245,
      capacity: '9,500 / 14,000 Available',
      units: '9,500 Units Open'
    },
    evacEta: '50 mins',
    corridorName: 'Puri-Bhubaneswar Expressway NH-316',
    wayroute: [
      [19.8135, 85.8312],
      [19.9800, 85.8280],
      [20.1500, 85.8260],
      [20.2961, 85.8245]
    ]
  }
];


function getHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function RealGoogleMap({ onZoneSelect }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const layersGroupRef = useRef(null);
  const userLocationLayerRef = useRef(null);
  const markersMapRef = useRef({});

  const [activeLayerType, setActiveLayerType] = useState('streets');
  const [selectedZone, setSelectedZone] = useState(HAZARD_ZONES[0]);
  const [showRedZones, setShowRedZones] = useState(true);
  const [showSafeSites, setShowSafeSites] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);


  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);


  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      tileLayerRef.current = L.tileLayer(TILE_LAYERS[activeLayerType].url, {
        attribution: TILE_LAYERS[activeLayerType].attribution,
        maxZoom: 18,
      }).addTo(map);

      layersGroupRef.current = L.layerGroup().addTo(map);
      userLocationLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);


  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    tileLayerRef.current = L.tileLayer(TILE_LAYERS[activeLayerType].url, {
      attribution: TILE_LAYERS[activeLayerType].attribution,
      maxZoom: 18,
    }).addTo(mapInstanceRef.current);
  }, [activeLayerType]);


  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;

    const group = layersGroupRef.current;
    group.clearLayers();
    markersMapRef.current = {};

    HAZARD_ZONES.forEach((zone) => {
      const isRed = zone.type === 'red';
      const isSelected = selectedZone?.id === zone.id;


      if (showRedZones) {
        const circle = L.circle([zone.lat, zone.lng], {
          color: isRed ? '#DC2626' : '#D97706',
          fillColor: isRed ? '#EF4444' : '#F59E0B',
          fillOpacity: isSelected ? 0.35 : 0.2,
          weight: isSelected ? 3 : 1.5,
          dashArray: isSelected ? undefined : '4, 4',
          radius: zone.radiusMeters,
        });

        circle.bindTooltip(`<b>${zone.shortName}</b><br/>Risk Score: ${zone.riskScore}/100<br/>Hazard: ${zone.hazard}`, {
          permanent: false,
          direction: 'top',
        });

        circle.on('click', () => {
          handleFlyTo(zone);
        });

        group.addLayer(circle);
      }


      const pinHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="position: absolute; width: ${isSelected ? '38px' : '28px'}; height: ${isSelected ? '38px' : '28px'}; border-radius: 50%; background: ${isRed ? 'rgba(220,38,38,0.45)' : 'rgba(217,119,6,0.45)'}; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="position: relative; width: ${isSelected ? '24px' : '18px'}; height: ${isSelected ? '24px' : '18px'}; border-radius: 50%; background: ${isRed ? '#DC2626' : '#D97706'}; border: 2px solid #FFFFFF; box-shadow: 0 3px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: ${isSelected ? '11px' : '9px'}; font-weight: 900;">
            !
          </div>
        </div>
      `;

      const hazardIcon = L.divIcon({
        className: 'custom-hazard-pin',
        html: pinHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([zone.lat, zone.lng], { icon: hazardIcon });
      markersMapRef.current[zone.id] = marker;
      
      const popupContent = `
        <div style="font-family: Inter, system-ui, sans-serif; min-width: 220px; color: #0f172a; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px;">
            <span style="font-size: 9px; font-weight: 800; color: ${isRed ? '#dc2626' : '#d97706'}; text-transform: uppercase;">
              ● ${isRed ? 'CRITICAL RED ZONE' : 'HIGH RISK BUFFER'}
            </span>
            <span style="font-size: 9px; font-family: monospace; font-weight: bold; background: #e2e8f0; padding: 1px 4px; border-radius: 4px;">
              #${zone.geohash}
            </span>
          </div>
          <h4 style="margin: 2px 0 3px 0; font-size: 13px; font-weight: 800; color: #0f172a;">${zone.name}</h4>
          <div style="font-size: 10px; color: #475569; margin-bottom: 6px;">Threat: <strong>${zone.hazard}</strong></div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px; border-radius: 6px; font-size: 10px; margin-bottom: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <div><span style="color: #64748b; font-size: 9px;">Threat Score:</span><br/><strong style="color: ${isRed ? '#dc2626' : '#d97706'}; font-size: 12px;">${zone.riskScore}/100</strong></div>
            <div><span style="color: #64748b; font-size: 9px;">At-Risk Population:</span><br/><strong style="color: #0f172a; font-size: 12px;">${zone.populationRisk.toLocaleString()}</strong></div>
          </div>
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 5px 6px; border-radius: 5px; font-size: 10px; color: #065f46;">
            <strong>Target Safe Hub:</strong> ${zone.safeSite.name}<br/>
            <span style="font-size: 9px; color: #047857;">Capacity: ${zone.safeSite.capacity} | ETA: ${zone.evacEta}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        offset: [0, -10],
        closeButton: true,
        autoPan: true,
      });

      marker.on('click', () => {
        handleFlyTo(zone);
      });

      group.addLayer(marker);


      if (showSafeSites && zone.safeSite) {
        const safeHtml = `
          <div style="width: 18px; height: 18px; border-radius: 50%; background: #16A34A; border: 2px solid #FFFFFF; box-shadow: 0 3px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-size: 9px; font-weight: 900; cursor: pointer;">
            S
          </div>
        `;
        const safeIcon = L.divIcon({
          className: 'custom-safe-pin',
          html: safeHtml,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const safeMarker = L.marker([zone.safeSite.lat, zone.safeSite.lng], { icon: safeIcon });
        safeMarker.bindTooltip(`<b>SAFE RELOCATION HUB:</b><br/>${zone.safeSite.name}<br/><strong>${zone.safeSite.capacity}</strong>`, {
          direction: 'top',
        });
        group.addLayer(safeMarker);
      }


      if (showRoutes && zone.wayroute) {
        const polyline = L.polyline(zone.wayroute, {
          color: isSelected ? '#0284C7' : '#94A3B8',
          weight: isSelected ? 4 : 2,
          dashArray: isSelected ? '6, 6' : '4, 6',
          opacity: isSelected ? 1 : 0.5,
        });

        polyline.bindTooltip(`<b>Evacuation Corridor:</b> ${zone.corridorName}<br/>${zone.shortName} to ${zone.safeSite.name} (${zone.evacEta})`);
        group.addLayer(polyline);
      }
    });
  }, [selectedZone, showRedZones, showSafeSites, showRoutes]);


  const handleFlyTo = (zone) => {
    setSelectedZone(zone);
    if (mapInstanceRef.current) {
      if (zone.wayroute && zone.wayroute.length > 0) {
        const bounds = L.latLngBounds(zone.wayroute);
        if (zone.safeSite) {
          bounds.extend([zone.safeSite.lat, zone.safeSite.lng]);
        }
        bounds.extend([zone.lat, zone.lng]);
        
        mapInstanceRef.current.fitBounds(bounds, {
          paddingTopLeft: [30, 40],
          paddingBottomRight: [30, 160],
          maxZoom: 12,
          animate: true,
          duration: 1.2
        });
      } else {
        mapInstanceRef.current.flyTo([zone.lat, zone.lng], 11, {
          duration: 1.2,
        });
      }

      setTimeout(() => {
        if (markersMapRef.current[zone.id]) {
          markersMapRef.current[zone.id].openPopup();
        }
      }, 500);
    }
    if (onZoneSelect) onZoneSelect(zone);
  };


  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([20.5937, 78.9629], 5, {
        duration: 1.2
      });
    }
  };


  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        let minDistance = Infinity;
        let nearest = HAZARD_ZONES[0];

        HAZARD_ZONES.forEach((zone) => {
          const dist = getHaversineDistanceKm(latitude, longitude, zone.lat, zone.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = zone;
          }
        });

        const isInsideHazard = minDistance <= (nearest.radiusMeters / 1000);

        const locData = {
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
          nearestZone: nearest,
          distanceKm: minDistance.toFixed(1),
          isInsideHazard,
          timestamp: new Date().toLocaleTimeString()
        };

        setUserLocation(locData);
        setIsLocating(false);

        if (mapInstanceRef.current && userLocationLayerRef.current) {
          const uGroup = userLocationLayerRef.current;
          uGroup.clearLayers();

          const accCircle = L.circle([latitude, longitude], {
            radius: Math.max(accuracy, 100),
            color: '#3B82F6',
            fillColor: '#60A5FA',
            fillOpacity: 0.15,
            weight: 1.5,
          });
          uGroup.addLayer(accCircle);

          const userPinHtml = `
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(59, 130, 246, 0.4); animation: ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></div>
              <div style="width: 18px; height: 18px; border-radius: 50%; background: #2563EB; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 12px rgba(37,99,235,0.6); display: flex; align-items: center; justify-content: center; color: white; font-size: 9px; font-weight: bold;">
                GPS
              </div>
            </div>
          `;

          const userIcon = L.divIcon({
            className: 'custom-user-pin',
            html: userPinHtml,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const userMarker = L.marker([latitude, longitude], { icon: userIcon });
          
          const userPopup = `
            <div style="font-family: Inter, system-ui, sans-serif; min-width: 200px; color: #0f172a; padding: 2px;">
              <div style="font-size: 9px; font-weight: 800; color: #2563eb; text-transform: uppercase;">
                EXACT GPS LOCATION
              </div>
              <div style="font-size: 11px; font-weight: 800; margin: 3px 0; color: #0f172a;">
                ${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E
              </div>
              <div style="font-size: 9px; color: #64748b; margin-bottom: 5px;">GPS Accuracy: ±${Math.round(accuracy)}m</div>
              <div style="padding: 4px 6px; border-radius: 5px; font-size: 10px; background: ${isInsideHazard ? '#fee2e2' : '#f0fdf4'}; border: 1px solid ${isInsideHazard ? '#f87171' : '#86efac'}; color: ${isInsideHazard ? '#991b1b' : '#166534'}; font-weight: bold;">
                ${isInsideHazard ? `Alert: Inside ${nearest.shortName} Red Zone!` : `Safe Zone: Nearest is ${nearest.shortName} (${minDistance.toFixed(1)} km)`}
              </div>
            </div>
          `;

          userMarker.bindPopup(userPopup).openPopup();
          uGroup.addLayer(userMarker);

          mapInstanceRef.current.flyTo([latitude, longitude], 12, {
            duration: 1.5
          });
        }
      },
      (error) => {
        setIsLocating(false);
        setLocationError(error.code === 1 ? 'Location access was denied. Please allow GPS permission.' : 'Location request failed.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    /* MacBook Bezel & Chassis Container */
    <div className="w-full max-w-6xl mx-auto">
      
      {/* MacBook Screen Top Housing */}
      <div className="relative rounded-3xl p-2.5 sm:p-3.5 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        
        {/* Top Bezel Notch / Camera */}
        <div className="flex items-center justify-center -mt-1 mb-1.5 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-cyan-400/60 animate-pulse"></div>
          </div>
        </div>

        {/* macOS Window Top Navigation Bar (Mobile Responsive) */}
        <div className="px-3 py-2 bg-slate-950/95 rounded-t-2xl border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
          
          {/* Left: macOS Traffic Lights & Mode */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-sm"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-sm"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-sm"></div>
            </div>
            <span className="hidden md:inline text-[10px] font-mono font-bold text-emerald-400 pl-1 border-l border-slate-800">
              ● LIVE GIS SATELLITE & ROAD TILES
            </span>
          </div>

          {/* Center: URL / Telemetry Address Capsule */}
          <div className="flex-1 max-w-[200px] sm:max-w-sm mx-auto flex items-center justify-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] sm:text-[11px] text-slate-400 font-mono truncate">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-slate-300 font-medium truncate">surakshadrishti.mha.gov.in</span>
          </div>

          {/* Right: Live Encrypted indicator & Instruction Hint */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 shrink-0">
            <span className="hidden lg:inline font-cambria text-slate-400">Click marker to inspect</span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE GIS</span>
            </span>
          </div>
        </div>

        {/* Interactive Tactical Control Bar (Fully Mobile Optimized) */}
        <div className="p-2 sm:p-3 bg-slate-900 border-b border-slate-800 flex flex-col gap-2 text-white">
          
          {/* Row 1: Sector Dropdown & Locate / Reset Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            
            <div className="flex items-center gap-1.5 bg-slate-800/90 px-2 py-1 rounded-xl border border-slate-700 text-xs font-semibold flex-1 min-w-[170px] sm:flex-initial">
              <Search className="w-3 h-3 text-cyan-400 shrink-0" />
              <select
                value={selectedZone?.id || ''}
                onChange={(e) => {
                  const found = HAZARD_ZONES.find((z) => z.id === e.target.value);
                  if (found) handleFlyTo(found);
                }}
                aria-label="Select hotspot"
                className="w-full bg-slate-900 text-white rounded-lg px-2 py-1 text-[11px] sm:text-xs font-bold border border-slate-700 outline-none cursor-pointer hover:border-cyan-500 transition-colors"
              >
                {HAZARD_ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.shortName} ({z.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Locate Me & Reset View */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-400/50 text-white text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                title="Detect Exact GPS Coordinates"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Locating...</span>
                  </>
                ) : (
                  <>
                    <Crosshair className="w-3 h-3 text-cyan-200" />
                    <span>Locate Me</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetView}
                className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
                title="Reset All-India View"
              >
                <RotateCcw className="w-3 h-3 text-cyan-400" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

          </div>

          {/* Row 2: Map Tile Type Switcher & Layer Filters */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-slate-800/80">
            
            {/* Tile Style Switcher */}
            <div className="flex items-center bg-slate-800/90 p-0.5 rounded-xl border border-slate-700 text-[11px] font-bold">
              <button
                onClick={() => setActiveLayerType('streets')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  activeLayerType === 'streets'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setActiveLayerType('satellite')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  activeLayerType === 'satellite'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => setActiveLayerType('terrain')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  activeLayerType === 'terrain'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Terrain
              </button>
            </div>

            {/* Layer Visibility Filters */}
            <div className="flex items-center bg-slate-800/90 p-0.5 rounded-xl border border-slate-700 text-[10px] sm:text-[11px] font-medium gap-0.5">
              <button
                type="button"
                onClick={() => setShowRedZones(!showRedZones)}
                className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  showRedZones ? 'bg-red-950/80 border border-red-800 text-red-300 font-bold' : 'text-slate-400'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>Red Zones</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSafeSites(!showSafeSites)}
                className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  showSafeSites ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold' : 'text-slate-400'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Safe Hubs</span>
              </button>

              <button
                type="button"
                onClick={() => setShowRoutes(!showRoutes)}
                className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  showRoutes ? 'bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                <Navigation className="w-2.5 h-2.5 text-cyan-400" />
                <span>Routes</span>
              </button>
            </div>

          </div>

        </div>

        {/* Error Notice */}
        {locationError && (
          <div className="bg-amber-950/90 text-amber-200 text-xs px-4 py-1.5 border-b border-amber-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{locationError}</span>
            </div>
            <button onClick={() => setLocationError(null)} className="text-amber-400 hover:text-white font-bold ml-2">✕</button>
          </div>
        )}

        {/* Inner Screen Display Viewport */}
        <div className="relative w-full h-[400px] sm:h-[520px] rounded-b-2xl overflow-hidden bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* User Location Locked Badge (Mobile Floating Pill) */}
          {userLocation && (
            <div className="absolute top-2 left-2 right-2 sm:right-auto sm:max-w-xs z-[1000] pointer-events-auto">
              <div className="bg-slate-950/95 text-white backdrop-blur-md rounded-xl p-2 sm:p-2.5 border border-blue-500/40 shadow-2xl space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] font-extrabold text-blue-400">
                    <Crosshair className="w-3 h-3 text-blue-400 animate-pulse" />
                    GPS LOCKED (±{userLocation.accuracy}m)
                  </span>
                  <span className="text-[9px] text-slate-400">{userLocation.timestamp}</span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-slate-200">
                  {userLocation.lat.toFixed(4)}° N, {userLocation.lng.toFixed(4)}° E
                </div>
                <div className={`p-1 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 ${
                  userLocation.isInsideHazard 
                    ? 'bg-red-950/80 text-red-300 border border-red-800' 
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                }`}>
                  {userLocation.isInsideHazard ? (
                    <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  )}
                  <span className="truncate">
                    {userLocation.isInsideHazard
                      ? `Inside ${userLocation.nearestZone.shortName} Red Zone!`
                      : `Safe Zone • ${userLocation.distanceKm} km to ${userLocation.nearestZone.shortName}`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Selected Zone Telemetry HUD (Mobile Bottom Docked Card) */}
          {selectedZone && (
            <div className="absolute bottom-2 left-2 right-2 sm:left-3 sm:bottom-3 sm:right-auto sm:max-w-sm z-[1000] pointer-events-auto">
              <div className="bg-slate-950/95 text-white backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-slate-800 shadow-2xl space-y-1.5 sm:space-y-2">
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                    selectedZone.type === 'red' ? 'bg-red-600 text-white' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {selectedZone.type === 'red' ? 'CRITICAL RED ZONE' : 'HIGH RISK BUFFER'}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">
                    #{selectedZone.geohash}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight">{selectedZone.name}</h3>
                  <div className="text-[10px] sm:text-[11px] text-red-400 font-medium">{selectedZone.hazard}</div>
                </div>

                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="p-1 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[8px] sm:text-[9px]">Threat Index</div>
                    <div className="text-[11px] sm:text-xs font-black text-red-400">{selectedZone.riskScore} / 100</div>
                  </div>
                  <div className="p-1 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[8px] sm:text-[9px]">At-Risk Population</div>
                    <div className="text-[11px] sm:text-xs font-black text-amber-400">{selectedZone.populationRisk.toLocaleString()}</div>
                  </div>
                </div>

                <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-xs">
                  <div className="text-[9px] text-emerald-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Designated Safe Hub:
                  </div>
                  <div className="text-white font-bold text-[10px] sm:text-[11px] mt-0.5 truncate">{selectedZone.safeSite.name}</div>
                  <div className="text-[9px] sm:text-[10px] text-emerald-300 truncate">
                    {selectedZone.safeSite.capacity} • {selectedZone.corridorName} ({selectedZone.evacEta})
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onZoneSelect?.(selectedZone)}
                  className="w-full py-1.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] sm:text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer btn-bottom-glow-blue"
                >
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>Generate QuickPass for this Sector</span>
                </button>

              </div>
            </div>
          )}

        </div>

      </div>

      {/* MacBook Bottom Base / Lip Notch */}
      <div className="w-40 h-2 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded-b-xl mx-auto -mt-0.5 border-t border-slate-700/60 shadow-md"></div>
    </div>
  );
}
