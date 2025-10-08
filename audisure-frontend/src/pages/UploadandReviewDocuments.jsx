import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/upload_documents.css";
import "../styles/userdashboard-features.css";

const BASE_URL = "https://audisure-backend.onrender.com/api";

export default function UploadAndReviewDocuments() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [reviewDocs, setReviewDocs] = useState([]);
  const [loadingReview, setLoadingReview] = useState(false);
  const [selectedType, setSelectedType] = useState("All");

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
      const res = await axios.get(`${BASE_URL}/documents`);
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

  // Group documents by type
  const groupedDocs = {
    ECC: reviewDocs.filter(doc => doc.title.toUpperCase().startsWith("ECC")),
    WCC: reviewDocs.filter(doc => doc.title.toUpperCase().startsWith("WCC")),
    SHC: reviewDocs.filter(doc => doc.title.toUpperCase().startsWith("SHC")),
  };

  // Filtered based on dropdown selection
  const displayedGroups = selectedType === "All" ? groupedDocs : { [selectedType]: groupedDocs[selectedType] };

  const renderDocTable = (docs, label) => {
    if (!docs || docs.length === 0) return <p>No documents for {label}.</p>;

    return (
      <table className="review-table">
        <thead>
          <tr>
            <th>Applicant Email</th>
            <th>Document UID</th>
            <th>Title</th>
            <th>URL</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {docs.map(doc => (
            <tr key={doc.document_uid}>
              <td>{doc.user_email}</td>
              <td>{doc.document_uid}</td>
              <td>{doc.title}</td>
              <td>
                <a href={doc.url} target="_blank" rel="noopener noreferrer">View</a>
              </td>
              <td>{doc.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

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

        {/* Dropdown filter */}
        <div className="filter-dropdown">
          <label htmlFor="docTypeSelect">Filter by Application Type: </label>
          <select
            id="docTypeSelect"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="All">All</option>
            <option value="ECC">Electrification Clearance (ECC)</option>
            <option value="WCC">Water Certification Clearance (WCC)</option>
            <option value="SHC">Socialized Housing/Condo (SHC)</option>
          </select>
        </div>

        {loadingReview ? (
          <p>Loading documents...</p>
        ) : reviewDocs.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          Object.entries(displayedGroups).map(([type, docs]) => (
            <div key={type}>
              <h3>
                {type === "ECC" && "Electrification Clearance (ECC)"}
                {type === "WCC" && "Water Certification Clearance (WCC)"}
                {type === "SHC" && "Socialized Housing/Condo (SHC)"}
              </h3>
              {renderDocTable(docs, type)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
