import React, { useState, useEffect } from 'react';
import RealGoogleMap from './RealGoogleMap';
import AlertNotification from './AlertNotification';
import { api } from '../utils/api';

export default function AgentDashboard({ onLogout, session }) {
  const [isEmergency, setIsEmergency] = useState(false);
  const [zones, setZones] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  
  // Poll for zones
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await api.get('/zones');
        const activeZones = response.data.filter(z => z.status === 'active');
        setZones(activeZones);
        setIsEmergency(activeZones.length > 0);
      } catch (err) {
        console.error("Failed to fetch zones for Agent dashboard:", err);
      }
    };
    
    fetchZones();
    const interval = setInterval(fetchZones, 10000);
    return () => clearInterval(interval);
  }, []);

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
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            E2EE Secure Relay
          </h2>
          
          <div className="flex-1 bg-zinc-950 rounded-lg border border-zinc-800 p-3 overflow-y-auto mb-3 flex flex-col gap-3">
            <div className="text-[10px] text-center text-zinc-600 font-mono uppercase my-1">Encrypted Tunnel Established</div>
            
            <div className="bg-zinc-800 rounded-lg p-2 text-xs text-zinc-300 w-[90%]">
              <span className="text-blue-400 font-bold text-[10px] block mb-1">HQ Command</span>
              Sector 4 riverbank has breached. Deploying SAR teams now.
            </div>
            
            <div className="bg-blue-900/50 border border-blue-800 rounded-lg p-2 text-xs text-blue-100 w-[90%] self-end">
              <span className="text-blue-300 font-bold text-[10px] block mb-1">You</span>
              Copy that. ETA 12 minutes. Initiating evacuation protocols.
            </div>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Transmit securely..."
              className="flex-1 bg-zinc-950 border border-zinc-800 text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-2 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </div>
        </div>

        {/* Zone Consensus Voting Placeholder */}
        <div className="p-5">
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            Active 80% Consensus
          </h2>
          
          <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4">
            <div className="text-white font-bold text-sm mb-1">Declare Sector 4 Red Zone</div>
            <div className="text-zinc-500 text-xs mb-3">Vote requires 80% multi-agency approval.</div>
            
            <div className="flex gap-1 mb-3">
              <div className="h-1.5 flex-1 bg-green-500 rounded-full"></div>
              <div className="h-1.5 flex-1 bg-green-500 rounded-full"></div>
              <div className="h-1.5 flex-1 bg-green-500 rounded-full"></div>
              <div className="h-1.5 flex-1 bg-zinc-800 rounded-full"></div>
              <div className="h-1.5 flex-1 bg-zinc-800 rounded-full"></div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-green-600/20 hover:bg-green-600/40 border border-green-500/50 text-green-400 font-bold text-xs py-2 rounded-lg transition-colors">
                APPROVE
              </button>
              <button className="flex-1 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-400 font-bold text-xs py-2 rounded-lg transition-colors">
                REJECT
              </button>
            </div>
          </div>
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
          standalone={true}
          zones={zones}
          zoom={isEmergency ? 11 : 13}
        />
      </div>

    </div>
  );
}
