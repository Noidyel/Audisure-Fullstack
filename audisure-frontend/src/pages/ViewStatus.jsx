import React from "react";
import "../styles/dashboard.css"; // optional, keeps styling consistent

export default function ViewStatus() {
  return (
    <div className="page-container">
      <h1 className="page-title">📄 Document Status</h1>
      <p className="page-description">
        This page will allow users to view the current status of their submitted documents in real-time.
      </p>

      <div className="mock-content">
        <div className="status-card">
          <h3>Document: Proof of Residency</h3>
          <p>Status: <span className="status pending">Pending Review</span></p>
          <p>Last Updated: October 4, 2025</p>
        </div>

        <div className="status-card">
          <h3>Document: Income Certificate</h3>
          <p>Status: <span className="status approved">Approved</span></p>
          <p>Last Updated: October 2, 2025</p>
        </div>
      </div>
    </div>
  );
}
