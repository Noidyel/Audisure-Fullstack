// routes/upload.js
import express from "express";
import db from "../db.js";

const router = express.Router();

// POST /api/upload - Receive Cloudinary URL and save to DB
router.post("/", async (req, res) => {
  const { user_email, document_type_id, requirement_id, file_url } = req.body;

  if (!user_email || !document_type_id || !requirement_id || !file_url) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    // Generate short 6-character UID
    const documentUid = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Insert into documents table
    const sql = `
      INSERT INTO documents 
        (document_uid, user_id, document_type_id, requirement_id, file_path, status, created_at) 
      VALUES 
        (?, (SELECT id FROM users WHERE email = ?), ?, ?, ?, 'pending', NOW())
    `;
    await db.execute(sql, [
      documentUid,
      user_email,
      document_type_id,
      requirement_id,
      file_url
    ]);

    res.json({
      success: true,
      message: "Document saved successfully",
      document_uid: documentUid,
      file_url
    });
  } catch (err) {
    console.error("Upload route error:", err);
    res.status(500).json({ success: false, message: "Failed to save document." });
  }
});

export default router;
