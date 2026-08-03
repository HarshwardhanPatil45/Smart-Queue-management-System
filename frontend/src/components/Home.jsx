import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showEmergency, setShowEmergency] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false); 
    };

    return (
        <div style={styles.container}>
            
            {/* NAVBAR */}
            <nav style={styles.navbar}>
                <div style={styles.logoContainer}>
                    <div style={styles.logo}> SmartQueue</div>
                </div>

                <div style={styles.desktopMenu}>
                    <span onClick={() => scrollToSection('hero')} style={styles.navLink}>Home</span>
                    <span onClick={() => scrollToSection('workflow')} style={styles.navLink}>How It Works</span>
                    <span onClick={() => scrollToSection('features')} style={styles.navLink}>Features</span>
                </div>

                <div style={styles.navActions}>
                    <button 
                        style={styles.emergencyBtn} 
                        onClick={() => setShowEmergency(true)}
                    >
                        🚑 Emergency
                    </button>
                    
                    <button onClick={() => navigate('/patient-login')} style={styles.loginBtn}>Patient Login</button>
                    <button onClick={() => navigate('/doctor-login')} style={styles.loginBtn}>Doctor Login</button>
                    <div style={styles.hamburger} onClick={toggleMenu}>☰</div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div style={styles.mobileMenu}>
                    <span onClick={() => scrollToSection('hero')} style={styles.mobileLink}>Home</span>
                    <span onClick={() => navigate('/doctor-login')} style={styles.mobileLink}>Doctor Portal</span>
                    <span onClick={() => navigate('/admin-login')} style={styles.mobileLink}>Admin Login</span>
                </div>
            )}

            {/* EMERGENCY MODAL */}
            {showEmergency && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalCard}>
                        <div style={styles.modalHeader}>
                            <h2>🚑 Emergency Assistance</h2>
                            <button onClick={() => setShowEmergency(false)} style={styles.closeBtn}>&times;</button>
                        </div>
                        
                        <p style={{color: "#555", marginBottom: "20px"}}>
                            <strong>Do not wait in the queue!</strong><br/>
                            If this is a life-threatening emergency, please contact us immediately or visit the Casualty Ward.
                        </p>

                        <div style={styles.actionGrid}>
                            <a href="tel:108" style={styles.actionBtnRed}>
                                <span style={{fontSize: "24px"}}>📞</span>
                                <div>
                                    <strong>Call Ambulance</strong>
                                    <div style={{fontSize: "12px"}}>Dial 108</div>
                                </div>
                            </a>

                            <a href="tel:9112345678" style={styles.actionBtnBlue}>
                                <span style={{fontSize: "24px"}}>🏥</span>
                                <div>
                                    <strong>Casualty Ward</strong>
                                    <div style={{fontSize: "12px"}}>Direct Line</div>
                                </div>
                            </a>
                        </div>

                        <div style={{marginTop: "20px", padding: "10px", background: "#fff3cd", color: "#856404", borderRadius: "5px", fontSize: "13px"}}>
                            ⚠️ <strong>Note:</strong> Emergency cases are treated Priority Level 1. Please proceed directly to the ground floor.
                        </div>
                    </div>
                </div>
            )}

            {/* HERO SECTION */}
            <header id="hero" style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>Smart Hospital <br/>Queue Management.</h1>
                    <p style={styles.heroSubtitle}>
                        Don't know which doctor to visit? <strong>Ask our AI.</strong> <br/>
                        Book a token, track your status live, and arrive only when it's your turn.
                    </p>
                    <div style={styles.heroButtons}>
                        <button onClick={() => navigate('/patient-login')} style={styles.ctaButton}>Book Token Now</button>
                    </div>
                </div>
                <div style={styles.heroImage}>
                    <img 
                        src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="Hospital Digital Queue" 
                        style={styles.image} 
                    />
                </div>
            </header>

            {/* HOW IT WORKS */}
            <section id="workflow" style={styles.sectionGray}>
                <h2 style={styles.sectionTitle}>How It Works</h2>
                <div style={styles.stepGrid}>
                    <div style={styles.stepCard}>
                        <div style={styles.stepNumber}>1</div>
                        <h3>Login</h3>
                        <p>Log in as a patient. Use the <strong>" Health Assistant"</strong> to type your symptoms (e.g., "heart pain").</p>
                    </div>
                    <div style={styles.stepCard}>
                        <div style={styles.stepNumber}>2</div>
                        <h3>Get Your Token</h3>
                        <p>Book the appointment. You receive a unique <strong>Token Number</strong> instantly.</p>
                    </div>
                    <div style={styles.stepCard}>
                        <div style={styles.stepNumber}>3</div>
                        <h3>Live Tracking</h3>
                        <p>Relax at home. Watch the <strong>Live Status Board</strong> on your dashboard.</p>
                    </div>
                    <div style={styles.stepCard}>
                        <div style={styles.stepNumber}>4</div>
                        <h3>Consultation</h3>
                        <p>When the Doctor clicks <strong>"Call Next"</strong>, your status turns GREEN.</p>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" style={styles.section}>
                <h2 style={styles.sectionTitle}>System Features</h2>
                <div style={styles.grid}>
                    <div style={styles.card}>
                        <div style={styles.icon}>🤖</div>
                        <h3>AI Symptom Checker</h3>
                        <p style={styles.cardText}>Built-in Intelligence that maps symptoms to doctors.</p>
                    </div>
                    <div style={styles.card}>
                        <div style={styles.icon}>📊</div>
                        <h3>Admin Dashboard</h3>
                        <p style={styles.cardText}>Admins can manage doctors, users and stats.</p>
                    </div>
                    <div style={styles.card}>
                        <div style={styles.icon}>🔒</div>
                        <h3>Secure OTP Login</h3>
                        <p style={styles.cardText}>Patients verify via Email OTP to prevent fake bookings.</p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={styles.footer}>
                <div style={{textAlign: "left"}}>
                    <h3 style={{color: "white", margin:0}}>🏥 SmartQueue</h3>
                    <p style={{fontSize:"12px", color: "#64748b"}}>Optimizing Patient Flow.</p>
                </div>
                <div style={styles.footerLinks}>
                    <span onClick={() => navigate('/admin-login')} style={styles.footerLink}>Admin Login</span>
                    <span style={styles.footerLink}>Privacy</span>
                </div>
            </footer>
        </div>
    );
};

