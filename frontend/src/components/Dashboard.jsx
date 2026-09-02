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
  Shield
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

  // Simulated Residents Trapped in Red Zone
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
    { title: 'Active Red Zones', value: `${zones.filter(z=>z.status==='ACTIVE_RED_ZONE').length} Sectors`, change: '16-Digit Encrypted Keys', color: 'text-[#B85C38]', bg: 'bg-white/70 border-[#FADED4]' },
    { title: 'Trapped Citizens Monitored', value: `${trappedCitizens.length * 710}`, change: 'Blue GPS Telemetry Pulses', color: 'text-[#C05621]', bg: 'bg-white/70 border-[#FEEBC8]' },
    { title: 'Assigned Command Officers', value: `${activeZone.assigned_officers.length} Officers`, change: `${activeZone.assigned_officers.map(o=>o.department).join(', ') || 'Awaiting Assignment'}`, color: 'text-[#2D7A4F]', bg: 'bg-white/70 border-[#D4EDDA]' },
    { title: 'Sector Resolution Status', value: activeZone.status === 'SITUATION_UNDER_CONTROL' ? 'SAFE — RESOLVED' : 'ACTIVE EMERGENCY', change: `Consensus: ${activeZone.resolution_votes_cast}/${activeZone.resolution_votes_required} Votes`, color: activeZone.status === 'SITUATION_UNDER_CONTROL' ? 'text-[#2D7A4F]' : 'text-[#8B7355]', bg: 'bg-white/70 border-[#E8E1D5]' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* Header Bar with Live Geolocation Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white/80 border border-[#E8E1D5] backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-[#2C2A29] text-[#FDFBF7] shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
                Suraksha<span className="text-[#8B7355]">Drishti</span> — Command Console
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#B85C38] text-white rounded-full">
                SIH 26191
              </span>
            </div>
            <p className="text-xs text-[#5C544D] mt-0.5">
              Officer: <span className="text-[#1A1A1A] font-semibold">{user?.name || user?.username || 'NDRF Commander Chief'}</span> | Department: <span className="text-[#8B7355] font-semibold">{user?.role || 'NDRF Tactical Command'}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Automatic Browser Geolocation Display */}
          <div className="px-3.5 py-2 rounded-xl bg-[#F6F4F0] border border-[#E8E1D5] text-xs text-[#5C544D] flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-[#8B7355] animate-spin" />
            {isGpsLoading ? (
              <span>Locating Browser GPS...</span>
            ) : (
              <span>GPS: <strong className="text-[#1A1A1A]">{officerLocation?.lat.toFixed(4)}° N, {officerLocation?.lng.toFixed(4)}° E</strong> (±{officerLocation?.accuracy}m)</span>
            )}
          </div>

          <button 
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-transparent hover:bg-[#FFF5F2] border border-[#D9D0C1] hover:border-[#B85C38] text-xs font-semibold text-[#B85C38] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border ${s.bg} backdrop-blur-md transition-all hover:scale-[1.01] shadow-xs`}>
            <div className="text-xs text-[#5C544D] font-semibold">{s.title}</div>
            <div className={`text-2xl font-bold mt-1 tracking-tight ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-[#7A726A] mt-1 flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#8C847A]" /> {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Left GIS Viewport with Trapped Citizen Telemetry | Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive GIS Map */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-white/80 border border-[#E8E1D5] rounded-3xl p-4 flex flex-col justify-between min-h-[480px] relative overflow-hidden backdrop-blur-md shadow-sm">
            
            {/* Map Header & Zone Selector */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F6F4F0] p-3 rounded-2xl border border-[#E8E1D5]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A]">
                <Map className="w-4 h-4 text-[#8B7355]" /> 
                <span>Active GIS Red Zone Viewport</span>
              </div>

              {/* Zone Dropdown Selector */}
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-[#7A726A] font-bold uppercase">Sector:</label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => {
                    setSelectedZoneId(e.target.value);
                    setAssignSuccessMsg(null);
                    setAssignErrorMsg(null);
                  }}
                  className="bg-white text-[#1A1A1A] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] cursor-pointer"
                >
                  {zones.map(z => (
                    <option key={z.zone_id} value={z.zone_id}>
                      {z.name} ({z.status === 'SITUATION_UNDER_CONTROL' ? 'RESOLVED SAFE' : 'RED ZONE'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interactive Real Map */}
            <div className="relative z-10 my-4 rounded-2xl overflow-hidden border border-[#E8E1D5] h-[400px]">
              <RealGoogleMap
                center={[activeZone.lat, activeZone.lng]}
                zoom={14}
                interactive={true}
              />

              {/* Overlay Legend */}
              <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 border border-[#E8E1D5] p-2.5 rounded-xl text-xs backdrop-blur-md space-y-1 shadow-sm">
                <div className="font-bold text-[#1A1A1A] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#8B7355]" /> GIS Telemetry Legend
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#5C544D]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B85C38] inline-block"></span>
                  <span>Active Red Zone Hazard Perimeter</span>
                </div>
              </div>
            </div>

            {/* Selected Zone Footer Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between text-xs text-[#5C544D] bg-[#F6F4F0] p-3 rounded-xl border border-[#E8E1D5] gap-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B85C38]" />
                Center: <strong className="text-[#1A1A1A]">{activeZone.lat}° N, {activeZone.lng}° E</strong>
              </span>
              <span className="font-mono text-[#4A4238] font-bold">
                16-Digit Key: <code className="bg-white px-2 py-0.5 rounded border border-[#E8E1D5] text-[#B85C38]">{activeZone.access_key}</code>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Card 1: 16-Digit Key Assignment */}
          <div className="bg-white/80 border border-[#E8E1D5] rounded-3xl p-5 backdrop-blur-md space-y-3 shadow-sm">
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

            {assignSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-[#EBF7EE] border border-[#2D7A4F]/30 text-[#2D7A4F] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2D7A4F] shrink-0" />
                <span>{assignSuccessMsg}</span>
              </div>
            )}

            {assignErrorMsg && (
              <div className="p-2.5 rounded-xl bg-[#FFF5F2] border border-[#FADED4] text-[#B85C38] text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#B85C38] shrink-0" />
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
                  className="w-full bg-[#FDFBF7] text-[#1A1A1A] font-mono text-xs px-3 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] disabled:opacity-50"
                />
              </div>

              <button
                onClick={handleAssignSelf}
                disabled={isOfficerAssigned}
                className={`w-full py-3 rounded-xl font-medium text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  isOfficerAssigned
                    ? 'bg-[#EBF7EE] border border-[#2D7A4F] text-[#2D7A4F] opacity-90'
                    : 'bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7]'
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

          {/* Card 2: Inter-Departmental Assigned Officers Roster */}
          <div className="bg-white/80 border border-[#E8E1D5] rounded-3xl p-5 backdrop-blur-md space-y-3 shadow-sm">
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
                      <span className="px-2 py-0.5 bg-white text-[#7A726A] text-[10px] rounded border border-[#E8E1D5]">
                        ON DUTY
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card 3: Consensus Resolution Voting Panel */}
          <div className="bg-white/80 border border-[#E8E1D5] rounded-3xl p-5 backdrop-blur-md space-y-3 shadow-sm">
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
              className={`w-full py-3 rounded-xl font-medium text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                activeZone.status === 'SITUATION_UNDER_CONTROL'
                  ? 'bg-[#EBF7EE] text-[#2D7A4F] border border-[#2D7A4F] cursor-default'
                  : hasOfficerVoted
                  ? 'bg-[#F6F4F0] text-[#7A726A] cursor-default'
                  : !isOfficerAssigned
                  ? 'bg-[#F6F4F0] text-[#8C847A] cursor-not-allowed opacity-70'
                  : 'bg-[#2D7A4F] hover:bg-[#256842] text-white'
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

        </div>

      </div>
    </div>
  );
}
