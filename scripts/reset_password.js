require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    console.log("Hashing new password...");
    const hashedPassword = await bcrypt.hash('Password123', 10);
    
    console.log("Updating password for babinbid3@gmail.com...");
    const res = await client.query(
      "UPDATE users SET password = $1 WHERE email = $2 RETURNING email",
      [hashedPassword, 'babinbid3@gmail.com']
    );
    
    if (res.rowCount > 0) {
      console.log("Password updated successfully for: " + res.rows[0].email);
    } else {
      console.log("User not found!");
    }
  } catch (err) {
    console.error("Failed to update password:", err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
