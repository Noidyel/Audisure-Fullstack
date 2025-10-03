import React, { useState } from "react";
import axios from "axios";
import "../styles/user_styles.css";

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
    if (!file) return setMessage("Please select a file first.");
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
        setMessage("File uploaded successfully!");
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
      setMessage("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="feature-container">
      <h2>Upload Document</h2>

      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" className="btn btn-red">Upload</button>
      </form>

      {uploading && (
        <div className="uploading-bar">
          <div></div>
        </div>
      )}

      {message && <p>{message}</p>}

      {uploadedDoc && (
        <div className="uploaded-doc">
          <p><strong>Document UID:</strong> {uploadedDoc.uid}</p>
          <p><strong>Title:</strong> {uploadedDoc.title}</p>
          <p>
            <strong>Cloudinary URL:</strong>{" "}
            <a href={uploadedDoc.url} target="_blank" rel="noopener noreferrer">{uploadedDoc.url}</a>
          </p>
          <p><strong>File Type:</strong> {uploadedDoc.fileType}</p>
        </div>
      )}
    </div>
  );
}
