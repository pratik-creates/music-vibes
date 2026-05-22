import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// react-bootstrap-icons ko import karein
import {
    Speedometer2, 
    MusicNoteBeamed, 
    ClockHistory, 
    People, 
    BoxArrowRight, 
    PlusCircleFill 
} from 'react-bootstrap-icons';
import { AuthContext } from '../../context/AuthContext'; // AuthContext ko import karein
import './AdminSidebar.css';

function AdminSidebar() {
    // AuthContext se logout function aur pendingSongsCount ko destructure karein
    const { logout, pendingSongsCount } = useContext(AuthContext); 
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <aside className="admin-sidebar d-flex flex-column flex-shrink-0 p-3">
            <a href="/admin/dashboard" className="sidebar-logo d-flex align-items-center mb-4 me-md-auto text-decoration-none">
                <span className="purple-text">Music</span>VIbes
                <span className="admin-badge">Admin</span>
            </a>
            
            <ul className="sidebar-nav nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <NavLink to="/admin/dashboard" className="nav-link">
                        <Speedometer2 className="me-2" size={20} />
                        Dashboard
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/add-song" className="nav-link">
                        <PlusCircleFill className="me-2" size={20} />
                        Add New Song
                    </NavLink>
                </li>
                {/* Pending Approvals Link (Notification Badge ke saath) */}
                <li>
                    <NavLink 
                        to="/admin/pending-approvals" 
                        className="nav-link d-flex justify-content-between align-items-center" // Flexbox classes add kiye hain
                    >
                        <span>
                            <ClockHistory className="me-2" size={20} />
                            Pending Approvals
                        </span>
                        {/* Agar pendingSongsCount 0 se zyada hai toh badge dikhayen */}
                        {pendingSongsCount > 0 && (
                            <span className="badge bg-danger rounded-pill">
                                {pendingSongsCount}
                            </span>
                        )}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/manage-songs" className="nav-link">
                        <MusicNoteBeamed className="me-2" size={20} />
                        Manage Songs
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/manage-users" className="nav-link">
                        <People className="me-2" size={20} />
                        Manage Users
                    </NavLink>
                </li>
            </ul>
            
            <div className="mt-auto">
                <button onClick={handleLogout} className="btn-logout d-flex align-items-center">
                    <BoxArrowRight className="me-2" size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
}

export default AdminSidebar;