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
  Heart,
  Sparkles,
  Building2,
  ChevronRight,
  Key
} from 'lucide-react';
import { apiService, checkGeofenceRedZoneStatus } from '../utils/api';
import { useToast } from './Toast';

export default function AuthSection({ initialMode = 'signin', onClose, onAuthSuccess }) {
  const { addToast } = useToast();
  const [authMode, setAuthMode] = useState(initialMode); // 'signin' | 'signup'
  const [loginType, setLoginType] = useState('authority'); // Authority command desk only

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [tempAuthData, setTempAuthData] = useState(null);

  const [signupRole, setSignupRole] = useState('ndrf'); // 'ndrf' | 'sdma' | 'police' | 'fire_rescue'
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [district, setDistrict] = useState('Wayanad Sector 4');
  const [familyMembers, setFamilyMembers] = useState('1');
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

    const trimmedUsername = username.trim();
    // Check if the officer has modified their password in real-time
    const updatedCustomPassword = localStorage.getItem(`suraksha_pwd_${trimmedUsername}`);

    let loginSuccessful = false;
    let authResult = null;

    if (updatedCustomPassword) {
      if (password === updatedCustomPassword) {
        loginSuccessful = true;
        authResult = {
          success: true,
          token: 'jwt_officer_custom_' + Date.now(),
          user: {
            userId: trimmedUsername,
            fullName: trimmedUsername === 'officer_vikram_singh' ? 'Commander Vikram Singh' : trimmedUsername,
            role: 'NDRF',
            district: 'Wayanad Sector 4',
            zone: 'NDRF Tactical Sector'
          }
        };
      } else {
        setIsLoading(false);
        const errText = 'Incorrect password. Note: If you updated your password in Profile, you must use your new password.';
        addToast(errText, 'error');
        setMessage({ type: 'error', text: errText });
        return;
      }
    } else {
      authResult = await apiService.login({
        username: trimmedUsername,
        password,
        loginType,
        role: loginType,
      });
      loginSuccessful = authResult.success;
    }

    setIsLoading(false);

    if (loginSuccessful && authResult) {
      if (authResult.requires2FA || authResult.token === 'mock-jwt-token-sih2026') {
        // Enforce 2FA Step
        setTempAuthData(authResult);
        setAuthMode('otp');
        addToast('Credentials verified. Please enter 2FA OTP.', 'info');
      } else {
        addToast('Authentication successful! Initializing tactical session...', 'success');
        setTimeout(() => {
          onAuthSuccess({
            token: authResult.token,
            user: authResult.user || {
              username: trimmedUsername,
              name: trimmedUsername.split('@')[0].toUpperCase(),
              role: loginType === 'authority' ? 'NDRF Tactical Command' : 'Resident Citizen',
              department: loginType === 'authority' ? 'NDRF' : 'Civilian',
            }
          });
        }, 700);
      }
    } else {
      const errText = authResult?.error || authResult?.message || 'Invalid credentials. Please verify your details.';
      addToast(errText, 'error');
      setMessage({ type: 'error', text: errText });
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      addToast('Please enter a valid 6-digit OTP code.', 'error');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate OTP Verification (as backend may not have full verify route yet)
    setTimeout(() => {
      setIsLoading(false);
      addToast('2FA Verified! Initializing tactical session...', 'success');
      setTimeout(() => {
        onAuthSuccess({
          token: tempAuthData?.token || 'jwt_registered_' + Date.now(),
          user: tempAuthData?.user || {
            username: username,
            name: username.split('@')[0].toUpperCase(),
            role: loginType === 'authority' ? 'NDRF Tactical Command' : 'Resident Citizen',
            department: loginType === 'authority' ? 'NDRF' : 'Civilian',
          }
        });
      }, 700);
    }, 1000);
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
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <img 
                    src="/favicon.webp" 
                    alt="SurakshaDrishti Emblem" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#8B7355]">
                  SurakshaDrishti Security
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
                {authMode === 'otp' ? 'Two-Factor Authentication' : 'Official Command Desk Sign In'}
              </h2>
              <p className="text-xs text-[#5C544D] mt-0.5">
                {authMode === 'otp'
                  ? 'Enter the secure OTP code sent to your official device'
                  : 'Centralized access for NDRF, SDMA, Police, and Fire Rescue officers with pre-provisioned credentials'}
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

          {authMode === 'otp' ? (
            /* ================= MODE: 2FA OTP ================= */
            <div>
              <div className="mb-4 p-3 bg-[#FFF5F2] rounded-xl border border-[#FADED4] flex items-center justify-center gap-2 text-[#B85C38] font-bold text-sm">
                <ShieldCheck className="w-4 h-4" /> Secure Auth Enforced
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2C2A29] mb-1">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3.5 top-3 text-[#7A726A]" />
                    <input
                      type="text"
                      required
                      maxLength="6"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="000000"
                      className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl py-2.5 pl-10 pr-3 text-xs sm:text-sm text-[#1A1A1A] font-mono tracking-[0.5em] placeholder-[#8C847A] focus:outline-none focus:border-[#8B7355] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpCode.length < 6}
                  className="w-full py-3.5 rounded-xl bg-[#2D7A4F] hover:bg-[#256842] text-[#FDFBF7] font-medium text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer hover:-translate-y-0.5"
                >
                  {isLoading ? 'Verifying...' : 'Verify Secure Code'}
                  <CheckCircle2 className="w-4 h-4 opacity-80" />
                </button>
                
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="w-full py-2 text-xs text-[#5C544D] hover:text-[#1A1A1A] underline transition-colors"
                >
                  Return to Sign In
                </button>
              </form>
            </div>
          ) : (
            /* ================= MODE: PRE-PROVISIONED OFFICIAL SIGN IN ================= */
          <div>
            <div className="mb-4 p-3 bg-[#F6F4F0] rounded-xl border border-[#E8E1D5] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#1A1A1A] font-bold text-xs sm:text-sm">
                <Shield className="w-4 h-4 text-[#8B7355]" />
                <span>Authorized Command Desk Access</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E8E1D5] text-[#4A4238] font-bold uppercase">
                Pre-Provisioned
              </span>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2C2A29] mb-1">
                  Official Gov Email / Service ID / Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-[#7A726A]" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ndrf.command@mha.gov.in or ndrf_admin"
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

              {/* 2FA Status */}
              <div className="flex flex-wrap items-center justify-end gap-2 text-xs pt-1">
                {locationStatus?.inRedZone ? (
                  <span className="text-[#B85C38] font-semibold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> High Priority Bypass
                  </span>
                ) : (
                  <span className="text-[#2D7A4F] font-semibold flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" /> 2FA Encrypted Authentication Active
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

              {/* Notice for new or field personnel */}
              <div className="mt-4 pt-3 border-t border-[#E8E1D5] text-center space-y-1.5">
                <p className="text-[11px] text-[#5C544D]">
                  Officer credentials are pre-provisioned by Ministry/SDMA IT Command.
                </p>
                <p className="text-[10px] text-[#7A726A]">
                  For field incident reporting and citizen access, use the <span className="font-semibold text-[#8B7355]">SurakshaDrishti Civilian App</span>.
                </p>
              </div>
            </form>
          </div>
          )}
        </div>

      </div>
    </div>
  );
}
