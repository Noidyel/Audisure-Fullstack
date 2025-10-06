import React, { useState } from "react";
import Sidebar from "../components/UserSidebar";
import Topbar from "../components/UserTopbar";
import UploadDocuments from "./UploadDocuments";
import ViewStatus from "./ViewStatus";
import ViewTasks from "./ViewTasks"; // <-- changed
import "../styles/dashboard.css";

export default function UserDashboard() {
  const userFirstName = localStorage.getItem("firstName") || "Nigel";
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [activeFeature, setActiveFeature] = useState("dashboard");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/home";
  };

  const activities = [
    { id: 1, text: "You uploaded a document", time: "5 min ago" },
    { id: 2, text: "Your task was marked in progress", time: "20 min ago" },
    { id: 3, text: "You checked a document status", time: "1 hour ago" },
    { id: 4, text: "Your document was approved", time: "2 hours ago" },
  ];

  const renderContent = () => {
    switch (activeFeature) {
      case "upload":
        return <UploadDocuments />;
      case "status":
        return <ViewStatus />;
      case "tasks": // <-- changed from "notifications"
        return <ViewTasks />; // <-- changed
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

              <div className="card card-neutral" onClick={() => setActiveFeature("tasks")}>
                <strong>📝 View Tasks</strong>
                <p>
                  See all your assigned tasks and their progress.
                  Keep track of what needs to be done and stay organized
                  so you never miss an important action.
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
