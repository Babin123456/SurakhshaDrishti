import React from 'react';
import { Shield, AlertTriangle, Activity, Lock, Users } from 'lucide-react';

export default function GovernmentLanding({ onSignIn, onEmergencyAccess }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-slate-800/30 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-5xl w-full px-6 py-12 flex flex-col items-center text-center">
        
        {/* Emblem/Icon */}
        <div className="mb-8 p-4 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl flex items-center justify-center">
          <Shield className="w-16 h-16 text-blue-500" strokeWidth={1.5} />
        </div>
        
        {/* Headlines */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Suraksha<span className="text-blue-500">Drishti</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mb-12 leading-relaxed">
          National Hazard Management & Emergency Relocation Portal
        </p>
        
        {/* Information Panel */}
        <div className="w-full max-w-4xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-8 md:p-12 shadow-2xl mb-12 text-left grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-blue-400" />
              System Overview
            </h2>
            <p className="text-slate-400 leading-relaxed">
              SurakshaDrishti is an intelligent Decision Support System utilized by the Ministry of Home Affairs, NDRF, and State Disaster Management Authorities. It leverages satellite telemetry to identify imminent hazard zones, orchestrate multi-agency evacuations, and assess real-time carrying capacity of safe shelters.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-slate-800/50 p-3 rounded-lg mr-4 border border-slate-700/50">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-300">Command Console</h3>
                <p className="text-sm text-slate-500 mt-1">Encrypted access for inter-agency personnel to manage Red Zones and coordinate relief.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-red-900/20 p-3 rounded-lg mr-4 border border-red-900/30">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-300">Citizen SOS Access</h3>
                <p className="text-sm text-slate-500 mt-1">Geofenced emergency portal providing immediate evacuation passes and secure routing.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md mx-auto">
          <button 
            onClick={onSignIn}
            className="flex-1 group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative z-10 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Authorized Sign In
            </span>
          </button>
          
          <button 
            onClick={onEmergencyAccess}
            className="flex-1 group relative px-8 py-4 bg-transparent border border-red-500/50 hover:bg-red-500/10 text-red-400 rounded-xl font-medium transition-all duration-300 flex items-center justify-center"
          >
            <span className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Emergency Log In
            </span>
          </button>
        </div>
        
      </div>
      
      {/* Footer text */}
      <div className="absolute bottom-6 text-center w-full px-6 text-xs text-slate-600 tracking-wider uppercase">
        Ministry of Home Affairs & NDRF Disaster Management Division • SIH Problem Statement 26191
      </div>
    </div>
  );
}
