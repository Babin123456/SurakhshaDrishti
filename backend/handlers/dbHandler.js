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

        //Hazard Red/Yellow/Green Zones Table
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
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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