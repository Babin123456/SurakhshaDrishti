import React, { useState } from 'react';
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
  BarChart3
} from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('redZones');

  const stats = [
    { title: 'Active Red Zones', value: '14 Sectors', change: '+2 Emergency', color: 'text-red-400', bg: 'bg-red-950/40 border-red-900/60' },
    { title: 'Habitations at Risk', value: '28,450', change: '8,200 Immediate', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-900/60' },
    { title: 'Safe Sites Evaluated', value: '32 Locations', change: '84% Capacity Free', color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-900/60' },
    { title: 'SDMA Evacuation Priority', value: 'Tier 1 (High)', change: 'Wayanad & Shimla', color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-900/60' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-glass shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 text-white shadow-md shadow-red-950">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cambria text-xl font-bold text-white tracking-tight">SurakshaDrishti — Command Console</h1>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-red-600 text-white rounded-full">SIH 26191</span>
            </div>
            <p className="font-cambria text-xs text-slate-400">
              User: <span className="text-white font-medium">{user?.username || user?.guestId || 'Command Officer'}</span> | Role: <span className="text-cyan-400 font-medium">{user?.role || 'EMERGENCY_PASS'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            GIS Telemetry Live
          </div>
          <button 
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-xs font-semibold text-red-300 transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${s.bg} backdrop-blur-glass transition-all hover:scale-[1.01]`}>
            <div className="font-cambria text-xs text-slate-400 font-semibold">{s.title}</div>
            <div className={`font-cambria text-2xl font-black mt-1 ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Activity className="w-3 h-3 text-slate-500" /> {s.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-[480px] relative overflow-hidden backdrop-blur-glass">
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#EF4444_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 flex items-center justify-between bg-black/50 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Map className="w-4 h-4 text-cyan-400" /> Dynamic Multi-Hazard GIS Red Zone Overlay
            </div>
            <div className="flex gap-2">
              <button className="px-2.5 py-1 bg-red-900/40 border border-red-700 text-red-300 rounded text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Red Zone
              </button>
              <button className="px-2.5 py-1 bg-emerald-900/40 border border-emerald-700 text-emerald-300 rounded text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Safe Site
              </button>
            </div>
          </div>

          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-2 border-red-500/40 flex items-center justify-center animate-ping"></div>
              <div className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-red-600/20 border border-red-500 flex items-center justify-center shadow-lg shadow-red-600/50">
                <Radio className="w-8 h-8 text-red-500 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="font-cambria text-sm font-bold text-white">Sector 4 Landslide & Cloudburst Perimeter</div>
              <div className="font-cambria text-xs text-slate-400">Habitation Density: 1,420 Residents | High Vulnerability Index</div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 bg-black/60 p-2.5 rounded-lg border border-slate-800">
            <span>Coordinates: 11.6854° N, 76.1320° E</span>
            <span className="font-cambria text-amber-400 font-semibold">Carrying Capacity Safe Site: Site Bravo (3.2 km distance)</span>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between backdrop-blur-glass">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-cambria text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Relocation Priority Queue
              </h3>
              <span className="text-[11px] text-cyan-400 font-mono">Realtime Triage</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/60">
                <div className="flex justify-between items-start text-xs">
                  <span className="font-cambria font-bold text-red-400">1. Wayanad Hill Slope (Sector 4)</span>
                  <span className="px-1.5 py-0.5 bg-red-600 text-white rounded text-[10px] font-extrabold">IMMEDIATE</span>
                </div>
                <p className="font-cambria text-[11px] text-slate-300 mt-1">Hazard: Landslide & Flash Flood. 1,420 residents requiring immediate transport.</p>
                <div className="mt-2 text-[10px] text-slate-400 font-mono">Assigned Site: Shelter Alpha (Capacity: 85%)</div>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-900/50">
                <div className="flex justify-between items-start text-xs">
                  <span className="font-cambria font-bold text-amber-400">2. Teesta Riverbank Habitation</span>
                  <span className="px-1.5 py-0.5 bg-amber-600 text-white rounded text-[10px] font-bold">SHORT-TERM</span>
                </div>
                <p className="font-cambria text-[11px] text-slate-300 mt-1">Hazard: Dynamic Erosion. 3,100 residents planned for pre-monsoon shift.</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="flex justify-between items-start text-xs">
                  <span className="font-cambria font-bold text-slate-200">3. Joshimath Slope Sector B</span>
                  <span className="px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded text-[10px]">MEDIUM-TERM</span>
                </div>
                <p className="font-cambria text-[11px] text-slate-400 mt-1">Hazard: Land Subsidence. Structural reinforcement + phased shifting.</p>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" /> Export SDMA Action Report (PDF)
          </button>
        </div>

      </div>
    </div>
  );
}
