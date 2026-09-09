const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path')
const db = require('../handlers/dbHandler');

const uploadDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = req.user.username + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});

const upload = multer({storage:storage});
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT bio, profile_picture FROM users WHERE user_id = $1`, [req.user.username]);
        const user = result.rows[0];
        res.status(200).json({
            success: true,
            bio_text: user ? user.bio : null,
            pfp: user ? user.profile_picture : null
        });
    } catch (err) {
        console.error("Profile GET error:", err);
        return res.status(500).json({error: "Internal server error in backend"});
    }
});

// Fetch public profile of ANY user
router.get('/user/:username', async (req, res, next) => {
    const targetUser = req.params.username;
    
    try {
        const result = await db.query(`SELECT user_id, bio, profile_picture FROM users WHERE user_id = $1`, [targetUser]);
        const user = result.rows[0];
        if(!user) {
            return res.status(404).json({error: "User not found"});
        }
        res.status(200).json({
            success: true,
            user_id: user.user_id,
            bio_text: user.bio,
            pfp: user.profile_picture
        });
    } catch (err) {
        console.error("Public profile GET error:", err);
        return res.status(500).json({error: "Internal server error"});
    }
});

router.post('/bio', async (req, res, next) => {
    const {bio_msg} = req.body;
    const username = req.user.username;

    try {
        await db.query('UPDATE users SET bio = $1 WHERE user_id = $2', [bio_msg, username]);
        return res.status(200).json({message: "Bio Updated!"}); //a popup seuqence 
    } catch (err) {
        console.error("Update bio error:", err);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

router.post('/pfp', upload.single('profile_picture'), async (req, res, next) =>{
    const username = req.user.username;

    if(!req.file){
        return res.status(400).json({error: "No image was provided"})
    }

    const fileName = req.file.filename;
    const pfpURL = `/uploads/profiles/${fileName}`;

    try {
        await db.query(`UPDATE users SET profile_picture = $1 WHERE user_id = $2`, [pfpURL, username]);
        res.status(200).json({message: "Profile Picture change was sucessful"})
    } catch (err) {
        console.error("Update pfp error:", err);
        return res.status(500).json({error: "Internal server Error, DB unresponsive..."})
    }
});

module.exports = router;