import { FaTachometerAlt, FaUpload, FaList, FaCheckCircle } from "react-icons/fa";

export default function UserSidebar({ active = "dashboard", onHoverChange, onSelectFeature }) {
  return (
    <div
      className="sidebar"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <div className="sidebar-title">User Panel</div>
      <nav>
        <ul>
          {/* Dashboard */}
          <li
            className={`menu-item ${active === "dashboard" ? "active" : ""}`}
            onClick={() => onSelectFeature("dashboard")}
          >
            <FaTachometerAlt size={20} />
            <span>Dashboard</span>
          </li>

          {/* Upload */}
          <li
            className={`menu-item ${active === "upload" ? "active" : ""}`}
            onClick={() => onSelectFeature("upload")}
          >
            <FaUpload size={20} />
            <span>Upload</span>
          </li>

          {/* View Tasks */}
          <li
            className={`menu-item ${active === "tasks" ? "active" : ""}`}
            onClick={() => onSelectFeature("tasks")}
          >
            <FaList size={20} />
            <span>View Tasks</span>
          </li>

          {/* Check Status */}
          <li
            className={`menu-item ${active === "status" ? "active" : ""}`}
            onClick={() => onSelectFeature("status")}
          >
            <FaCheckCircle size={20} />
            <span>Check Status</span>
          </li>
        </ul>
      </nav>
      <div className="logged-in">
        Logged in as:<br /><strong>User</strong>
      </div>
    </div>
  );
}
