// routes/documents_meta.js
import express from "express";
import db from "../db.js"; // MySQL promise pool

const router = express.Router();

// GET all document types
router.get("/types", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM document_types");
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all document requirements
router.get("/requirements", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM document_requirements");
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
