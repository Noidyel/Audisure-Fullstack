// routes/upload.js
import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  let { user_email, title, file_url, file_type, document_type_id, requirement_id } = req.body;

  if (!file_url) {
    return res.status(400).json({ success: false, message: "Missing file_url." });
  }

  try {
    // Get user ID if email is provided
    let userId = null;
    if (user_email) {
      const [rows] = await db.execute(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [user_email]
      );
      if (rows.length > 0) userId = rows[0].id;
    }

    // Generate short UID
    const documentUid = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Insert columns that exist in your documents table
    // Web might send document_type_id & requirement_id, app sends title/file_type
    const sql = `
      INSERT INTO documents
        (document_uid, user_id, title, file_path, file_type, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const dbTitle = title || (document_type_id ? `DocumentType${document_type_id}` : "Untitled Document");
    const dbFileType = file_type || "pdf";

    await db.execute(sql, [documentUid, userId, dbTitle, file_url, dbFileType]);

    res.json({
      success: true,
      message: "Document saved",
      document_uid: documentUid,
      file_url,
    });
  } catch (err) {
    console.error("Upload route error:", err);
    res.status(500).json({ success: false, message: "Failed to save document." });
  }
});

export default router;
