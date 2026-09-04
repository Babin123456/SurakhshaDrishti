const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
      }
    : {
        user: process.env.PG_USER || "postgres",
        password: process.env.PG_PASSWORD || "password",
        host: process.env.PG_HOST || "localhost",
        port: process.env.PG_PORT || 5432,
        database: process.env.PG_DATABASE || "instakg",
        connectionTimeoutMillis: 10000,
      };

const pool = new Pool(poolConfig);

let pgHealthy = true;

pool.on('error', (err) => {
    console.warn('[PostgreSQL Pool Warning]', err.message);
    pgHealthy = false;
});

// Local JSON store fallback directory
const dbDir = path.join(__dirname, "../database");
const dbFile = path.join(dbDir, "suraksha_local_db.json");

let localStore = {
  users: [
    { user_id: 'ndrf_admin', email: 'ndrf.command@mha.gov.in', password: '$2b$10$w09ZkF2xO59lU22qj4A24u7s2h/k8q5d/Z71d.a6f4s8b9c1d2e3f', full_name: 'NDRF Commander Chief', user_role: 'NDRF', officer_mode: 'OFF_SITE', district: 'Wayanad Sector 4' },
    { user_id: 'sdma_officer', email: 'sdma.kerala@gov.in', password: '$2b$10$w09ZkF2xO59lU22qj4A24u7s2h/k8q5d/Z71d.a6f4s8b9c1d2e3f', full_name: 'SDMA Regional Officer', user_role: 'SDMA', officer_mode: 'ON_SITE', district: 'Wayanad, Kerala' }
  ],
  hazard_zones: [
    { zone_id: 'RZ-WAYANAD-01', name: 'Wayanad Sector 4 (Chooralmala - Meppadi)', state: 'Kerala', lat: 11.5583, lng: 76.1384, zone_type: 'RED', hazard_type: 'LANDSLIDE', risk_score: 94, geohash: 'tdv2n19z', population_risk: 4820, radius_meters: 4000, access_key: 'RZ-89A4-91F2-3B7C', status: 'ACTIVE_RED_ZONE', resolution_votes_required: 2, resolution_votes_cast: 0, is_open: true },
    { zone_id: 'RZ-KULLU-02', name: 'Beas River Valley (Kullu - Manali)', state: 'Himachal Pradesh', lat: 32.2396, lng: 77.1887, zone_type: 'RED', hazard_type: 'FLASH_FLOOD', risk_score: 91, geohash: 'ttv3m4wx', population_risk: 3200, radius_meters: 5000, access_key: 'RZ-41C2-88E0-99A1', status: 'ACTIVE_RED_ZONE', resolution_votes_required: 3, resolution_votes_cast: 0, is_open: true },
    { zone_id: 'RZ-DHUBRI-03', name: 'Dhubri Lower Assam Basin', state: 'Assam', lat: 26.0207, lng: 89.9743, zone_type: 'RED', hazard_type: 'FLOOD', risk_score: 85, geohash: 'wh8r3p7q', population_risk: 12500, radius_meters: 8000, access_key: 'RZ-73F9-22D4-55B8', status: 'ACTIVE_RED_ZONE', resolution_votes_required: 2, resolution_votes_cast: 0, is_open: true },
    { zone_id: 'RZ-KODAGU-04', name: 'Kodagu Western Ghats Slopes', state: 'Karnataka', lat: 12.3375, lng: 75.8069, zone_type: 'RED', hazard_type: 'LANDSLIDE', risk_score: 82, geohash: 'tdnc2e6w', population_risk: 2100, radius_meters: 3000, access_key: 'RZ-12A4-9X82-6C4D', status: 'ACTIVE_RED_ZONE', resolution_votes_required: 2, resolution_votes_cast: 0, is_open: true },
    { zone_id: 'RZ-TEESTA-05', name: 'Teesta River Basin (Singtam & Rangpo)', state: 'Sikkim', lat: 27.5029, lng: 88.5309, zone_type: 'RED', hazard_type: 'FLASH_FLOOD', risk_score: 88, geohash: 'tuyf29pk', population_risk: 6400, radius_meters: 4500, access_key: 'RZ-99B2-3C44-1D7F', status: 'ACTIVE_RED_ZONE', resolution_votes_required: 3, resolution_votes_cast: 0, is_open: true }
  ],
  history_red_zones: [],
  zone_assignments: [],
  shelters: [
    { shelter_id: 'SH-01', zone_id: 'RZ-WAYANAD-04', primary_hashed_key: 'RZ-89A4-91F2-3B7C', name: 'Nilambur Foothill Base Camp', lat: 11.2764, lng: 76.2241, capacity_total: 1420, capacity_occupied: 420, status: 'OPEN', evacuation_corridor: 'Via SH-28 (Clearing Teams Active)' },
    { shelter_id: 'SH-02', zone_id: 'RZ-WAYANAD-04', primary_hashed_key: 'RZ-89A4-91F2-3B7C', name: 'Pipalkoti Relief Center', lat: 30.4285, lng: 79.4312, capacity_total: 850, capacity_occupied: 210, status: 'OPEN', evacuation_corridor: 'Via NH-07 (Bypass Operational)' }
  ],
  emergency_passes: [],
  e2ee_conversations: [],
  e2ee_messages: [],
  gsm_telemetry_logs: []
};

