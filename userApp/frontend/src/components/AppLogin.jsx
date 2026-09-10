import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Mail, 
  Phone, 
  KeyRound, 
  Radio, 
  Compass, 
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../utils/api';

export default function AppLogin({ onLogin }) {
  const [role, setRole] = useState(null);
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [geoLoc, setGeoLoc] = useState({ lat: null, lng: null, address: 'Acquiring GPS...' });

  // Fetch location using multiple fallback strategies
  React.useEffect(() => {
    let cancelled = false;

    const fetchLocation = async () => {
      // Strategy 1: Browser native geolocation
      if (navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 4000,
              maximumAge: 300000
            });
          });
          if (!cancelled) {
            setGeoLoc({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              address: `${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`
            });
            return;
          }
        } catch (e) {
          // Fall through to IP strategy
        }
      }

      // Strategy 2: IP-based geolocation
      const ipEndpoints = [
        { url: 'https://ipapi.co/json/', parse: (d) => ({ lat: d.latitude, lng: d.longitude, address: `${d.city}, ${d.region}` }) },
        { url: 'https://ipwho.is/', parse: (d) => ({ lat: d.latitude, lng: d.longitude, address: `${d.city}, ${d.region}` }) },
      ];

      for (const endpoint of ipEndpoints) {
        try {
          const res = await fetch(endpoint.url);
          const data = await res.json();
          if (!cancelled && data && (data.latitude || data.lat)) {
            const parsed = endpoint.parse(data);
            setGeoLoc(parsed);
            return;
          }
        } catch (e) {
          // Try next endpoint
        }
      }

      // All strategies fallback
      if (!cancelled) {
        setGeoLoc({ lat: 22.5726, lng: 88.3639, address: 'Kolkata, West Bengal (Default)' });
      }
    };

    fetchLocation();
    return () => { cancelled = true; };
  }, []);

  // --- AGENT LOGIN FLOW ---
  const handleAgentLoginStep1 = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('Email and Password required.');
    
    setLoading(true);
    const res = await apiService.login({ username: email, password, loginType: 'authority' });
    setLoading(false);

    if (res.success) {
      if (res.requires2FA) {
        setStep(2);
      } else {
        onLogin({ role: 'agent', email: email, user: res.user, token: res.token });
      }
    } else {
      setError(res.error || res.message || 'Login failed.');
    }
  };

  const handleAgentLoginStep2 = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp) return setError('Please enter the 2FA Code sent to your email.');

    setLoading(true);
    const res = await apiService.verifyOtp(email, otp);
    setLoading(false);

    if (res.success) {
      onLogin({ role: 'agent', email: email, token: res.token });
    } else {
      setError(res.error || res.message || 'Invalid 2FA Code.');
    }
  };

  // --- USER LOGIN FLOW (MOBILE NUMBER ONLY) ---
  const handleUserLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Clean numeric digits only
    const digitsOnly = phone.replace(/\D/g, '');
    if (!digitsOnly) {
      return setError('Please enter your mobile number.');
    }
    if (digitsOnly.length < 10) {
      return setError('Please enter a valid 10-digit mobile number.');
    }

    const formattedMobile = digitsOnly.slice(-10); // get last 10 digits

    setLoading(true);

    const tempPassword = 'RES-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    await apiService.register({
      fullName: `Citizen (${formattedMobile})`,
      email: `${formattedMobile}@suraksha.local`,
      phone: formattedMobile,
      password: tempPassword,
      role: 'RESIDENT',
      district: geoLoc.address || 'Unknown District',
      familyMembers: 1,
      hasVulnerable: false
    });

    const res = await apiService.quickSign({ 
      phone: formattedMobile, 
      role: 'resident', 
      lat: geoLoc.lat, 
      lng: geoLoc.lng, 
      address: geoLoc.address 
    });
    setLoading(false);

    if (res.success) {
      onLogin({ role: 'user', phone: formattedMobile, emergencyId: res.emergencyId, location: geoLoc });
    } else {
      setError(res.message || 'Failed to initialize session.');
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#FDFBF7] font-sans relative overflow-hidden select-none">
      {/* Dynamic Background Mesh & Ambient Glow */}
      <div className="absolute inset-0 bg-creme-mesh pointer-events-none opacity-80" />
      <div className="paper-texture" />

      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#8B7355]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#B85C38]/10 blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="z-10 bg-white/90 backdrop-blur-xl border border-[#E8E1D5] p-7 sm:p-9 rounded-3xl shadow-[0_20px_50px_rgba(44,42,41,0.08)] w-full max-w-md mx-4 transition-all duration-300">
        
        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F6F4F0] border border-[#E8E1D5] shadow-xs mb-3.5 group transition-transform duration-300 hover:scale-105">
            <img 
              src="/favicon.webp" 
              alt="SurakshaDrishti Emblem" 
              className="w-9 h-9 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }} 
            />
            <ShieldCheck className="w-7 h-7 text-[#8B7355] hidden" />
          </div>

          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
            Suraksha<span className="text-[#8B7355]">Drishti</span>
          </h1>
          <p className="text-xs text-[#5C544D] font-medium mt-1">
            Civilian Incident Hub & Evacuation Relay
          </p>
        </div>

        {!role ? (
          <div className="flex flex-col gap-3.5">
            {/* Citizen Access Option */}
            <button 
              type="button"
              onClick={() => { setRole('user'); setError(''); }}
              className="w-full flex items-center justify-between p-4 bg-[#FDFBF7] hover:bg-white border border-[#E8E1D5] hover:border-[#8B7355]/50 shadow-2xs hover:shadow-sm rounded-2xl transition-all duration-200 group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-[#1A1A1A] font-bold text-sm tracking-tight group-hover:text-[#8B7355] transition-colors">
                    Citizen Access Portal
                  </div>
                  <div className="text-[#7A726A] text-xs mt-0.5">
                    Live GPS radar, evacuation route & relief hubs
                  </div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#E8E1D5]/60 group-hover:bg-[#2C2A29] text-[#2C2A29] group-hover:text-white flex items-center justify-center transition-colors shrink-0 ml-2">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Field Officer Access Option */}
            <button 
              type="button"
              onClick={() => { setRole('agent'); setStep(1); setError(''); }}
              className="w-full flex items-center justify-between p-4 bg-[#FDFBF7] hover:bg-white border border-[#E8E1D5] hover:border-[#8B7355]/50 shadow-2xs hover:shadow-sm rounded-2xl transition-all duration-200 group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 text-[#B85C38] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-[#1A1A1A] font-bold text-sm tracking-tight group-hover:text-[#8B7355] transition-colors">
                    Tactical Officer Terminal
                  </div>
                  <div className="text-[#7A726A] text-xs mt-0.5">
                    Command console, 80% consensus & E2EE relay
                  </div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#E8E1D5]/60 group-hover:bg-[#2C2A29] text-[#2C2A29] group-hover:text-white flex items-center justify-center transition-colors shrink-0 ml-2">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Live GPS Telemetry Status */}
            <div className="bg-[#F6F4F0] border border-[#E8E1D5] rounded-xl p-3 text-xs flex items-center justify-between mt-1">
              <span className="text-[#5C544D] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className={`w-3.5 h-3.5 ${geoLoc.lat ? 'text-emerald-600' : 'text-amber-600 animate-pulse'}`} />
                GPS Telemetry:
              </span>
              <span className={`font-mono text-xs font-semibold text-right truncate pl-2 ${geoLoc.lat ? 'text-[#1A1A1A]' : 'text-amber-700'}`}>
                {geoLoc.address}
              </span>
            </div>
          </div>
        ) : role === 'agent' ? (
          <form onSubmit={step === 1 ? handleAgentLoginStep1 : handleAgentLoginStep2} className="flex flex-col gap-3.5">
            <button 
              type="button"
              onClick={() => { setRole(null); setStep(1); }}
              className="text-xs text-[#5C544D] hover:text-[#1A1A1A] text-left mb-1 flex items-center gap-1.5 font-semibold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#8B7355]" />
              <span>Back to Role Selection</span>
            </button>

            {error && (
              <div className="bg-[#FFF5F2] border border-[#FADED4] text-[#B85C38] text-xs font-medium p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {step === 1 ? (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-[#5C544D] mb-1 uppercase tracking-wider">Officer Email</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-[#E8E1D5] text-[#1A1A1A] rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-[#8B7355] transition-all shadow-2xs font-medium placeholder:text-[#A89F91]"
                      placeholder="officer@ndrf.gov.in"
                    />
                    <Mail className="w-4 h-4 text-[#8B7355] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5C544D] mb-1 uppercase tracking-wider">Passkey / Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-[#E8E1D5] text-[#1A1A1A] rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-[#8B7355] transition-all shadow-2xs font-medium placeholder:text-[#A89F91]"
                      placeholder="••••••••••••"
                    />
                    <Lock className="w-4 h-4 text-[#8B7355] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-2 bg-[#2C2A29] hover:bg-[#1A1A1A] text-white font-bold py-3 rounded-xl transition-all uppercase text-xs tracking-wider disabled:opacity-50 shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating Officer...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 text-[#8B7355]" />
                      <span>Verify Credentials</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <div className="bg-amber-50 border border-amber-200 text-amber-800 font-medium text-xs p-3 rounded-xl flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>2FA verification required. An OTP has been sent to {email}.</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#5C544D] mb-1 uppercase tracking-wider">QuickSign 6-Digit Code</label>
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-white border border-[#E8E1D5] text-[#1A1A1A] rounded-xl p-3 text-sm focus:outline-none focus:border-[#8B7355] transition-all shadow-2xs tracking-widest font-mono text-center font-bold"
                    placeholder="000-000"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-2 bg-[#2C2A29] hover:bg-[#1A1A1A] text-white font-bold py-3 rounded-xl transition-all uppercase text-xs tracking-wider disabled:opacity-50 shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Token...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Authenticate & Enter Hub</span>
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        ) : (
          <form onSubmit={handleUserLogin} className="flex flex-col gap-3.5">
            <button 
              type="button"
              onClick={() => setRole(null)}
              className="text-xs text-[#5C544D] hover:text-[#1A1A1A] text-left mb-1 flex items-center gap-1.5 font-semibold cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#8B7355]" />
              <span>Back to Role Selection</span>
            </button>

            {error && (
              <div className="bg-[#FFF5F2] border border-[#FADED4] text-[#B85C38] text-xs font-medium p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-[#5C544D] uppercase tracking-wider">Mobile Number</label>
                <span className="text-[10px] text-[#7A726A] font-mono font-medium">10 Digits (Numeric Only)</span>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1.5 text-xs font-bold text-[#5C544D] pointer-events-none border-r border-[#E8E1D5] pr-2.5">
                  <Phone className="w-3.5 h-3.5 text-[#8B7355]" />
                  <span>+91</span>
                </div>
                <input 
                  type="tel" 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const onlyInts = e.target.value.replace(/\D/g, '');
                    setPhone(onlyInts);
                  }}
                  className="w-full bg-white border border-[#E8E1D5] text-[#1A1A1A] rounded-xl pl-18 pr-3 py-2.5 text-sm tracking-wider font-mono focus:outline-none focus:border-[#8B7355] transition-all shadow-2xs font-semibold placeholder:text-[#A89F91]"
                  placeholder="9876543210"
                  autoFocus
                />
              </div>
            </div>
            
            {/* Auto-detected GPS location display */}
            <div className="bg-[#F6F4F0] border border-[#E8E1D5] rounded-xl p-3 text-xs flex items-center justify-between">
              <span className="text-[#5C544D] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className={`w-3.5 h-3.5 ${geoLoc.lat ? 'text-emerald-600' : 'text-amber-600 animate-pulse'}`} />
                Detected Sector:
              </span>
              <span className={`font-mono text-xs font-semibold text-right truncate pl-2 ${geoLoc.lat ? 'text-emerald-800' : 'text-amber-700'}`}>
                {geoLoc.address}
              </span>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-2 bg-[#2C2A29] hover:bg-[#1A1A1A] text-white font-bold py-3 rounded-xl transition-all uppercase text-xs tracking-wider disabled:opacity-50 shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting Live Viewport...</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <span>Access Safe Dashboard</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-5 left-0 w-full text-center text-[#8C847A] text-[11px] font-mono flex items-center justify-center gap-2">
        <Lock className="w-3 h-3 text-[#8B7355]" />
        <span>SurakshaDrishti Incident Hub v1.0.0 • E2EE Secured Connection</span>
      </div>
    </div>
  );
}

