const { Pool } = require("pg");

const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
      }
    : {
        user: process.env.PG_USER || "postgres",
        password: process.env.PG_PASSWORD || "password",
        host: process.env.PG_HOST || "localhost",
        port: process.env.PG_PORT || 5432,
        database: process.env.PG_DATABASE || "instakg",
        connectionTimeoutMillis: 3000,
      };

const pool = new Pool(poolConfig);

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err.message);
});

async function initDB() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        //Users Table (Dual Role: RESIDENT vs AUTHORITY + On-Site / Off-Site Officer Mode)
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
                current_geohash TEXT,
                lat DOUBLE PRECISION,
                lng DOUBLE PRECISION,
                public_key TEXT DEFAULT NULL,
                encrypted_private_key TEXT DEFAULT NULL,
                key_salt TEXT DEFAULT NULL,
                key_iv TEXT DEFAULT NULL,
                bio TEXT DEFAULT '~SurakshaDrishti User~',
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Hazard Red/Yellow/Green Zones Table (with 16-Digit Access Keys & Resolution Tracking)
        await client.query(`
            CREATE TABLE IF NOT EXISTS hazard_zones (
                zone_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                state TEXT,
                lat DOUBLE PRECISION NOT NULL,
                lng DOUBLE PRECISION NOT NULL,
                zone_type TEXT NOT NULL,
                hazard_type TEXT NOT NULL,
                risk_score INTEGER DEFAULT 0,
                geohash TEXT NOT NULL,
                population_risk INTEGER DEFAULT 0,
                radius_meters INTEGER DEFAULT 3000,
                access_key TEXT NOT NULL DEFAULT 'RZ-0000-0000-0000',
                status TEXT NOT NULL DEFAULT 'ACTIVE_RED_ZONE',
                resolution_votes_required INTEGER DEFAULT 2,
                resolution_votes_cast INTEGER DEFAULT 0,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Zone Administrator Assignments & Resolution Voting Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS zone_assignments (
                assignment_id SERIAL PRIMARY KEY,
                zone_id TEXT REFERENCES hazard_zones(zone_id) ON DELETE CASCADE,
                user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
                officer_name TEXT,
                department TEXT,
                assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                vote_to_resolve BOOLEAN DEFAULT false,
                voted_at TIMESTAMPTZ,
                UNIQUE(zone_id, user_id)
            )
        `);

        // Evacuation Shelters & Carrying Capacity Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS shelters (
                shelter_id TEXT PRIMARY KEY,
                zone_id TEXT REFERENCES hazard_zones(zone_id) ON DELETE SET NULL,
                name TEXT NOT NULL,
                lat DOUBLE PRECISION NOT NULL,
                lng DOUBLE PRECISION NOT NULL,
                capacity_total INTEGER NOT NULL,
                capacity_occupied INTEGER DEFAULT 0,
                status TEXT DEFAULT 'OPEN',
                evacuation_corridor TEXT
            )
        `);

        // QuickSign Emergency Passes (SOS Pass Tracking)
        await client.query(`
            CREATE TABLE IF NOT EXISTS emergency_passes (
                pass_id TEXT PRIMARY KEY,
                user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
                phone TEXT,
                geohash TEXT,
                lat DOUBLE PRECISION,
                lng DOUBLE PRECISION,
                assigned_shelter_id TEXT REFERENCES shelters(shelter_id) ON DELETE SET NULL,
                special_needs TEXT[],
                status TEXT DEFAULT 'ACTIVE_RED_ZONE',
                bypassed_2fa BOOLEAN DEFAULT false,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Inter-Departmental E2EE Conversations Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS e2ee_conversations (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                department TEXT DEFAULT 'INTER_DEPARTMENTAL',
                is_red_alert BOOLEAN DEFAULT false,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        `);

        //  E2EE Messages Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS e2ee_messages (
                message_id SERIAL PRIMARY KEY,
                conversation_id TEXT REFERENCES e2ee_conversations(id) ON DELETE CASCADE,
                sender_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
                encrypted_payload TEXT NOT NULL,
                iv TEXT,
                signature TEXT,
                timestamp BIGINT NOT NULL
            )
        `);

        // GSM Telemetry & Low-Bandwidth Satellite Pings
        await client.query(`
            CREATE TABLE IF NOT EXISTS gsm_telemetry_logs (
                log_id SERIAL PRIMARY KEY,
                device_id TEXT NOT NULL,
                geohash TEXT NOT NULL,
                lat DOUBLE PRECISION,
                lng DOUBLE PRECISION,
                signal_strength_dbm INTEGER,
                battery_level INTEGER,
                sos_triggered BOOLEAN DEFAULT false,
                raw_payload TEXT,
                received_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Safely add missing columns to users table if already exists
        const alterStatements = [
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS user_role TEXT DEFAULT 'RESIDENT'`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS officer_mode TEXT DEFAULT 'OFF_SITE'`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS district TEXT DEFAULT 'Wayanad, Kerala'`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS family_members INTEGER DEFAULT 1`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS has_vulnerable BOOLEAN DEFAULT false`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS current_geohash TEXT`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS public_key TEXT DEFAULT NULL`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS encrypted_private_key TEXT DEFAULT NULL`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS key_salt TEXT DEFAULT NULL`,
            `ALTER TABLE users ADD COLUMN IF NOT EXISTS key_iv TEXT DEFAULT NULL`
        ];

        for (const stmt of alterStatements) {
            try { await client.query(stmt); } catch (e) {}
        }

        // Safely add missing columns to hazard_zones if already exists
        const hazardAlterStatements = [
            `ALTER TABLE hazard_zones ADD COLUMN IF NOT EXISTS access_key TEXT NOT NULL DEFAULT 'RZ-0000-0000-0000'`,
            `ALTER TABLE hazard_zones ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ACTIVE_RED_ZONE'`,
            `ALTER TABLE hazard_zones ADD COLUMN IF NOT EXISTS resolution_votes_required INTEGER DEFAULT 2`,
            `ALTER TABLE hazard_zones ADD COLUMN IF NOT EXISTS resolution_votes_cast INTEGER DEFAULT 0`
        ];
        for (const stmt of hazardAlterStatements) {
            try { await client.query(stmt); } catch (e) {}
        }

        // Seed Default Red Zones with 16-Digit Access Keys
        await client.query(`
            INSERT INTO hazard_zones (zone_id, name, state, lat, lng, zone_type, hazard_type, risk_score, geohash, population_risk, radius_meters, access_key, status, resolution_votes_required)
            VALUES 
                ('RZ-WAYANAD-04', 'Wayanad Hill Slope (Sector 4)', 'Kerala', 11.6854, 76.1320, 'RED', 'LANDSLIDE', 94, 't1829abc', 1420, 3500, 'RZ-89A4-91F2-3B7C', 'ACTIVE_RED_ZONE', 2),
                ('RZ-JOSHIMATH-02', 'Joshimath Slope Sector B', 'Uttarakhand', 30.5564, 79.5659, 'RED', 'SUBSIDENCE', 88, 't2912xyz', 2850, 4200, 'RZ-41C2-88E0-99A1', 'ACTIVE_RED_ZONE', 3),
                ('RZ-TEESTA-07', 'Teesta Riverbank Sector 7', 'Sikkim', 27.0883, 88.2609, 'YELLOW', 'FLASH_FLOOD', 76, 't3819mno', 3100, 2800, 'RZ-73F9-22D4-55B8', 'ACTIVE_RED_ZONE', 2)
            ON CONFLICT (zone_id) DO NOTHING
        `);

        // Seed Default Command Center Accounts
        await client.query(`
            INSERT INTO users (user_id, email, password, full_name, user_role, officer_mode) 
            VALUES 
                ('ndrf_admin', 'ndrf.command@mha.gov.in', '$2b$10$w09ZkF2xO59lU22qj4A24u7s2h/k8q5d/Z71d.a6f4s8b9c1d2e3f', 'NDRF Commander Chief', 'NDRF', 'OFF_SITE'),
                ('sdma_officer', 'sdma.kerala@gov.in', '$2b$10$w09ZkF2xO59lU22qj4A24u7s2h/k8q5d/Z71d.a6f4s8b9c1d2e3f', 'SDMA Regional Officer', 'SDMA', 'ON_SITE')
            ON CONFLICT (user_id) DO NOTHING
        `);

        await client.query('COMMIT');
        console.log("PostgreSQL SurakshaDrishti database schemas verified!");
    } catch (e) {
        await client.query('ROLLBACK');
        console.error("Failed to initialize DB schemas:", e);
        throw e;
    } finally {
        client.release();
    }
}

// Automatically initialize the DB on load
initDB().catch(err => console.error(err));

module.exports = pool;