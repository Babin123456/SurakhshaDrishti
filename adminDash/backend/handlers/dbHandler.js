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

let pgHealthy = false;
let retryCount = 0;
const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 5000;

pool.on('error', (err) => {
    console.error('[PostgreSQL Pool Error]', err.message);
    pgHealthy = false;
});

async function initDB() {
    try {
        const client = await pool.connect();
        try {
            console.log("[SurakshaDrishti Database] Connecting to PostgreSQL/Supabase...");
            
            // Execute schema.sql directly to fix Bug 2.2
            const schemaPath = path.join(__dirname, "../database/schema.sql");
            if (fs.existsSync(schemaPath)) {
                const schemaSql = fs.readFileSync(schemaPath, "utf-8");
                await client.query('BEGIN');
                await client.query(schemaSql);
                await client.query('COMMIT');
                console.log("[SurakshaDrishti Database] PostgreSQL connected & all schemas verified!");
            } else {
                console.warn("[SurakshaDrishti Database] schema.sql not found! Skipping DDL.");
            }
            
            pgHealthy = true;
            retryCount = 0; // Reset retries on successful connect
        } catch (e) {
            await client.query('ROLLBACK');
            console.error("[SurakshaDrishti Database] Schema execution failed:", e.message);
            pgHealthy = false;
            throw e;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error(`[SurakshaDrishti Database] PostgreSQL offline/unreachable: ${err.message}`);
        pgHealthy = false;
        
        // Self-Healing Retry to fix Bug 2.3
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`[SurakshaDrishti Database] Retrying connection in ${RETRY_DELAY_MS / 1000} seconds... (Attempt ${retryCount}/${MAX_RETRIES})`);
            setTimeout(initDB, RETRY_DELAY_MS);
        } else {
            console.error("[SurakshaDrishti Database] Max retries reached. Database is offline. Application may crash on queries.");
        }
    }
}

initDB();

const dbWrapper = {
    query: async (text, params) => {
        if (!pgHealthy) {
            throw new Error("Database is currently offline. Please wait for reconnection.");
        }
        return await pool.query(text, params);
    },
    getPool: () => pool
};

module.exports = dbWrapper;