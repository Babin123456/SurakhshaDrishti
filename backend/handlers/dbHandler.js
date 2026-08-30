const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASSWORD || "password",
    host: process.env.PG_HOST || "localhost",
    port: process.env.PG_PORT || 5432,
    database: process.env.PG_DATABASE || "instakg",
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

async function initDB() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Users Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                email TEXT UNIQUE,
                password TEXT,
                bio TEXT DEFAULT '~flowing along~',
                profile_picture TEXT DEFAULT NULL,
                public_key TEXT DEFAULT NULL,
                encrypted_private_key TEXT DEFAULT NULL,
                key_salt TEXT DEFAULT NULL,
                key_iv TEXT DEFAULT NULL
            )
        `);

        // Conversations Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS conversations (
                id TEXT PRIMARY KEY,
                is_group BOOLEAN DEFAULT false,
                name TEXT DEFAULT NULL,
                created_at BIGINT NOT NULL
            )
        `);

        // Conversation Participants Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS conversation_participants (
                conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
                user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                role TEXT DEFAULT 'member',
                join_order INTEGER DEFAULT 1,
                group_public_key TEXT DEFAULT NULL,
                last_read_message_id INTEGER DEFAULT 0,
                PRIMARY KEY (conversation_id, user_id)
            )
        `);

        // Safely add new columns to existing databases
        try {
            await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '~flowing along~'`);
        } catch (e) {}
        try {
            await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT DEFAULT NULL`);
        } catch (e) {}
        try {
            await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS public_key TEXT DEFAULT NULL`);
        } catch (e) {}
        try {
            await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS encrypted_private_key TEXT DEFAULT NULL`);
        } catch (e) {}
        try {
            await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS key_salt TEXT DEFAULT NULL`);
        } catch (e) {}
        try {
            await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS key_iv TEXT DEFAULT NULL`);
        } catch (e) {}

        try {
            await client.query(`ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member'`);
        } catch (e) {}
        try {
            await client.query(`ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS join_order INTEGER DEFAULT 1`);
        } catch (e) {}
        try {
            await client.query(`ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS group_public_key TEXT DEFAULT NULL`);
        } catch (e) {}

        // Chat Logs Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS chat_logs (
                chat_id SERIAL PRIMARY KEY,
                conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
                sender_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                message TEXT NOT NULL,
                timestamp BIGINT NOT NULL
            )
        `);

        // Create index for faster chat loading (this is what I was talking about!)
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_chat_logs_convo_time 
            ON chat_logs (conversation_id, timestamp)
        `);

        // Reactions Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS message_reactions (
                chat_id INTEGER REFERENCES chat_logs(chat_id) ON DELETE CASCADE,
                user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                reaction TEXT,
                PRIMARY KEY (chat_id, user_id)
            )
        `);

        // Seed the IKG Bot user to prevent foreign key errors
        await client.query(`
            INSERT INTO users (user_id, email, password, bio) 
            VALUES ('ikg_bot', 'bot@instakg.local', 'bot_no_login', 'I am the InstaKG Bot! How can I help?')
            ON CONFLICT (user_id) DO NOTHING
        `);

        await client.query('COMMIT');
        console.log("PostgreSQL database schemas verified!");
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