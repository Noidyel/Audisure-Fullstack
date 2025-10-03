import express from "express";
import db from "../db.js"; // Make sure this is correct

const router = express.Router();

// GET: fetch documents + latest status for a user by user_id
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
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

    const [documents] = await db.query(sql, [userId]);
    res.json({ success: true, documents });
  } catch (err) {
    console.error("Fetch documents error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
