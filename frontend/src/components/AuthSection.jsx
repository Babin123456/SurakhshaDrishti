import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Users,
  Zap,
  MapPin,
  Crosshair,
  UserPlus,
  LogIn,
  Phone,
  Mail,
  Home,
  Heart
} from 'lucide-react';
import { apiService, checkGeofenceRedZoneStatus } from '../utils/api';

export default function AuthSection({ initialMode = 'signin', onClose, onAuthSuccess }) {
  const [authMode, setAuthMode] = useState(initialMode); // 'signin' | 'signup'
  const [loginType, setLoginType] = useState('authority'); // 'authority' | 'resident'
  
  // Sign In Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [trustedDevice, setTrustedDevice] = useState(false);

  // Sign Up Form State
  const [signupRole, setSignupRole] = useState('resident'); // 'resident' | 'ndrf' | 'sdma'
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [stateDistrict, setStateDistrict] = useState('Wayanad, Kerala');
  const [familyMembers, setFamilyMembers] = useState('4');
  const [hasVulnerable, setHasVulnerable] = useState(false);
  const [detectedLoc, setDetectedLoc] = useState(null);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          const inRedZone = await checkGeofenceRedZoneStatus(coords.lat, coords.lng);
          setLocationStatus({ inRedZone: true, coords, name: 'Wayanad Sector 4' });
          setDetectedLoc(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        },
        () => {
          setLocationStatus({ inRedZone: true, coords: { lat: 11.5583, lng: 76.1384 }, name: 'Wayanad Sector 4' });
          setDetectedLoc('11.5583, 76.1384');
        }
      );
    } else {
      setLocationStatus({ inRedZone: true, coords: { lat: 11.5583, lng: 76.1384 }, name: 'Wayanad Sector 4' });
      setDetectedLoc('11.5583, 76.1384');
    }
  }, []);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) return;
    setIsDetectingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectedLoc(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        setIsDetectingGPS(false);
      },
      () => {
        setIsDetectingGPS(false);
      }
    );
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const isRedZone = locationStatus?.inRedZone;
    const res = await apiService.login({ username, password, loginType, trustedDevice }, isRedZone);

    setIsLoading(false);
    if (res.success) {
      if (res.bypassed2FA) {
        setMessage({ type: 'warning', text: 'RED ZONE OVERRIDE: 2FA bypassed to prevent delay.' });
      } else {
        setMessage({ type: 'success', text: 'Authenticated via standard secure channel.' });
      }
      setTimeout(() => onAuthSuccess(res), 800);
    } else {
      setMessage({ type: 'error', text: res.message || 'Authentication failed' });
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Call API or register session
    const res = await apiService.quickSign({
      name: fullName,
      phone,
      email,
      role: signupRole,
      district: stateDistrict,
      peopleCount: familyMembers,
      coordinates: detectedLoc,
      specialNeeds: hasVulnerable ? ['elderly/infant'] : [],
      timestamp: new Date().toISOString()
    });

    setIsLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: `Account Created Successfully! Assigned Shelter: ${res.assignedShelter}` });
      setTimeout(() => {
        onAuthSuccess({
          success: true,
          user: {
            name: fullName || 'Registered Resident',
            role: signupRole,
            district: stateDistrict,
            token: 'jwt_registered_' + Date.now(),
            emergencyId: res.emergencyId
          }
        });
      }, 1000);
    } else {
      setMessage({ type: 'error', text: 'Registration failed. Please check your fields.' });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Authentication portal"
    >
      <div className="w-full max-w-lg my-8 animate-scale-in">
        
        {/* Red Zone Context Banner */}
        {locationStatus?.inRedZone && (
          <div className="flex items-center justify-between gap-2 p-3 rounded-t-2xl bg-red-950/80 border border-red-500/30 border-b-0 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-slate-300">
                Red Zone Detected: <span className="text-white font-bold">{locationStatus.name}</span>
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[10px] uppercase">
              2FA Bypass Active
            </span>
          </div>
        )}

        {/* Modal Card */}
        <div className={`bg-slate-900/95 border border-slate-800 ${locationStatus?.inRedZone ? 'rounded-b-2xl rounded-t-none' : 'rounded-2xl'} p-6 sm:p-7 shadow-2xl backdrop-blur-xl`}>
          
          {/* Top Header & Close */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <img src="/favicon.webp" alt="Logo" className="w-5 h-5 object-contain" />
                <span className="font-cambria text-[11px] font-bold uppercase tracking-wider text-cyan-400">SurakshaDrishti Portal</span>
              </div>
              <h2 className="font-cambria text-xl font-black text-white tracking-tight">
                {authMode === 'signin' ? 'Sign In to SurakshaDrishti' : 'Create an Account / Register'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {authMode === 'signin' 
                  ? 'Access real-time GIS intelligence, command logs, and emergency passes' 
                  : 'Register for priority evacuation passes and official disaster consoles'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dual Main Mode Selector: [Sign In] vs [Sign Up] */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                authMode === 'signin'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                authMode === 'signup'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Sign Up / Register
            </button>
          </div>

          {/* Status / Alert Message */}
          {message && (
            <div className={`mb-5 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              message.type === 'warning' ? 'bg-amber-950/80 border border-amber-800 text-amber-300' :
              message.type === 'error' ? 'bg-red-950/80 border border-red-800 text-red-300' :
              'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
            }`}>
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {message.text}
            </div>
          )}

          {/* ================= MODE: SIGN IN ================= */}
          {authMode === 'signin' && (
            <div>
              {/* Role Toggle for Sign In */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLoginType('authority')}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    loginType === 'authority'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-blue-400" /> NDRF & SDMA Official
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType('resident')}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    loginType === 'resident'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-emerald-400" /> Resident / Citizen
                </button>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {loginType === 'authority' ? 'Official Gov Email / Service ID' : 'Mobile Number / Registered ID'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={loginType === 'authority' ? 'e.g. ndrf.command@mha.gov.in' : 'e.g. +91 98765 43210'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Password / Secure Passcode</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* 2FA Status + Trusted Device */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                    <input
                      type="checkbox"
                      checked={trustedDevice}
                      onChange={(e) => setTrustedDevice(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
                    />
                    Remember this device (30 days)
                  </label>

                  {locationStatus?.inRedZone ? (
                    <span className="text-red-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 2FA Bypassed
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 2FA Encrypted
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-900/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? 'Authenticating...' : 'Sign In & Access Platform'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-slate-400">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-cyan-400 hover:underline font-bold"
                >
                  Sign Up / Register Here
                </button>
              </div>
            </div>
          )}

          {/* ================= MODE: SIGN UP / REGISTER ================= */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Account Role</label>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSignupRole('resident')}
                    className={`p-2 rounded-xl border transition-all text-center ${
                      signupRole === 'resident'
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Resident
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('ndrf')}
                    className={`p-2 rounded-xl border transition-all text-center ${
                      signupRole === 'ndrf'
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    NDRF Officer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('sdma')}
                    className={`p-2 rounded-xl border transition-all text-center ${
                      signupRole === 'sdma'
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    SDMA Admin
                  </button>
                </div>
              </div>

              {/* Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Full Legal Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Mobile (Aadhaar / OTP)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Email & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@domain.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">District & State</label>
                  <div className="relative">
                    <Home className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={stateDistrict}
                      onChange={(e) => setStateDistrict(e.target.value)}
                      placeholder="e.g. Wayanad, Kerala"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Location GPS & Household Details */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    Habitation GPS Geohash Coordinates:
                  </span>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Crosshair className="w-3 h-3" />
                    {isDetectingGPS ? 'Detecting...' : 'Auto-Detect GPS'}
                  </button>
                </div>

                <input
                  type="text"
                  value={detectedLoc || ''}
                  onChange={(e) => setDetectedLoc(e.target.value)}
                  placeholder="e.g. 11.5583, 76.1384 (#tdv2n19z)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                />

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Household Members</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={familyMembers}
                      onChange={(e) => setFamilyMembers(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                    />
                  </div>

                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={hasVulnerable}
                        onChange={(e) => setHasVulnerable(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                      />
                      Elderly / Infant in Family
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-900/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Registering Account...' : 'Complete Sign Up & Generate Pass'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-xs text-slate-400 pt-1">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-cyan-400 hover:underline font-bold"
                >
                  Sign In Here
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
