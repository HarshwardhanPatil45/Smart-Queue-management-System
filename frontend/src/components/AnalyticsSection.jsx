import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell 
} from 'recharts';

const AnalyticsSection = ({ doctors, patients, appointments }) => {

    // --- 1. PREPARE DATA FOR PIE CHART (Patient Status) ---
    const verifiedCount = patients.filter(p => p.verified).length;
    const unverifiedCount = patients.length - verifiedCount;
    
    const pieData = [
        { name: 'Verified', value: verifiedCount },
        { name: 'Unverified', value: unverifiedCount }
    ];
    const COLORS = ['#00C49F', '#FF8042'];

    // --- 2. PREPARE DATA FOR BAR CHART (Appointments per Doctor) ---
    // This logic counts how many appointments each doctor has
    const doctorStats = doctors.map(doc => {
        // Find appointments for this specific doctor
        // (Assuming appointments have a doctorId or doctorName field)
        const count = appointments.filter(app => app.doctor && app.doctor.id === doc.id).length;
        
        return {
            name: doc.name.split(' ')[1] || doc.name, // Display Last Name only for cleaner look
            appointments: count 
        };
    });

    return (
        <div style={styles.container}>
            
            {/* LEFT: BAR CHART */}
            <div style={styles.chartBox}>
                <h3 style={styles.title}>📊 Doctor Workload</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={doctorStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="appointments" fill="#8884d8" name="Active Appointments" radius={[5, 5, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* RIGHT: PIE CHART */}
            <div style={styles.chartBox}>
                <h3 style={styles.title}>👥 Patient Verification</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie 
                                data={pieData} 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={60} 
                                outerRadius={80} 
                                fill="#8884d8" 
                                paddingAngle={5} 
                                dataKey="value" 
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// Internal Styles
const styles = {
    container: { display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' },
    chartBox: { flex: 1, minWidth: '300px', background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    title: { textAlign: 'center', marginBottom: '15px', color: '#555', fontSize: '18px' }
};

export default AnalyticsSection;