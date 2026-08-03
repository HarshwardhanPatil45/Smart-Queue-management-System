import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password
            });

            const user = response.data;

            // 🚫 Block Patients
            if (user.role === 'PATIENT') {
                alert("🚫 Access Denied: Patients must use the Patient Portal.");
                return;
            }

            // ✅ Allow Admin & Doctor
            onLoginSuccess(user);
            navigate('/dashboard');

        } catch (error) {
            alert("Login Failed: " + (error.response?.data || "Check credentials"));
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-card">
                <h2 className="admin-title">Admin Login</h2>
                <p className="admin-subtitle">Restricted area for Doctors & Admins</p>

                <form onSubmit={handleLogin} className="admin-form">
                    <div className="form-group">
                        <label>Username / Email</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="admin-btn">
                        Secure Login
                    </button>
                </form>

                {/* 
                <p className="patient-link">
                    Are you a Patient? 
                    <span onClick={() => navigate('/')} className="link-text">
                        Go to Patient Portal
                    </span>
                </p> 
                */}
            </div>
        </div>
    );
};

export default AdminLogin;
