import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import UploadDocuments from "./pages/UploadDocuments";
import ViewStatus from "./pages/ViewStatus";           // ✅ add this
import UserNotifications from "./pages/UserNotifications"; // ✅ add this
import AdminDashboard from "./pages/AdminDashboard";
import Verify from "./pages/Verify";
import Assign from "./pages/Assign";
import Documents from "./pages/Documents";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Root goes to HomePage */}
      <Route path="/" element={<HomePage />} />

      {/* Login & Register */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ==============================
           USER DASHBOARD & PAGES
      =============================== */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute allowedRoles={["user", "applicant"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-dashboard/upload"
        element={
          <ProtectedRoute allowedRoles={["user", "applicant"]}>
            <UploadDocuments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-dashboard/status"
        element={
          <ProtectedRoute allowedRoles={["user", "applicant"]}>
            <ViewStatus />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-dashboard/notifications"
        element={
          <ProtectedRoute allowedRoles={["user", "applicant"]}>
            <UserNotifications />
          </ProtectedRoute>
        }
      />

      {/* ==============================
           ADMIN DASHBOARD & PAGES
      =============================== */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard/verify"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Verify />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard/assign"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Assign />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard/documents"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Documents />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirects to home */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
