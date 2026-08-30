const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/instaKG.db");
db.all("SELECT * FROM conversation_participants;", (err, rows) => {
    console.log("Participants", rows);
});
db.all("SELECT * FROM conversations;", (err, rows) => {
    console.log("Conversations", rows);
});
