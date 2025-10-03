import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all documents
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT d.document_uid AS id,
             u.first_name AS firstName,
             u.last_name AS lastName,
             d.file_path,
             d.document_hash,
             d.created_at,
             d.title
      FROM documents d
      JOIN users u ON d.user_id = u.id
      ORDER BY d.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("SQL Error in /api/documents:", err);
    res.status(500).json({ success: false, message: "Failed to fetch documents" });
  }
});

// Update document status
router.put("/update-status/:document_uid", async (req, res) => {
  const { document_uid } = req.params;
  const { status, changed_by } = req.body;

  if (!status || !changed_by) {
    return res.status(400).json({ success: false, message: "Missing status or changed_by" });
  }

  try {
    await db.query(`
      INSERT INTO documents_statuses (document_uid, status, updated_at, changed_by)
      VALUES (?, ?, NOW(), ?)
    `, [document_uid, status, changed_by]);

    res.json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    console.error("SQL Error updating status:", err);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

export default router;
