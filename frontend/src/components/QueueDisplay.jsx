import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QueueDisplay = () => {
    const [queue, setQueue] = useState([]);

    const fetchQueue = async () => {
        const res = await axios.get("http://localhost:8080/api/queue/list");
        setQueue(res.data);
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 5000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = async (id, status) => {
        await axios.put(`http://localhost:8080/api/queue/update/${id}?status=${status}`);
        fetchQueue();
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Doctor's Queue Management</h1>
            <table border="1" style={{ width: "100%", textAlign: "left" }}>
                <thead><tr><th>Token</th><th>Name</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                    {queue.map(q => (
                        <tr key={q.id}>
                            <td>{q.tokenNumber}</td>
                            <td>{q.patientName}</td>
                            <td style={{ color: q.status === "ACTIVE" ? "green" : "black" }}>{q.status}</td>
                            <td>
                                <button onClick={() => updateStatus(q.id, 'ACTIVE')}>Call Next</button>
                                <button onClick={() => updateStatus(q.id, 'COMPLETED')}>Done</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default QueueDisplay;