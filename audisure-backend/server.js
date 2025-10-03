// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import uploadRoutes from "./routes/upload.js";
import documentsRoutes from "./routes/documents.js"; // new
import tasksRoutes from "./routes/tasks.js";
import statusRoutes from "./routes/status.js"; // documents status

import db from "./db.js"; // MySQL pool

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/status", statusRoutes);

// Test route
app.get("/", (req, res) => res.send("Audisure backend running with MySQL!"));

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Start server
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
