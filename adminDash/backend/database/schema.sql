--USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    user_role TEXT DEFAULT 'RESIDENT', -- RESIDENT, SDMA, NDRF, FIRE, POLICE
    officer_mode TEXT DEFAULT 'OFF_SITE',
    district TEXT DEFAULT 'Wayanad, Kerala',
    coordinates NUMERIC[] NOT NULL DEFAULT '{28.6448, 77.2167}',
    family_members INTEGER DEFAULT 1,
    has_vulnerable BOOLEAN DEFAULT false,
    public_key TEXT, -- Added for E2EE Identity Key
    profile_picture TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- HAZARD ZONES (Red Zones / Yellow Zones)
CREATE TABLE IF NOT EXISTS hazard_zones (
    zone_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    radius NUMERIC NOT NULL, --predicted affecting radius
    zone_type TEXT DEFAULT 'RED',
    hazard_type TEXT,
    risk_score INTEGER,
    geohash TEXT,
    population_risk INTEGER,
    radius_meters INTEGER,
    access_key TEXT NOT NULL, -- 16-Digit Security Key
    status TEXT DEFAULT 'ACTIVE_RED_ZONE',
    resolution_votes_required INTEGER DEFAULT 2,
    resolution_votes_cast INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- HISTORY RED ZONES (Archived Zones)
CREATE TABLE IF NOT EXISTS history_red_zones (
    zone_id TEXT PRIMARY KEY,
    archived_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    assigned_mem TEXT[] NOT NULL
);

-- ZONE ASSIGNMENTS (Field Officers assigned to a zone)
CREATE TABLE IF NOT EXISTS zone_assignments (
    assignment_id SERIAL PRIMARY KEY,
    zone_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    officer_name TEXT,
    department TEXT,
    vote_to_resolve BOOLEAN DEFAULT false,
    voted_at TIMESTAMPTZ,
    assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(zone_id, user_id),
    FOREIGN KEY (zone_id) REFERENCES hazard_zones(zone_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- SHELTERS / SAFEHOUSE CAPACITIES
CREATE TABLE IF NOT EXISTS shelters (
    shelter_id TEXT PRIMARY KEY,
    zone_id TEXT,
    primary_hashed_key TEXT,
    name TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    capacity_total INTEGER NOT NULL,
    capacity_occupied INTEGER DEFAULT 0,
    status TEXT DEFAULT 'OPEN',
    evacuation_corridor TEXT,

    FOREIGN KEY (zone_id) REFERENCES hazard_zones(zone_id)
);

-- EMERGENCY PASSES (Citizen SOS / Quick Signups)
CREATE TABLE IF NOT EXISTS emergency_passes (
    pass_id TEXT PRIMARY KEY,
    user_id TEXT,
    phone TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    assigned_shelter_id TEXT,
    special_needs TEXT,
    status TEXT DEFAULT 'ACTIVE_RED_ZONE',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- E2EE CHAT & SECURE RELAY TABLES
-- ==========================================

-- CONVERSATIONS (Groups & Direct Messages)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY,
    is_group BOOLEAN DEFAULT false,
    name TEXT,
    created_at BIGINT
);

-- ONVERSATION PARTICIPANTS
CREATE TABLE IF NOT EXISTS conversation_participants (
    id SERIAL PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(user_id) ON DELETE CASCADE,
    role TEXT DEFAULT 'onsite', -- admin, ondesk, onsite
    join_order INTEGER,
    group_public_key TEXT, -- For Group Diffie-Hellman Key Exchange
    last_read_message_id INTEGER DEFAULT 0,
    UNIQUE(conversation_id, user_id)
);

-- CHAT LOGS
CREATE TABLE IF NOT EXISTS chat_logs (
    chat_id SERIAL PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id TEXT,
    message TEXT NOT NULL, -- Encrypted AES-GCM Payload
    timestamp BIGINT
);

-- MESSAGE REACTIONS
CREATE TABLE IF NOT EXISTS message_reactions (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chat_logs(chat_id) ON DELETE CASCADE,
    user_id TEXT,
    reaction TEXT,
    UNIQUE(chat_id, user_id)
);

-- ==========================================
-- AI & TELEMETRY LOGS
-- ==========================================

-- AI PREDICTION HISTORY (Logs of proactive Red Zone triggers)
CREATE TABLE IF NOT EXISTS ai_prediction_history (
    prediction_id SERIAL PRIMARY KEY,
    zone_id TEXT REFERENCES hazard_zones(zone_id),
    predicted_hazard TEXT NOT NULL,
    lat NUMERIC NOT NULL,
    lng NUMERIC NOT NULL,
    radius NUMERIC NOT NULL,
    trigger_reasoning TEXT,
    confidence_score NUMERIC,
    status TEXT DEFAULT 'TRIGGERED', -- TRIGGERED, FALSE_ALARM, VALIDATED
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
