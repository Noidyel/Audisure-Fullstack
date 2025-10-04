import React, { useState } from "react";
import Sidebar from "../components/UserSidebar";
import Topbar from "../components/UserTopbar";
import UploadDocuments from "./UploadDocuments";
import ViewStatus from "./ViewStatus";
import UserNotifications from "./UserNotifications";
import "../styles/dashboard.css";

export default function UserDashboard() {
  const userFirstName = localStorage.getItem("firstName") || "Nigel";
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [activeFeature, setActiveFeature] = useState("dashboard");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/home";
  };

  // Mock user activities
  const activities = [
    { id: 1, text: "You uploaded a document", time: "5 min ago" },
    { id: 2, text: "Your task was marked in progress", time: "20 min ago" },
    { id: 3, text: "You checked a document status", time: "1 hour ago" },
    { id: 4, text: "Your document was approved", time: "2 hours ago" },
  ];

  // Render the correct section
  const renderContent = () => {
    switch (activeFeature) {
      case "upload":
        return <UploadDocuments />;
      case "status":
        return <ViewStatus />;
      case "notifications":
        return <UserNotifications />;
      default:
        return (
          <>
            <div className="card-grid">
              <div className="card card-primary" onClick={() => setActiveFeature("upload")}>
                <strong>📤 Upload</strong>
                <p>
                  Easily upload all the necessary documents required for your application.
                  Our system ensures secure storage, quick access, and smooth verification
                  by authorized staff to speed up the approval process.
                </p>
              </div>

              <div className="card card-secondary" onClick={() => setActiveFeature("status")}>
                <strong>🔍 Status</strong>
                <p>
                  Track the progress of your submitted documents in real time.
                  From pending to approval, you’ll always know the current stage
                  of your application and avoid unnecessary delays or confusion.
                </p>
              </div>

              <div className="card card-neutral" onClick={() => setActiveFeature("notifications")}>
                <strong>🔔 Notifications</strong>
                <p>
                  Receive instant updates whenever there are changes to your documents.
                  Whether a task is assigned, a status is updated, or a document is approved,
                  you’ll stay informed at every step of the process.
                </p>
              </div>
            </div>

            <div className="recent-activities">
              <h2>Recent Activities</h2>
              <ul className="activity-list">
                {activities.map((activity) => (
                  <li key={activity.id}>
                    <span className="activity-text">{activity.text}</span>
                    <span className="activity-time">{activity.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        );
    }
  };

  return (
    <div className="user-dashboard-container">
      <Sidebar
        active={activeFeature}
        onHoverChange={setSidebarHovered}
        onSelectFeature={setActiveFeature}
      />
      <Topbar
        userName={userFirstName}
        onLogout={handleLogout}
        sidebarHovered={sidebarHovered}
      />

      <div className={`dashboard-content ${sidebarHovered ? "expanded" : ""}`}>
        {renderContent()}
      </div>
    </div>
  );
}