// --- STYLES ---
const styles = {
    container: { fontFamily: "'Inter', sans-serif", color: "#1e293b", overflowX: "hidden", width: "100%", background: "#fff" },

    navbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 5%", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(12px)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 1000 },
    logoContainer: { display: "flex", alignItems: "center", gap: "15px" },
    logo: { fontSize: "22px", fontWeight: "800", color: "#0f172a" },

    desktopMenu: { display: "flex", gap: "30px", alignItems: "center" },
    navLink: { cursor: "pointer", fontWeight: "500", color: "#64748b", fontSize: "14px" },

    navActions: { display: "flex", gap: "10px", alignItems: "center" },
    emergencyBtn: { background: "#fee2e2", color: "#ef4444", border: "1px solid #fca5a5", padding: "8px 12px", borderRadius: "6px", fontWeight: "700", cursor: "pointer", fontSize: "13px" },
    loginBtn: { background: "#2563eb", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
    hamburger: { fontSize: "24px", cursor: "pointer", display: "none", marginLeft: "10px" },

    mobileMenu: { position: "absolute", top: "65px", left: 0, right: 0, background: "white", padding: "20px", display: "flex", flexDirection: "column", gap: "15px", boxShadow: "0 10px 15px rgba(0,0,0,0.1)", borderBottom: "1px solid #eee" },
    mobileLink: { fontSize: "16px", fontWeight: "500", color: "#334155", padding: "10px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer" },

    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 },
    modalCard: { background: "white", padding: "30px", borderRadius: "15px", width: "90%", maxWidth: "400px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", textAlign: "center" },
    modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "10px" },
    closeBtn: { background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#999" },

    actionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "20px" },
    actionBtnRed: { display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", padding: "15px", background: "#fee2e2", color: "#dc2626", borderRadius: "10px", textDecoration: "none", border: "1px solid #fca5a5" },
    actionBtnBlue: { display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", padding: "15px", background: "#e0f2fe", color: "#0284c7", borderRadius: "10px", textDecoration: "none", border: "1px solid #bae6fd" },

    hero: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "80px 5%", background: "linear-gradient(180deg, #f8fafc 0%, #fff 100%)", minHeight: "500px", flexWrap: "wrap" },
    heroContent: { flex: "1 1 500px", paddingRight: "40px", marginBottom: "40px" },
    heroTitle: { fontSize: "48px", fontWeight: "900", lineHeight: "1.1", marginBottom: "20px", color: "#0f172a" },
    heroSubtitle: { fontSize: "17px", color: "#64748b", marginBottom: "30px", lineHeight: "1.6", maxWidth: "550px" },
    heroButtons: { display: "flex", gap: "15px" },
    ctaButton: { padding: "14px 28px", fontSize: "15px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", boxShadow: "0 4px 6px rgba(37, 99, 235, 0.2)" },
    heroImage: { flex: "1 1 400px", display: "flex", justifyContent: "center" },
    image: { maxWidth: "100%", borderRadius: "20px", boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)" },

    section: { padding: "80px 5%", textAlign: "center", background: "white" },
    sectionGray: { padding: "80px 5%", textAlign: "center", background: "#f8fafc" },
    sectionTitle: { fontSize: "32px", fontWeight: "800", marginBottom: "50px", color: "#0f172a" },

    stepGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "30px" },
    stepCard: { background: "white", padding: "30px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", textAlign: "left", position: "relative" },
    stepNumber: { position: "absolute", top: "-15px", left: "20px", width: "40px", height: "40px", background: "#2563eb", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px" },

    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" },
    card: { padding: "30px", borderRadius: "15px", background: "#fff", border: "1px solid #f1f5f9", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", textAlign: "left" },
    icon: { fontSize: "35px", marginBottom: "15px", background: "#eff6ff", width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px" },
    cardText: { color: "#64748b", lineHeight: "1.5", fontSize: "14px" },

    footer: { padding: "40px 5%", background: "#1e293b", color: "#94a3b8", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #334155", flexWrap: "wrap", gap: "20px" },
    footerLinks: { display: "flex", gap: "20px", fontSize: "13px" },
    footerLink: { cursor: "pointer" }
};

export default Home;
