import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/view_status.css";

export default function ViewStatus() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId"); // assuming userId is stored after login

  // Base URL for API
  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000/api" // local backend
      : "https://audisure-fullstack.onrender.com/api"; // deployed backend

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStatuses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/status`, {
          params: { user_id: userId }, // query param for status.js
        });

        if (!response.data.success)
          throw new Error(response.data.message || "Failed to fetch documents");

        setDocuments(response.data.documents || []);
      } catch (err) {
        console.error("Error fetching status:", err);
        setError(err.message || "Failed to fetch document statuses.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, [userId, BASE_URL]);

  const renderStatus = (status) => {
    switch (status) {
      case "approved":
        return <span className="status approved">Approved</span>;
      case "rejected":
        return <span className="status rejected">Rejected</span>;
      case "needs_editing":
        return <span className="status needs-editing">Needs Editing</span>;
      case "processing":
        return <span className="status processing">Processing</span>;
      case "in_review":
        return <span className="status pending">In Review</span>;
      default:
        return <span className="status pending">Pending</span>;
    }
  };

  // Loading and error states
  if (!userId) return <p>Loading user info...</p>;
  if (loading) return <p>Loading document statuses...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (documents.length === 0)
    return <p>You haven't uploaded any documents yet.</p>;

  return (
    <div className="page-container">
      <h1 className="page-title">📄 Document Status</h1>
      <p className="page-description">
        View the current status of your submitted documents in real-time.
      </p>

      <div className="table-wrapper">
        <table className="status-table">
          <thead>
            <tr>
              <th>Document UID</th>
              <th>Title</th>
              <th>Uploaded At</th>
              <th>Last Updated</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.document_uid}>
                <td>{doc.document_uid}</td>
                <td>{doc.title}</td>
                <td>{new Date(doc.created_at).toLocaleString()}</td>
                <td>{new Date(doc.updated_at).toLocaleString()}</td>
                <td>{renderStatus(doc.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
