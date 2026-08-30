require('dotenv').config();
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASSWORD || "password-",
    host: process.env.PG_HOST || "localhost",
    port: process.env.PG_PORT || 5432,
    database: process.env.PG_DATABASE || "instakg",
});

const targetUser = "Kaushik";
const newPassword = "password";

async function resetPassword() {
    try {
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the database
        const res = await pool.query(`UPDATE users SET password = $1 WHERE user_id = $2`, [hashedPassword, targetUser]);
        
        if (res.rowCount === 0) {
            console.log(`User '${targetUser}' not found in the database.`);
        } else {
            console.log(`Successfully reset password for user '${targetUser}'. You can now login with '${newPassword}'.`);
        }
    } catch (error) {
        console.error("Error hashing password:", error);
    } finally {
        await pool.end();
    }
}

resetPassword();
