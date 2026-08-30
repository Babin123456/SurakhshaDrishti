const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../database/instaKG.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
        process.exit(1);
    }
    console.log("Connected to the SQLite database.");
});

db.serialize(() => {
    db.run("DELETE FROM chat_logs", (err) => {
        if (err) {
            console.error("Error clearing chat_logs:", err.message);
        } else {
            console.log("Successfully cleared chat_logs table.");
        }
    });

    db.run("DELETE FROM users", (err) => {
        if (err) {
            console.error("Error clearing users:", err.message);
        } else {
            console.log("Successfully cleared users table.");
        }
    });

    // Reset auto-increment sequence counters if they exist
    db.run("DELETE FROM sqlite_sequence WHERE name='chat_logs'", (err) => {
        if (err) {
            // It's okay if this table/row doesn't exist yet
        } else {
            console.log("Reset autoincrement sequence for chat_logs.");
        }
    });
});

db.close((err) => {
    if (err) {
        console.error("Error closing database connection:", err.message);
    } else {
        console.log("Closed the database connection.");
    }
});
