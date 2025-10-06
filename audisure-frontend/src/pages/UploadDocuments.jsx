import React, { useState } from "react";
import axios from "axios";
import "../styles/upload_documents.css";
import "../styles/userdashboard-features.css";

export default function UploadDocuments() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);

  const userEmail = localStorage.getItem("userEmail");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setUploadedDoc(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("⚠️ Please select a file first.");
    if (!userEmail) return setMessage("User email not available.");

    const formData = new FormData();
    formData.append("document", file);
    formData.append("user_email", userEmail);

    try {
      setUploading(true);
      setMessage("");

      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setMessage("✅ File uploaded successfully!");
        setUploadedDoc({
          uid: res.data.document_uid,
          title: file.name,
          url: res.data.url,
          fileType: file.name.split(".").pop().toLowerCase(),
        });
        setFile(null);
      } else {
        setMessage(res.data.message || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1 className="feature-header">📤 Upload Your Documents</h1>
<p className="feature-description">
  This is where you can upload your required documents for verification and approval.  
  Make sure your files are clear and readable — accepted formats include PDF, JPG, and PNG.
</p>

      <form onSubmit={handleUpload} className="upload-form">
        <label htmlFor="file-upload" className="file-label">
          {file ? (
            <span className="file-name">📄 {file.name}</span>
          ) : (
            <>
              <span className="file-icon">📁</span>
              <span className="file-text">Click to select or drag a file here</span>
            </>
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="file-input"
        />

        <button type="submit" className="btn btn-red" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      </form>

      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar"></div>
        </div>
      )}

      {message && <p className="upload-message">{message}</p>}

      {uploadedDoc && (
        <div className="uploaded-info">
          <h3>📁 Uploaded Document Details</h3>
          <p><strong>Document UID:</strong> {uploadedDoc.uid}</p>
          <p><strong>Title:</strong> {uploadedDoc.title}</p>
          <p>
            <strong>Cloudinary URL:</strong>{" "}
            <a href={uploadedDoc.url} target="_blank" rel="noopener noreferrer">
              {uploadedDoc.url}
            </a>
          </p>
          <p><strong>File Type:</strong> {uploadedDoc.fileType}</p>
        </div>
      )}
    </div>
  );
}
