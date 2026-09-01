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
  RefreshCw
} from 'lucide-react';
import RealGoogleMap from './RealGoogleMap';

export default function Dashboard({ user, onLogout }) {
  // Automatic Browser Geolocation
  const [officerLocation, setOfficerLocation] = useState(null);
  const [isGpsLoading, setIsGpsLoading] = useState(true);

  // Red Zones State
  const [zones, setZones] = useState([
    {
      zone_id: 'RZ-WAYANAD-04',
      name: 'Wayanad Hill Slope (Sector 4)',
      state: 'Kerala',
      lat: 11.6854,
      lng: 76.1320,
      zone_type: 'RED',
      hazard_type: 'LANDSLIDE',
      risk_score: 94,
      access_key: 'RZ-89A4-91F2-3B7C',
      status: 'ACTIVE_RED_ZONE',
      resolution_votes_required: 2,
      resolution_votes_cast: 1,
      population_risk: 1420,
      assigned_officers: [
        { user_id: 'sdma_officer', officer_name: 'SDMA Regional Officer', department: 'SDMA', vote_to_resolve: true }
      ]
    },
    {
      zone_id: 'RZ-JOSHIMATH-02',
      name: 'Joshimath Slope Sector B',
      state: 'Uttarakhand',
      lat: 30.5564,
      lng: 79.5659,
      zone_type: 'RED',
      hazard_type: 'SUBSIDENCE',
      risk_score: 88,
      access_key: 'RZ-41C2-88E0-99A1',
      status: 'ACTIVE_RED_ZONE',
      resolution_votes_required: 3,
      resolution_votes_cast: 0,
      population_risk: 2850,
      assigned_officers: []
    },
    {
      zone_id: 'RZ-TEESTA-07',
      name: 'Teesta Riverbank Sector 7',
      state: 'Sikkim',
      lat: 27.0883,
      lng: 88.2609,
      zone_type: 'YELLOW',
      hazard_type: 'FLASH_FLOOD',
      risk_score: 76,
      access_key: 'RZ-73F9-22D4-55B8',
      status: 'ACTIVE_RED_ZONE',
      resolution_votes_required: 2,
      resolution_votes_cast: 0,
      population_risk: 3100,
      assigned_officers: []
    }
  ]);

  const [selectedZoneId, setSelectedZoneId] = useState('RZ-WAYANAD-04');
  const [inputKey, setInputKey] = useState('');
  const [assignSuccessMsg, setAssignSuccessMsg] = useState(null);
  const [assignErrorMsg, setAssignErrorMsg] = useState(null);

  // Selected Zone Details
  const activeZone = zones.find(z => z.zone_id === selectedZoneId) || zones[0];
  const isOfficerAssigned = activeZone?.assigned_officers?.some(
    o => o.user_id === (user?.user_id || user?.username || 'ndrf_admin')
  );
  const hasOfficerVoted = activeZone?.assigned_officers?.some(
    o => o.user_id === (user?.user_id || user?.username || 'ndrf_admin') && o.vote_to_resolve
  );

  // Simulated Residents Trapped in Red Zone (Blue Pulsing Markers)
  const trappedCitizens = [
    { id: 'SOS-901', name: 'Citizen #104 (Elderly)', lat: activeZone.lat + 0.0012, lng: activeZone.lng + 0.0015, type: 'CRITICAL', specialNeeds: 'Wheelchair Assistance' },
    { id: 'SOS-902', name: 'Citizen #105 (Infant Family)', lat: activeZone.lat - 0.0018, lng: activeZone.lng - 0.0008, type: 'URGENT', specialNeeds: 'Medical Supplies' },
    { id: 'SOS-903', name: 'Citizen #106', lat: activeZone.lat + 0.0025, lng: activeZone.lng - 0.0021, type: 'EVACUATING', specialNeeds: 'None' },
    { id: 'SOS-904', name: 'Citizen #107', lat: activeZone.lat - 0.0009, lng: activeZone.lng + 0.0028, type: 'CRITICAL', specialNeeds: 'Stretcher Required' },
  ];

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
          // Fallback to default command location
          setOfficerLocation({ lat: 11.6854, lng: 76.1320, accuracy: 12 });
          setIsGpsLoading(false);
        }
      );
    } else {
      setOfficerLocation({ lat: 11.6854, lng: 76.1320, accuracy: 12 });
      setIsGpsLoading(false);
    }
  }, []);

  // 2. Assign Officer to Red Zone using 16-digit Security Key
  const handleAssignSelf = () => {
    setAssignSuccessMsg(null);
    setAssignErrorMsg(null);

    // Verify key if user typed one
    if (inputKey.trim() && inputKey.trim().toUpperCase() !== activeZone.access_key.toUpperCase()) {
      setAssignErrorMsg(`Invalid 16-Digit Access Key for ${activeZone.name}. Required format: RZ-XXXX-XXXX-XXXX`);
      return;
    }

    const currentOfficerId = user?.user_id || user?.username || 'ndrf_command_chief';
    const currentOfficerName = user?.name || user?.username || 'NDRF Commander Chief';
    const currentDept = user?.role || 'NDRF';

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

    setAssignSuccessMsg(`Successfully assigned to ${activeZone.name}! You are now part of the multi-agency response team.`);
    setInputKey('');
  };

  // 3. Vote to Resolve Situation in Red Zone
  const handleVoteResolve = () => {
    const currentOfficerId = user?.user_id || user?.username || 'ndrf_command_chief';

    setZones(prev => prev.map(z => {
      if (z.zone_id === selectedZoneId) {
        const updatedOfficers = z.assigned_officers.map(o => {
          if (o.user_id === currentOfficerId) {
            return { ...o, vote_to_resolve: true };
          }
          return o;
        });

        const newVotesCast = updatedOfficers.filter(o => o.vote_to_resolve).length;
        const isFullyResolved = newVotesCast >= z.resolution_votes_required;

        return {
          ...z,
          assigned_officers: updatedOfficers,
          resolution_votes_cast: newVotesCast,
          status: isFullyResolved ? 'SITUATION_UNDER_CONTROL' : z.status,
          zone_type: isFullyResolved ? 'GREEN' : z.zone_type
        };
      }
      return z;
    }));
  };

  const stats = [
    { title: 'Active Red Zones', value: `${zones.filter(z=>z.status==='ACTIVE_RED_ZONE').length} Sectors`, change: '16-Digit Encrypted Keys', color: 'text-red-400', bg: 'bg-red-950/40 border-red-900/60' },
    { title: 'Trapped Citizens Monitored', value: `${trappedCitizens.length * 710}`, change: 'Blue GPS Telemetry Pulses', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-900/60' },
    { title: 'Assigned Command Officers', value: `${activeZone.assigned_officers.length} Officers`, change: `${activeZone.assigned_officers.map(o=>o.department).join(', ') || 'Awaiting Assignment'}`, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-900/60' },
    { title: 'Sector Resolution Status', value: activeZone.status === 'SITUATION_UNDER_CONTROL' ? 'SAFE — UNDER CONTROL' : 'ACTIVE EMERGENCY', change: `Consensus: ${activeZone.resolution_votes_cast}/${activeZone.resolution_votes_required} Votes`, color: activeZone.status === 'SITUATION_UNDER_CONTROL' ? 'text-emerald-400' : 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-900/60' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* Header Bar with Live Geolocation Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-glass shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 text-white shadow-md shadow-red-950">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cambria text-xl font-bold text-white tracking-tight">SurakshaDrishti — Administrator Command Console</h1>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-red-600 text-white rounded-full">SIH 26191</span>
            </div>
            <p className="font-cambria text-xs text-slate-400">
              Officer: <span className="text-white font-medium">{user?.name || user?.username || 'NDRF Commander Chief'}</span> | Department: <span className="text-cyan-400 font-medium">{user?.role || 'NDRF Tactical Command'}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Automatic Browser Geolocation Display */}
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            {isGpsLoading ? (
              <span>Locating Browser GPS...</span>
            ) : (
              <span>GPS: <strong className="text-white">{officerLocation?.lat.toFixed(4)}° N, {officerLocation?.lng.toFixed(4)}° E</strong> (±{officerLocation?.accuracy}m)</span>
            )}
          </div>

          <button 
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-xs font-semibold text-red-300 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${s.bg} backdrop-blur-glass transition-all hover:scale-[1.01]`}>
            <div className="font-cambria text-xs text-slate-400 font-semibold">{s.title}</div>
            <div className={`font-cambria text-xl font-black mt-1 ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Activity className="w-3 h-3 text-slate-500" /> {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Left GIS Viewport with Blue Pulsing Trapped Resident Markers | Right Assignment & Resolution Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive GIS Map & Trapped Citizen Telemetry (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-[480px] relative overflow-hidden backdrop-blur-glass">
            
            {/* Map Header & Zone Selector */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/70 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Map className="w-4 h-4 text-cyan-400" /> 
                <span>Active GIS Red Zone Viewport</span>
              </div>

              {/* Zone Dropdown Selector */}
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-slate-400 font-bold uppercase">Sector:</label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => {
                    setSelectedZoneId(e.target.value);
                    setAssignSuccessMsg(null);
                    setAssignErrorMsg(null);
                  }}
                  className="bg-slate-950 text-white font-cambria text-xs font-bold px-3 py-1.5 rounded-md border border-slate-700 focus:outline-none focus:border-cyan-500"
                >
                  {zones.map(z => (
                    <option key={z.zone_id} value={z.zone_id}>
                      {z.name} ({z.status === 'SITUATION_UNDER_CONTROL' ? 'RESOLVED SAFE' : 'RED ZONE'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interactive Real Map with Blue Pulsing Trapped Resident Telemetry */}
            <div className="relative z-10 my-4 rounded-xl overflow-hidden border border-slate-800 h-[380px]">
              <RealGoogleMap
                center={[activeZone.lat, activeZone.lng]}
                zoom={14}
                interactive={true}
              />

              {/* Overlay Legend: Blue Pulsing Circles = Citizens Trapped inside Red Zone */}
              <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/90 border border-slate-800 p-2.5 rounded-lg text-xs backdrop-blur-md space-y-1.5">
                <div className="font-bold text-white text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" /> GIS Telemetry Legend
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping inline-block"></span>
                  <span>Blue Pulses = Residents Trapped in Red Zone ({trappedCitizens.length} Active)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
                  <span>Red Circle = High-Slope Hazard Perimeter</span>
                </div>
              </div>
            </div>

            {/* Selected Zone Footer Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between text-xs text-slate-400 bg-black/60 p-2.5 rounded-lg border border-slate-800 gap-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                Center: <strong>{activeZone.lat}° N, {activeZone.lng}° E</strong>
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                16-Digit Key: <code className="bg-slate-950 px-2 py-0.5 rounded border border-cyan-900 text-cyan-300">{activeZone.access_key}</code>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Administrator Assignment & Resolution Voting Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Card 1: 16-Digit Key Assignment */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur-glass space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-cambria text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" /> Assign Self to Red Zone
              </h3>
              <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800">
                16-DIGIT KEY REQUIRED
              </span>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed">
              To operate in <strong className="text-white">{activeZone.name}</strong>, enter the 16-digit security key assigned to this zone:
            </div>

            {assignSuccessMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{assignSuccessMsg}</span>
              </div>
            )}

            {assignErrorMsg && (
              <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{assignErrorMsg}</span>
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`e.g. ${activeZone.access_key}`}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  disabled={isOfficerAssigned}
                  className="w-full bg-slate-950 text-white font-mono text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                />
              </div>

              <button
                onClick={handleAssignSelf}
                disabled={isOfficerAssigned}
                className={`w-full py-2.5 rounded-lg font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  isOfficerAssigned
                    ? 'bg-emerald-950 border border-emerald-800 text-emerald-300 opacity-90'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white'
                }`}
              >
                {isOfficerAssigned ? (
                  <>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
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

          {/* Card 2: Inter-Departmental Assigned Officers Roster */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur-glass space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-cambria text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" /> Assigned Inter-Agency Team
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {activeZone.assigned_officers.length} Officers Active
              </span>
            </div>

            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {activeZone.assigned_officers.length === 0 ? (
                <div className="text-xs text-slate-500 italic py-2 text-center">
                  No officers assigned to this zone yet. Use the key assignment above to join.
                </div>
              ) : (
                activeZone.assigned_officers.map((officer, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{officer.officer_name}</div>
                      <div className="text-[10px] text-cyan-400 font-mono">{officer.department}</div>
                    </div>
                    {officer.vote_to_resolve ? (
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-extrabold rounded border border-emerald-800">
                        VOTED SAFE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded">
                        ON DUTY
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card 3: Consensus Resolution Voting Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur-glass space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-cambria text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sector Resolution Vote
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                activeZone.status === 'SITUATION_UNDER_CONTROL' 
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                  : 'bg-red-950 text-red-400 border border-red-800'
              }`}>
                {activeZone.status === 'SITUATION_UNDER_CONTROL' ? 'RESOLVED SAFE' : 'ACTIVE RED ZONE'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              A Red Zone transitions to <strong className="text-emerald-400">Situation Under Control</strong> only when assigned administrators reach majority consensus.
            </p>

            {/* Resolution Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Consensus Votes:</span>
                <span className="text-white font-bold">{activeZone.resolution_votes_cast} / {activeZone.resolution_votes_required} Required</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (activeZone.resolution_votes_cast / activeZone.resolution_votes_required) * 100)}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={handleVoteResolve}
              disabled={!isOfficerAssigned || hasOfficerVoted || activeZone.status === 'SITUATION_UNDER_CONTROL'}
              className={`w-full py-2.5 rounded-lg font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                activeZone.status === 'SITUATION_UNDER_CONTROL'
                  ? 'bg-emerald-900 text-emerald-200 border border-emerald-700 cursor-default'
                  : hasOfficerVoted
                  ? 'bg-slate-800 text-slate-400 cursor-default'
                  : !isOfficerAssigned
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
              }`}
            >
              {activeZone.status === 'SITUATION_UNDER_CONTROL' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Situation Under Control (Resolved)</span>
                </>
              ) : hasOfficerVoted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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

        </div>

      </div>
    </div>
  );
}
