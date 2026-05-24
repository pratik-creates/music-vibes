import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Speedometer2, 
    MusicNoteBeamed, 
    ClockHistory, 
    People, 
    BoxArrowRight, 
    PlusCircleFill,
    List,
    X
} from 'react-bootstrap-icons';
import { AuthContext } from '../../context/AuthContext';
import './AdminSidebar.css';

function AdminSidebar() {
    const { logout, pendingSongsCount } = useContext(AuthContext); 
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            {/* Hamburger button - only visible on mobile */}
            <button
                className="admin-sidebar-hamburger"
                onClick={() => setIsOpen(true)}
                aria-label="Open admin navigation menu"
            >
                <List size={26} />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div className="admin-sidebar-overlay" onClick={closeSidebar} aria-hidden="true" />
            )}

            <aside className={`admin-sidebar d-flex flex-column flex-shrink-0 p-3${isOpen ? ' admin-sidebar-open' : ''}`}>
                {/* Close button inside sidebar on mobile */}
                <button className="admin-sidebar-close-btn" onClick={closeSidebar} aria-label="Close admin navigation menu">
                    <X size={24} />
                </button>

                <a href="/admin/dashboard" className="sidebar-logo d-flex align-items-center mb-4 me-md-auto text-decoration-none" onClick={closeSidebar}>
                    <span className="purple-text">Music</span>VIbes
                    <span className="admin-badge">Admin</span>
                </a>
                
                <ul className="sidebar-nav nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <NavLink to="/admin/dashboard" className="nav-link" onClick={closeSidebar}>
                            <Speedometer2 className="me-2" size={20} />
                            Dashboard
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/admin/add-song" className="nav-link" onClick={closeSidebar}>
                            <PlusCircleFill className="me-2" size={20} />
                            Add New Song
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/admin/pending-approvals" 
                            className="nav-link d-flex justify-content-between align-items-center"
                            onClick={closeSidebar}
                        >
                            <span>
                                <ClockHistory className="me-2" size={20} />
                                Pending Approvals
                            </span>
                            {pendingSongsCount > 0 && (
                                <span className="badge bg-danger rounded-pill">
                                    {pendingSongsCount}
                                </span>
                            )}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/manage-songs" className="nav-link" onClick={closeSidebar}>
                            <MusicNoteBeamed className="me-2" size={20} />
                            Manage Songs
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/manage-users" className="nav-link" onClick={closeSidebar}>
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
        </>
    );
}

export default AdminSidebar;