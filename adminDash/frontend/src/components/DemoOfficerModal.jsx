import React, { useState } from 'react';
import {
  X,
  Shield,
  Sparkles,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Lock,
  Compass,
  Building2
} from 'lucide-react';
import { apiService } from '../utils/api';
import { useToast } from './Toast';

export default function DemoOfficerModal({ onClose, onAuthSuccess }) {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOfficerId, setSelectedOfficerId] = useState(null);

  const DEMO_OFFICERS = [
    {
      id: 'ndrf_vikram',
      name: 'Commander Vikram Singh',
      role: 'NDRF Tactical Lead',
      department: 'NDRF',
      district: 'Wayanad Sector 4',
      badge: 'Batallion Commander',
      details: 'Assigned to Wayanad High-Hazard landslide and flash flood sector.',
      username: 'officer_vikram_singh',
      password: 'Commander@Pass2026',
    },
    {
      id: 'sdma_kerala',
      name: 'SDMA Regional Officer',
      role: 'State Disaster Cell Lead',
      department: 'SDMA',
      district: 'Wayanad, Kerala',
      badge: 'State Coordination Cell',
      details: 'Supervising regional evacuation zones and relief camp logistics.',
      username: 'sdma_officer',
      password: '$2b$10$w09ZkF2xO59lU22qj4A24u7s2h/k8q5d/Z71d.a6f4s8b9c1d2e3f',
    },
    {
      id: 'ndrf_hq',
      name: 'NDRF Commander Chief',
      role: 'Apex Command HQ',
      department: 'NDRF HQ',
      district: 'Wayanad Sector 4',
      badge: 'Ministry / MHA Telemetry',
      details: 'Central Command overview for interstate disaster mitigation.',
      username: 'ndrf_admin',
      password: '$2b$10$w09ZkF2xO59lU22qj4A24u7s2h/k8q5d/Z71d.a6f4s8b9c1d2e3f',
    },
  ];

  const handleSelectOfficer = async (officer) => {
    setIsLoading(true);
    setSelectedOfficerId(officer.id);

    const res = await apiService.login({
      username: officer.username,
      password: officer.password,
      loginType: 'authority',
      role: 'authority',
    });

    setIsLoading(false);

    if (res.success) {
      addToast(`Access granted: ${officer.name} (${officer.department})`, 'success');
      setTimeout(() => {
        onAuthSuccess({
          token: res.token,
          user: res.user || {
            userId: officer.username,
            name: officer.name,
            role: officer.role,
            district: officer.district,
            department: officer.department,
          }
        });
      }, 500);
    } else {
      const err = res.error || res.message || 'Officer demo access failed';
      addToast(err, 'error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#2C2A29]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Demo officer selection portal"
    >
      <div className="w-full max-w-lg my-auto animate-scale-in max-h-[90vh] flex flex-col justify-center">
        <div className="bg-white/95 border border-[#E8E1D5] rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl overflow-y-auto max-h-[85vh]">
          
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <img 
                    src="/favicon.webp" 
                    alt="SurakshaDrishti Emblem" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8B7355]">
                  SurakshaDrishti Evaluator Access
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
                Demo Officer Quick Sign In
              </h2>
              <p className="text-xs text-[#5C544D] mt-0.5">
                Instant one-click access with pre-configured officer credentials to test the Command Console HUD.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#F6F4F0] hover:bg-[#E8E1D5] text-[#5C544D] hover:text-[#1A1A1A] transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Officer Cards List */}
          <div className="space-y-3 mb-5">
            {DEMO_OFFICERS.map((officer) => {
              const isSelected = selectedOfficerId === officer.id && isLoading;
              return (
                <div
                  key={officer.id}
                  onClick={() => !isLoading && handleSelectOfficer(officer)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#F4ECE1] border-[#8B7355] ring-2 ring-[#8B7355]/30'
                      : 'bg-[#FAF8F5] hover:bg-white border-[#E8E1D5] hover:border-[#8B7355] shadow-2xs hover:shadow-sm'
                  } group`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#2C2A29] text-[#FDFBF7]">
                        {officer.department}
                      </span>
                      <span className="text-[10px] font-semibold text-[#8B7355]">
                        {officer.badge}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#8B7355] transition-colors">
                      {officer.name}
                    </div>
                    <div className="text-xs text-[#6B635B]">
                      {officer.details}
                    </div>
                    <div className="text-[10px] font-mono text-[#8C847A]">
                      Assigned: {officer.district}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isLoading}
                    className="self-end sm:self-center px-4 py-2 rounded-lg bg-[#2C2A29] group-hover:bg-[#8B7355] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
                  >
                    <span>{isSelected ? 'Launching...' : 'Enter HUD'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer Notice */}
          <div className="p-3 bg-[#F6F4F0] rounded-xl border border-[#E8E1D5] flex items-center justify-between text-[11px] text-[#5C544D]">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#8B7355]" />
              <span>Full command permissions granted for selected officer</span>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#E8E1D5] text-[#4A4238] font-bold uppercase">
              SIH Sandbox
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
