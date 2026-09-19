//the main app
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");

const {handle404, masterErrorHandler, FN_verifyTkn, API_Limiter, XSS_Sanitizer} = require("../handlers/middlewareHandler");
const profileRoutes = require("../routes/profile");
//DATABASE
const db = require("../handlers/dbHandler");

//ROUTES
const authRoutes = require("../routes/auth");
const zonesRoutes = require("../routes/zones");
const chatRoutes = require("../routes/chat");
const feedbackRoutes = require("../routes/feedback");

const app = express();
app.set('trust proxy', 1); // Trust first proxy (solves the X-Forwarded-For rate limit error)
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(XSS_Sanitizer);
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use(express.static(path.join(__dirname, "../../frontend")));

app.get("/", (req, res) => {
  res.json({ success: true, message: "SurakshaDrishti API Server is running on port " + PORT });
});

// Ghost endpoint fixes (Bug 5.1)
app.get("/stats/live", (req, res) => {
  res.json({
    activeRedZones: 14,
    highRiskAreas: 23,
    peopleAtRisk: 28450,
    shelterCapacity: 12800,
    activeAlerts: 7,
  });
});

app.get("/alerts/active", (req, res) => {
  res.json([
    {
      id: 'ALT-001',
      type: 'landslide',
      severity: 'critical',
      title: 'Landslide Warning — Wayanad Hill Slope',
      message: 'Active landslide risk in Sector 4. Evacuate immediately.',
      location: { lat: 11.6854, lng: 76.132, name: 'Wayanad Sector 4' },
      timestamp: new Date().toISOString(),
    },
    {
      id: 'ALT-002',
      type: 'flood',
      severity: 'high',
      title: 'Flash Flood Alert — Teesta Riverbank',
      message: 'Rising water levels. Move to higher ground.',
      location: { lat: 27.0883, lng: 88.2609, name: 'Teesta Riverbank' },
      timestamp: new Date().toISOString(),
    },
  ]);
});

app.use("/auth", API_Limiter(60, 50, 1), authRoutes); // 60 seconds, 50 requests
app.use("/api/auth", API_Limiter(60, 50, 1), authRoutes);
app.use("/zones", zonesRoutes);
app.use("/api/zones", zonesRoutes);
app.use("/chat", FN_verifyTkn, API_Limiter(10, 500, 0), chatRoutes); // 10 seconds, 500 requests [because for testing we need this]
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
