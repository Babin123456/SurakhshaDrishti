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
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use(express.static(path.join(__dirname, "../../frontend")));

app.get("/", (req, res) => {
  res.json({ success: true, message: "SurakshaDrishti API Server is running on port " + PORT });
});

//app.use(API_Limiter(900, 100)); // global rate limiter disabled
app.use("/auth", API_Limiter(60, 50, 1), authRoutes); // 60 seconds, 50 requests
app.use("/api/auth", API_Limiter(60, 50, 1), authRoutes);
app.use("/chat", FN_verifyTkn, API_Limiter(10, 500, 0), chatRoutes); // 10 seconds, 500 requests
app.use("/profile", FN_verifyTkn, API_Limiter(10, 50, 0), profileRoutes); // 10 seconds, 50 requests
app.use("/feedback", FN_verifyTkn, API_Limiter(60, 50, 1), feedbackRoutes); // 60 seconds, 50 requests
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// error handlers
app.use(handle404);
app.use(masterErrorHandler);

// WebSocket integration for Real-Time Emergency Alerts & Red Zone Telemetry
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

const jwt = require("jsonwebtoken");

// Socket.io Authentication Middleware — verifies JWT if provided
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        socket.user = { role: 'GUEST' };
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    } catch (err) {
        socket.user = { role: 'GUEST' };
        next();
    }
});

io.on("connection", (socket) => {
    console.log(`[Socket] Client connected: ${socket.id} (Role: ${socket.user?.role || 'GUEST'})`);

    // Dynamic room join for emergency channels / sector geohashes
    socket.on("join_sector", (geohash) => {
        socket.join(geohash);
        console.log(`[Socket] ${socket.id} joined disaster sector room: ${geohash}`);
    });

    // Emergency telemetry ping from client
    socket.on("emergency_ping", (data) => {
        io.emit("red_zone_alert", {
            ...data,
            timestamp: new Date().toISOString()
        });
    });

    socket.on("disconnect", () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
});

app.set("socketio", io);

server.listen(PORT, () => {
    console.log(`[SurakshaDrishti API] running on http://localhost:${PORT}`);
});
