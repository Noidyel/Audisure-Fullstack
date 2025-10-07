// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";
import documentsRoutes from "./routes/documents.js";
import tasksRoutes from "./routes/tasks.js";
import statusRoutes from "./routes/status.js";

import db from "./db.js";

dotenv.config();
const app = express();

// Get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// ================================
// SECURITY HEADERS FOR ALL ROUTES
// ================================
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; img-src 'self' https://res.cloudinary.com data:; font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'self'; base-uri 'self';"
  );
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), accelerometer=(), gyroscope=(), magnetometer=(), usb=()"
  );
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// ================================
// API Routes
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/status", statusRoutes);

// ================================
// Serve React frontend build
// ================================
const buildPath = path.join(__dirname, "../audisure-frontend/build");
app.use(express.static(buildPath));

// Fallback: send index.html for any non-API route
app.get("/*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// ================================
// Start server
// ================================
const startServer = async () => {
  try {
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
