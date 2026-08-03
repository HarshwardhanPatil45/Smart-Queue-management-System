import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AnalyticsSection from './AnalyticsSection'; // ✅ Import the new Charts Component

const AdminDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    
    // Data State
    const [stats, setStats] = useState({ totalPatients: 0, totalTokens: 0, totalDoctors: 0 });
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [tokens, setTokens] = useState([]);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('ADD'); 
    const [targetRole, setTargetRole] = useState('DOCTOR'); 
    
    const [formData, setFormData] = useState({ 
        id: '', 
        username: '', 
        password: '', 
        name: '', 
        specialization: '', 
        verified: false 
    });

    // ✅ HELPER: Finds the ID regardless of what the backend calls it
    const getValidId = (item) => {
        if (!item) return null;
        return item.id || item.userId || item.doctorId;
    };

    // ================= DATA FETCHING =================
    const fetchData = useCallback(async () => {
        try { 
            const statsRes = await axios.get("http://localhost:8080/api/admin/stats");
            setStats(statsRes.data);

            const docRes = await axios.get("http://localhost:8080/api/queue/doctors");
            setDoctors(docRes.data);

            const userRes = await axios.get("http://localhost:8080/api/admin/users");
            setPatients(userRes.data.filter(u => u.role === 'PATIENT'));

            const tokenRes = await axios.get("http://localhost:8080/api/admin/appointments");
            setTokens(tokenRes.data);

        } catch (e) {
            console.error("Error loading data", e);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ================= ACTIONS =================

    // 1. DELETE FUNCTION
    const handleDelete = async (item, role) => {
        const id = getValidId(item);

        if (!id) {
            alert(`❌ Error: ID is missing for this ${role}.`);
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${item.username || item.name}?`)) return;

        try {
            const endpoint = role === 'DOCTOR' 
                ? `http://localhost:8080/api/admin/doctor/${id}`
                : `http://localhost:8080/api/admin/user/${id}`;

            await axios.delete(endpoint);
            alert("✅ Deleted Successfully");
            fetchData(); 
        } catch (e) { 
            console.error(e);
            const msg = e.response?.status === 403 
                ? "Access Denied. Check SecurityConfig." 
                : "Delete Failed. Check Server Logs.";
            alert(msg);
        }
    };

    // 2. OPEN MODAL
    const openModal = (mode, role, data = null) => {
        setModalMode(mode);
        setTargetRole(role);
        
        if (mode === 'EDIT' && data) {
            const validId = getValidId(data);
            setFormData({ 
                id: validId, 
                username: data.username || '', 
                password: '', 
                name: data.name || '', 
                specialization: data.specialization || '', 
                verified: data.verified || false
            });
        } else {
            setFormData({ id: '', username: '', password: '', name: '', specialization: '', role: role, verified: true });
        }
        setShowModal(true);
    };

    // 3. SAVE FORM
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'ADD') {
                const url = targetRole === 'DOCTOR' 
                    ? "http://localhost:8080/api/admin/add-doctor" 
                    : "http://localhost:8080/api/auth/register"; 
                await axios.post(url, { ...formData, role: targetRole });
                alert("✅ Added Successfully!");
            } else {
                const endpoint = targetRole === 'DOCTOR' ? `doctor/${formData.id}` : `patient/${formData.id}`;
                const payload = { ...formData };
                if (!payload.password) delete payload.password; 
                await axios.put(`http://localhost:8080/api/admin/${endpoint}`, payload);
                alert("✅ Updated Successfully!");
            }
            setShowModal(false);
            fetchData();
        } catch (e) {
            alert("Operation Failed: " + (e.response?.data || "Server Error"));
        }
    };

    // 4. RESET QUEUE
    const handleResetQueue = async () => {
        if(!window.confirm("⚠️ WARNING: This will delete ALL tokens. Continue?")) return;
        try {
            await axios.delete("http://localhost:8080/api/admin/reset-queue");
            alert("✅ Queue has been reset.");
            fetchData();
        } catch (e) {
            alert("Failed to reset queue.");
        }
    };

    // ================= RENDER =================
    const renderModal = () => {
        if (!showModal) return null;
        return (
            <div style={styles.modalOverlay}>
                <div style={styles.modalContent}>
                    <h3>{modalMode === 'ADD' ? '➕ Add ' : '✏️ Edit '}{targetRole}</h3>
                    <form onSubmit={handleSave} style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label>Username / Email</label>
                            <input value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={styles.input} required />
                        </div>
                        <div style={styles.formGroup}>
                            <label>Password {modalMode === 'EDIT' && '(Leave blank to keep)'}</label>
                            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={styles.input} required={modalMode === 'ADD'} />
                        </div>
                        
                        {targetRole === 'DOCTOR' && (
                            <>
                                <div style={styles.formGroup}><label>Name</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={styles.input} /></div>
                                <div style={styles.formGroup}><label>Specialization</label><input value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} style={styles.input} /></div>
                            </>
                        )}

                        {targetRole === 'PATIENT' && (
                            <div style={styles.formGroup}>
                                <label>Is Verified?</label>
                                <select 
                                    value={formData.verified} 
                                    onChange={e => setFormData({...formData, verified: e.target.value === 'true'})} 
                                    style={styles.input}
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                        )}

                        <div style={styles.modalActions}>
                            <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>Cancel</button>
                            <button type="submit" style={styles.saveBtn}>Save</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            {renderModal()}
            <div style={styles.sidebar}>
                <div style={styles.logo}>🏥 Admin Panel</div>
                {['dashboard', 'doctors', 'patients', 'tokens', 'settings'].map(tab => (
                    <button key={tab} style={activeTab === tab ? styles.navActive : styles.navBtn} onClick={() => setActiveTab(tab)}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>
            <div style={styles.main}>
                <div style={styles.topbar}>Welcome, {user.username}</div>
                <div style={styles.content}>
                    
                    {/* DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <div>
                            {/* 1. Stats Numbers */}
                            <div style={styles.statsGrid}>
                                <div style={{...styles.statBox, background: "#4e73df"}}><h3>Total Patients</h3><div style={styles.bigNumber}>{stats.totalPatients}</div></div>
                                <div style={{...styles.statBox, background: "#1cc88a"}}><h3>Total Tokens</h3><div style={styles.bigNumber}>{stats.totalTokens}</div></div>
                                <div style={{...styles.statBox, background: "#36b9cc"}}><h3>Active Doctors</h3><div style={styles.bigNumber}>{stats.totalDoctors}</div></div>
                            </div>

                            {/* 2. ✅ NEW ANALYTICS SECTION */}
                            <div style={{ marginTop: '30px' }}>
                                <AnalyticsSection 
                                    doctors={doctors} 
                                    patients={patients} 
                                    appointments={tokens} 
                                />
                            </div>
                        </div>
                    )}

                    {/* DOCTORS TABLE */}
                    {activeTab === 'doctors' && (
                        <div>
                            <div style={styles.headerRow}><h2>👨‍⚕️ Manage Doctors</h2><button onClick={() => openModal('ADD', 'DOCTOR')} style={styles.addBtn}>+ Add Doctor</button></div>
                            <table style={styles.table}>
                                <thead style={styles.trHead}><tr><th style={styles.th}>ID</th><th style={styles.th}>Name</th><th style={styles.th}>Spec</th><th style={styles.th}>Actions</th></tr></thead>
                                <tbody>
                                    {doctors.map(d => (
                                        <tr key={getValidId(d)}>
                                            <td style={styles.td}>{getValidId(d)}</td>
                                            <td style={styles.td}>{d.name}</td>
                                            <td style={styles.td}>{d.specialization}</td>
                                            <td style={styles.td}>
                                                <button onClick={() => openModal('EDIT', 'DOCTOR', d)} style={styles.editBtn}>✏️</button>
                                                <button onClick={() => handleDelete(d, 'DOCTOR')} style={styles.deleteBtn}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* PATIENTS TABLE */}
                    {activeTab === 'patients' && (
                        <div>
                             <div style={styles.headerRow}><h2>👤 Manage Patients</h2><button onClick={() => openModal('ADD', 'PATIENT')} style={styles.addBtn}>+ Add Patient</button></div>
                            <table style={styles.table}>
                                <thead style={styles.trHead}><tr><th style={styles.th}>ID</th><th style={styles.th}>Email</th><th style={styles.th}>Status</th><th style={styles.th}>Actions</th></tr></thead>
                                <tbody>
                                    {patients.map(p => (
                                        <tr key={getValidId(p)}>
                                            <td style={styles.td}>{getValidId(p)}</td>
                                            <td style={styles.td}>{p.username}</td>
                                            <td style={styles.td}>
                                                <span style={p.verified ? styles.badgeGreen : styles.badgeRed}>{p.verified ? "Verified" : "Unverified"}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <button onClick={() => openModal('EDIT', 'PATIENT', p)} style={styles.editBtn}>✏️</button>
                                                <button onClick={() => handleDelete(p, 'PATIENT')} style={styles.deleteBtn}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TOKENS TABLE */}
                    {activeTab === 'tokens' && (
                        <div>
                            <h2>🎫 Tokens</h2>
                            <table style={styles.table}>
                                <thead style={styles.trHead}><tr><th style={styles.th}>Token</th><th style={styles.th}>Patient</th><th style={styles.th}>Status</th></tr></thead>
                                <tbody>
                                    {tokens.map(t => (
                                        <tr key={t.id}>
                                            <td style={styles.td}>#{t.tokenNumber}</td>
                                            <td style={styles.td}>{t.patientName}</td>
                                            <td style={styles.td}>
                                                 <span style={t.status === 'COMPLETED' ? styles.badgeGreen : styles.badgeOrange}>{t.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === 'settings' && (
                        <div>
                            <h2>⚙️ Settings</h2>
                            <div style={styles.card}>
                                <h4 style={{color: "#dc3545"}}>⚠️ Danger Zone</h4>
                                <p>Resetting the queue will delete all active appointments for the day.</p>
                                <button onClick={handleResetQueue} style={styles.deleteBtn}>Reset Queue System</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- STYLES ---
const styles = {
    container: { display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif", background: "#f8f9fc" },
    sidebar: { width: "250px", background: "#224abe", color: "white", display: "flex", flexDirection: "column", padding: "20px" },
    logo: { fontSize: "20px", fontWeight: "bold", marginBottom: "40px", textAlign: "center" },
    navBtn: { background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", padding: "15px", textAlign: "left", cursor: "pointer", fontSize: "16px", textTransform: "capitalize" },
    navActive: { background: "white", border: "none", color: "#224abe", padding: "15px", textAlign: "left", cursor: "pointer", fontSize: "16px", borderRadius: "8px", fontWeight: "bold", textTransform: "capitalize" },
    main: { flex: 1, display: "flex", flexDirection: "column" },
    topbar: { background: "white", padding: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", fontWeight: "bold" },
    content: { padding: "30px" },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
    statBox: { padding: "30px", borderRadius: "10px", color: "white", textAlign: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
    bigNumber: { fontSize: "40px", fontWeight: "bold", marginTop: "10px" },
    headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    table: { width: "100%", borderCollapse: "collapse", background: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" },
    trHead: { background: "#4e73df", color: "white" },
    th: { padding: "15px", textAlign: "left", fontSize: "14px", fontWeight: "600" },
    td: { padding: "15px", borderBottom: "1px solid #eee", fontSize: "14px", color: "#333" },
    addBtn: { background: "#1cc88a", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
    editBtn: { background: "#f6c23e", color: "white", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer", marginRight: "5px" },
    deleteBtn: { background: "#e74a3b", color: "white", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer" },
    cancelBtn: { background: "#858796", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", marginRight: "10px" },
    saveBtn: { background: "#4e73df", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" },
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modalContent: { background: "white", padding: "30px", borderRadius: "10px", width: "400px", boxShadow: "0 5px 15px rgba(0,0,0,0.3)" },
    formGrid: { display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" },
    formGroup: { display: "flex", flexDirection: "column", textAlign: "left" },
    input: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginTop: "5px" },
    modalActions: { display: "flex", justifyContent: "flex-end", marginTop: "20px" },
    card: { background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
    badgeGreen: { background: "#d4edda", color: "#155724", padding: "5px 10px", borderRadius: "20px", fontWeight: "bold" },
    badgeRed: { background: "#f8d7da", color: "#721c24", padding: "5px 10px", borderRadius: "20px", fontWeight: "bold" },
    badgeOrange: { background: "#fff3cd", color: "#856404", padding: "5px 10px", borderRadius: "20px", fontWeight: "bold" }
};

export default AdminDashboard;