import React from "react";
import "../styles/dashboard.css"; // optional

export default function UserNotifications() {
  return (
    <div className="page-container">
      <h1 className="page-title">🔔 Notifications</h1>
      <p className="page-description">
        Here, users will receive real-time updates about their document activities and status changes.
      </p>

      <div className="mock-content">
        <div className="notification-card">
          <h3>✅ Document Approved</h3>
          <p>Your proof of income has been approved by the admin.</p>
          <span className="time">3 hours ago</span>
        </div>

        <div className="notification-card">
          <h3>📤 Document Uploaded</h3>
          <p>You uploaded your residency certificate successfully.</p>
          <span className="time">1 day ago</span>
        </div>
      </div>
    </div>
  );
}
