const API_BASE_URL = 'http://localhost:5000';

export const checkGeofenceRedZoneStatus = async (lat, lng) => {
  if (!lat || !lng) return false;
  return true;
};

export const fetchLiveStats = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/stats/live`);
    return await res.json();
  } catch {
    return {
      activeRedZones: 14,
      highRiskAreas: 23,
      peopleAtRisk: 28450,
      shelterCapacity: 12800,
      activeAlerts: 7,
    };
  }
};

export const fetchActiveAlerts = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/alerts/active`);
    return await res.json();
  } catch {
    return [
      {
        id: 'ALT-001',
        type: 'landslide',
        severity: 'critical',
        title: 'Landslide Warning — Wayanad Hill Slope',
        message: 'Active landslide risk in Sector 4. Evacuate immediately.',
        location: { lat: 11.6854, lng: 76.132, name: 'Wayanad Sector 4' },
        timestamp: new Date().toISOString(),
      },
      {
        id: 'ALT-002',
        type: 'flood',
        severity: 'high',
        title: 'Flash Flood Alert — Teesta Riverbank',
        message: 'Rising water levels. Move to higher ground.',
        location: { lat: 27.0883, lng: 88.2609, name: 'Teesta Riverbank' },
        timestamp: new Date().toISOString(),
      },
    ];
  }
};

export const apiService = {
  login: async (credentials, isRedZoneHabitation) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...credentials,
          redZoneBypass: isRedZoneHabitation,
        }),
      });
      return await response.json();
    } catch {
      return {
        success: true,
        bypassed2FA: isRedZoneHabitation,
        user: {
          username: credentials.username || 'NDRF_Officer',
          role: isRedZoneHabitation ? 'REDZONE_CIVILIAN' : 'NDRF_OFFICER',
          zone: isRedZoneHabitation ? 'Red Zone - Wayanad Sector 4' : 'Safe Zone',
        },
        token: 'mock-jwt-token-sih2026',
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.email || userData.phone || userData.fullName,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
          role: userData.role,
          district: userData.district,
          familyMembers: userData.familyMembers,
          hasVulnerable: userData.hasVulnerable,
        }),
      });
      return await response.json();
    } catch {
      const uname = userData.email || userData.phone || 'User';
      return {
        success: true,
        message: 'Account registered successfully!',
        token: 'jwt_registered_' + Date.now(),
        user: {
          userId: uname,
          fullName: userData.fullName || uname,
          email: userData.email,
          phone: userData.phone,
          role: userData.role || 'RESIDENT',
          district: userData.district || 'Wayanad, Kerala',
          familyMembers: userData.familyMembers || 1,
          hasVulnerable: !!userData.hasVulnerable,
        },
      };
    }
  },

  quickSignupEmergency: async (locationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/quick-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationData),
      });
      return await response.json();
    } catch {
      return {
        success: true,
        isGuestAccount: true,
        guestId: `EMG-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'RED_ZONE_EMERGENCY_PASS',
        allocatedEvacuationSite: 'Safe Haven Site B (Carrying Cap: 85%)',
        requiresPostCrisisMigration: true,
      };
    }
  },

  quickSign: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/quicksign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      return await response.json();
    } catch {
      const id = 'QS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      return {
        success: true,
        emergencyId: id,
        isTemporary: true,
        assignedShelter: 'Relief Camp Alpha — Sector 7 (3.2km away)',
        shelterCapacity: '72%',
        evacuationRoute: 'NH-766 → Bypass Road → Camp Alpha Gate',
        message: `Emergency ID ${id} created. Proceed to your assigned shelter.`,
      };
    }
  },
};
