import React, { useState, useEffect } from "react";
import UserSidebar from "../components/UserSidebar";
import UserTopbar from "../components/UserTopbar";
import UploadDocuments from "./UploadDocuments";
import ViewTasks from "./ViewTasks";
import CheckStatus from "./CheckStatus";
import '../styles/userDashboard.css';

const UserDashboard = () => {
  const [activeFeature, setActiveFeature] = useState("dashboard");
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [userId, setUserId] = useState(null);

  // Load userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const renderFeature = () => {
    switch (activeFeature) {
      case "upload":
        return <UploadDocuments userId={userId} />;
      case "tasks":
        return <ViewTasks />;
      case "status":
        return <CheckStatus />;
      default:
        // Dashboard home with clickable cards
        return (
          <div className="dashboard-home">
            <div className="card-grid">
              {/* Upload Documents */}
              <div
                className="card card-primary"
                onClick={() => setActiveFeature("upload")}
                style={{
                  cursor: "pointer",
                  height: "160px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  📂 Upload Documents
                </strong>
                <p
                  style={{
                    fontSize: "0.9rem",
                    margin: 0,
                    color: "#555",
                    lineHeight: "1.4",
                  }}
                >
                  Users can upload applicants' documents here. Only PDF, PNG, and JPG files are allowed.
                </p>
              </div>

              {/* View Tasks */}
              <div
                className="card card-secondary"
                onClick={() => setActiveFeature("tasks")}
                style={{
                  cursor: "pointer",
                  height: "160px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  📋 View Tasks
                </strong>
                <p
                  style={{
                    fontSize: "0.9rem",
                    margin: 0,
                    color: "#555",
                    lineHeight: "1.4",
                  }}
                >
                  Check the tasks assigned to you by the admin and manage their completion status.
                </p>
              </div>

              {/* Check Status */}
              <div
                className="card card-neutral"
                onClick={() => setActiveFeature("status")}
                style={{
                  cursor: "pointer",
                  height: "160px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  ✅ Check Status
                </strong>
                <p
                  style={{
                    fontSize: "0.9rem",
                    margin: 0,
                    color: "#555",
                    lineHeight: "1.4",
                  }}
                >
                  View the verification status of your uploaded documents in real time.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <UserSidebar
        active={activeFeature}
        onHoverChange={setSidebarHovered}
        onSelectFeature={setActiveFeature}
      />
      <UserTopbar sidebarHovered={sidebarHovered} />
      <div className="dashboard-content">
        {renderFeature()}
      </div>
    </div>
  );
};

export default UserDashboard;
