require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as current_time');
    console.log("SUCCESS! Connected to Supabase Database.");
    console.log("Database Time:", res.rows[0].current_time);
    client.release();
    process.exit(0);
  } catch (err) {
    console.error("FAILED to connect to Supabase:");
    console.error(err.message);
    process.exit(1);
  }
}

testConnection();
