import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 

// ✅ CSS STYLES
const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

  .doctor-wrapper {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    padding: 30px 20px;
    color: #1e293b;
    background: linear-gradient(rgba(241, 245, 249, 0.85), rgba(241, 245, 249, 0.9)), 
                url('https://img.freepik.com/free-photo/health-still-life-with-copy-space_23-2148854031.jpg?t=st=1770553060~exp=1770556660~hmac=8747a5e6fd59273ce93192c712331a7a045823f02582048d84c4674df877e5bd&w=1480');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }

  .doctor-container { max-width: 1200px; margin: 0 auto; }

  /* HEADER */
  .doc-header {
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px);
    padding: 20px 30px; border-radius: 20px;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
    margin-bottom: 30px; border: 1px solid rgba(255, 255, 255, 0.4);
    border-left: 6px solid #6366f1; animation: slideDown 0.6s ease;
  }
  .doc-info h2 { margin: 0; font-size: 24px; color: #0f172a; }
  .doc-badge { background: #e0e7ff; color: #4338ca; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 700; margin-top: 5px; display: inline-block; }
  .btn-logout { background: #fee2e2; color: #b91c1c; border: none; padding: 10px 20px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; }
  .btn-logout:hover { background: #fecaca; }

  /* GRID */
  .dashboard-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 30px; animation: fadeIn 0.8s ease; }
  
  .dashboard-card {
    background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);
    border-radius: 24px; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.6); padding: 30px;
    position: relative; overflow: hidden;
  }
  .card-title { margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: #334155; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }

  /* PATIENT BOX */
  .active-patient-box { text-align: center; padding: 30px; background: linear-gradient(145deg, #f8fafc, #ffffff); border: 1px solid #e2e8f0; border-radius: 20px; }
  .token-display { font-size: 80px; font-weight: 800; color: #6366f1; margin: 10px 0; line-height: 1; text-shadow: 0 4px 20px rgba(99, 102, 241, 0.2); animation: pulse 2s infinite; }
  
  /* Patient Name Style */
  .patient-name { font-size: 28px; font-weight: 700; color: #1e293b; margin-bottom: 5px; text-transform: capitalize; }
  
  .status-text { color: #16a34a; font-weight: 600; font-size: 14px; background: #dcfce7; padding: 5px 15px; border-radius: 20px; display: inline-block; }
  .empty-state { text-align: center; padding: 60px 20px; color: #94a3b8; }
  .empty-icon { font-size: 48px; margin-bottom: 15px; display: block; opacity: 0.5; }

  /* BUTTONS */
  .action-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 30px; }
  .btn-action { padding: 15px; border: none; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .btn-prescription { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: white; grid-column: span 2; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); }
  .btn-prescription:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4); }
  .btn-complete { background: #10b981; color: white; grid-column: span 2; }
  .btn-complete:hover { background: #059669; }
  .btn-next { width: 100%; padding: 18px; background: #3b82f6; color: white; border: none; border-radius: 12px; font-size: 18px; font-weight: 700; cursor: pointer; margin-top: 20px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); transition: 0.3s; }
  .btn-next:hover { background: #2563eb; transform: translateY(-2px); }
  .btn-next:disabled { background: #cbd5e1; cursor: not-allowed; transform: none; box-shadow: none; }

  /* WAITING LIST */
  .queue-list { max-height: 500px; overflow-y: auto; padding-right: 5px; }
  .queue-item { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 15px; margin-bottom: 10px; border-radius: 12px; border-left: 4px solid #cbd5e1; transition: 0.2s; }
  .queue-item:hover { background: #eff6ff; border-left-color: #6366f1; transform: translateX(5px); }
  .q-token { font-weight: 800; color: #64748b; background: #e2e8f0; padding: 5px 10px; border-radius: 8px; font-size: 14px; }
  .q-name { font-weight: 600; color: #334155; margin-left: 10px; font-size: 14px; text-transform: capitalize; }
  .q-time { font-size: 12px; color: #94a3b8; }

  /* MODAL */
  .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 1000; animation: fadeIn 0.3s; }
  .modal-content { background: white; width: 600px; padding: 30px; border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); animation: scaleUp 0.3s; }
  .modal-header { font-size: 22px; font-weight: 700; margin-bottom: 20px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }
  .form-group { margin-bottom: 20px; }
  .form-label { display: block; font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 8px; }
  .modal-input, .modal-textarea { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; font-family: inherit; transition: 0.3s; background: #f8fafc; box-sizing: border-box; }
  .modal-input:focus, .modal-textarea:focus { border-color: #6366f1; background: white; outline: none; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
  .modal-actions { display: flex; gap: 15px; margin-top: 25px; }
  .btn-modal { flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
  .btn-download { background: #f59e0b; color: white; }
  .btn-email { background: #6366f1; color: white; }
  .btn-close { background: #e2e8f0; color: #475569; }

  /* ANIMATIONS */
  @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
  @media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr; } .modal-content { width: 90%; } }
`;

const DoctorDashboard = ({ user, onLogout }) => {
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [waitingList, setWaitingList] = useState([]);
    const [currentPatient, setCurrentPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [prescriptionData, setPrescriptionData] = useState({ 
        patientName: '', diagnosis: '', medicines: '', notes: '' 
    });

    // ✅ HELPER: Format Email to Name (e.g. aditya123@gmail.com -> Aditya)
    const formatPatientName = (rawName) => {
        if (!rawName) return "Unknown Patient";
        if (rawName.includes('@')) {
            let name = rawName.split('@')[0]; // Get part before @
            name = name.replace(/[0-9]/g, ''); // Remove numbers
            return name.charAt(0).toUpperCase() + name.slice(1); // Capitalize
        }
        return rawName;
    };

    // --- DATA FETCHING ---
    const fetchDoctorProfile = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/queue/doctor-profile/${user.username}`);
            setDoctorProfile(res.data);
            setLoading(false);
        } catch (error) { setLoading(false); toast.error("Failed to load profile."); }
    }, [user.username]);

    const fetchQueueData = useCallback(async () => {
        if (!doctorProfile) return;
        try {
            const waitingRes = await axios.get(`http://localhost:8080/api/queue/doctor/${doctorProfile.id}/waiting`);
            setWaitingList(waitingRes.data);

            try {
                const currentRes = await axios.get(`http://localhost:8080/api/queue/doctor/${doctorProfile.id}/current`);
                if (currentRes.status === 204 || !currentRes.data) setCurrentPatient(null);
                else setCurrentPatient(currentRes.data);
            } catch (e) { setCurrentPatient(null); }
        } catch (error) { console.error("Queue Data Error"); }
    }, [doctorProfile]);

    useEffect(() => { fetchDoctorProfile(); }, [fetchDoctorProfile]);
    useEffect(() => {
        if (doctorProfile) {
            fetchQueueData();
            const interval = setInterval(fetchQueueData, 3000);
            return () => clearInterval(interval);
        }
    }, [doctorProfile, fetchQueueData]);

    // --- ACTIONS ---
    const handleCallNext = async () => {
        if (waitingList.length === 0) { toast.info("No patients waiting."); return; }
        if (currentPatient && !window.confirm("Finish current patient?")) return;
        if (currentPatient) await handleComplete();
        try {
            const nextPatient = waitingList[0]; 
            await axios.put(`http://localhost:8080/api/queue/appointment/${nextPatient.id}/status?status=ACTIVE`);
            fetchQueueData(); 
            toast.success(`Called Token #${nextPatient.tokenNumber}`);
        } catch (e) { toast.error("Error calling next."); }
    };

    const handleComplete = async () => {
        if (!currentPatient) return;
        try {
            await axios.put(`http://localhost:8080/api/queue/appointment/${currentPatient.id}/status?status=COMPLETED`);
            setCurrentPatient(null);
            fetchQueueData(); 
            toast.success("Patient marked completed.");
        } catch (e) { console.error(e); }
    };

    // --- PRESCRIPTION HANDLERS ---
    const openPrescriptionModal = () => {
        if (!currentPatient) return;
        // ✅ Pre-fill with formatted name
        setPrescriptionData({ 
            patientName: formatPatientName(currentPatient.patientName), 
            diagnosis: '', 
            medicines: '', 
            notes: '' 
        });
        setShowModal(true);
    };

    const handleDownloadPDF = async () => {
        try {
            const payload = { 
                ...prescriptionData, 
                patientName: prescriptionData.patientName, 
                email: currentPatient.patientName, 
                doctorName: doctorProfile.name 
            };
            const response = await axios.post(`http://localhost:8080/api/prescription/download-pdf`, payload, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Prescription_${prescriptionData.patientName}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("PDF Downloaded!");
        } catch (e) { toast.error("Failed to download PDF."); }
    };

    const handleSendEmail = async () => {
        const email = prompt("Confirm Patient Email Address:", currentPatient.patientName.includes('@') ? currentPatient.patientName : "");
        if (!email) return;
        
        try {
            toast.info("Sending Email...");
            const payload = { 
                ...prescriptionData, 
                patientName: prescriptionData.patientName, 
                email: email, 
                doctorName: doctorProfile.name 
            };
            await axios.post(`http://localhost:8080/api/prescription/send`, payload);
            toast.success("✅ Prescription Sent!");
            setShowModal(false); 
        } catch (e) { toast.error("Failed to send email."); }
    };

    if (loading) return <div>Loading...</div>;
    if (!doctorProfile) return <div>Profile Not Found</div>;

    return (
        <div className="doctor-wrapper">
            <style>{cssStyles}</style> 
            
            <div className="doctor-container">
                <div className="doc-header">
                    <div className="doc-info">
                        <h2>Dr. {doctorProfile.name}</h2>
                        <span className="doc-badge">{doctorProfile.specialization}</span>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                        <div style={{textAlign:'right'}}>
                            <span style={{fontSize:'12px', color:'#64748b', display:'block'}}>Status</span>
                            <span style={{color:'#16a34a', fontWeight:'bold', fontSize:'14px'}}>● System Live</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    {/* Active Patient */}
                    <div className="dashboard-card">
                        <div className="card-title">
                            <span>🔊 Now Serving</span>
                            {currentPatient && <span className="status-text">In Consultation</span>}
                        </div>

                        {currentPatient ? (
                            <div className="active-patient-box">
                                <div className="token-display">#{currentPatient.tokenNumber}</div>
                                
                                {/* ✅ DISPLAY NAME INSTEAD OF EMAIL */}
                                <div className="patient-name">
                                    {formatPatientName(currentPatient.patientName)}
                                </div>
                                <div style={{color:'#64748b', marginBottom:'20px', fontSize:'12px'}}>
                                    ID: {currentPatient.patientName}
                                </div>

                                <div className="action-buttons">
                                    <button onClick={openPrescriptionModal} className="btn-action btn-prescription">
                                        📝 Write & Send Prescription
                                    </button>
                                    <button onClick={handleComplete} className="btn-action btn-complete">
                                        ✅ Mark Completed
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <span className="empty-icon">☕</span>
                                <h3>No Active Patient</h3>
                                <p>Queue is idle. Click below to call the next patient.</p>
                            </div>
                        )}

                        <button 
                            onClick={handleCallNext} 
                            className="btn-next"
                            disabled={waitingList.length === 0}
                        >
                            {waitingList.length > 0 ? "📢 Call Next Patient" : "Queue Empty"}
                        </button>
                    </div>

                    {/* Waiting Queue */}
                    <div className="dashboard-card">
                        <div className="card-title">
                            <span>⏳ Waiting Queue</span>
                            <span style={{background:'#f1f5f9', padding:'2px 10px', borderRadius:'10px', fontSize:'14px'}}>{waitingList.length}</span>
                        </div>

                        <div className="queue-list">
                            {waitingList.length === 0 ? (
                                <p style={{textAlign:'center', color:'#94a3b8', marginTop:'50px'}}>No patients in queue.</p>
                            ) : (
                                waitingList.map(p => (
                                    <div key={p.id} className="queue-item">
                                        <div>
                                            <span className="q-token">#{p.tokenNumber}</span>
                                            {/* ✅ FORMAT NAME IN LIST TOO */}
                                            <span className="q-name">{formatPatientName(p.patientName)}</span>
                                        </div>
                                        <span className="q-time">
                                            {new Date(p.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Prescription Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">📝 Write Prescription</div>
                        
                        <div className="form-group">
                            <label className="form-label">Patient Name (Editable)</label>
                            <input 
                                className="modal-input" 
                                value={prescriptionData.patientName} 
                                onChange={(e) => setPrescriptionData({...prescriptionData, patientName: e.target.value})} 
                                placeholder="Enter Patient's Real Name"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Diagnosis</label>
                            <input className="modal-input" placeholder="e.g. Viral Fever" value={prescriptionData.diagnosis} onChange={(e) => setPrescriptionData({...prescriptionData, diagnosis: e.target.value})} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Medicines (Name, Dosage, Frequency)</label>
                            <textarea className="modal-textarea" rows="5" placeholder="1. Paracetamol 500mg - 1-0-1 (3 Days)" value={prescriptionData.medicines} onChange={(e) => setPrescriptionData({...prescriptionData, medicines: e.target.value})} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Additional Notes</label>
                            <textarea className="modal-textarea" rows="2" placeholder="Drink plenty of water..." value={prescriptionData.notes} onChange={(e) => setPrescriptionData({...prescriptionData, notes: e.target.value})} />
                        </div>

                        <div className="modal-actions">
                            <button onClick={handleDownloadPDF} className="btn-modal btn-download">⬇️ Download PDF</button>
                            <button onClick={handleSendEmail} className="btn-modal btn-email">📧 Email Patient</button>
                            <button onClick={() => setShowModal(false)} className="btn-modal btn-close">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;