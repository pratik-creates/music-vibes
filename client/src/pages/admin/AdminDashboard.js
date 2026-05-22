import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
// Sahi icon library se icons import karein
import { PeopleFill, MusicNoteBeamed, ClockHistory } from 'react-bootstrap-icons';

// Alag se StatCard component banayein taaki code saaf rahe
const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="col-md-4">
        <div className={`card h-100 text-white p-3 border-0 ${colorClass}`}>
            <div className="d-flex align-items-center">
                <div className={`p-3 bg-white bg-opacity-25 rounded-circle me-3`}>
                    {icon}
                </div>
                <div>
                    <p className="text-white-50 mb-0">{title}</p>
                    <h2 className="fw-bold mb-0">{value}</h2>
                </div>
            </div>
        </div>
    </div>
);

function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null); // Shuruaat mein null rakhein
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            if (user?.token) {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${user.token}` },
                    };
                    // Relative URL ka istemal karein
                    const { data } = await axios.get('/api/admin/stats', config);
                    setStats(data);
                } catch (error) {
                    setError('Failed to fetch dashboard stats.');
                    console.error('Failed to fetch dashboard stats:', error);
                }
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    return (
        <div>
            <h1 className="display-5 fw-bold">Dashboard</h1>
            <p className="lead text-secondary mb-5">Welcome back, {user?.name}!</p>
            
            {loading ? (
                <div className="text-center"><div className="spinner-border text-primary" /></div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <div className="row g-4">
                    <StatCard 
                        title="Total Users" 
                        value={stats.totalUsers} 
                        icon={<PeopleFill size={32} />}
                        colorClass="bg-primary" 
                    />
                    <StatCard 
                        title="Approved Songs" 
                        value={stats.totalSongs} 
                        icon={<MusicNoteBeamed size={32} />}
                        colorClass="bg-success"
                    />
                    <StatCard 
                        title="Pending Approvals" 
                        value={stats.pendingSongs} 
                        icon={<ClockHistory size={32} />}
                        colorClass="bg-warning"
                    />
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;