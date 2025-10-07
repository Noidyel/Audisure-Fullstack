// routes/upload.js
import express from "express";
import db from "../db.js";
import crypto from "crypto";

const router = express.Router();

// POST /api/upload - Receive Cloudinary URL and save to DB
router.post("/", async (req, res) => {
  const { user_email, document_type_id, requirement_id, file_url } = req.body;

  if (!user_email || !document_type_id || !requirement_id || !file_url) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    // Check if user exists
    const [users] = await db.execute("SELECT id FROM users WHERE email = ?", [user_email]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    const userId = users[0].id;

    // Generate short UID
    const documentUid = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Generate SHA-256 hash of URL
    const documentHash = crypto.createHash("sha256").update(file_url).digest("hex");

    // Insert into documents table
    const sql = `
      INSERT INTO documents
        (document_uid, user_id, document_type_id, requirement_id, file_path, document_hash, status, created_at)
      VALUES
        (?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;
    await db.execute(sql, [
      documentUid,
      userId,
      document_type_id,
      requirement_id,
      file_url,
      documentHash
    ]);

    res.json({
      success: true,
      message: "Document saved successfully",
      document_uid: documentUid,
      file_url,
      document_hash: documentHash
    });
  } catch (err) {
    console.error("Upload route error:", err);
    res.status(500).json({ success: false, message: "Failed to save document." });
  }
});

export default router;
