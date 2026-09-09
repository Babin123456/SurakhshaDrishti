import React, { useState, useEffect } from 'react';
import RealGoogleMap from './RealGoogleMap';
import AlertNotification from './AlertNotification';
import { apiService } from '../utils/api';

export default function AgentDashboard({ onLogout, session }) {
  const [isEmergency, setIsEmergency] = useState(false);
  const [zones, setZones] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMode, setChatMode] = useState('E2EE'); // 'E2EE' or 'GSM'
  const [safehouses, setSafehouses] = useState([]);
  const [trappedCitizens, setTrappedCitizens] = useState([]);
  
  // Poll for zones
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await apiService.fetchZones();
        if (response.success && response.zones) {
          const activeZones = response.zones.filter(z => z.status === 'ACTIVE_RED_ZONE' || z.status === 'ACTIVE_WARNING_ZONE');
          setZones(activeZones);
          setIsEmergency(activeZones.length > 0);
        } else if (Array.isArray(response)) {
          const activeZones = response.filter(z => z.status === 'ACTIVE_RED_ZONE' || z.status === 'ACTIVE_WARNING_ZONE');
          setZones(activeZones);
          setIsEmergency(activeZones.length > 0);
        }
      } catch (err) {
        console.error("Failed to fetch zones for Agent dashboard:", err);
      }
    };
    
    fetchZones();
    const interval = setInterval(fetchZones, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Safehouses globally for the map
  useEffect(() => {
    if (zones.length === 0) return;
    const fetchSafehouses = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/zones/shelters/dynamic?lat=${zones[0].lat}&lng=${zones[0].lng}&radius=30000`);
        const data = await response.json();
        if (data.success) {
          setSafehouses(data.shelters);
        }
      } catch (err) {
        console.error("Agent safehouse fetch failed:", err);
      }
    };
    fetchSafehouses();
  }, [zones]);

  // Fetch Trapped Citizens
  useEffect(() => {
    if (zones.length === 0) return;
    const fetchCitizens = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/zones/${zones[0].id || zones[0].zone_id}/trapped-citizens`);
        const data = await response.json();
        if (data.success) {
          setTrappedCitizens(data.citizens);
        }
      } catch (err) {
        console.error("Agent citizen fetch failed:", err);
      }
    };
    fetchCitizens();
    const interval = setInterval(fetchCitizens, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [zones]);

  return (
    <div className="w-screen h-screen flex bg-zinc-950 font-sans overflow-hidden">
      
      {/* Left Sidebar - Agent Controls */}
      <div className="w-[350px] h-full bg-zinc-900 border-r border-zinc-800 flex flex-col z-10 shrink-0">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              Tactical Hub
            </h1>
            <button 
              onClick={onLogout}
              className="text-xs font-bold text-zinc-500 hover:text-red-500 transition-colors uppercase"
            >
              Log Off
            </button>
          </div>
          <div className="text-xs text-zinc-400 font-mono">
            ID: {session?.email || 'NDRF_CMD_104'} <br/>
            Role: FIELD COMMANDER
          </div>
        </div>

        {/* E2EE Chat Placeholder */}
        <div className="flex-1 flex flex-col p-5 border-b border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              Comms Relay
            </h2>
            <select 
              value={chatMode} 
              onChange={e => setChatMode(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] uppercase font-bold rounded px-1.5 py-0.5 focus:outline-none focus:border-blue-500"
            >
              <option value="E2EE">E2EE Secure</option>
              <option value="GSM">GSM Fallback</option>
            </select>
          </div>
          
          <div className="flex-1 bg-zinc-950 rounded-lg border border-zinc-800 p-3 overflow-y-auto mb-3 flex flex-col gap-3">
            <div className={`text-[10px] text-center font-mono uppercase my-1 ${chatMode === 'E2EE' ? 'text-zinc-600' : 'text-orange-500/70'}`}>
              {chatMode === 'E2EE' ? 'Encrypted Tunnel Established' : 'WARNING: Unencrypted GSM Channel'}
            </div>
            
            {chatMode === 'E2EE' ? (
              <>
                <div className="bg-zinc-800 rounded-lg p-2 text-xs text-zinc-300 w-[90%]">
                  <span className="text-blue-400 font-bold text-[10px] block mb-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    HQ Command
                  </span>
                  Sector 4 riverbank has breached. Deploying SAR teams now.
                </div>
                
                <div className="bg-blue-900/50 border border-blue-800 rounded-lg p-2 text-xs text-blue-100 w-[90%] self-end">
                  <span className="text-blue-300 font-bold text-[10px] block mb-1">You</span>
                  Copy that. ETA 12 minutes. Initiating evacuation protocols.
                </div>
              </>
            ) : (
              <>
                <div className="bg-orange-950/30 border border-orange-900/50 rounded-lg p-2 text-xs text-orange-200 w-[90%]">
                  <span className="text-orange-400 font-bold text-[10px] block mb-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
                    Local Govt Relay
                  </span>
                  Power grid failure in Sector 4. Cellular towers switching to backup generators. Expect spotty coverage.
                </div>

                <div className="bg-orange-900/40 border border-orange-800/60 rounded-lg p-2 text-xs text-orange-100 w-[90%] self-end">
                  <span className="text-orange-300 font-bold text-[10px] block mb-1">You</span>
                  Acknowledged. Shifting non-essential comms to GSM to save E2EE bandwidth.
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={chatMode === 'E2EE' ? "Transmit securely..." : "Send SMS text..."}
              className={`flex-1 bg-zinc-950 border text-xs rounded-lg px-3 py-2 focus:outline-none ${chatMode === 'E2EE' ? 'border-zinc-800 text-white focus:border-blue-500' : 'border-orange-900/50 text-orange-100 focus:border-orange-500'}`}
            />
            <button className={`${chatMode === 'E2EE' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-orange-600 hover:bg-orange-500'} text-white rounded-lg px-3 py-2 transition-colors`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </div>
        </div>

        {/* Zone Consensus Voting - Dynamic Logic */}
        <div className="p-5 flex-1 overflow-y-auto">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            Active 80% Consensus
          </h2>
          
          {zones.filter(z => z.zone_type === 'RED').length === 0 ? (
            <div className="text-zinc-600 text-xs text-center mt-4">No active Red Zones require your vote.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {zones.filter(z => z.zone_type === 'RED').map(zone => {
                const totalAssigned = zone.active_officers_count || 1; // Prevent div by 0
                const votesCast = zone.resolution_votes_cast || 0;
                const required = Math.max(1, Math.ceil(totalAssigned * 0.8));
                
                // Determine if this specific officer has voted
                const myVoteObj = Array.isArray(zone.assigned_officers) 
                  ? zone.assigned_officers.find(o => o.user_id === (session?.email || 'NDRF_CMD_104'))
                  : null;
                const haveIVoted = myVoteObj?.vote_to_resolve === true;

                const handleVote = async () => {
                  const res = await apiService.voteResolveZone(zone.zone_id, session?.email || 'NDRF_CMD_104');
                  if (res.success) {
                    // Force a re-fetch of zones (handled by the polling interval, or we can just wait 10s)
                    // The UI will update on the next poll.
                    alert(res.message);
                  } else {
                    alert("Vote failed: " + res.error);
                  }
                };

                return (
                  <div key={zone.zone_id} className="bg-zinc-950 rounded-xl border border-zinc-800 p-4">
                    <div className="text-white font-bold text-sm mb-1 truncate" title={zone.name}>{zone.name}</div>
                    <div className="text-zinc-500 text-xs mb-3">
                      {votesCast} / {required} votes cast (Requires 80% consensus)
                    </div>
                    
                    <div className="flex gap-1 mb-3">
                      {/* Render progress bar blocks based on total required */}
                      {Array.from({ length: Math.max(5, required) }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 flex-1 rounded-full ${i < votesCast ? 'bg-green-500' : 'bg-zinc-800'}`}
                        ></div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={handleVote}
                        disabled={haveIVoted}
                        className={`flex-1 font-bold text-xs py-2 rounded-lg transition-colors border ${
                          haveIVoted 
                            ? 'bg-green-900/30 border-green-800 text-green-700 cursor-not-allowed'
                            : 'bg-green-600/20 hover:bg-green-600/40 border-green-500/50 text-green-400'
                        }`}
                      >
                        {haveIVoted ? 'VOTE RECORDED' : 'APPROVE'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative">
        {/* Top Floating Status */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[99] bg-zinc-900/90 backdrop-blur border border-zinc-800 px-6 py-2 rounded-full shadow-2xl flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isEmergency ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
            <span className="text-white font-bold text-xs uppercase tracking-wider">
              {isEmergency ? 'CRITICAL EMERGENCY' : 'SECTORS STABLE'}
            </span>
          </div>
          <div className="w-px h-4 bg-zinc-700"></div>
          <div className="text-zinc-400 font-mono text-xs">
            {zones.length} Active Zones
          </div>
        </div>

        <RealGoogleMap 
          zones={zones} 
          safehouses={safehouses}
          citizens={trappedCitizens}
          standalone={false} 
          zoom={isEmergency ? 11 : 13}
        />
      </div>

    </div>
  );
}
