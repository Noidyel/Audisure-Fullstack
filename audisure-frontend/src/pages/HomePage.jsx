import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaSearch, FaCheckCircle, FaLock, FaUserShield, FaMobileAlt } from "react-icons/fa";
import '../styles/HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      {/* Hero Section */}
      <header className="hero-header relative">
        <div className="hero-bg"></div>
        <div className="hero-shape shape1"></div>
        <div className="hero-shape shape2"></div>

        {/* Hero content container */}
        <div className="hero-content-container relative z-10 max-w-4xl mx-auto px-4">
          {/* Top-right portal button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => navigate("/login")}
              className="btn-portal"
            >
              Audisure Portal
            </button>
          </div>

          <div className="hero-content text-center">
            <h1 className="text-5xl font-bold text-red-600 mb-4">Audisure</h1>
            <p className="text-gray-700 text-lg mb-6">
              A Document Management Verification System for the Housing Community Development 
              and Resettlement Department. Upload, verify, and track documents securely and efficiently.
            </p>
          </div>
        </div>
      </header>

      {/* Features Section by User */}
      <section className="features-section max-w-6xl mx-auto mb-16 px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">FEATURES</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Admin */}
          <div className="user-card admin-card">
            <h3 className="user-type">Admin</h3>
            <div className="feature-item">
              <FaUserShield className="feature-icon" />
              <p>Document Approval</p>
            </div>
            <div className="feature-item">
              <FaLock className="feature-icon" />
              <p>Secure Storage</p>
            </div>
          </div>

          {/* Staff */}
          <div className="user-card staff-card">
            <h3 className="user-type">Staff</h3>
            <div className="feature-item">
              <FaUpload className="feature-icon" />
              <p>Document Upload</p>
            </div>
            <div className="feature-item">
              <FaCheckCircle className="feature-icon" />
              <p>Track Submission</p>
            </div>
          </div>

          {/* Applicant */}
          <div className="user-card applicant-card">
            <h3 className="user-type">Applicant</h3>
            <div className="feature-item">
              <FaMobileAlt className="feature-icon" />
              <p>Check Status</p>
            </div>
            <div className="feature-item">
              <FaSearch className="feature-icon" />
              <p>Document History</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section text-center mb-16">
        <div className="stats-container">
          <div><p className="stat-number">100+</p><p>Documents Managed</p></div>
          <div><p className="stat-number">50+</p><p>Admins & Staff</p></div>
          <div><p className="stat-number">100%</p><p>Tamper-Proof</p></div>
        </div>
      </section>

      {/* QR Code Placeholder */}
      <section className="qr-section max-w-md mx-auto">
        <h2>Download Our Mobile App</h2>
        <p>Scan the QR code to check your document status instantly.</p>
        <div className="qr-placeholder">QR Code Here</div>
      </section>
    </div>
  );
}
