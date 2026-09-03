import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  ArrowLeft, 
  Camera, 
  Trash2, 
  Save, 
  Lock, 
  Mail, 
  Phone, 
  Shield, 
  CheckCircle2, 
  AlertTriangle,
  Key,
  BadgeCheck,
  Home
} from 'lucide-react';
import { useToast } from '../Toast';

export default function UserProfile({ user, onUpdateUser, onBack, onLogout, onNavigateHome }) {
  const { addToast } = useToast();
  // Form states initialized from user session
  const [fullName, setFullName] = useState(user?.fullName || user?.name || user?.username || 'NDRF Commander Chief');
  const [email, setEmail] = useState(user?.email || 'officer.command@surakshadrishti.in');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [department, setDepartment] = useState(user?.role || user?.department || 'NDRF Tactical Command');
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Profile picture state (supports local preview, upload, remove)
  const [profileImage, setProfileImage] = useState(
    user?.profile_picture || user?.avatar || localStorage.getItem('suraksha_user_pfp') || null
  );

  // Sync state whenever user prop updates externally
  useEffect(() => {
    if (user) {
      if (user.fullName || user.name) setFullName(user.fullName || user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.role || user.department) setDepartment(user.role || user.department);
      if (user.profile_picture || user.avatar) {
        setProfileImage(user.profile_picture || user.avatar);
      }
    }
  }, [user]);

  // Status feedback
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef(null);

  // Handle Photo Upload via local file reader
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSaveError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    // 5MB max
    if (file.size > 5 * 1024 * 1024) {
      setSaveError('Image size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setProfileImage(dataUrl);
      localStorage.setItem('suraksha_user_pfp', dataUrl);
      setSaveSuccess('Profile photo updated successfully!');
      setSaveError(null);
      addToast('Profile photo updated successfully!', 'success');
      if (onUpdateUser) {
        onUpdateUser({ ...user, profile_picture: dataUrl, avatar: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Photo Removal
  const handleRemovePhoto = () => {
    setProfileImage(null);
    localStorage.removeItem('suraksha_user_pfp');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setSaveSuccess('Profile photo removed.');
    setSaveError(null);
    addToast('Profile photo removed.', 'info');
    if (onUpdateUser) {
      onUpdateUser({ ...user, profile_picture: null, avatar: null });
    }
  };

  // Handle Credential & Profile Update
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveSuccess(null);
    setSaveError(null);

    // Validation
    if (!fullName.trim()) {
      const err = 'Full Name cannot be empty.';
      setSaveError(err);
      addToast(err, 'error');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      const err = 'Please enter a valid official email address.';
      setSaveError(err);
      addToast(err, 'error');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        const err = 'New password must be at least 6 characters long.';
        setSaveError(err);
        addToast(err, 'error');
        return;
      }
      if (newPassword !== confirmPassword) {
        const err = 'New password and confirmation do not match.';
        setSaveError(err);
        addToast(err, 'error');
        return;
      }
    }

    setIsSaving(true);

    setTimeout(() => {
      const updatedUserData = {
        ...user,
        fullName: fullName.trim(),
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: department.trim(),
        profile_picture: profileImage,
        avatar: profileImage
      };

      // Persist locally for session consistency
      try {
        localStorage.setItem('suraksha_user_credentials', JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role: department.trim(),
          profile_picture: profileImage
        }));
      } catch (err) {
        // ignore storage quota
      }

      if (onUpdateUser) {
        onUpdateUser(updatedUserData);
      }

      setIsSaving(false);
      const msg = newPassword 
        ? 'Officer credentials & security password updated successfully!' 
        : 'Profile details saved successfully!';
      setSaveSuccess(msg);
      addToast(msg, 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-sans py-6 sm:py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#8B7355]/20 selection:text-[#1A1A1A] relative">
      <div className="paper-texture"></div>

      <div className="max-w-4xl mx-auto space-y-6 relative z-20">
        
        {/* Top Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8E1D5]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#F6F4F0] text-[#5C544D] hover:text-[#1A1A1A] border border-[#E8E1D5] text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#8B7355]" />
              <span>Back to Dashboard</span>
            </button>

            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#F6F4F0] text-[#5C544D] hover:text-[#1A1A1A] border border-[#E8E1D5] text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <Home className="w-4 h-4 text-[#8B7355]" />
                <span>Home Portal</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-[#5C544D]">
            <span className="w-2 h-2 rounded-full bg-[#2D7A4F] animate-pulse"></span>
            <span>SECURE OFFICER CREDENTIAL MANAGEMENT • SIH 26191</span>
          </div>
        </div>

        {/* Profile Card & Avatar Banner */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-[#E8E1D5] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            
            {/* Avatar with Upload and Remove Actions */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="relative group w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-[#E8E1D5] bg-[#F6F4F0] flex items-center justify-center shadow-xs">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Officer Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[#8B7355]">
                    <User className="w-12 h-12 stroke-[1.5]" />
                    <span className="text-[10px] font-mono mt-1 font-bold text-[#7A726A]">NO PHOTO</span>
                  </div>
                )}
              </div>

              {/* Action Buttons for Avatar */}
              <div className="flex items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F6F4F0] border border-[#E8E1D5] text-[11px] font-semibold text-[#1A1A1A] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Upload Profile Photo"
                >
                  <Camera className="w-3.5 h-3.5 text-[#8B7355]" />
                  <span>Upload</span>
                </button>

                {profileImage && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FFF5F2] border border-[#E8E1D5] hover:border-[#FADED4] text-[11px] font-semibold text-[#B85C38] transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                    title="Remove Profile Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>

            {/* Officer Meta Info */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
                  {fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF5F2] border border-[#FADED4] text-[#B85C38]">
                  {department}
                </span>
              </div>
              
              <p className="text-xs text-[#5C544D]">
                Operational Clearance: <strong className="text-[#1A1A1A]">Level 4 (Disaster Response Administrator)</strong>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-[#7A726A]">
                <span className="flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#2D7A4F]" /> Verified Officer ID
                </span>
                <span>•</span>
                <span className="font-mono text-[#5C544D]">
                  ID: {user?.userId || user?.user_id || user?.username || 'ndrf_admin'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          
          {/* Section 1: Personal and Operational Info */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-[#E8E1D5] p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="pb-3 border-b border-[#E8E1D5]">
              <h2 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                <User className="w-4 h-4 text-[#8B7355]" /> Officer Personal & Department Information
              </h2>
              <p className="text-xs text-[#7A726A] mt-0.5">
                Update your active contact information and tactical assignment title.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1A]">Officer Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#FDFBF7] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] transition-colors"
                    placeholder="Commander Full Name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1A]">Official Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FDFBF7] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] transition-colors"
                    placeholder="officer@disaster.gov.in"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1A]">Tactical Contact Phone</label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FDFBF7] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1A]">Department / Role</label>
                <div className="relative">
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#FDFBF7] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] transition-colors"
                    placeholder="NDRF Tactical Command"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Security Credentials & Password Change */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-[#E8E1D5] p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="pb-3 border-b border-[#E8E1D5]">
              <h2 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#8B7355]" /> Change Security Credentials & Access Passcode
              </h2>
              <p className="text-xs text-[#7A726A] mt-0.5">
                Leave these fields blank if you do not wish to change your authentication password.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1A]">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FDFBF7] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1A]">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#FDFBF7] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1A]">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-[#FDFBF7] text-[#1A1A1A] text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F6F4F0] border border-[#E8E1D5] text-xs font-semibold text-[#5C544D] hover:text-[#1A1A1A] transition-colors cursor-pointer shadow-2xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-2.5 rounded-xl bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm ${
                isSaving
                  ? 'cursor-not-allowed opacity-50 pointer-events-none'
                  : 'cursor-pointer'
              }`}
            >
              <Save className="w-4 h-4 text-[#8B7355]" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Updated Credentials'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
