import express from "express";
import db from "../db.js"; // your MySQL connection

const router = express.Router();

// GET all document types
router.get("/types", (req, res) => {
  const sql = "SELECT * FROM document_types";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(results);
  });
});

// GET all document requirements
router.get("/requirements", (req, res) => {
  const sql = "SELECT * FROM document_requirements";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(results);
  });
});

export default router;
