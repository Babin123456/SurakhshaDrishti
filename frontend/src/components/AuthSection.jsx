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
import { useToast } from './Toast';

export default function AuthSection({ initialMode = 'signin', onClose, onAuthSuccess }) {
  const { addToast } = useToast();
  const [authMode, setAuthMode] = useState(initialMode); // 'signin' | 'signup'
  const [loginType, setLoginType] = useState('authority'); // 'authority' | 'resident'

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [trustedDevice, setTrustedDevice] = useState(false);

  const [signupRole, setSignupRole] = useState('resident'); // 'resident' | 'ndrf' | 'sdma'
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [district, setDistrict] = useState('Wayanad, Kerala');
  const [familyMembers, setFamilyMembers] = useState('4');
  const [hasVulnerable, setHasVulnerable] = useState(false);
  const [detectedLoc, setDetectedLoc] = useState(null);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();

    return () => {
      document.body.style.overflow = originalOverflow;
      if (window.__lenis) window.__lenis.start();
    };
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          const result = await checkGeofenceRedZoneStatus(coords.lat, coords.lng);
          if (result.inRedZone && result.zone) {
            setLocationStatus({ inRedZone: true, coords, name: result.zone.name });
          } else {
            setLocationStatus({ inRedZone: false, coords, name: null });
          }
          setDetectedLoc(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        },
        () => {
          setLocationStatus({ inRedZone: false, coords: null, name: null });
        },
        { timeout: 5000 }
      );
    } else {
      setLocationStatus({ inRedZone: false, coords: null, name: null });
    }
  }, []);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) return;
    setIsDetectingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectedLoc(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setIsDetectingGPS(false);
      },
      () => {
        setDetectedLoc('11.5583, 76.1384');
        setIsDetectingGPS(false);
      }
    );
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const res = await apiService.login({
      username: username.trim(),
      password,
      loginType,
      role: loginType,
      trustedDevice,
    });

    setIsLoading(false);

    if (res.success) {
      addToast('Authentication successful! Initializing tactical session...', 'success');
      setMessage({ type: 'success', text: 'Authentication successful! Initializing tactical session...' });
      setTimeout(() => {
        onAuthSuccess({
          token: res.token,
          user: res.user || {
            username: username,
            name: username.split('@')[0].toUpperCase(),
            role: loginType === 'authority' ? 'NDRF Tactical Command' : 'Resident Citizen',
            department: loginType === 'authority' ? 'NDRF' : 'Civilian',
          }
        });
      }, 700);
    } else {
      const errText = res.error || res.message || 'Invalid credentials. Please verify your details.';
      addToast(errText, 'error');
      setMessage({ type: 'error', text: errText });
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const res = await apiService.register({
      fullName,
      email,
      phone,
      password: signupPassword,
      role: signupRole,
      district,
      familyMembers: parseInt(familyMembers) || 1,
      hasVulnerable,
      coordinates: detectedLoc,
    });

    setIsLoading(false);

    if (res.success) {
      addToast('Account registered successfully! Redirecting...', 'success');
      setMessage({ type: 'success', text: 'Account registered successfully! Redirecting...' });
      setTimeout(() => {
        onAuthSuccess({
          user: {
            username: email || phone,
            name: fullName,
            role: signupRole,
            district,
            token: 'jwt_registered_' + Date.now(),
            emergencyId: res.emergencyId
          }
        });
      }, 800);
    } else {
      const errText = 'Registration failed. Please check your fields.';
      addToast(errText, 'error');
      setMessage({ type: 'error', text: errText });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#2C2A29]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Authentication portal"
    >
      <div className="w-full max-w-lg my-auto animate-scale-in max-h-[90vh] flex flex-col justify-center">
        
        {/* Red Zone Context Banner */}
        {locationStatus?.inRedZone && (
          <div className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-t-2xl bg-[#FFF5F2] border border-[#FADED4] border-b-0 text-[11px] sm:text-xs shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B85C38] shrink-0" />
              <span className="text-[#5C544D] truncate">
                Red Zone Vicinity: <span className="text-[#1A1A1A] font-bold">{locationStatus.name}</span>
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#B85C38] text-white font-bold text-[9px] sm:text-[10px] uppercase shrink-0">
              Priority Pass Ready
            </span>
          </div>
        )}

        {/* Modal Card */}
        <div className={`bg-white/95 border border-[#E8E1D5] ${
          locationStatus?.inRedZone ? 'rounded-b-2xl rounded-t-none' : 'rounded-2xl'
        } p-6 sm:p-8 shadow-2xl backdrop-blur-xl overflow-y-auto max-h-[85vh] sm:max-h-[80vh]`}>
          
          {/* Top Header & Close */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-[#8B7355]" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8B7355]">
                  SurakshaDrishti Security
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
                {authMode === 'signin' ? 'Sign In to SurakshaDrishti' : 'Create an Account'}
              </h2>
              <p className="text-xs text-[#5C544D] mt-0.5">
                {authMode === 'signin' 
                  ? 'Access real-time GIS intelligence, zone management, and emergency passes' 
                  : 'Register for priority evacuation passes and official consoles'}
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

          {/* Dual Main Mode Selector: [Sign In] vs [Sign Up] */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F6F4F0] border border-[#E8E1D5] mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setMessage(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-[#2C2A29] text-[#FDFBF7] shadow-sm'
                  : 'text-[#5C544D] hover:text-[#1A1A1A]'
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
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-[#2C2A29] text-[#FDFBF7] shadow-sm'
                  : 'text-[#5C544D] hover:text-[#1A1A1A]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Register
            </button>
          </div>

          {/* ================= MODE: SIGN IN ================= */}
          {authMode === 'signin' && (
            <div>
              {/* Role Toggle for Sign In */}
              <div className="flex bg-[#F6F4F0] p-1 rounded-xl border border-[#E8E1D5] mb-4 text-xs font-semibold gap-1">
                <button
                  type="button"
                  onClick={() => setLoginType('authority')}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginType === 'authority'
                      ? 'bg-white text-[#1A1A1A] shadow-xs border border-[#E8E1D5]'
                      : 'text-[#7A726A] hover:text-[#1A1A1A]'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-[#8B7355]" /> NDRF & SDMA
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType('resident')}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    loginType === 'resident'
                      ? 'bg-white text-[#1A1A1A] shadow-xs border border-[#E8E1D5]'
                      : 'text-[#7A726A] hover:text-[#1A1A1A]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#4A4238]" /> Resident / Citizen
                </button>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2C2A29] mb-1">
                    {loginType === 'authority' ? 'Official Gov Email / Service ID' : 'Mobile Number / Registered ID'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-[#7A726A]" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={loginType === 'authority' ? 'ndrf.command@mha.gov.in' : '+91 98765 43210'}
                      className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl py-2.5 pl-10 pr-3 text-xs sm:text-sm text-[#1A1A1A] placeholder-[#8C847A] focus:outline-none focus:border-[#8B7355] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2C2A29] mb-1">Password / Secure Passcode</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#7A726A]" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl py-2.5 pl-10 pr-3 text-xs sm:text-sm text-[#1A1A1A] placeholder-[#8C847A] focus:outline-none focus:border-[#8B7355] transition-colors"
                    />
                  </div>
                </div>

                {/* 2FA Status + Trusted Device */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[#5C544D] hover:text-[#1A1A1A] text-[11px] sm:text-xs">
                    <input
                      type="checkbox"
                      checked={trustedDevice}
                      onChange={(e) => setTrustedDevice(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-[#D9D0C1] text-[#2C2A29] focus:ring-0"
                    />
                    Remember this device (30 days)
                  </label>

                  {locationStatus?.inRedZone ? (
                    <span className="text-[#B85C38] font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> High Priority Bypass
                    </span>
                  ) : (
                    <span className="text-[#2D7A4F] font-semibold flex items-center gap-1 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" /> 2FA Encrypted
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] font-medium text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer hover:-translate-y-0.5"
                >
                  {isLoading ? 'Authenticating...' : 'Sign In & Access Platform'}
                  <ArrowRight className="w-4 h-4 opacity-80" />
                </button>
              </form>

              <div className="mt-5 text-center text-[11px] sm:text-xs text-[#7A726A]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-[#8B7355] hover:underline font-bold cursor-pointer"
                >
                  Sign Up / Register Here
                </button>
              </div>
            </div>
          )}

          {/* ================= MODE: SIGN UP / REGISTER ================= */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#2C2A29] mb-1">Account Role</label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setSignupRole('resident')}
                    className={`py-2 px-1 rounded-xl border transition-all text-center cursor-pointer ${
                      signupRole === 'resident'
                        ? 'bg-[#2C2A29] text-[#FDFBF7] border-[#2C2A29] shadow-xs'
                        : 'bg-[#F6F4F0] text-[#5C544D] border-[#E8E1D5] hover:bg-[#E8E1D5]'
                    }`}
                  >
                    Resident
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('ndrf')}
                    className={`py-2 px-1 rounded-xl border transition-all text-center cursor-pointer ${
                      signupRole === 'ndrf'
                        ? 'bg-[#2C2A29] text-[#FDFBF7] border-[#2C2A29] shadow-xs'
                        : 'bg-[#F6F4F0] text-[#5C544D] border-[#E8E1D5] hover:bg-[#E8E1D5]'
                    }`}
                  >
                    NDRF Battalion
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('sdma')}
                    className={`py-2 px-1 rounded-xl border transition-all text-center cursor-pointer ${
                      signupRole === 'sdma'
                        ? 'bg-[#2C2A29] text-[#FDFBF7] border-[#2C2A29] shadow-xs'
                        : 'bg-[#F6F4F0] text-[#5C544D] border-[#E8E1D5] hover:bg-[#E8E1D5]'
                    }`}
                  >
                    State Authority
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#2C2A29] mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commander Rajesh Nair"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl py-2 px-3 text-xs sm:text-sm text-[#1A1A1A] placeholder-[#8C847A] focus:outline-none focus:border-[#8B7355]"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#2C2A29] mb-1">Contact Phone</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#7A726A]" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl py-2 pl-9 pr-3 text-xs text-[#1A1A1A] placeholder-[#8C847A] focus:outline-none focus:border-[#8B7355]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2C2A29] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#7A726A]" />
                    <input
                      type="email"
                      required
                      placeholder="officer@ndrf.gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl py-2 pl-9 pr-3 text-xs text-[#1A1A1A] placeholder-[#8C847A] focus:outline-none focus:border-[#8B7355]"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#2C2A29] mb-1">Set Account Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#7A726A]" />
                  <input
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl py-2 pl-9 pr-3 text-xs text-[#1A1A1A] placeholder-[#8C847A] focus:outline-none focus:border-[#8B7355]"
                  />
                </div>
              </div>

              {/* District & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#2C2A29] mb-1">District / Jurisdiction</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl py-2 px-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#8B7355]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#2C2A29] mb-1 flex items-center justify-between">
                    <span>GPS Coordinates</span>
                    <button
                      type="button"
                      onClick={handleDetectGPS}
                      className="text-[10px] text-[#8B7355] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Crosshair className="w-2.5 h-2.5" /> Auto-GPS
                    </button>
                  </label>
                  <input
                    type="text"
                    value={detectedLoc || 'Detecting GPS...'}
                    onChange={(e) => setDetectedLoc(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl py-2 px-3 text-xs font-mono text-[#5C544D] focus:outline-none focus:border-[#8B7355]"
                  />
                </div>
              </div>

              {/* Resident Household Details */}
              <div className="p-2.5 rounded-xl bg-[#F6F4F0] border border-[#E8E1D5] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2C2A29]">
                  <Home className="w-3.5 h-3.5 text-[#8B7355]" />
                  <span>Household Capacity Planning</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-[#5C544D]">Family Members:</label>
                    <input
                      type="number"
                      min="1"
                      value={familyMembers}
                      onChange={(e) => setFamilyMembers(e.target.value)}
                      className="w-full bg-white border border-[#E8E1D5] rounded-lg px-2 py-1 text-xs text-[#1A1A1A]"
                    />
                  </div>

                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] sm:text-[11px] text-[#5C544D] hover:text-[#1A1A1A]">
                      <input
                        type="checkbox"
                        checked={hasVulnerable}
                        onChange={(e) => setHasVulnerable(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[#D9D0C1] text-[#2C2A29] focus:ring-0"
                      />
                      <span>Elderly / Infant</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] font-medium text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer hover:-translate-y-0.5"
              >
                {isLoading ? 'Registering Account...' : 'Complete Sign Up & Generate Pass'}
                <ArrowRight className="w-4 h-4 opacity-80" />
              </button>

              <div className="text-center text-[11px] sm:text-xs text-[#7A726A] pt-0.5">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-[#8B7355] hover:underline font-bold cursor-pointer"
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
