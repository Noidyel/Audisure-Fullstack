// routes/upload.js
import express from "express";
import multer from "multer";
import db from "../db.js";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to generate 6-character alphanumeric UID
const generateShortUID = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Function to generate SHA-256 hash
const generateHash = (data) => {
  return crypto.createHash("sha256").update(data).digest("hex");
};

// POST /api/upload - Upload a document
router.post("/", upload.single("document"), async (req, res) => {
  const { user_email } = req.body;
  if (!user_email)
    return res.status(400).json({ success: false, message: "User email not provided." });
  if (!req.file)
    return res.status(400).json({ success: false, message: "No file uploaded." });

  try {
    // Upload file buffer to Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(fileBuffer);
      });
    };

    const result = await streamUpload(req.file.buffer);

    // Generate short 6-character UID
    const documentUid = generateShortUID();

    // Generate SHA-256 hash of the file URL (immutable reference)
    const documentHash = generateHash(result.secure_url);

    // Get the file extension from the original file name
    const fileType = req.file.originalname.split('.').pop().toLowerCase();

    // Insert into documents table
    const sql = `
  INSERT INTO documents (document_uid, user_id, title, file_type, file_path, document_hash, created_at)
  VALUES (?, (SELECT id FROM users WHERE email = ?), ?, ?, ?, ?, NOW())
`;
await db.execute(sql, [
  documentUid,
  user_email,
  req.file.originalname,
  fileType,
  result.secure_url,
  documentHash
]);

    res.json({
      success: true,
      message: "Document uploaded successfully",
      url: result.secure_url,
      document_uid: documentUid,
      document_hash: documentHash
    });
  } catch (err) {
    console.error("Upload route error:", err);
    res.status(500).json({ success: false, message: "Failed to upload document." });
  }
});

export default router;
