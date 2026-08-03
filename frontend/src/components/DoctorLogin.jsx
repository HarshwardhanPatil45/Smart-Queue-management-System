import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// --- CSS STYLES (Cinematic Background) ---
const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  body { margin: 0; font-family: 'Poppins', sans-serif; }

  /* --- WRAPPER WITH BACKGROUND IMAGE --- */
  .doc-login-wrapper {
    display: flex;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    padding: 20px;
    
    /* ✅ BACKGROUND IMAGE SETTINGS */
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.6)), 
                url('https://img.freepik.com/premium-photo/health-medical-objects-3d-rendering-with-blue-background_636537-308955.jpg?w=1480');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }

  /* --- LOGIN CARD --- */
  .login-box {
    display: flex;
    background: rgba(255, 255, 255, 0.95); /* Slight transparency */
    backdrop-filter: blur(10px);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); /* Deep shadow for pop */
    max-width: 900px;
    width: 100%;
    min-height: 550px;
    animation: zoomIn 0.5s ease-out;
  }

  /* --- LEFT SIDE (IMAGE/BRANDING) --- */
  .image-side {
    flex: 1;
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    padding: 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  /* Decorative Circles */
  .image-side::before {
    content: ''; position: absolute; top: -50px; left: -50px; width: 250px; height: 250px;
    background: rgba(255,255,255,0.1); border-radius: 50%;
  }
  .image-side::after {
    content: ''; position: absolute; bottom: -50px; right: -50px; width: 150px; height: 150px;
    background: rgba(255,255,255,0.1); border-radius: 50%;
  }

  .image-side h2 { font-size: 32px; font-weight: 700; margin-bottom: 10px; z-index: 1; }
  .image-side p { font-size: 15px; opacity: 0.9; max-width: 300px; line-height: 1.6; z-index: 1; }
  .illustration { font-size: 80px; margin-bottom: 20px; text-shadow: 0 10px 20px rgba(0,0,0,0.2); z-index: 1; }

  /* --- RIGHT SIDE (FORM) --- */
  .form-side {
    flex: 1;
    padding: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .form-header { margin-bottom: 30px; text-align: center; }
  .form-header h3 { font-size: 26px; color: #1f2937; margin: 0; font-weight: 700; }
  .form-header p { color: #6b7280; font-size: 14px; margin-top: 5px; }

  /* --- INPUTS --- */
  .input-group { margin-bottom: 20px; }
  .input-label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  
  .input-field {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 15px;
    outline: none;
    transition: all 0.3s ease;
    background: #f8fafc;
    box-sizing: border-box;
  }

  .input-field:focus {
    border-color: #059669;
    background: white;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  }

  /* --- BUTTONS --- */
  .btn-login {
    width: 100%;
    padding: 15px;
    background: #059669;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
    box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
    margin-top: 10px;
  }
  .btn-login:hover { transform: translateY(-2px); background: #047857; }
  .btn-login:active { transform: translateY(0); }

  .back-link {
    display: block;
    text-align: center;
    margin-top: 25px;
    color: #6b7280;
    font-size: 14px;
    text-decoration: none;
    font-weight: 500;
    transition: 0.3s;
  }
  .back-link:hover { color: #059669; text-decoration: underline; }

  /* --- ERROR --- */
  .error-box {
    background: #fef2f2;
    color: #b91c1c;
    padding: 12px;
    border-radius: 8px;
    font-size: 13px;
    text-align: center;
    margin-bottom: 20px;
    border: 1px solid #fecaca;
    animation: shake 0.4s;
  }

  /* --- ANIMATIONS --- */
  @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }

  /* --- RESPONSIVE --- */
  @media (max-width: 768px) {
    .login-box { flex-direction: column; max-width: 450px; min-height: auto; }
    .image-side { padding: 30px; }
    .form-side { padding: 30px; }
    .illustration { font-size: 60px; }
  }
`;

const DoctorLogin = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post("http://localhost:8080/api/auth/login", { username, password });
            const userData = res.data;

            if (userData.role !== 'DOCTOR') {
                setError("⛔ Access Denied: This portal is strictly for Doctors.");
                return;
            }

            setUser(userData);
            localStorage.setItem("hospital_user", JSON.stringify(userData));
            navigate('/dashboard');

        } catch (err) {
            setError("Invalid Username or Password.");
        }
    };

    return (
        <div className="doc-login-wrapper">
            <style>{cssStyles}</style>
            
            <div className="login-box">
                {/* LEFT SIDE */}
                <div className="image-side">
                    <div className="illustration">🩺</div>
                    <h2>Doctor Portal</h2>
                    <p>Secure access for medical professionals. Manage appointments & patient records efficiently.</p>
                </div>

                {/* RIGHT SIDE */}
                <div className="form-side">
                    <div className="form-header">
                        <h3>Welcome Back</h3>
                        <p>Enter credentials to access dashboard</p>
                    </div>

                    {error && <div className="error-box">{error}</div>}

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label className="input-label">Doctor ID</label>
                            <input 
                                className="input-field" 
                                type="text" 
                                placeholder="e.g. dr.smith"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input 
                                className="input-field" 
                                type="password" 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-login">
                            Secure Login
                        </button>
                    </form>

                    <a href="/" className="back-link">← Back to Home</a>
                </div>
            </div>
        </div>
    );
};

export default DoctorLogin;