import React, { useState } from 'react';
import { apiService } from '../utils/api';

export default function AppLogin({ onLogin }) {
  const [role, setRole] = useState(null); // 'user', 'agent', or null
  const [step, setStep] = useState(1); // 1 = credentials, 2 = OTP

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        setStep(2); // Move to OTP step
      } else {
        // Bypassed or instant success
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
    // Use QuickSignup or standard login for users. We'll use QuickSign to register a guest session easily.
    const res = await apiService.quickSign({ phone, role: 'resident' });
    setLoading(false);

    if (res.success) {
      onLogin({ role: 'user', phone: phone, emergencyId: res.emergencyId });
    } else {
      setError(res.message || 'Failed to initialize session.');
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-zinc-950 font-sans relative overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-900 blur-[100px]"></div>
      </div>

      <div className="z-10 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase flex items-center justify-center gap-3">
            <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
            SurakshaDrishti
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">Disaster Incident Hub & Evacuation Relay</p>
        </div>

        {!role ? (
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => { setRole('agent'); setStep(1); setError(''); }}
              className="w-full flex items-center justify-between p-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all group"
            >
              <div className="text-left">
                <div className="text-white font-bold text-lg">Field Officer Access</div>
                <div className="text-zinc-400 text-xs mt-1">Requires 2FA & Secure Passkey</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                →
              </div>
            </button>

            <button 
              onClick={() => { setRole('user'); setError(''); }}
              className="w-full flex items-center justify-between p-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all group"
            >
              <div className="text-left">
                <div className="text-white font-bold text-lg">Citizen Access</div>
                <div className="text-zinc-400 text-xs mt-1">Direct access to map & alerts</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors">
                →
              </div>
            </button>
          </div>
        ) : role === 'agent' ? (
          <form onSubmit={step === 1 ? handleAgentLoginStep1 : handleAgentLoginStep2} className="flex flex-col gap-4">
            <button 
              type="button"
              onClick={() => { setRole(null); setStep(1); }}
              className="text-xs text-zinc-400 hover:text-white text-left mb-2 flex items-center gap-1"
            >
              ← Back to Role Selection
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg">
                {error}
              </div>
            )}

            {step === 1 ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="officer@ndrf.gov.in"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase tracking-wider">Secure Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <button 
                  type="submit" disabled={loading}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors uppercase text-sm tracking-wider disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </>
            ) : (
              <>
                <div className="bg-blue-500/10 border border-blue-500/50 text-blue-400 text-xs p-3 rounded-lg mb-2">
                  2FA required. We've sent an OTP to {email}.
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase tracking-wider">2FA QuickSign Code</label>
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition-colors tracking-widest font-mono text-center"
                    placeholder="000-000"
                  />
                </div>
                <button 
                  type="submit" disabled={loading}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors uppercase text-sm tracking-wider disabled:opacity-50"
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
              className="text-xs text-zinc-400 hover:text-white text-left mb-2 flex items-center gap-1"
            >
              ← Back to Role Selection
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1 uppercase tracking-wider">Mobile Number / Email</label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="+91 98765 43210"
              />
            </div>
            
            <button 
              type="submit" disabled={loading}
              className="w-full mt-4 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-lg transition-colors uppercase text-sm tracking-wider disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Access Safe Dashboard'}
            </button>
          </form>
        )}

      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 left-0 w-full text-center text-zinc-600 text-xs font-mono">
        SurakshaDrishti Incident Hub v1.0.0 • E2EE Secured Connection
      </div>
    </div>
  );
}
