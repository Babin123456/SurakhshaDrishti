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
  Home,
  X,
  Send,
  Sparkles
} from 'lucide-react';
import { useToast } from '../Toast';
import { apiService } from '../../utils/api';

export default function UserProfile({ user, onUpdateUser, onBack, onLogout, onNavigateHome }) {
  const { addToast } = useToast();
  // Form states initialized from user session
  const [fullName, setFullName] = useState(user?.fullName || user?.name || user?.username || 'NDRF Commander Chief');
  const [email, setEmail] = useState(user?.email || 'vikram.singh@ndrf.gov.in');
  const [phone, setPhone] = useState(user?.phone || '9876501234');
  const [department, setDepartment] = useState(user?.role || user?.department || 'NDRF');
  
  // Baseline initial values to detect modifications
  const [initialEmail, setInitialEmail] = useState(user?.email || 'vikram.singh@ndrf.gov.in');
  const [initialPhone, setInitialPhone] = useState(user?.phone || '9876501234');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 2FA Verification Modal states for Email / Mobile change
  const [verificationModal, setVerificationModal] = useState(null); // { type: 'email' | 'phone', targetValue: string, otpCode: string, generatedOtp: string }
  const [enteredOtp, setEnteredOtp] = useState('');

  // Profile picture state (supports local preview, upload, remove)
  const [profileImage, setProfileImage] = useState(
    user?.profile_picture || user?.avatar || localStorage.getItem('suraksha_user_pfp') || null
  );

  // Sync state whenever user prop updates externally
  useEffect(() => {
    if (user) {
      const uName = user.fullName || user.name || user.username || 'NDRF Commander Chief';
      const uMail = user.email || 'vikram.singh@ndrf.gov.in';
      const uPhone = user.phone || '9876501234';
      const uDept = user.role || user.department || 'NDRF';

      setFullName(uName);
      setEmail(uMail);
      setPhone(uPhone);
      setDepartment(uDept);
      setInitialEmail(uMail);
      setInitialPhone(uPhone);

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

  // Trigger Email change verification flow
  const handleInitiateEmailVerification = () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      addToast('Please enter a valid new official email address.', 'error');
      return;
    }
    if (trimmed.toLowerCase() === initialEmail.toLowerCase()) {
      addToast('The email address is identical to your current registered email.', 'info');
      return;
    }

    const sampleOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setEnteredOtp('');
    setVerificationModal({
      type: 'email',
      targetValue: trimmed,
      previousEmail: initialEmail,
      generatedOtp: sampleOtp,
      title: 'Authorize Email Address Modification',
      description: `A 6-digit security authorization code has been dispatched to your currently registered email: ${initialEmail}. Enter the code below to complete the transition to ${trimmed}.`
    });
    addToast(`Security authorization code dispatched to ${initialEmail} (Demo Code: ${sampleOtp})`, 'info');
  };

  // Trigger Mobile Phone change verification flow
  const handleInitiatePhoneVerification = () => {
    const trimmed = phone.trim();
    if (!trimmed || trimmed.length < 8) {
      addToast('Please enter a valid 10-digit tactical mobile number.', 'error');
      return;
    }
    if (trimmed === initialPhone) {
      addToast('The phone number is identical to your current registered number.', 'info');
      return;
    }

    const sampleOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setEnteredOtp('');
    setVerificationModal({
      type: 'phone',
      targetValue: trimmed,
      previousEmail: initialEmail,
      generatedOtp: sampleOtp,
      title: 'Authorize Tactical Phone Number Modification',
      description: `Per official IT protocol, changing an officer's phone requires clearance. A verification code has been dispatched to your registered email (${initialEmail}). Enter the code below to authorize changing to ${trimmed}.`
    });
    addToast(`Verification code dispatched to ${initialEmail} (Demo Code: ${sampleOtp})`, 'info');
  };

  // Confirm OTP Verification for email/phone
  const handleConfirmVerification = () => {
    if (!enteredOtp || enteredOtp.trim() !== verificationModal.generatedOtp) {
      addToast('Invalid verification code. Please check and re-enter.', 'error');
      return;
    }

    if (verificationModal.type === 'email') {
      const verifiedMail = verificationModal.targetValue;
      setInitialEmail(verifiedMail);
      setEmail(verifiedMail);
      setVerificationModal(null);
      addToast(`Official email successfully verified and updated to ${verifiedMail}`, 'success');

      // Auto update storage and user session
      const targetUserId = user?.userId || user?.user_id || user?.username || 'officer_vikram_singh';
      const updatedUserData = {
        ...user,
        fullName: fullName.trim(),
        name: fullName.trim(),
        email: verifiedMail,
        phone: initialPhone.trim(),
        role: department.trim(),
        department: department.trim(),
        profile_picture: profileImage,
        avatar: profileImage
      };

      try {
        localStorage.setItem('suraksha_user_credentials', JSON.stringify({
          fullName: fullName.trim(),
          email: verifiedMail,
          phone: initialPhone.trim(),
          role: department.trim(),
          profile_picture: profileImage
        }));

        const existingSession = localStorage.getItem('suraksha_user_session');
        if (existingSession) {
          const parsed = JSON.parse(existingSession);
          parsed.user = { ...parsed.user, ...updatedUserData };
          localStorage.setItem('suraksha_user_session', JSON.stringify(parsed));
        }
      } catch (e) {}

      if (onUpdateUser) {
        onUpdateUser(updatedUserData);
      }
    } else if (verificationModal.type === 'phone') {
      const verifiedPhone = verificationModal.targetValue;
      setInitialPhone(verifiedPhone);
      setPhone(verifiedPhone);
      setVerificationModal(null);
      addToast(`Tactical mobile number successfully verified and updated to ${verifiedPhone}`, 'success');

      // Auto update storage and user session
      const updatedUserData = {
        ...user,
        fullName: fullName.trim(),
        name: fullName.trim(),
        email: initialEmail.trim(),
        phone: verifiedPhone,
        role: department.trim(),
        department: department.trim(),
        profile_picture: profileImage,
        avatar: profileImage
      };

      try {
        localStorage.setItem('suraksha_user_credentials', JSON.stringify({
          fullName: fullName.trim(),
          email: initialEmail.trim(),
          phone: verifiedPhone,
          role: department.trim(),
          profile_picture: profileImage
        }));

        const existingSession = localStorage.getItem('suraksha_user_session');
        if (existingSession) {
          const parsed = JSON.parse(existingSession);
          parsed.user = { ...parsed.user, ...updatedUserData };
          localStorage.setItem('suraksha_user_session', JSON.stringify(parsed));
        }
      } catch (e) {}

      if (onUpdateUser) {
        onUpdateUser(updatedUserData);
      }
    }
  };

  // Handle Credential, Department & Password Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveSuccess(null);
    setSaveError(null);

    // Check if user changed email or phone without running verification
    if (email.trim().toLowerCase() !== initialEmail.toLowerCase()) {
      const err = 'Email modification detected. Please click "Verify Email" to complete authorization first.';
      setSaveError(err);
      addToast(err, 'error');
      return;
    }

    if (phone.trim() !== initialPhone) {
      const err = 'Mobile number modification detected. Please click "Verify Mobile" to complete authorization first.';
      setSaveError(err);
      addToast(err, 'error');
      return;
    }

    // Comprehensive Password Modification Logic
    const isPasswordChangeAttempted = currentPassword || newPassword || confirmPassword;

    if (isPasswordChangeAttempted) {
      if (!currentPassword) {
        const err = 'Please enter your Current Password to authorize a password change.';
        setSaveError(err);
        addToast(err, 'error');
        return;
      }

      if (!newPassword) {
        const err = 'Please enter a New Password.';
        setSaveError(err);
        addToast(err, 'error');
        return;
      }

      if (newPassword.length < 6) {
        const err = 'New Password must be at least 6 characters long.';
        setSaveError(err);
        addToast(err, 'error');
        return;
      }

      if (newPassword !== confirmPassword) {
        const err = 'New Password and Confirm New Password do not match. Please verify.';
        setSaveError(err);
        addToast(err, 'error');
        return;
      }

      if (newPassword === currentPassword) {
        const err = 'New Password must be different from your Current Password.';
        setSaveError(err);
        addToast(err, 'error');
        return;
      }
    }

    setIsSaving(true);

    const targetUserId = user?.userId || user?.user_id || user?.username || 'officer_vikram_singh';

    // If password change is requested, verify current password against custom storage or backend /auth/login
    if (isPasswordChangeAttempted) {
      // Check if custom password was previously set by the officer in local storage
      const storedSecurityCreds = localStorage.getItem(`suraksha_pwd_${targetUserId}`);
      let isVerified = false;

      if (storedSecurityCreds) {
        if (storedSecurityCreds === currentPassword) {
          isVerified = true;
        }
      } else {
        // Verify against backend login
        const verifyCurrentRes = await apiService.login({
          username: targetUserId,
          password: currentPassword,
          loginType: 'authority',
          role: 'authority',
        });
        if (verifyCurrentRes.success) {
          isVerified = true;
        }
      }

      if (!isVerified) {
        setIsSaving(false);
        const err = 'Incorrect Current Password! Security credentials modification rejected.';
        setSaveError(err);
        addToast(err, 'error');
        return;
      }

      // Store updated password in real-time storage
      localStorage.setItem(`suraksha_pwd_${targetUserId}`, newPassword);
    }

    // Persist real-time modifications in local session & local database store
    const updatedUserData = {
      ...user,
      fullName: fullName.trim(),
      name: fullName.trim(),
      email: initialEmail.trim(),
      phone: initialPhone.trim(),
      role: department.trim(),
      department: department.trim(),
      profile_picture: profileImage,
      avatar: profileImage
    };

    // Save locally for persistence
    try {
      localStorage.setItem('suraksha_user_credentials', JSON.stringify({
        fullName: fullName.trim(),
        email: initialEmail.trim(),
        phone: initialPhone.trim(),
        role: department.trim(),
        profile_picture: profileImage
      }));

      // Update active user session
      const existingSession = localStorage.getItem('suraksha_user_session');
      if (existingSession) {
        const parsed = JSON.parse(existingSession);
        parsed.user = {
          ...parsed.user,
          ...updatedUserData
        };
        localStorage.setItem('suraksha_user_session', JSON.stringify(parsed));
      }
    } catch (err) {
      // ignore storage quota
    }

    if (onUpdateUser) {
      onUpdateUser(updatedUserData);
    }

    setIsSaving(false);

    if (isPasswordChangeAttempted) {
      const msg = 'Password successfully changed! Security credentials updated in real-time. Please use your new password for subsequent logins.';
      setSaveSuccess(msg);
      addToast(msg, 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      const msg = 'Officer Personal & Department Information successfully saved!';
      setSaveSuccess(msg);
      addToast(msg, 'success');
    }
  };

  const isEmailModified = email.trim().toLowerCase() !== initialEmail.toLowerCase();
  const isPhoneModified = phone.trim() !== initialPhone;

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

        {/* Credentials & Password Change Form */}
        <form onSubmit={handleSaveProfile} className="space-y-6">

          {/* Section 1: Restored Officer Personal & Department Information */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-[#E8E1D5] p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="pb-3 border-b border-[#E8E1D5] flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#8B7355]" /> Officer Personal & Department Information
                </h2>
                <p className="text-xs text-[#7A726A] mt-0.5">
                  Update your active contact information and tactical assignment title.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F6F4F0] text-[#7A726A] border border-[#E8E1D5]">
                2FA VERIFICATION MANDATORY FOR CONTACT MODIFICATIONS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1A]">Full Official Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-[#7A726A]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Commander Vikram Singh"
                    className="w-full bg-[#FDFBF7] text-[#1A1A1A] text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] transition-colors"
                  />
                </div>
              </div>

              {/* Department / Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1A]">Tactical Department / Operational Role</label>
                <div className="relative">
                  <Shield className="w-4 h-4 absolute left-3.5 top-3 text-[#7A726A]" />
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. NDRF, SDMA Kerala, Tactical Command"
                    className="w-full bg-[#FDFBF7] text-[#1A1A1A] text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] transition-colors"
                  />
                </div>
              </div>

              {/* Official Email Address with Verification Action */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1A1A1A]">Official Email Address</label>
                  {isEmailModified && (
                    <span className="text-[10px] text-[#B85C38] font-bold">Unverified modification</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#7A726A]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@ndrf.gov.in"
                      className="w-full bg-[#FDFBF7] text-[#1A1A1A] text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] transition-colors"
                    />
                  </div>
                  {isEmailModified && (
                    <button
                      type="button"
                      onClick={handleInitiateEmailVerification}
                      className="px-3 py-2.5 rounded-xl bg-[#FFF5F2] hover:bg-[#FADED4] text-[#B85C38] border border-[#FADED4] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                      title="Verify via Previous Email"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Verify Email</span>
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-[#7A726A]">
                  {isEmailModified
                    ? `Verification code will be dispatched to previous mail (${initialEmail})`
                    : `Registered Email: ${initialEmail}`}
                </p>
              </div>

              {/* Tactical Contact Phone with Verification Action */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1A1A1A]">Tactical Contact Phone</label>
                  {isPhoneModified && (
                    <span className="text-[10px] text-[#B85C38] font-bold">Unverified modification</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3 text-[#7A726A]" />
                    <input
                      type="tel"
                      required
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '');
                        setPhone(digitsOnly);
                      }}
                      placeholder="9876501234"
                      className="w-full bg-[#FDFBF7] text-[#1A1A1A] text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] transition-colors"
                    />
                  </div>
                  {isPhoneModified && (
                    <button
                      type="button"
                      onClick={handleInitiatePhoneVerification}
                      className="px-3 py-2.5 rounded-xl bg-[#FFF5F2] hover:bg-[#FADED4] text-[#B85C38] border border-[#FADED4] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                      title="Verify via Registered Email"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Verify Mobile</span>
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-[#7A726A]">
                  {isPhoneModified
                    ? `Verification code dispatched to registered mail (${initialEmail})`
                    : `Active Tactical Line: ${initialPhone}`}
                </p>
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
                Update your command desk authentication credentials and access passcode. Real-time validation active.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1A]">Current Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-3 text-[#7A726A]" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    className="w-full bg-[#FDFBF7] text-[#1A1A1A] text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1A]">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#7A726A]" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-[#FDFBF7] text-[#1A1A1A] text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1A]">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#7A726A]" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-[#FDFBF7] text-[#1A1A1A] text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8E1D5] focus:outline-none focus:border-[#8B7355] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Banners */}
          {saveError && (
            <div className="p-3.5 rounded-2xl bg-[#FFF5F2] border border-[#FADED4] text-[#B85C38] text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] text-[#166534] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveSuccess}</span>
            </div>
          )}

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
              <span>{isSaving ? 'Saving Changes...' : 'Save Updated Information & Passcode'}</span>
            </button>
          </div>

        </form>

      </div>

      {/* 2FA Verification Modal Dialog for Email / Phone Modification */}
      {verificationModal && (
        <div
          className="fixed inset-0 z-[110] bg-[#2C2A29]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-white rounded-3xl border border-[#E8E1D5] p-6 sm:p-8 shadow-2xl relative animate-scale-in">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF5F2] border border-[#FADED4] flex items-center justify-center text-[#B85C38]">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B7355]">
                    Official Protocol Clearance
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A]">
                    {verificationModal.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVerificationModal(null)}
                className="p-1.5 rounded-xl bg-[#F6F4F0] hover:bg-[#E8E1D5] text-[#5C544D] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5C544D] mb-4 leading-relaxed">
              {verificationModal.description}
            </p>

            <div className="p-3 bg-[#F6F4F0] rounded-xl border border-[#E8E1D5] mb-4 text-xs">
              <div className="flex items-center justify-between text-[#7A726A] mb-1">
                <span>Target Value:</span>
                <strong className="text-[#1A1A1A] font-mono">{verificationModal.targetValue}</strong>
              </div>
              <div className="flex items-center justify-between text-[#7A726A]">
                <span>Demo Code (For Evaluation):</span>
                <span className="px-2 py-0.5 rounded bg-[#E8E1D5] font-mono font-bold text-[#2C2A29]">
                  {verificationModal.generatedOtp}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                  Enter 6-Digit Authorization Code
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-3 text-[#7A726A]" />
                  <input
                    type="text"
                    maxLength="6"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="000000"
                    className="w-full bg-[#FDFBF7] border border-[#E8E1D5] rounded-xl py-2.5 pl-10 pr-3 text-sm text-[#1A1A1A] font-mono tracking-[0.4em] placeholder-[#8C847A] focus:outline-none focus:border-[#8B7355] transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setVerificationModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white hover:bg-[#F6F4F0] border border-[#E8E1D5] text-xs font-semibold text-[#5C544D] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmVerification}
                  disabled={enteredOtp.length < 6}
                  className="flex-1 py-2.5 rounded-xl bg-[#2C2A29] hover:bg-[#1A1A1A] text-[#FDFBF7] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2D7A4F]" />
                  <span>Verify & Apply</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

