import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PatientDashboard = ({ user, onLogout }) => { 
    const [activeTab, setActiveTab] = useState('book'); 
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [currentStatus, setCurrentStatus] = useState(null);
    const [history, setHistory] = useState([]);
    const [liveServingToken, setLiveServingToken] = useState(null);

    // AI State Variables
    const [symptom, setSymptom] = useState('');
    const [aiSuggestion, setAiSuggestion] = useState(null);

    // ================= HELPER: FIND ID =================
    const getDocId = (doc) => {
        if (!doc) return null;
        return doc.id || doc.doctorId || doc.userId;
    };

    // ================= DATA FETCHING =================
    const fetchDoctors = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/queue/doctors");
            setDoctors(res.data);
        } catch (error) {
            console.error("Error loading doctors");
        }
    }, []);

    const fetchMyStatus = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/queue/patient/status/${user.username}`);
            if (res.data && res.data.tokenNumber) {
                setCurrentStatus(res.data);
            } else {
                setCurrentStatus(null);
            }
        } catch (error) {
            setCurrentStatus(null);
        }
    }, [user.username]);

    const fetchHistory = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/queue/history/${user.username}`);
            setHistory(res.data);
        } catch (error) {
            console.error("Error loading history:", error);
        }
    }, [user.username]);

    const fetchLiveToken = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/queue/current-serving");
            setLiveServingToken(res.data);
        } catch (error) { 
            console.error("Live token error");
        }
    }, []);

    useEffect(() => {
        fetchDoctors();
        fetchMyStatus();
        fetchHistory();
        fetchLiveToken();

        const interval = setInterval(() => {
            fetchMyStatus();
            fetchLiveToken();
        }, 3000); 

        return () => clearInterval(interval);
    }, [fetchDoctors, fetchMyStatus, fetchHistory, fetchLiveToken]);

    // ================= ACTIONS =================
    const handleCancelToken = async () => {
        if (!currentStatus) return;
        if (!window.confirm("Are you sure you want to cancel your appointment?")) return;

        try {
            await axios.put(`http://localhost:8080/api/queue/cancel/${currentStatus.id}`);
            toast.info("🚫 Appointment Cancelled."); 
            setCurrentStatus(null);
            fetchMyStatus(); 
            fetchHistory(); 
        } catch (error) {
            toast.error("Failed to cancel appointment.");
        }
    };

    const handleAIPredict = async (e) => {
        e.preventDefault();
        if (!symptom.trim()) return;

        try {
            const res = await axios.post("http://localhost:8080/api/ai/predict", { symptom });
            let recommendedSpec = "General Physician";
            
            if (Array.isArray(res.data) && res.data.length > 0) {
                 recommendedSpec = res.data[0].specialization;
            } else if (res.data.specialization) {
                 recommendedSpec = res.data.specialization;
            }

            setAiSuggestion(recommendedSpec);
            const matchingDoc = doctors.find(d => 
                d.specialization && d.specialization.toLowerCase() === recommendedSpec.toLowerCase()
            );

            if (matchingDoc) {
                setSelectedDoctor(getDocId(matchingDoc)); 
                toast.success(` found Dr. ${matchingDoc.name} for you!`);
            } else {
                toast.info(`suggests: ${recommendedSpec}`);
            }
        } catch (error) {
            toast.error("AI Service Unavailable.");
        }
    };

    const handleBookToken = async (e) => {
        e.preventDefault();
        if (!selectedDoctor) {
            toast.warning("Please select a doctor first.");
            return;
        }

        try {
            const payload = {
                patientName: user.username,
                doctorId: Number(selectedDoctor)
            };
            await axios.post("http://localhost:8080/api/queue/book", payload);
            toast.success("✅ Token Booked! Check your email.");
            setActiveTab('status'); 
            fetchMyStatus();        
            fetchHistory();         
        } catch (error) {
            toast.error("Booking Failed: " + (error.response?.data || "Server Error."));
        }
    };

    // ================= RENDER HELPERS =================
    const getLiveTokenDisplay = () => {
        if (!liveServingToken) return "-";
        if (typeof liveServingToken === 'object') return liveServingToken.token || liveServingToken.tokenNumber;
        return liveServingToken;
    };

    const getLiveDoctorDisplay = () => {
        if (!liveServingToken) return "";
        if (typeof liveServingToken === 'object') return liveServingToken.doctor;
        return "";
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'doctors': 
                return (
                    <div style={styles.card}>
                        <h3>👨‍⚕️ Available Doctors </h3>
                        <div style={styles.grid}>
                            {doctors.map((doc, index) => {
                                const id = getDocId(doc);
                                return (
                                    <div key={id || index} style={styles.doctorCard}>
                                        <div style={styles.avatar}>👨‍⚕️</div>
                                        <h4 style={{margin: "10px 0"}}>{doc.name || doc.username}</h4>
                                        <p style={{color: "#666", fontSize: "14px"}}>
                                            {doc.specialization || 'General Physician'}
                                        </p>
                                        <button 
                                            style={styles.bookBtnSmall}
                                            onClick={() => {
                                                setSelectedDoctor(id);
                                                setActiveTab('book'); 
                                            }}
                                        >
                                            Book Appointment
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );

            case 'book':
                return (
                    <div style={styles.card}>
                        <h3>📅 Book an Appointment</h3>
                        <div style={styles.aiBox}>
                            <h4 style={{marginTop: 0, color: "#0056b3"}}>Need any help </h4>
                            <p style={{fontSize: "13px", color: "#555"}}>
                                Not sure which doctor to visit? Describe your symptoms.
                            </p>
                            <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                                <input 
                                    type="text" 
                                    placeholder="Enter symptoms (e.g. chest pain, fever)..." 
                                    value={symptom}
                                    onChange={(e) => setSymptom(e.target.value)}
                                    style={{...styles.select, marginTop: 0}} 
                                />
                                <button onClick={handleAIPredict} style={styles.aiBtn}>
                                    search
                                </button>
                            </div>
                            {aiSuggestion && (
                                <p style={{marginTop: "10px", color: "green", fontWeight: "bold", fontSize:"14px"}}>
                                    ✨ Suggested Specialist: {aiSuggestion}
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleBookToken}>
                            <div style={{ textAlign: "left", marginBottom: "15px" }}>
                                <label>Select Doctor:</label>
                                <select 
                                    style={styles.select} 
                                    value={selectedDoctor} 
                                    onChange={(e) => setSelectedDoctor(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose a Doctor --</option>
                                    {doctors.map((doc, index) => (
                                        <option key={getDocId(doc) || index} value={getDocId(doc)}>
                                            Dr. {doc.name || doc.username} ({doc.specialization || 'General'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" style={styles.button}>Book Token</button>
                        </form>
                    </div>
                );

            case 'status':
                return (
                    <div style={styles.card}>
                        <h3>📍 Live Status</h3>
                        <div style={styles.liveBox}>
                            <h4>Now Serving Token</h4>
                            <div style={styles.bigNumber}>#{getLiveTokenDisplay()}</div>
                            <p style={{color: "#224abe", fontWeight: "bold"}}>
                                {getLiveDoctorDisplay() ? `Dr. ${getLiveDoctorDisplay()}` : "No Active Session"}
                            </p>
                        </div>
                        <hr style={{margin: "20px 0", borderTop: "1px solid #eee"}} />
                        {currentStatus ? (
                            <div>
                                <h4>🎫 Your Token: <span style={{color: "#007bff"}}>#{currentStatus.tokenNumber}</span></h4>
                                <p><strong>Doctor:</strong> Dr. {currentStatus.doctor ? (currentStatus.doctor.name || currentStatus.doctor.username) : "Assigned"}</p>
                                <p>
                                    <strong>Status: </strong> 
                                    <span style={{
                                        fontWeight: "bold", 
                                        color: currentStatus.status === 'WAITING' ? '#ffc107' : '#28a745'
                                    }}>
                                        {currentStatus.status}
                                    </span>
                                </p>
                                {currentStatus.status === 'WAITING' && (
                                    <button 
                                        onClick={handleCancelToken} 
                                        style={styles.cancelBtn}
                                    >
                                        🚫 Cancel Appointment
                                    </button>
                                )}
                            </div>
                        ) : (
                            <p>You have no active appointments. <span style={styles.link} onClick={() => setActiveTab('book')}>Book Now</span></p>
                        )}
                    </div>
                );

            case 'history':
                return (
                    <div style={styles.card}>
                        <h3>📜 Appointment History</h3>
                        {history.length === 0 ? (
                            <p>No past appointments found.</p>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr style={{ background: "#f8f9fa" }}>
                                        <th style={styles.th}>Date</th>
                                        <th style={styles.th}>Token</th>
                                        <th style={styles.th}>Doctor</th>
                                        <th style={styles.th}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((appt, index) => (
                                        <tr key={appt.id || index}>
                                            <td style={styles.td}>{new Date(appt.createdAt || Date.now()).toLocaleDateString()}</td>
                                            <td style={styles.td}>#{appt.tokenNumber}</td>
                                            <td style={styles.td}>Dr. {appt.doctor ? (appt.doctor.name || appt.doctor.username) : "N/A"}</td>
                                            <td style={styles.td}>
                                                <span style={
                                                    appt.status === 'COMPLETED' ? styles.badgeGreen : 
                                                    appt.status === 'CANCELLED' ? styles.badgeRed : 
                                                    styles.badgeGray
                                                }>
                                                    {appt.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={{margin:0}}>Welcome, {user.name || user.username}</h2>
               
            </div>

            <div style={styles.navBar}>
                {['book', 'doctors', 'status', 'history'].map(tab => (
                    <button 
                        key={tab}
                        style={activeTab === tab ? styles.navActive : styles.navBtn}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div style={styles.contentArea}>
                {renderContent()}
            </div>
        </div>
    );
};

// --- STYLES (EXACTLY AS PROVIDED) ---
const styles = {
    container: { maxWidth: "900px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    logoutBtn: { background: "#dc3545", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
    navBar: { display: "flex", justifyContent: "center", marginBottom: "30px", background: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" },
    navBtn: { flex: 1, padding: "15px", border: "none", background: "transparent", cursor: "pointer", fontSize: "16px", color: "#555", borderBottom: "3px solid transparent" },
    navActive: { flex: 1, padding: "15px", border: "none", background: "#eef2ff", cursor: "pointer", fontSize: "16px", color: "#007bff", fontWeight: "bold", borderBottom: "3px solid #007bff" },
    contentArea: { textAlign: "center" },
    card: { background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", textAlign: "left" },
    select: { width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" },
    button: { width: "100%", padding: "12px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", fontSize: "16px", cursor: "pointer", marginTop: "10px" },
    liveBox: { textAlign: "center", background: "#f0f8ff", padding: "20px", borderRadius: "10px", border: "1px solid #b3d7ff" },
    bigNumber: { fontSize: "40px", fontWeight: "bold", color: "#007bff", marginTop: "5px" },
    link: { color: "#007bff", cursor: "pointer", textDecoration: "underline", fontWeight: "bold" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
    th: { padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" },
    td: { padding: "12px", borderBottom: "1px solid #eee" },
    badgeGreen: { background: "#d4edda", color: "#155724", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" },
    badgeRed: { background: "#f8d7da", color: "#721c24", padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" },
    badgeGray: { background: "#e2e3e5", color: "#383d41", padding: "4px 8px", borderRadius: "12px", fontSize: "12px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px", marginTop: "20px" },
    doctorCard: { border: "1px solid #eee", borderRadius: "10px", padding: "15px", textAlign: "center", background: "#f8f9fa", transition: "0.2s" },
    avatar: { fontSize: "40px", marginBottom: "5px" },
    bookBtnSmall: { marginTop: "10px", padding: "8px 15px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%" },
    aiBox: { background: "#e3f2fd", padding: "15px", borderRadius: "10px", marginBottom: "25px", border: "1px solid #90caf9" },
    aiBtn: { background: "#0288d1", color: "white", border: "none", padding: "0 15px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
    cancelBtn: { marginTop: "15px", padding: "10px 20px", background: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", width: "100%" }
};

export default PatientDashboard;