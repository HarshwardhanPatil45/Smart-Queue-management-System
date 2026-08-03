import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; 
import { jwtDecode } from "jwt-decode"; 
import './LoginRegister.css'; // ✅ Import styles


const LoginRegister = ({ onLoginSuccess }) => {
    const [view, setView] = useState('LOGIN'); 
    
    const [formData, setFormData] = useState({ 
        username: '', 
        password: '', 
        role: 'PATIENT', 
        otp: '',
        name: '',
        mobile: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // 1. SUBMIT HANDLER
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 

        try {
            if (view === 'LOGIN') {
                const loginPayload = { 
                    username: formData.username, 
                    password: formData.password 
                };
                
                const res = await axios.post("http://localhost:8080/api/auth/login", loginPayload);
                onLoginSuccess(res.data);
                navigate('/dashboard');

            } else if (view === 'REGISTER') {
                const res = await axios.post("http://localhost:8080/api/auth/register", formData);
                
                if (res.data === "OTP_SENT") {
                    alert("✅ OTP sent to your email!");
                    setView('VERIFY_OTP'); 
                } else {
                    alert("✅ Registration Successful! Please Login.");
                    setView('LOGIN');
                }
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data || "Authentication Failed. Please check your details.");
        }
    };

    // 2. OTP VERIFICATION
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/auth/verify", {
                email: formData.username,
                otp: formData.otp
            });
            alert("✅ Verified! You can now login.");
            setView('LOGIN');
        } catch (err) {
            setError("Invalid OTP. Please try again.");
        }
    };

    // 3. GOOGLE LOGIN
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const res = await axios.post("http://localhost:8080/api/auth/google-login", {
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture
            });
            onLoginSuccess(res.data);
            navigate('/dashboard');
        } catch (err) {
            setError("Google Login Failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                
                <h2 className="login-title">
                    {view === 'LOGIN' && "Welcome Back"}
                    {view === 'REGISTER' && "Create Account"}
                    {view === 'VERIFY_OTP' && "Verify Identity"}
                </h2>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={view === 'VERIFY_OTP' ? handleVerifyOtp : handleSubmit}>
                    
                    {/* REGISTER FIELDS */}
                    {view === 'REGISTER' && (
                        <>
                            <div className="form-group">
                                <input 
                                    className="custom-input"
                                    name="name" 
                                    placeholder="Full Name" 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input 
                                    className="custom-input"
                                    name="mobile" 
                                    placeholder="Mobile Number" 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* COMMON FIELDS */}
                    {view !== 'VERIFY_OTP' && (
                        <>
                            <div className="form-group">
                                <input 
                                    className="custom-input"
                                    name="username" 
                                    placeholder="Email Address" 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input 
                                    className="custom-input"
                                    name="password" 
                                    type="password" 
                                    placeholder="Password" 
                                    onChange={handleChange} 
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* ROLE SELECTION */}
                    {view === 'REGISTER' && (
                        <div className="form-group">
                            <select className="custom-input role-select" name="role" onChange={handleChange} value={formData.role}>
                                <option value="PATIENT">Patient (Requires OTP)</option>
            
                            </select>
                        </div>
                    )}

                    {/* OTP FIELD */}
                    {view === 'VERIFY_OTP' && (
                        <div className="form-group" style={{textAlign: 'center'}}>
                            <p style={{marginBottom:"15px", color: '#555', fontSize: '14px'}}>
                                Enter the 4-digit code sent to <br/><b>{formData.username}</b>
                            </p>
                            <input 
                                className="custom-input"
                                name="otp" 
                                placeholder="• • • •" 
                                style={{textAlign: "center", letterSpacing: "15px", fontSize: "24px", fontWeight: "bold"}} 
                                onChange={handleChange} 
                                required
                                maxLength="6"
                            />
                        </div>
                    )}

                    <button type="submit" className="btn-primary">
                        {view === 'LOGIN' && "Sign In"}
                        {view === 'REGISTER' && "Sign Up"}
                        {view === 'VERIFY_OTP' && "Verify Code"}
                    </button>
                </form>

                {/* DIVIDER & GOOGLE */}
                {view !== 'VERIFY_OTP' && (
                    <>
                        <div className="divider">OR CONTINUE WITH</div>
                        
                        <div className="google-btn-wrapper">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError("Google Login Failed")}
                                theme="outline"
                                shape="pill"
                                width="100%"
                            />
                        </div>
                    </>
                )}

                {/* SWITCH LINKS */}
                {view !== 'VERIFY_OTP' && (
                    <div className="toggle-text">
                        {view === 'LOGIN' ? "Don't have an account?" : "Already have an account?"} 
                        <span 
                            className="toggle-link"
                            onClick={() => {
                                setView(view === 'LOGIN' ? 'REGISTER' : 'LOGIN'); 
                                setError(""); 
                            }} 
                        >
                            {view === 'LOGIN' ? "Register Now" : "Login Here"}
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LoginRegister;