// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";
import documentsRoutes from "./routes/documents.js";
import tasksRoutes from "./routes/tasks.js";
import statusRoutes from "./routes/status.js";

import db from "./db.js"; // MySQL connection pool

dotenv.config();
const app = express();

// =========================
// ✅ CORS Configuration
// =========================
const allowedOrigins = [
  "https://audisure-frontend.onrender.com", // your deployed frontend URL
  "http://localhost:3000",                  // for local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Handle preflight requests globally
app.options("*", cors());

// =========================
// Middleware
// =========================
app.use(express.json());

// =========================
// Routes
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/status", statusRoutes);

// =========================
// Root Landing Page
// =========================
app.get("/", (req, res) => {
  res.send(`
    <div style="font-family: Arial, sans-serif; padding: 2rem; text-align: center;">
      <h1>🚀 Audisure API</h1>
      <p>Status: <strong style="color: green;">Online</strong></p>
      <p>Database: <strong>MySQL Connected ✅</strong></p>
      <p>Version: 1.0.0</p>
      <h3>Available Routes:</h3>
      <ul style="list-style: none; padding: 0;">
        <li><a href="/api/auth">/api/auth</a></li>
        <li><a href="/api/admin">/api/admin</a></li>
        <li><a href="/api/upload">/api/upload</a></li>
        <li><a href="/api/documents">/api/documents</a></li>
        <li><a href="/api/tasks">/api/tasks</a></li>
        <li><a href="/api/status">/api/status</a></li>
      </ul>
    </div>
  `);
});

// =========================
// 404 Handler
// =========================
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// =========================
// Start Server
// =========================
const startServer = async () => {
  try {
    // Test MySQL connection
    const connection = await db.getConnection();
    connection.release();
    console.log("✅ MySQL Database connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
