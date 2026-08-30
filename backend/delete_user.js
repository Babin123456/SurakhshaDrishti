require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASSWORD || "password-",
    host: process.env.PG_HOST || "localhost",
    port: process.env.PG_PORT || 5432,
    database: process.env.PG_DATABASE || "instakg",
});

const targetUser = process.argv[2] || 'Tuhin_2006';

console.log(`Starting deletion process for user: ${targetUser}`);

async function deleteUser() {
    try {
        // Since we added ON DELETE CASCADE to our Postgres tables, 
        // deleting the user from 'users' will automatically wipe their chat logs, 
        // conversation participations, and reactions!
        
        const res = await pool.query(`DELETE FROM users WHERE user_id = $1`, [targetUser]);
        console.log(`Successfully deleted ${res.rowCount} user account(s) matching ${targetUser}.`);
        console.log("All associated chat logs and conversation participations were deleted via CASCADE.");
        
        // Also try to delete their ikg bot user just in case
        const botTarget = `ikg_bot_${targetUser}`;
        const botRes = await pool.query(`DELETE FROM users WHERE user_id = $1`, [botTarget]);
        if (botRes.rowCount > 0) {
            console.log(`Successfully deleted IKG bot user for ${targetUser}.`);
        }
    } catch (err) {
        console.error("Error deleting user:", err);
    } finally {
        await pool.end();
        console.log("Database connection closed safely. Deletion complete!");
    }
}

deleteUser();
