import React, { useState } from 'react';
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

  const [geoLoc, setGeoLoc] = useState({ lat: null, lng: null, address: 'Detecting...' });

  // Fetch location using multiple fallback strategies
  React.useEffect(() => {
    let cancelled = false;

    const fetchLocation = async () => {
      // Strategy 1: Browser native geolocation (works on mobile, may fail on desktop without GPS)
      if (navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 4000,  // short timeout — if it fails, fall through to IP
              maximumAge: 300000
            });
          });
          if (!cancelled) {
            setGeoLoc({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              address: `${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`
            });
            return; // Success! No need for IP fallback.
          }
        } catch (e) {
          // Browser geolocation failed (expected on desktop/laptop). Fall through.
        }
      }

      // Strategy 2: IP-based geolocation (works everywhere, even on laptops with no GPS)
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

      // All strategies failed
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

  // --- USER LOGIN FLOW ---
  const handleUserLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!phone) return setError('Phone or Email is required for Citizen Access.');

    setLoading(true);

    // 1. Automatically register an account for the resident using GPS data
    const isEmail = phone.includes('@');
    const tempPassword = 'RES-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    await apiService.register({
      fullName: 'Resident User',
      email: isEmail ? phone : `${phone.replace(/\s+/g, '')}@suraksha.local`,
      phone: isEmail ? '' : phone,
      password: tempPassword,
      role: 'RESIDENT',
      district: geoLoc.address || 'Unknown District',
      familyMembers: 1,
      hasVulnerable: false
    });

    // 2. Log them in / generate emergency pass
    const res = await apiService.quickSign({ 
      phone, 
      role: 'resident', 
      lat: geoLoc.lat, 
      lng: geoLoc.lng, 
      address: geoLoc.address 
    });
    setLoading(false);

    if (res.success) {
      onLogin({ role: 'user', phone: phone, emergencyId: res.emergencyId, location: geoLoc });
    } else {
      setError(res.message || 'Failed to initialize session.');
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#F6F4F0] font-sans relative overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-100 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-100 blur-[100px]"></div>
      </div>

      <div className="z-10 bg-white/80 backdrop-blur-xl border border-stone-200 p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md mx-4">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-stone-900 tracking-tight uppercase flex items-center justify-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            SurakshaDrishti
          </h1>
          <p className="text-stone-500 mt-2 text-sm font-medium">Disaster Incident Hub & Evacuation Relay</p>
        </div>

        {!role ? (
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => { setRole('agent'); setStep(1); setError(''); }}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-stone-50 border border-stone-200 shadow-sm rounded-xl transition-all group"
            >
              <div className="text-left">
                <div className="text-stone-800 font-bold text-lg">Field Officer Access</div>
                <div className="text-stone-500 text-xs mt-1">Requires 2FA & Secure Passkey</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                →
              </div>
            </button>

            <button 
              onClick={() => { setRole('user'); setError(''); }}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-stone-50 border border-stone-200 shadow-sm rounded-xl transition-all group"
            >
              <div className="text-left">
                <div className="text-stone-800 font-bold text-lg">Citizen Access</div>
                <div className="text-stone-500 text-xs mt-1">Direct access to map & alerts</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                →
              </div>
            </button>

            {/* GPS Status shown on role selection screen */}
            <div className="bg-stone-100 border border-stone-200 rounded-lg p-2.5 text-xs flex items-center justify-between mt-2">
              <span className="text-stone-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${geoLoc.lat ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                GPS:
              </span>
              <span className={`font-mono text-right truncate pl-2 ${geoLoc.lat ? 'text-emerald-700' : 'text-amber-600'}`}>
                {geoLoc.address}
              </span>
            </div>
          </div>
        ) : role === 'agent' ? (
          <form onSubmit={step === 1 ? handleAgentLoginStep1 : handleAgentLoginStep2} className="flex flex-col gap-4">
            <button 
              type="button"
              onClick={() => { setRole(null); setStep(1); }}
              className="text-xs text-stone-500 hover:text-stone-800 text-left mb-2 flex items-center gap-1 font-semibold"
            >
              ← Back to Role Selection
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-medium p-3 rounded-lg">
                {error}
              </div>
            )}

            {step === 1 ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-stone-200 text-stone-900 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                    placeholder="officer@ndrf.gov.in"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">Secure Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-stone-200 text-stone-900 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
                <button 
                  type="submit" disabled={loading}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors uppercase text-sm tracking-wider disabled:opacity-50 shadow-md"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-200 text-blue-700 font-medium text-xs p-3 rounded-lg mb-2">
                  2FA required. We've sent an OTP to {email}.
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">2FA QuickSign Code</label>
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-white border border-stone-200 text-stone-900 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm tracking-widest font-mono text-center"
                    placeholder="000-000"
                  />
                </div>
                <button 
                  type="submit" disabled={loading}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors uppercase text-sm tracking-wider disabled:opacity-50 shadow-md"
                >
                  {loading ? 'Verifying...' : 'Authenticate & Enter Hub'}
                </button>
              </>
            )}
          </form>
        ) : (
          <form onSubmit={handleUserLogin} className="flex flex-col gap-4">
            <button 
              type="button"
              onClick={() => setRole(null)}
              className="text-xs text-stone-500 hover:text-stone-800 text-left mb-2 flex items-center gap-1 font-semibold"
            >
              ← Back to Role Selection
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-medium p-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">Mobile Number / Email</label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-stone-200 text-stone-900 rounded-lg p-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all shadow-sm"
                placeholder="+91 98765 43210"
              />
            </div>
            
            {/* Auto-detected GPS location display */}
            <div className="bg-stone-100 border border-stone-200 rounded-lg p-3 text-xs flex items-center justify-between">
              <span className="text-stone-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${geoLoc.lat ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                Auto-GPS:
              </span>
              <span className={`font-mono text-right truncate pl-2 ${geoLoc.lat ? 'text-teal-700' : 'text-amber-600'}`}>
                {geoLoc.address}
              </span>
            </div>
            
            <button 
              type="submit" disabled={loading}
              className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors uppercase text-sm tracking-wider disabled:opacity-50 shadow-md"
            >
              {loading ? 'Connecting...' : 'Access Safe Dashboard'}
            </button>
          </form>
        )}

      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 left-0 w-full text-center text-stone-400 text-xs font-mono">
        SurakshaDrishti Incident Hub v1.0.0 • E2EE Secured Connection
      </div>
    </div>
  );
}
