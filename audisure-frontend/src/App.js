import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";   // ✅ add this
import UserDashboard from "./pages/UserDashboard";
import UploadDocuments from "./pages/UploadDocuments";
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

      {/* Login page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Register page */}
      <Route path="/register" element={<RegisterPage />} /> {/* ✅ now works */}

      {/* User dashboard */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute allowedRoles={['user', 'applicant']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* User Upload Document page */}
      <Route
        path="/upload"
        element={
          <ProtectedRoute allowedRoles={['user', 'applicant']}>
            <UploadDocuments />
          </ProtectedRoute>
        }
      />

      {/* Admin pages */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard/verify"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Verify />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard/assign"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Assign />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard/documents"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Documents />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirects to home */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