// Load saved local data if exists
if (fs.existsSync(dbFile)) {
  try {
    const raw = fs.readFileSync(dbFile, "utf-8");
    localStore = { ...localStore, ...JSON.parse(raw) };
  } catch (e) {}
}

const saveLocalStore = () => {
  try {
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    fs.writeFileSync(dbFile, JSON.stringify(localStore, null, 2), "utf-8");
  } catch (e) {}
};

async function executeLocalQuery(text, params = []) {
  const sql = text.trim();
  const lower = sql.toLowerCase();

  // Transactions
  if (lower === 'begin' || lower === 'commit' || lower === 'rollback') {
    return { rows: [] };
  }

  // SELECT FROM users
  if (lower.startsWith('select') && lower.includes('from users')) {
    if (params.length >= 1) {
      const match = localStore.users.filter(u => {
        return params.some(p => {
          if (!p) return false;
          const pStr = String(p).trim().toLowerCase();
          return (
            (u.user_id && String(u.user_id).trim().toLowerCase() === pStr) ||
            (u.email && String(u.email).trim().toLowerCase() === pStr) ||
            (u.phone && String(u.phone).trim() === String(p).trim())
          );
        });
      });
      return { rows: match };
    }
    return { rows: localStore.users };
  }

  // INSERT INTO users
  if (lower.startsWith('insert into users')) {
    const [user_id, email, password, full_name, phone, user_role, district, family_members, has_vulnerable] = params;
    const existingIdx = localStore.users.findIndex(u => u.user_id === user_id || u.email === email);
    const newUser = {
      user_id, email, password, full_name: full_name || user_id, phone: phone || '', user_role: user_role || 'RESIDENT',
      district: district || 'Wayanad, Kerala', family_members: family_members || 1,
      has_vulnerable: !!has_vulnerable, created_at: new Date().toISOString()
    };
    if (existingIdx >= 0) {
      localStore.users[existingIdx] = newUser;
    } else {
      localStore.users.push(newUser);
    }
    saveLocalStore();
    return { rows: [newUser] };
  }

  // SELECT FROM hazard_zones
  if (lower.startsWith('select') && lower.includes('from hazard_zones')) {
    if (lower.includes('where zone_id =') && params.length > 0) {
      const match = localStore.hazard_zones.filter(z => z.zone_id === params[0]);
      return { rows: match };
    }
    return { rows: localStore.hazard_zones };
  }

  // SELECT FROM shelters
  if (lower.startsWith('select') && lower.includes('from shelters')) {
    if (lower.includes('where primary_hashed_key') && params.length > 0) {
      const match = localStore.shelters.filter(s => s.primary_hashed_key === params[0]);
      return { rows: match };
    }
    return { rows: localStore.shelters };
  }

  // UPDATE zone_assignments
  if (lower.startsWith('update zone_assignments') && lower.includes('vote_to_resolve')) {
     const [zone_id, user_id] = params;
     const assignment = localStore.zone_assignments.find(a => a.zone_id === zone_id && a.user_id === user_id);
     if (assignment) assignment.vote_to_resolve = true;
     saveLocalStore();
     return { rows: [] };
  }

  // COUNT zone_assignments
  if (lower.startsWith('select count(*)') && lower.includes('from zone_assignments')) {
     const [zone_id] = params;
     let count = 0;
     if (lower.includes('vote_to_resolve = true')) {
         count = localStore.zone_assignments.filter(a => a.zone_id === zone_id && a.vote_to_resolve).length;
         return { rows: [{ total_votes: count }] };
     } else {
         count = localStore.zone_assignments.filter(a => a.zone_id === zone_id).length;
         return { rows: [{ total_assigned: count }] };
     }
  }

  // UPDATE hazard_zones (resolution_votes_cast)
  if (lower.startsWith('update hazard_zones') && lower.includes('resolution_votes_cast')) {
     const [totalVotes, zone_id] = params;
     const zone = localStore.hazard_zones.find(z => z.zone_id === zone_id);
     if (zone) zone.resolution_votes_cast = totalVotes;
     saveLocalStore();
     return { rows: [] };
  }

  // INSERT INTO history_red_zones & DELETE FROM hazard_zones
  if (lower.startsWith('insert into history_red_zones')) {
     const [zone_id] = params;
     const zoneIdx = localStore.hazard_zones.findIndex(z => z.zone_id === zone_id);
     if (zoneIdx >= 0) {
         const closedZone = localStore.hazard_zones.splice(zoneIdx, 1)[0];
         closedZone.is_open = false;
         closedZone.status = 'SITUATION_UNDER_CONTROL';
         localStore.history_red_zones.push(closedZone);
         saveLocalStore();
     }
     return { rows: [] };
  }

  // INSERT INTO zone_assignments
  if (lower.startsWith('insert into zone_assignments')) {
     const [zone_id, user_id, officer_name, department] = params;
     const existing = localStore.zone_assignments.find(a => a.zone_id === zone_id && a.user_id === user_id);
     if (!existing) {
         localStore.zone_assignments.push({ zone_id, user_id, officer_name, department, vote_to_resolve: false });
         saveLocalStore();
     }
     return { rows: [] };
  }
  
  // SELECT FROM zone_assignments
  if (lower.startsWith('select user_id, officer_name') && lower.includes('from zone_assignments')) {
     const [zone_id] = params;
     return { rows: localStore.zone_assignments.filter(a => a.zone_id === zone_id) };
  }

  // INSERT INTO emergency_passes
  if (lower.startsWith('insert into emergency_passes')) {
    const [pass_id, user_id, phone, assigned_shelter_id, special_needs] = params;
    const newPass = { pass_id, user_id, phone, assigned_shelter_id, special_needs, status: 'ACTIVE_RED_ZONE', created_at: new Date().toISOString() };
    localStore.emergency_passes.push(newPass);
    saveLocalStore();
    return { rows: [newPass] };
  }

  return { rows: [] };
}

