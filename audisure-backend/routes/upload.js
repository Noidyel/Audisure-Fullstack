// routes/upload.js
import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  let { user_email, document_type_id, requirement_id, file_url } = req.body;

  // quick defaults for dev/testing
  if (!user_email) user_email = null; // we'll check database presence below
  document_type_id = document_type_id ?? 0; // allow 0 as placeholder
  requirement_id = requirement_id ?? 0;

  if (!file_url) {
    return res.status(400).json({ success: false, message: "Missing file_url." });
  }

  try {
    // If user_email not provided, try to insert with NULL user_id (or you may reject)
    // Lookup user id (if email provided)
    let userId = null;
    if (user_email) {
      const [rows] = await db.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [user_email]);
      if (rows && rows.length > 0) {
        userId = rows[0].id;
      } else {
        // user not found: for dev/testing we let userId be NULL; alternatively, return error
        console.warn("upload: user email not found:", user_email);
      }
    }

    // Generate short UID
    const documentUid = Math.random().toString(36).substring(2, 8).toUpperCase();

    const sql = `
      INSERT INTO documents
        (document_uid, user_id, document_type_id, requirement_id, file_path, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'pending', NOW())
    `;

    // Note: if userId is null, pass null so DB gets NULL user_id
    await db.execute(sql, [
      documentUid,
      userId,
      document_type_id,
      requirement_id,
      file_url
    ]);

    return res.json({
      success: true,
      message: "Document saved (dev-mode)",
      document_uid: documentUid,
      file_url
    });
  } catch (err) {
    console.error("Upload route error:", err);
    res.status(500).json({ success: false, message: "Failed to save document." });
  }
});

export default router;
