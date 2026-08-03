
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import your components
import Home from './components/Home';                 // ✅ NEW: Landing Page
import LoginRegister from './components/LoginRegister'; // Patient Login
import DoctorLogin from './components/DoctorLogin';     // Doctor Login
import AdminLogin from './components/AdminLogin';       // Admin Login
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard'; 
import AdminDashboard from './components/AdminDashboard';

// 1. Protected Route Wrapper
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/" replace />; 
  }
  return children;
};

// 2. Main App Component
function App() {
  // Load user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("hospital_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Common Login Handler
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("hospital_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("hospital_user");
    window.location.href = "/"; 
  };

  return (
    <Router>
      <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f7f6", minHeight: "100vh"}}>
        
        {/* Global Header (Optional: You can remove this if you want the Landing Page to handle the header) */}
        {user && (
            <header style={{ padding: "15px 20px", background: "#343a40", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <h2 style={{ margin: 0, flex: 1, textAlign: "center" }}>🏥 Smart Hospital Queue System</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <span>👤 {user.name} ({user.role})</span>
                <button onClick={handleLogout} style={{ background: "#dc3545", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Logout</button>
            </div>
            </header>
        )}

        {/* Route Definitions */}
        {/* Note: We removed padding here so the Home page can use full width */}
        <div style={user ? { padding: "20px" } : { padding: "0" }}>
          <Routes>
            
            {/* Route 1: Landing Page (Default Home) */}
            <Route path="/" element={<Home />} />

            {/* Route 2: Patient Login */}
            <Route path="/patient-login" element={
              !user ? (
                <LoginRegister onLoginSuccess={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } />

            {/* Route 3: Doctor Login */}
            <Route path="/doctor-login" element={
              !user ? (
                <DoctorLogin setUser={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } />

            {/* Route 4: Admin Login */}
            <Route path="/admin-login" element={
              !user ? (
                <AdminLogin onLoginSuccess={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } />

            {/* Route 5: The Dashboard (Protected) */}
            <Route path="/dashboard" element={
              <ProtectedRoute user={user}>
                
                {/* Role-Based Rendering */}
                {user?.role === 'ADMIN' && <AdminDashboard user={user} />}
                {user?.role === 'DOCTOR' && <DoctorDashboard user={user} />}
                {user?.role === 'PATIENT' && <PatientDashboard user={user} />}
                
              </ProtectedRoute>
            } />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
