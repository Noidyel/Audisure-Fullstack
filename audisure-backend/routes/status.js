// status.js
import express from "express";
import db from "../db.js";

const router = express.Router();

// GET: fetch documents + latest status for a user by query param ?user_id=xxx
router.get("/", async (req, res) => {
  const { user_id } = req.query; // expects ?user_id=1
  if (!user_id) {
    return res.status(400).json({ success: false, message: "Missing user_id parameter" });
  }

  try {
    const sql = `
      SELECT d.document_uid, d.title, d.created_at,
        (SELECT ds.status
         FROM documents_statuses ds
         WHERE ds.document_uid = d.document_uid
         ORDER BY ds.updated_at DESC
         LIMIT 1) AS status
      FROM documents d
      WHERE d.user_id = ?
      ORDER BY d.created_at DESC
    `;

    const [documents] = await db.query(sql, [user_id]);
    res.json({ success: true, documents });
  } catch (err) {
    console.error("Fetch documents error, documents have error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
