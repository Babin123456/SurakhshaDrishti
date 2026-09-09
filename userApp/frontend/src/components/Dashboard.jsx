import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Map, 
  Users, 
  Building2, 
  Activity, 
  Radio, 
  FileText, 
  AlertTriangle,
  Compass,
  ArrowUpRight,
  LogOut,
  Layers,
  Key,
  CheckCircle2,
  Lock,
  UserCheck,
  Navigation,
  MapPin,
  RefreshCw,
  Shield,
  RadioReceiver,
  Megaphone,
  Ambulance,
  Plane,
  Maximize2,
  Minimize2,
  ChevronRight,
  User,
  Mail,
  Phone,
  BadgeCheck,
  X,
  Home,
  Camera,
  Search,
  MessageSquare,
  Send,
  Sparkles
} from 'lucide-react';
import RealGoogleMap from './RealGoogleMap';
import { useToast } from './Toast';
import { apiService } from '../utils/api';

export default function Dashboard({ user, onLogout, onNavigateProfile, onNavigateHome }) {
  const { addToast } = useToast();
  // Automatic Browser Geolocation
  const [officerLocation, setOfficerLocation] = useState(null);
  const [isGpsLoading, setIsGpsLoading] = useState(true);

  // Red Zones State
  const [zones, setZones] = useState([
    {
      zone_id: 'RZ-WAYANAD-01',
      name: 'Fetching Live Database...',
      state: 'Kerala',
      lat: 11.5583,
      lng: 76.1384,
      zone_type: 'RED',
      hazard_type: 'LANDSLIDE',
      risk_score: 94,
      access_key: 'RZ-89A4-91F2-3B7C',
      status: 'ACTIVE_RED_ZONE',
      resolution_votes_required: 2,
      resolution_votes_cast: 0,
      population_risk: 4820,
      radius_meters: 4000,
      assigned_officers: []
    }
  ]);

  const [selectedZoneId, setSelectedZoneId] = useState('RZ-WAYANAD-01');
  const [inputKey, setInputKey] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [assignSuccessMsg, setAssignSuccessMsg] = useState(null);
  const [assignErrorMsg, setAssignErrorMsg] = useState(null);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [backupRequested, setBackupRequested] = useState(false);

  // Deep Focus Mode & Side Menu states (#13)
  const [focusTrigger, setFocusTrigger] = useState(0);
  const [isSideMenuCollapsed, setIsSideMenuCollapsed] = useState(false);

  // TeamViewer-style Side Panel Chatting Interface (#13)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'NDRF Base Control', department: 'HQ Command', text: 'Tactical mesh channel open. Geohash telemetry streaming.', time: 'Just now' },
    { id: 2, sender: 'SDMA Field Lead', department: 'SDMA', text: 'Sector perimeter assessed. Awaiting team assignment.', time: '1m ago' }
  ]);

  const [isFullMapView, setIsFullMapView] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [dynamicCoordinates, setDynamicCoordinates] = useState(null);

  const fallbackZone = {
    zone_id: 'ALL-SAFE-00',
    name: 'No Active Emergencies (System Monitoring)',
    state: 'India',
    lat: 22.9734,
    lng: 78.6569,
    zone_type: 'SAFE',
    hazard_type: 'ALL_CLEAR',
    risk_score: 0,
    population_risk: 0,
    radius_meters: 0,
    status: 'SITUATION_UNDER_CONTROL',
    access_key: 'NO-ACTIVE-ZONES',
    resolution_votes_cast: 0,
    resolution_votes_required: 1,
    assigned_officers: []
  };

  // Selected Zone Details
  const activeZone = zones.find(z => z.zone_id === selectedZoneId) || zones[0] || fallbackZone;
  // Current Officer Info
  const currentOfficerId = user?.userId || user?.user_id || user?.username || 'ndrf_admin';
  const currentOfficerName = user?.fullName || user?.name || user?.username || 'NDRF Commander Chief';
  const currentDept = user?.role || 'NDRF Tactical Command';

  const isOfficerAssigned = activeZone?.assigned_officers?.some(
    o => o.user_id === currentOfficerId
  );
  const hasOfficerVoted = activeZone?.assigned_officers?.some(
    o => o.user_id === currentOfficerId && o.vote_to_resolve
  );

  // 16-Digit Key Search System: Locates issue on map (#13)
  const handleSearchKey = async (e) => {
    if (e) e.preventDefault();
    const query = (searchKey || '').trim();
    if (!query) {
      addToast('Please enter a search term (e.g. 16-digit key, geohash, or name)', 'warning');
      return;
    }

    try {
      const res = await apiService.searchZones(query, 'in_office');
      if (res.success && res.zones.length > 0) {
        const matchedZone = res.zones[0];
        
        setZones(prev => {
           if (!prev.find(z => z.zone_id === matchedZone.zone_id)) {
               return [...prev, matchedZone];
           }
           return prev;
        });

        setSelectedZoneId(matchedZone.zone_id);
        setDynamicCoordinates(null);
        addToast(`Issue Located! Navigating map to ${matchedZone.name}`, 'success');
        setSearchKey('');
      } else {
        // Fallback to local search
        const queryClean = query.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const localMatch = zones.find(z => {
          const cleanKey = (z.access_key || '').replace(/[^A-Z0-9]/g, '').toUpperCase();
          return cleanKey === queryClean || cleanKey.includes(queryClean) || queryClean.includes(cleanKey);
        });

        if (localMatch) {
          setSelectedZoneId(localMatch.zone_id);
          setDynamicCoordinates(null);
          addToast(`Issue Located Locally! Navigating map to ${localMatch.name}`, 'success');
          setSearchKey('');
        } else {
          addToast(`No zone found for "${searchKey}". Verify search term.`, 'error');
        }
      }
    } catch (err) {
      addToast('Search error occurred.', 'error');
    }
  };

  // Simulated Residents Trapped in Red Zone
  const trappedCitizens = [
    { id: 'SOS-901', name: 'Citizen #104 (Elderly)', lat: activeZone.lat + 0.0012, lng: activeZone.lng + 0.0015, type: 'CRITICAL', specialNeeds: 'Wheelchair Assistance' },
    { id: 'SOS-902', name: 'Citizen #105 (Infant Family)', lat: activeZone.lat - 0.0018, lng: activeZone.lng - 0.0008, type: 'URGENT', specialNeeds: 'Medical Supplies' },
    { id: 'SOS-903', name: 'Citizen #106', lat: activeZone.lat + 0.0025, lng: activeZone.lng - 0.0021, type: 'EVACUATING', specialNeeds: 'None' },
    { id: 'SOS-904', name: 'Citizen #107', lat: activeZone.lat - 0.0009, lng: activeZone.lng + 0.0028, type: 'CRITICAL', specialNeeds: 'Stretcher Required' },
  ];

  // Fetch Zones from Backend
  useEffect(() => {
    let mounted = true;
    const loadZones = async () => {
      const res = await apiService.fetchZones();
      if (mounted && res.success && res.zones.length > 0) {
        setZones(res.zones);
        setSelectedZoneId(prev => {
          if (!res.zones.find(z => z.zone_id === prev)) {
             return res.zones[0].zone_id;
          }
          return prev;
        });
      }
    };
    loadZones();
    return () => { mounted = false; };
  }, []);

  // 1. Fetch Browser Geolocation Automatically
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setOfficerLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          });
          setIsGpsLoading(false);
        },
        () => {
          setOfficerLocation({ lat: 11.6854, lng: 76.1320, accuracy: 12 });
          setIsGpsLoading(false);
        }
      );
    } else {
      setOfficerLocation({ lat: 11.6854, lng: 76.1320, accuracy: 12 });
      setIsGpsLoading(false);
    }
  }, []);

  // 2. Assign Officer to Red Zone using 16-digit Security Key -> Enters Deep Focus Mode + Opens TeamViewer Chat (#13)
  const handleAssignSelf = () => {
    setAssignSuccessMsg(null);
    setAssignErrorMsg(null);

    const enteredClean = inputKey.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const targetClean = activeZone.access_key.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (inputKey.trim() && enteredClean !== targetClean) {
      const errMsg = `Invalid 16-Digit Access Key for ${activeZone.name}. Required format: ${activeZone.access_key}`;
      setAssignErrorMsg(errMsg);
      addToast(errMsg, 'error');
      return;
    }



    setZones(prev => prev.map(z => {
      if (z.zone_id === selectedZoneId) {
        const alreadyIn = z.assigned_officers.some(o => o.user_id === currentOfficerId);
        const updatedList = alreadyIn 
          ? z.assigned_officers 
          : [...z.assigned_officers, { user_id: currentOfficerId, officer_name: currentOfficerName, department: currentDept, vote_to_resolve: false }];
        return { ...z, assigned_officers: updatedList };
      }
      return z;
    }));

    const successMsg = `Assigned to ${activeZone.name}! Entered Deep Focus Mode & Team Dispatch.`;
    setAssignSuccessMsg(successMsg);
    addToast(successMsg, 'success');
    setInputKey('');
    
    // Chat is now natively part of Split View, Deep Focus mode removed
  };

  // Helper to assign self directly from Map HUD card or search bar
  const handleAssignSelfFromMap = (targetZone) => {
    setAssignSuccessMsg(null);
    setAssignErrorMsg(null);

    const target = targetZone 
      ? (zones.find(z => z.zone_id === targetZone.zone_id || z.access_key === targetZone.access_key || z.name.toLowerCase().includes((targetZone.shortName || targetZone.name || '').toLowerCase())) || activeZone) 
      : activeZone;
      
    setSelectedZoneId(target.zone_id);



    setZones(prev => prev.map(z => {
      if (z.zone_id === target.zone_id) {
        const alreadyIn = z.assigned_officers.some(o => o.user_id === currentOfficerId);
        const updatedList = alreadyIn 
          ? z.assigned_officers 
          : [...z.assigned_officers, { user_id: currentOfficerId, officer_name: currentOfficerName, department: currentDept, vote_to_resolve: false }];
        return { ...z, assigned_officers: updatedList };
      }
      return z;
    }));

    const successMsg = `Assigned to ${target.name}! Response channel activated.`;
    setAssignSuccessMsg(successMsg);
    addToast(successMsg, 'success');
    setInputKey('');
    setIsChatOpen(true);
  };

  // Send message in TeamViewer-style popup chatting interface
  const handleSendChatMessage = (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: user?.fullName || user?.name || 'My Terminal',
      department: user?.role || 'NDRF',
      text: chatInput.trim(),
      time: 'Just now'
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Simulate inter-agency confirmation
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'NDRF Air Dispatch',
          department: 'Emergency Airborne',
          text: `Acknowledged message for ${activeZone.name}. Drone corridor monitoring active.`,
          time: 'Just now'
        }
      ]);
    }, 1200);
  };

  // 3. Vote to Resolve Situation in Red Zone
  const handleVoteResolve = async () => {

    try {
        // Optimistic UI updates could go here, but since this triggers a major state change (movement to history), 
        // we hit the real backend and refresh the state.
        const res = await fetch('http://localhost:5000/api/zones/vote-resolve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ zone_id: selectedZoneId, user_id: currentOfficerId })
        });
        const data = await res.json();
        
        if (data.success) {
            addToast(data.message, data.isResolved ? 'success' : 'info');
            // Re-fetch zones to get updated list
            const refreshRes = await apiService.fetchZones();
            if (refreshRes.success && refreshRes.zones.length > 0) {
                setZones(refreshRes.zones);
                if (data.isResolved) {
                    setSelectedZoneId(refreshRes.zones[0].zone_id);
                }
            } else if (refreshRes.success && refreshRes.zones.length === 0) {
                setZones([]);
            }
        } else {
            addToast('Error resolving zone', 'error');
        }
    } catch (e) {
        addToast('Failed to record vote with backend', 'error');
    }
  };



  const stats = [
    { title: 'Active Red Zones', value: `${zones.filter(z=>z.status==='ACTIVE_RED_ZONE').length} Sectors`, change: '16-Digit Encrypted Keys', color: 'text-[#B85C38]', bg: 'bg-white/70 border-[#FADED4]' },
    { title: 'Trapped Citizens Monitored', value: `${trappedCitizens.length * 710}`, change: 'Blue GPS Telemetry Pulses', color: 'text-[#C05621]', bg: 'bg-white/70 border-[#FEEBC8]' },
    { title: 'Assigned Command Officers', value: `${activeZone.assigned_officers.length} Officers`, change: `${activeZone.assigned_officers.map(o=>o.department).join(', ') || 'Awaiting Assignment'}`, color: 'text-[#2D7A4F]', bg: 'bg-white/70 border-[#D4EDDA]' },
    { title: 'Sector Resolution Status', value: activeZone.status === 'SITUATION_UNDER_CONTROL' ? 'SAFE — RESOLVED' : 'ACTIVE EMERGENCY', change: `Consensus: ${activeZone.resolution_votes_cast}/${activeZone.resolution_votes_required} Votes`, color: activeZone.status === 'SITUATION_UNDER_CONTROL' ? 'text-[#2D7A4F]' : 'text-[#8B7355]', bg: 'bg-white/70 border-[#E8E1D5]' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* Header Bar with Live Geolocation Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/80 border border-[#E8E1D5] backdrop-blur-md shadow-sm">
        <div 
          onClick={() => {
            if (onNavigateProfile) onNavigateProfile();
            else setShowProfileModal(true);
          }}
          className="flex items-center gap-3 min-w-0 cursor-pointer p-1.5 -m-1.5 rounded-xl transition-all duration-300 hover:bg-[#F6F4F0]/80 group"
          title="Click to view and edit your profile credentials"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 transition-all duration-300 group-hover:scale-105 flex items-center justify-center overflow-hidden">
            {user?.profile_picture || user?.avatar || (typeof window !== 'undefined' && localStorage.getItem('suraksha_user_pfp')) ? (
              <img 
                src={user?.profile_picture || user?.avatar || localStorage.getItem('suraksha_user_pfp')} 
                alt="Officer Avatar" 
                className="w-full h-full object-cover rounded-xl border border-[#8B7355]/30 shadow-sm" 
              />
            ) : (
              <img 
                src="/favicon.webp" 
                alt="SurakshaDrishti Emblem" 
                className="w-full h-full object-contain" 
              />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-xl font-bold text-[#1A1A1A] tracking-tight truncate group-hover:text-[#8B7355] transition-colors">
                Suraksha<span className="text-[#8B7355]">Drishti</span> — Command Console
              </h1>
              <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold bg-[#B85C38] text-white rounded-full shrink-0">
                SIH 26191
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#5C544D] mt-0.5 truncate">
              Officer: <span className="text-[#1A1A1A] font-semibold underline decoration-dotted decoration-[#8B7355]/40">{user?.fullName || user?.name || user?.username || 'NDRF Commander Chief'}</span> | Dept: <span className="text-[#8B7355] font-semibold">{user?.role || 'NDRF Tactical Command'}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3 shrink-0">
          {/* Automatic Browser Geolocation Display */}
          <div className="px-3 py-1.5 sm:py-2 rounded-xl bg-[#F6F4F0] border border-[#E8E1D5] text-[11px] sm:text-xs text-[#5C544D] flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-[#8B7355] gps-radar-search shrink-0" />
            {isGpsLoading ? (
              <span>Locating GPS...</span>
            ) : (
              <span>GPS: <strong className="text-[#1A1A1A] font-mono">{officerLocation?.lat.toFixed(3)}° N, {officerLocation?.lng.toFixed(3)}° E</strong></span>
            )}
          </div>

          {/* Return to Home Landing Button */}
          {onNavigateHome && (
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-[#F6F4F0] border border-[#E8E1D5] text-[11px] sm:text-xs font-semibold text-[#1A1A1A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Return to Public Home Portal"
            >
              <Home className="w-3.5 h-3.5 text-[#8B7355]" />
              <span>Home Portal</span>
            </button>
          )}

          {/* User Profile Navigation Button */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateProfile) {
                onNavigateProfile();
              } else {
                setShowProfileModal(true);
              }
            }}
            className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-[#F6F4F0] border border-[#E8E1D5] text-[11px] sm:text-xs font-semibold text-[#1A1A1A] transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
            title="Open Full Officer Profile Page"
          >
            {user?.profile_picture || user?.avatar || (typeof window !== 'undefined' && localStorage.getItem('suraksha_user_pfp')) ? (
              <img 
                src={user?.profile_picture || user?.avatar || localStorage.getItem('suraksha_user_pfp')} 
                alt="Officer Avatar" 
                className="w-4 h-4 rounded-full object-cover border border-[#8B7355]/40" 
              />
            ) : (
              <User className="w-3.5 h-3.5 text-[#8B7355]" />
            )}
            <span>Profile</span>
          </button>

          <button 
            onClick={onLogout}
            className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-transparent hover:bg-[#FFF5F2] border border-[#D9D0C1] hover:border-[#B85C38] text-[11px] sm:text-xs font-semibold text-[#B85C38] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs ml-auto sm:ml-0"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Stats Strip (2 cols on mobile, 4 cols on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className={`p-3 sm:p-4 rounded-2xl border ${s.bg} backdrop-blur-md transition-all duration-300 hover:border-[#8B7355]/60 hover:bg-white hover:shadow-md hover:-translate-y-0.5 shadow-2xs`}>
            <div className="text-[11px] sm:text-xs text-[#5C544D] font-semibold truncate">{s.title}</div>
            <div className={`text-lg sm:text-2xl font-bold mt-1 tracking-tight truncate ${s.color}`}>{s.value}</div>
            <div className="text-[10px] sm:text-[11px] text-[#7A726A] mt-1 flex items-center gap-1 truncate">
              <Activity className="w-3 h-3 text-[#8C847A] shrink-0" /> <span className="truncate">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Left GIS Viewport with Trapped Citizen Telemetry | Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 transition-[grid-template-columns,gap] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
        
        {/* Interactive GIS Map Section (Full Width / Split Mode Toggle) */}
        <div className={`${
          isFullMapView ? 'lg:col-span-12' : 'lg:col-span-8'
        } space-y-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[width]`}>
          
          <div className="bg-white/80 border border-[#E8E1D5] rounded-3xl p-4 sm:p-5 flex flex-col justify-between min-h-[720px] relative overflow-hidden backdrop-blur-md shadow-sm transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
            
            {/* Map Header & Zone Selector with 16-Digit Search & Focus Mode (#13) */}
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-[#F6F4F0] p-3 sm:p-3.5 rounded-2xl border border-[#E8E1D5] transition-all duration-300 shadow-2xs">
              {/* Left: Viewport Title & Focus Mode Badge */}
              <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-white border border-[#E8E1D5] flex items-center justify-center shadow-2xs shrink-0">
                  <Map className="w-3.5 h-3.5 text-[#8B7355]" />
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-[#1A1A1A] truncate">
                    Active GIS Red Zone Viewport
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E8E1D5] text-[#4A4238] shadow-2xs shrink-0">
                    {isFullMapView ? 'Full View' : 'Split View'}
                  </span>
                </div>
              </div>

              {/* Center/Right: 16-Digit Red Zone Key Search Fallback System (#13) */}
              {!isOfficerAssigned && (
              <form onSubmit={handleSearchKey} className="flex items-center gap-1.5 flex-1 max-w-md w-full">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    placeholder="Search 16-Digit Key (e.g. RZ-89A4-91F2-3B7C)..."
                    className="w-full bg-white text-[#1A1A1A] font-mono text-xs pl-8 pr-3 py-2 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] transition-all shadow-2xs placeholder:text-[#9C948A]"
                  />
                  <Key className="w-3.5 h-3.5 text-[#8B7355] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-[#2C2A29] hover:bg-[#1A1A1A] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs cursor-pointer"
                  title="Locate Issue on Map by 16-Digit Key"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Locate</span>
                </button>
              </form>
              )}

              {/* Right: Sector Selector & View Mode Toggle */}
              <div className="flex items-center gap-2 w-full xl:w-auto shrink-0">
                {/* Sector Selector Dropdown */}
                {!isOfficerAssigned && (
                <div className="relative flex-1 sm:flex-initial min-w-[170px] max-w-full">
                  <select
                    value={selectedZoneId}
                    onChange={(e) => {
                      setSelectedZoneId(e.target.value);
                      setDynamicCoordinates(null);
                      setAssignSuccessMsg(null);
                      setAssignErrorMsg(null);
                    }}
                    className="w-full bg-white text-[#1A1A1A] text-xs font-bold pl-3 pr-8 py-2 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] cursor-pointer transition-all shadow-2xs hover:border-[#8B7355]/50 appearance-none truncate"
                  >
                    {zones.map(z => (
                      <option key={z.zone_id} value={z.zone_id}>
                        {z.name} ({z.status === 'SITUATION_UNDER_CONTROL' ? 'SAFE' : 'RED ZONE'})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8B7355]">
                    <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                  </div>
                </div>
                )}

                {/* Focus Button */}
                <button
                  type="button"
                  onClick={() => isOfficerAssigned && setFocusTrigger(f => f + 1)}
                  disabled={!isOfficerAssigned}
                  className={`group shrink-0 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs ${
                    isOfficerAssigned
                      ? 'bg-white hover:bg-[#F6F4F0] border-[#E8E1D5] text-[#1A1A1A] cursor-pointer'
                      : 'bg-[#F6F4F0] border-[#E8E1D5] text-[#A89F91] cursor-not-allowed opacity-60'
                  }`}
                  title="Recenter Map on Assigned Sector"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Focus</span>
                </button>

                {/* View Mode Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsFullMapView(!isFullMapView)}
                  className="group shrink-0 px-3 py-2 rounded-xl bg-white hover:bg-[#2C2A29] hover:text-[#FDFBF7] border border-[#E8E1D5] hover:border-[#2C2A29] text-xs font-semibold text-[#1A1A1A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title={isFullMapView ? "Switch to Split Tactical View" : "Expand Map to Full Width"}
                >
                  <span>
                    {isFullMapView ? (
                      <Minimize2 className="w-3.5 h-3.5 text-[#8B7355] group-hover:text-[#FDFBF7] transition-colors" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5 text-[#8B7355] group-hover:text-[#FDFBF7] transition-colors" />
                    )}
                  </span>
                  <span className="whitespace-nowrap transition-colors">
                    {isFullMapView ? 'Split View' : 'Full View'}
                  </span>
                </button>
              </div>
            </div>

            {/* Interactive Real Map Viewport with smooth height & scale easing */}
            <div className={`relative z-10 my-3 rounded-2xl overflow-hidden border border-[#E8E1D5] ${
              isFullMapView 
                ? 'h-[720px]' 
                : 'h-[640px]'
            } bg-[#F6F4F0] shadow-inner transition-[height,box-shadow] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[height]`}>
              <RealGoogleMap
                focusTrigger={focusTrigger}
                standalone={true}
                center={[activeZone.lat, activeZone.lng]}
                zoom={13}
                selectedZoneId={activeZone.zone_id}
                zones={(isOfficerAssigned ? [activeZone] : zones).map(z => ({
                  ...z,
                  id: z.zone_id,
                  type: z.zone_type ? z.zone_type.toLowerCase() : 'red',
                  hazard: z.hazard_type,
                  riskScore: z.risk_score,
                  populationRisk: z.population_risk,
                  radiusMeters: z.radius_meters || 3000,
                  shortName: z.name ? z.name.split('(')[0].trim() : 'Unknown Zone',
                  safeSite: z.safeSite || {
                    name: `${z.state || 'Local'} Relief Hub`,
                    lat: z.lat + 0.02,
                    lng: z.lng + 0.02,
                    capacity: '5,000 / 8,000 Available'
                  },
                  evacEta: z.evacEta || '45 mins',
                  corridorName: z.corridorName || 'Primary Emergency Route'
                }))}
                onLocationDetect={(loc) => {
                  setDynamicCoordinates({
                    lat: loc.lat,
                    lng: loc.lng,
                    label: `GPS Acquired (±${loc.accuracy}m)`,
                    isUserLocation: true,
                    nearestZone: loc.nearestZone
                  });
                }}
                onZoneSelect={(selected) => {
                  const targetId = selected.id || selected.zone_id;
                  const found = zones.find(z => 
                    z.zone_id === targetId || 
                    z.name?.toLowerCase().includes((selected.shortName || selected.name || '').toLowerCase())
                  );
                  if (found) {
                    setSelectedZoneId(found.zone_id);
                    setDynamicCoordinates(null);
                  }
                }}
                onAssignSelf={(selected) => handleAssignSelfFromMap(selected)}
              />
            </div>

            {/* Selected Zone Footer Bar — Dynamic Real-Time Target Coordinates */}
            <div className="relative z-10 flex flex-wrap items-center justify-between text-xs text-[#5C544D] bg-[#F6F4F0] p-3 sm:p-3.5 rounded-xl border border-[#E8E1D5] gap-2 transition-all duration-300 shadow-2xs">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${dynamicCoordinates?.isUserLocation ? 'bg-[#2563EB] animate-ping' : 'bg-[#B85C38] animate-pulse'}`}></span>
                <span>
                  {dynamicCoordinates?.isUserLocation ? 'My Detected Location:' : 'Target Coordinates:'}{' '}
                  <strong className="text-[#1A1A1A] font-mono font-bold bg-white px-2 py-0.5 rounded border border-[#E8E1D5] inline-block ml-1">
                    {(dynamicCoordinates?.lat ?? activeZone.lat).toFixed(4)}° N, {(dynamicCoordinates?.lng ?? activeZone.lng).toFixed(4)}° E
                  </strong>{' '}
                  <span className="text-[#7A726A] font-medium">
                    ({dynamicCoordinates?.isUserLocation ? dynamicCoordinates.label : activeZone.state})
                  </span>
                </span>
              </span>
              <span className="font-mono text-[#4A4238] font-bold text-[11px] flex items-center gap-1.5 ml-auto sm:ml-0">
                <span>16-Digit Key:</span>
                <code className="bg-white px-2 py-0.5 rounded border border-[#E8E1D5] text-[#B85C38] font-bold tracking-wide">
                  {activeZone.access_key}
                </code>
              </span>
            </div>
          </div>
        </div>

        {/* Controls Column / Lower Grid */}
        <div className={`${
          isFullMapView 
            ? 'lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 space-y-0 opacity-100 translate-y-0' 
            : 'lg:col-span-4 space-y-4 opacity-100 translate-y-0'
        } transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[transform,opacity]`}>
          
          {/* Card 1: 16-Digit Key Assignment */}
          {!isOfficerAssigned && (
          <div className="bg-white/80 hover:bg-white border border-[#E8E1D5] hover:border-[#8B7355]/50 rounded-3xl p-5 backdrop-blur-md space-y-3 shadow-2xs hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E1D5]">
              <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                <Key className="w-4 h-4 text-[#8B7355]" /> Assign Self to Red Zone
              </h3>
              <span className="text-[10px] font-mono font-bold bg-[#F6F4F0] text-[#4A4238] px-2 py-0.5 rounded border border-[#E8E1D5]">
                16-DIGIT KEY
              </span>
            </div>

            <div className="text-xs text-[#5C544D] leading-relaxed">
              To operate in <strong className="text-[#1A1A1A]">{activeZone.name}</strong>, enter the 16-digit security key assigned to this zone:
            </div>

            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`e.g. ${activeZone.access_key}`}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  disabled={isOfficerAssigned}
                  className="w-full bg-[#FDFBF7] text-[#1A1A1A] font-mono text-xs px-3 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] disabled:opacity-50"
                />
              </div>

              <button
                onClick={handleAssignSelf}
                disabled={isOfficerAssigned}
                className={`w-full py-3 rounded-xl font-medium text-xs transition-all shadow-sm flex items-center justify-center gap-2 ${
                  isOfficerAssigned
                    ? 'bg-[#EBF7EE] border border-[#2D7A4F] text-[#2D7A4F] opacity-90 cursor-not-allowed pointer-events-none'
                    : 'bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] cursor-pointer'
                }`}
              >
                {isOfficerAssigned ? (
                  <>
                    <UserCheck className="w-4 h-4 text-[#2D7A4F]" />
                    <span>Assigned to Sector</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Assign Myself with 16-Digit Key</span>
                  </>
                )}
              </button>
            </div>
          </div>
          )}

          {/* Card 2: Inter-Departmental Assigned Officers Roster */}
          <div className="bg-white/80 hover:bg-white border border-[#E8E1D5] hover:border-[#8B7355]/50 rounded-3xl p-5 backdrop-blur-md space-y-3 shadow-2xs hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E1D5]">
              <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#8B7355]" /> Assigned Inter-Agency Team
              </h3>
              <span className="text-xs text-[#7A726A] font-mono">
                {activeZone.assigned_officers.length} Active
              </span>
            </div>

            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {activeZone.assigned_officers.length === 0 ? (
                <div className="text-xs text-[#8C847A] italic py-2 text-center">
                  No officers assigned to this zone yet. Use the key assignment above to join.
                </div>
              ) : (
                activeZone.assigned_officers.map((officer, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#F6F4F0] border border-[#E8E1D5] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#1A1A1A]">{officer.officer_name}</div>
                      <div className="text-[10px] text-[#8B7355] font-mono">{officer.department}</div>
                    </div>
                    {officer.vote_to_resolve ? (
                      <span className="px-2 py-0.5 bg-[#EBF7EE] text-[#2D7A4F] text-[10px] font-bold rounded border border-[#2D7A4F]/30">
                        VOTED SAFE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#EBF7EE] text-[#2D7A4F] text-[10px] font-bold rounded border border-[#2D7A4F]/30">
                        ON DUTY
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card 3: Consensus Resolution Voting Panel */}
          <div className="bg-white/80 hover:bg-white border border-[#E8E1D5] hover:border-[#8B7355]/50 rounded-3xl p-5 backdrop-blur-md space-y-3 shadow-2xs hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E1D5]">
              <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D7A4F]" /> Sector Resolution Vote
              </h3>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                activeZone.status === 'SITUATION_UNDER_CONTROL' 
                  ? 'bg-[#EBF7EE] text-[#2D7A4F] border border-[#2D7A4F]/30' 
                  : 'bg-[#FFF5F2] text-[#B85C38] border border-[#FADED4]'
              }`}>
                {activeZone.status === 'SITUATION_UNDER_CONTROL' ? 'RESOLVED SAFE' : 'ACTIVE RED ZONE'}
              </span>
            </div>

            <p className="text-xs text-[#5C544D] leading-relaxed">
              A Red Zone transitions to <strong className="text-[#2D7A4F]">Situation Under Control</strong> only when assigned administrators reach consensus.
            </p>

            {/* Resolution Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[#7A726A] font-mono">
                <span>Consensus Votes:</span>
                <span className="text-[#1A1A1A] font-bold">{activeZone.resolution_votes_cast} / {activeZone.resolution_votes_required} Required</span>
              </div>
              <div className="w-full bg-[#E8E1D5] rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#2D7A4F] h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (activeZone.resolution_votes_cast / activeZone.resolution_votes_required) * 100)}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={handleVoteResolve}
              disabled={!isOfficerAssigned || hasOfficerVoted || activeZone.status === 'SITUATION_UNDER_CONTROL'}
              className={`w-full py-3 rounded-xl font-medium text-xs transition-all shadow-sm flex items-center justify-center gap-2 ${
                activeZone.status === 'SITUATION_UNDER_CONTROL'
                  ? 'bg-[#EBF7EE] text-[#2D7A4F] border border-[#2D7A4F] cursor-not-allowed pointer-events-none'
                  : hasOfficerVoted
                  ? 'bg-[#F6F4F0] text-[#7A726A] cursor-not-allowed pointer-events-none'
                  : !isOfficerAssigned
                  ? 'bg-[#F6F4F0] text-[#8C847A] cursor-not-allowed opacity-70 pointer-events-none'
                  : 'bg-[#2D7A4F] hover:bg-[#256842] text-white cursor-pointer'
              }`}
            >
              {activeZone.status === 'SITUATION_UNDER_CONTROL' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#2D7A4F]" />
                  <span>Situation Under Control (Resolved)</span>
                </>
              ) : hasOfficerVoted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#2D7A4F]" />
                  <span>Vote Cast — Awaiting Team Consensus</span>
                </>
              ) : !isOfficerAssigned ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Assign Yourself First to Vote</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Vote: Situation Under Control</span>
                </>
              )}
            </button>
          </div>
          
          {/* Card 4: Tactical Actions */}
          <div className="bg-white/80 hover:bg-white border border-[#E8E1D5] hover:border-[#8B7355]/50 rounded-3xl p-5 backdrop-blur-md space-y-3 shadow-2xs hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E1D5]">
              <h3 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#B85C38]" /> Tactical Actions
              </h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setBroadcastSent(true);
                  addToast('Priority evacuation siren broadcast sent to citizen mobile terminals.', 'success');
                }}
                disabled={broadcastSent || !isOfficerAssigned}
                className={`w-full py-2.5 rounded-xl font-medium text-xs transition-all shadow-sm flex items-center justify-center gap-2 ${
                  broadcastSent
                    ? 'bg-[#EBF7EE] text-[#2D7A4F] border border-[#2D7A4F]/30 cursor-not-allowed pointer-events-none'
                    : !isOfficerAssigned
                    ? 'bg-[#F6F4F0] text-[#8C847A] cursor-not-allowed opacity-70 pointer-events-none'
                    : 'bg-[#B85C38] hover:bg-[#A04D2D] text-white cursor-pointer'
                }`}
              >
                {broadcastSent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Broadcast Sent to Citizens
                  </>
                ) : (
                  <>
                    <Megaphone className="w-4 h-4" /> Send Evacuation Broadcast
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setBackupRequested(true);
                  addToast('NDRF Rapid Tactical Backup unit dispatched to target sector coordinates.', 'success');
                }}
                disabled={backupRequested || !isOfficerAssigned}
                className={`w-full py-2.5 rounded-xl font-medium text-xs transition-all shadow-sm flex items-center justify-center gap-2 ${
                  backupRequested
                    ? 'bg-[#EBF7EE] text-[#2D7A4F] border border-[#2D7A4F]/30 cursor-not-allowed pointer-events-none'
                    : !isOfficerAssigned
                    ? 'bg-[#F6F4F0] text-[#8C847A] cursor-not-allowed opacity-70 pointer-events-none'
                    : 'bg-[#2C2A29] hover:bg-[#1A1A1A] text-white cursor-pointer'
                }`}
              >
                {backupRequested ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> NDRF Backup Dispatched
                  </>
                ) : (
                  <>
                    <Ambulance className="w-4 h-4" /> Request Emergency Backup
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 5: TeamViewer-Style Chat System (#13) - Rendered natively in split view */}
          {isOfficerAssigned && (
            <div className="bg-white border border-[#E8E1D5] rounded-3xl shadow-sm flex flex-col overflow-hidden h-full min-h-[400px]">
              {/* TeamViewer style dark header bar */}
              <div className="bg-[#2C2A29] px-4 py-3 flex items-center justify-between text-white border-b border-[#3D3A38]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#3D3A38] flex items-center justify-center text-[#8B7355]">
                    <Radio className="w-3.5 h-3.5 text-[#2D7A4F] animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <span>Tactical Mesh Channel</span>
                      <span className="w-2 h-2 rounded-full bg-[#2D7A4F]"></span>
                    </div>
                    <div className="text-[10px] text-[#A89F91] truncate max-w-[180px]">
                      {activeZone.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Banner */}
              <div className="bg-[#F6F4F0] px-3.5 py-2 border-b border-[#E8E1D5] flex items-center justify-between text-[10px] text-[#5C544D]">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#8B7355]" />
                  <span>Encrypted Session • Linked</span>
                </span>
                <span className="font-mono font-bold text-[#8B7355]">{activeZone.access_key}</span>
              </div>

              {/* Message Thread */}
              <div className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-white/70 text-xs">
                {chatMessages.map(msg => {
                  const isMe = msg.sender === (user?.fullName || user?.name || 'My Terminal');
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#7A726A] mb-1">
                        <span className="font-bold text-[#1A1A1A]">{msg.sender}</span>
                        <span>•</span>
                        <span className="px-1.5 py-0.2 rounded bg-[#E8E1D5] text-[#4A4238] font-mono text-[9px]">{msg.department}</span>
                        <span>•</span>
                        <span>{msg.time}</span>
                      </div>
                      <div className={`p-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-2xs ${
                        isMe 
                          ? 'bg-[#2C2A29] text-[#FDFBF7] rounded-tr-xs' 
                          : 'bg-[#F6F4F0] text-[#1A1A1A] border border-[#E8E1D5] rounded-tl-xs'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input & Dispatch Bar */}
              <form onSubmit={handleSendChatMessage} className="p-2.5 bg-[#F6F4F0] border-t border-[#E8E1D5] flex items-center gap-1.5">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Send message to sector team..."
                  className="flex-1 bg-white text-[#1A1A1A] text-xs px-3 py-2 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355]"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="w-8 h-8 rounded-xl bg-[#2C2A29] hover:bg-[#1A1A1A] text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs shrink-0"
                  title="Send Message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FDFBF7] border border-[#E8E1D5] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-[#2C2A29] text-[#FDFBF7] flex items-center justify-center shadow-xs overflow-hidden border border-[#8B7355]/30">
                  {user?.profile_picture || user?.avatar || (typeof window !== 'undefined' && localStorage.getItem('suraksha_user_pfp')) ? (
                    <img 
                      src={user?.profile_picture || user?.avatar || localStorage.getItem('suraksha_user_pfp')} 
                      alt="Officer" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A1A1A]">Officer Profile</h3>
                  <p className="text-xs text-[#7A726A]">Operational Credentials & Clearance</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="w-8 h-8 rounded-xl bg-white border border-[#E8E1D5] flex items-center justify-center text-[#5C544D] hover:text-[#1A1A1A] transition-colors cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Details List */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-[#E8E1D5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#7A726A] font-medium">Officer Full Name</span>
                  <span className="font-bold text-[#1A1A1A]">{user?.fullName || user?.name || user?.username || 'NDRF Commander Chief'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A726A] font-medium">Officer Identifier / ID</span>
                  <span className="font-mono text-[#8B7355] font-bold">{user?.userId || user?.user_id || user?.username || 'officer_chief_01'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A726A] font-medium">Deployment Department</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EBF7EE] text-[#2D7A4F] border border-[#2D7A4F]/30">
                    {user?.role || 'NDRF Tactical Command'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#E8E1D5] space-y-2.5">
                <div className="flex items-center gap-2 text-[#5C544D]">
                  <Mail className="w-3.5 h-3.5 text-[#8B7355] shrink-0" />
                  <span className="truncate">{user?.email || 'officer.command@surakshadrishti.in'}</span>
                </div>
                <div className="flex items-center gap-2 text-[#5C544D]">
                  <Phone className="w-3.5 h-3.5 text-[#8B7355] shrink-0" />
                  <span>{user?.phone || '+91 98765 43210 (Secure Tactical Channel)'}</span>
                </div>
                <div className="flex items-center gap-2 text-[#2D7A4F] pt-1 border-t border-[#E8E1D5]">
                  <BadgeCheck className="w-4 h-4 shrink-0 text-[#2D7A4F]" />
                  <span className="font-semibold">Authenticated Supabase Officer Credentials</span>
                </div>
              </div>

              {/* Current Active Jurisdiction */}
              <div className="p-3 rounded-2xl bg-[#F6F4F0] border border-[#E8E1D5] text-[11px] text-[#5C544D] flex items-center justify-between">
                <span>Active Sector Focus:</span>
                <span className="font-bold text-[#1A1A1A]">{activeZone.name}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#E8E1D5]">
              {onNavigateProfile && (
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileModal(false);
                    onNavigateProfile();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-white hover:bg-[#F6F4F0] border border-[#E8E1D5] text-[#1A1A1A] font-semibold text-xs transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-[#8B7355]" />
                  <span>Edit Profile & Photo</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] font-semibold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
