import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  Send, 
  Lock, 
  LogOut, 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  Vote, 
  Wifi, 
  AlertTriangle,
  Building2,
  Signal
} from 'lucide-react';
import RealGoogleMap from './RealGoogleMap';
import AlertNotification from './AlertNotification';
import { apiService, API_BASE_URL } from '../utils/api';

export default function AgentDashboard({ onLogout, session }) {
  const [isEmergency, setIsEmergency] = useState(false);
  const [zones, setZones] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMode, setChatMode] = useState('E2EE'); // 'E2EE' or 'GSM'
  const [e2eeMessages, setE2eeMessages] = useState([
    {
      id: 1,
      sender: 'HQ Tactical Command',
      text: 'Singtam riverbank perimeter alerted. Dispatching SAR units to corridor Alpha.',
      isSelf: false,
      isHQ: true
    },
    {
      id: 2,
      sender: 'Field Unit',
      text: 'Acknowledged. Evac corridor verified. Relocating citizens to higher sector.',
      isSelf: true
    }
  ]);
  const [gsmMessages, setGsmMessages] = useState([
    {
      id: 1,
      sender: 'Local GSM Cell Tower',
      text: 'Main power grid down. Cell repeaters on emergency battery reserve.',
      isSelf: false,
      isTower: true
    },
    {
      id: 2,
      sender: 'Field Unit',
      text: 'Copy. Minimizing network polling to extend reserve lifespan.',
      isSelf: true
    }
  ]);
  const [safehouses, setSafehouses] = useState([]);
  const [trappedCitizens, setTrappedCitizens] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(API_BASE_URL.replace('/api', ''));
    
    // Join the chat room for the first active zone if any
    const activeZone = zones.length > 0 ? zones[0].zone_id : 'global';
    socketRef.current.emit("join_chat", activeZone);

    socketRef.current.on("tactical_message", (data) => {
        setE2eeMessages(prev => [...prev, { ...data.message, isSelf: false }]);
    });

    return () => {
        if (socketRef.current) socketRef.current.disconnect();
    };
  }, [zones]);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    const trimmed = chatMessage.trim();
    if (!trimmed) return;

    const newMsg = {
      id: Date.now(),
      sender: session?.user?.fullName || session?.fullName || 'Field Unit',
      text: trimmed,
      isSelf: true
    };

    if (chatMode === 'E2EE') {
      setE2eeMessages(prev => [...prev, newMsg]);
      // Emit to backend
      const activeZone = zones.length > 0 ? zones[0].zone_id : 'global';
      if (socketRef.current) {
        socketRef.current.emit("tactical_message", { room: activeZone, message: newMsg });
      }
    } else {
      setGsmMessages(prev => [...prev, newMsg]);
    }
    setChatMessage('');
  };
  
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
        const response = await fetch(`${API_BASE_URL}/api/zones/shelters/dynamic?lat=${zones[0].lat}&lng=${zones[0].lng}&radius=30000`);
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
        const response = await fetch(`${API_BASE_URL}/api/zones/${zones[0].id || zones[0].zone_id}/trapped-citizens`);
        const data = await response.json();
        if (data.success) {
          setTrappedCitizens(data.citizens);
        }
      } catch (err) {
        console.error("Agent citizen fetch failed:", err);
      }
    };
    fetchCitizens();
    const interval = setInterval(fetchCitizens, 15000);
    return () => clearInterval(interval);
  }, [zones]);

  return (
    <div className="w-screen h-screen flex bg-[#1A1A1A] font-sans overflow-hidden select-none">
      
      {/* Left Sidebar - Tactical Operations */}
      <div className="w-[360px] h-full bg-[#242220] border-r border-[#383533] flex flex-col z-10 shrink-0">
        
        {/* Header Console */}
        <div className="p-4 border-b border-[#383533] bg-[#1E1D1B]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2C2A29] border border-[#8B7355]/40 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-[#8B7355]" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight uppercase">
                  Tactical Console
                </h1>
                <span className="text-[10px] text-[#A89F91] font-mono">SurakshaDrishti Relay</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={onLogout}
              className="px-2.5 py-1 rounded-lg bg-[#2C2A29] hover:bg-[#383533] text-[#D8D2C7] text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer border border-[#45423E]"
            >
              <LogOut className="w-3 h-3 text-[#B85C38]" />
              <span>Log Off</span>
            </button>
          </div>

          <div className="bg-[#171615] rounded-xl p-2.5 border border-[#33302D] text-xs text-[#A89F91] font-mono mt-2">
            <div>Commander: <span className="text-white font-bold">{session?.email || 'NDRF_CMD_104'}</span></div>
            <div>Auth Role: <span className="text-[#8B7355] font-semibold">FIELD TACTICAL CHIEF</span></div>
          </div>
        </div>

        {/* E2EE / GSM Relay Channel */}
        <div className="flex-1 flex flex-col p-4 border-b border-[#383533] overflow-hidden">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-xs font-bold text-[#D8D2C7] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#8B7355]" />
              <span>Tactical Comms</span>
            </h2>

            <div className="flex items-center gap-1 bg-[#171615] p-0.5 rounded-lg border border-[#383533]">
              <button
                type="button"
                onClick={() => setChatMode('E2EE')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-colors flex items-center gap-1 ${
                  chatMode === 'E2EE' ? 'bg-[#8B7355] text-white' : 'text-[#8C847A] hover:text-white'
                }`}
              >
                <Lock className="w-2.5 h-2.5" />
                <span>E2EE</span>
              </button>
              <button
                type="button"
                onClick={() => setChatMode('GSM')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-colors flex items-center gap-1 ${
                  chatMode === 'GSM' ? 'bg-[#B85C38] text-white' : 'text-[#8C847A] hover:text-white'
                }`}
              >
                <Signal className="w-2.5 h-2.5" />
                <span>GSM</span>
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-[#171615] rounded-2xl border border-[#33302D] p-3 overflow-y-auto mb-3 flex flex-col gap-2.5">
            <div className={`text-[10px] text-center font-mono uppercase my-0.5 flex items-center justify-center gap-1 ${
              chatMode === 'E2EE' ? 'text-[#8B7355]' : 'text-amber-500'
            }`}>
              {chatMode === 'E2EE' ? (
                <>
                  <Lock className="w-3 h-3" />
                  <span>256-Bit Encrypted Tunnel Active</span>
                </>
              ) : (
                <>
                  <Signal className="w-3 h-3" />
                  <span>GSM Broadcast Relay Active</span>
                </>
              )}
            </div>
            
            {chatMode === 'E2EE' ? (
              <>
                {e2eeMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={msg.isSelf 
                      ? "bg-[#8B7355]/20 border border-[#8B7355]/40 rounded-xl p-2.5 text-xs text-white w-[92%] self-end"
                      : "bg-[#242220] border border-[#383533] rounded-xl p-2.5 text-xs text-[#E8E1D5] w-[92%]"
                    }
                  >
                    <span className={`font-bold text-[10px] mb-1 flex items-center gap-1 ${msg.isSelf ? 'text-[#E8E1D5]' : 'text-[#8B7355]'}`}>
                      {msg.isHQ && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                      {msg.sender}
                    </span>
                    {msg.text}
                  </div>
                ))}
              </>
            ) : (
              <>
                {gsmMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={msg.isSelf 
                      ? "bg-[#2C2A29] border border-[#45423E] rounded-xl p-2.5 text-xs text-[#E8E1D5] w-[92%] self-end"
                      : "bg-[#382620] border border-[#523429] rounded-xl p-2.5 text-xs text-amber-100 w-[92%]"
                    }
                  >
                    <span className={`font-bold text-[10px] mb-1 flex items-center gap-1 ${msg.isSelf ? 'text-amber-300' : 'text-[#B85C38]'}`}>
                      {msg.isTower && <Radio className="w-3 h-3" />}
                      {msg.sender}
                    </span>
                    {msg.text}
                  </div>
                ))}
              </>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              type="text" 
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={chatMode === 'E2EE' ? "Transmit secured order..." : "Transmit GSM text..."}
              className="flex-1 bg-[#171615] border border-[#383533] text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#8B7355] transition-colors placeholder:text-[#6E6860]"
            />
            <button 
              type="submit"
              className="bg-[#8B7355] hover:bg-[#A38968] text-white rounded-xl px-3 py-2 transition-colors cursor-pointer flex items-center justify-center"
              title="Transmit message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Zone Consensus Voting (80% Multi-Sig Protocol) */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h2 className="text-xs font-bold text-[#D8D2C7] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Vote className="w-3.5 h-3.5 text-[#8B7355]" />
            <span>80% De-Escalation Consensus</span>
          </h2>
          
          {zones.filter(z => z.zone_type === 'RED').length === 0 ? (
            <div className="text-[#8C847A] text-xs text-center mt-4 bg-[#1E1D1B] p-3 rounded-xl border border-[#33302D]">
              No active Red Zones currently requiring resolution vote.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {zones.filter(z => z.zone_type === 'RED').map(zone => {
                const totalAssigned = zone.active_officers_count || 1;
                const votesCast = zone.resolution_votes_cast || 0;
                const required = Math.max(1, Math.ceil(totalAssigned * 0.8));
                
                const myVoteObj = Array.isArray(zone.assigned_officers) 
                  ? zone.assigned_officers.find(o => o.user_id === (session?.email || 'NDRF_CMD_104'))
                  : null;
                const haveIVoted = myVoteObj?.vote_to_resolve === true;

                const handleVote = async () => {
                  const res = await apiService.voteResolveZone(zone.zone_id, session?.token);
                  if (res.success) {
                    alert(res.message);
                  } else {
                    alert("Vote failed: " + res.error);
                  }
                };

                return (
                  <div key={zone.zone_id} className="bg-[#1E1D1B] rounded-2xl border border-[#383533] p-3.5">
                    <div className="text-white font-bold text-xs mb-1 truncate" title={zone.name}>{zone.name}</div>
                    <div className="text-[#A89F91] text-[11px] mb-2.5">
                      {votesCast} / {required} votes recorded (Multi-Sig 80%)
                    </div>
                    
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: Math.max(5, required) }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 flex-1 rounded-full ${i < votesCast ? 'bg-emerald-500' : 'bg-[#33302D]'}`}
                        />
                      ))}
                    </div>
                    
                    <button 
                      type="button"
                      onClick={handleVote}
                      disabled={haveIVoted}
                      className={`w-full font-bold text-xs py-2 rounded-xl transition-all border flex items-center justify-center gap-1.5 ${
                        haveIVoted 
                          ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400 cursor-not-allowed'
                          : 'bg-[#8B7355] hover:bg-[#A38968] text-white border-transparent cursor-pointer active:scale-95'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{haveIVoted ? 'VOTE RECORDED' : 'CAST RESOLUTION VOTE'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="flex-1 relative">
        {/* Top Floating Telemetry Capsule */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[99] bg-[#242220]/95 backdrop-blur-md border border-[#383533] px-5 py-1.5 rounded-full shadow-2xl flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isEmergency ? 'bg-[#B85C38] animate-ping' : 'bg-emerald-400'}`} />
            <span className="text-white font-bold text-xs uppercase tracking-wider">
              {isEmergency ? 'CRITICAL DISASTER DETECTED' : 'SECTOR MONITORING STABLE'}
            </span>
          </div>
          <div className="w-px h-3.5 bg-[#45423E]" />
          <div className="text-[#A89F91] font-mono text-xs">
            {zones.length} Active Hotspots
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

