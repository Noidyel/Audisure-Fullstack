import Sidebar from "../components/AdminSidebar";
import Topbar from "../components/AdminTopbar";
import '../styles/dashboard.css';
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const userFirstName = localStorage.getItem("firstName") || "Nigel";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <Sidebar active="dashboard" />
      <Topbar adminName={userFirstName} onLogout={handleLogout} />

      <div className="dashboard-content">
        <div className="dashboard-grid">
          {/* Column 1 */}
          <div className="dashboard-column">
            <div className="feature-card feature-primary">
              <div className="top-bar" style={{ backgroundColor: '#F87171' }}></div>
              <div className="content">
                <h3>👥 Verify</h3>
                <p>Approve or reject new user account requests to ensure only legitimate individuals can access the system.</p>
              </div>
            </div>
            <div className="activity-card">
              <div className="top-bar" style={{ backgroundColor: '#F87171' }}></div>
              <div className="content">
                <h4>Most Recent Registered Account</h4>
                <p><strong>John Smith</strong> (Pending)</p>
                <button onClick={() => navigate('/admin-dashboard/verify')}>Expand...</button>
                <small>2 hours ago</small>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="dashboard-column">
            <div className="feature-card feature-secondary">
              <div className="top-bar" style={{ backgroundColor: '#FBBF24' }}></div>
              <div className="content">
                <h3>📝 Assign</h3>
                <p>Distribute verification or processing tasks to staff members to streamline workflows and ensure accountability.</p>
              </div>
            </div>
            <div className="activity-card">
              <div className="top-bar" style={{ backgroundColor: '#FBBF24' }}></div>
              <div className="content">
                <h4>Most Recent Task Update</h4>
                <p><strong>Task #24</strong> - In Progress</p>
                <button onClick={() => navigate('/admin-dashboard/assign')}>Expand...</button>
                <small>1 day ago</small>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="dashboard-column">
            <div className="feature-card feature-neutral">
              <div className="top-bar" style={{ backgroundColor: '#38BDF8' }}></div>
              <div className="content">
                <h3>📂 Documents</h3>
                <p>Oversee and organize uploaded documents for accuracy, completeness, and compliance.</p>
              </div>
            </div>
            <div className="activity-card">
              <div className="top-bar" style={{ backgroundColor: '#38BDF8' }}></div>
              <div className="content">
                <h4>Most Recent Uploaded Document</h4>
                <p><strong>contract.pdf</strong> (Pending)</p>
                <button onClick={() => navigate('/admin-dashboard/documents')}>Expand...</button>
                <small>3 hours ago</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
