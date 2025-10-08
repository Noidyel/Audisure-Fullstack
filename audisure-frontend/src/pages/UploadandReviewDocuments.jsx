import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/upload_documents.css";
import "../styles/userdashboard-features.css";

const BASE_URL = "https://audisure-backend.onrender.com/api"; // Use your deployed backend

export default function UploadAndReviewDocuments() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [reviewDocs, setReviewDocs] = useState([]);
  const [loadingReview, setLoadingReview] = useState(false);

  const userEmail = localStorage.getItem("userEmail");

  /** ---------------------- UPLOAD PART ---------------------- **/
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

      const res = await axios.post(`${BASE_URL}/upload`, formData, {
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
        fetchReviewDocs(); // Refresh review list after upload
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

  /** ---------------------- REVIEW PART ---------------------- **/
  const fetchReviewDocs = async () => {
    try {
      setLoadingReview(true);
      const res = await axios.get(`${BASE_URL}/documents`); // Fetch all applicant uploads
      if (res.data.success) {
        setReviewDocs(res.data.documents);
      } else {
        console.error("Failed to fetch documents:", res.data.message);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoadingReview(false);
    }
  };

  useEffect(() => {
    fetchReviewDocs();
  }, []);

  return (
    <div className="upload-container">
      <h1 className="feature-header">📤 Upload & 📑 Review Documents</h1>
      <p className="feature-description">
        Upload documents for verification or review the documents submitted by applicants.
      </p>

      {/* ---------------------- UPLOAD FORM ---------------------- */}
      <div className="upload-section">
        <h2>Upload Document</h2>
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

      {/* ---------------------- REVIEW DOCUMENTS ---------------------- */}
      <div className="review-section">
        <h2>Review Uploaded Documents</h2>
        {loadingReview ? (
          <p>Loading documents...</p>
        ) : reviewDocs.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <div className="documents-list">
            {reviewDocs.map((doc) => (
              <div key={doc.document_uid} className="document-card">
                <p><strong>Applicant Email:</strong> {doc.user_email}</p>
                <p><strong>Document UID:</strong> {doc.document_uid}</p>
                <p><strong>Title:</strong> {doc.title}</p>
                <p>
                  <strong>URL:</strong>{" "}
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    View Document
                  </a>
                </p>
                <p><strong>Status:</strong> {doc.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