async function initDB() {
    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(`
                CREATE TABLE IF NOT EXISTS users (
                    user_id TEXT PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    full_name TEXT,
                    phone TEXT,
                    user_role TEXT DEFAULT 'RESIDENT',
                    officer_mode TEXT DEFAULT 'OFF_SITE',
                    district TEXT DEFAULT 'Wayanad, Kerala',
                    family_members INTEGER DEFAULT 1,
                    has_vulnerable BOOLEAN DEFAULT false,
                    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
                )
            `);
            await client.query('COMMIT');
            console.log("[SurakshaDrishti Database] PostgreSQL connected & schemas verified!");
            pgHealthy = true;
        } catch (e) {
            await client.query('ROLLBACK');
            pgHealthy = false;
        } finally {
            client.release();
        }
    } catch (err) {
        console.warn("[SurakshaDrishti Database] PostgreSQL offline/unreachable. Resilient local fallback ACTIVE.");
        pgHealthy = false;
    }
}

initDB().catch(() => {
    pgHealthy = false;
});

const dbWrapper = {
    query: async (text, params) => {
        if (pgHealthy) {
            try {
                return await pool.query(text, params);
            } catch (err) {
                console.warn("[Database Query Warning - Supabase]", err.message, "SQL:", text.slice(0, 60));
                return executeLocalQuery(text, params);
            }
        }
        return executeLocalQuery(text, params);
    }
};

module.exports = dbWrapper;