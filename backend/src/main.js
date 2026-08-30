//the main app
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const {handle404, masterErrorHandler, FN_verifyTkn, API_Limiter} = require("../handlers/middlewareHandler");
const profileRoutes = require("../routes/profile");
//DATABASE
const db = require("../handlers/dbHandler");

//ROUTES
const authRoutes = require("../routes/auth");
const chatRoutes = require("../routes/chat");
const feedbackRoutes = require("../routes/feedback");

const app = express();
app.set('trust proxy', 1); // Trust first proxy (solves the X-Forwarded-For rate limit error)
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../react-frontend")));

//app.use(API_Limiter(900, 100)); i dont think we need global rate limiter, but it is an option
app.use("/auth", API_Limiter(900, 5, 1), authRoutes); // 900 seconds = 15 minutes
app.use("/chat", FN_verifyTkn, API_Limiter(10, 50, 0), chatRoutes); // 30 seconds
app.use("/profile", FN_verifyTkn, API_Limiter(50, 20, 0), profileRoutes);
app.use("/feedback", FN_verifyTkn, API_Limiter(60, 5, 1), feedbackRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// error handlers
app.use(handle404);
app.use(masterErrorHandler);

//websocket integration
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

const jwt = require("jsonwebtoken");

const userSockets = new Map();
const userStatuses = new Map(); // Tracks 'online', 'away', or 'offline'

// Socket.io Authentication Middleware — verifies JWT before allowing connection
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error("Socket Auth: No token provided"));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // Attach verified user data to the socket
        next();
    } catch (err) {
        return next(new Error("Socket Auth: Invalid or expired token"));
    }
});

io.on("connection", (socket) => {
    const username = socket.user.username; // Guaranteed authentic from JWT

    userSockets.set(username, socket.id);
    userStatuses.set(username, 'online');
    console.log(`[Socket] ${username} connected with ID ${socket.id} (JWT verified)`);

    // Broadcast that this user is online
    io.emit("status_update", { username, status: 'online' });

    // Send all current statuses to this new user
    socket.emit("initial_statuses", Object.fromEntries(userStatuses));

    // Auto-join all conversation rooms for this user
    db.query(`SELECT conversation_id FROM conversation_participants WHERE user_id = $1`, [username])
        .then(result => {
            const rows = result.rows;
            rows.forEach(row => socket.join(row.conversation_id.toString()));
            console.log(`[Socket] ${username} joined ${rows.length} rooms`);
        })
        .catch(err => console.error("Socket DB Error:", err));

    socket.on("set_status", ({ status }) => {
        // No need to send username from client anymore — we KNOW who they are
        userStatuses.set(username, status);
        io.emit("status_update", { username, status });
    });

    // Allow frontend to dynamically join a new room (e.g., when starting a new chat)
    socket.on("join_room", (convo_id) => {
        socket.join(convo_id.toString());
        console.log(`[Socket] ${username} dynamically joined room ${convo_id}`);
    });

    socket.on("disconnect", () => {
        userSockets.delete(username);
        userStatuses.set(username, 'offline');
        io.emit("status_update", { username, status: 'offline' });
        console.log(`[Socket] ${username} disconnected`);
    });
});

app.set("socketio", io);
app.set("userSockets", userSockets);

server.listen(PORT, () => {
    console.log(`[INSTA-KG] is running on http://localhost:${PORT}`);
});;
