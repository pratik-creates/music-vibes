import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { HouseDoorFill, Search, CollectionPlayFill, CloudArrowUpFill, PersonCircle, BoxArrowRight, X } from 'react-bootstrap-icons';
import './Sidebar.css';

function Sidebar({ isOpen, onClose }) {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Dark overlay — only rendered on mobile when sidebar is open */}
            {isOpen && (
                <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />
            )}

            <aside className={`sidebar d-flex flex-column flex-shrink-0 p-3${isOpen ? ' sidebar-open' : ''}`}>

                {/* Close button — only visible on mobile */}
                <button className="sidebar-close-btn" onClick={onClose} aria-label="Close navigation menu">
                    <X size={24} />
                </button>

                <NavLink to="/" className="sidebar-brand text-decoration-none h4 mb-4" onClick={onClose}>
                    <span className="brand-accent">Music</span>Vibes
                </NavLink>

                <ul className="sidebar-nav nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <NavLink to="/" className="nav-link" end onClick={onClose}>
                            <HouseDoorFill className="me-2" size={20} />
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/search" className="nav-link" onClick={onClose}>
                            <Search className="me-2" size={20} />
                            Search
                        </NavLink>
                    </li>
                    {user && (
                        <>
                            <li>
                                <NavLink to="/library" className="nav-link" onClick={onClose}>
                                    <CollectionPlayFill className="me-2" size={20} />
                                    Your Library
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/upload" className="nav-link" onClick={onClose}>
                                    <CloudArrowUpFill className="me-2" size={20} />
                                    Upload Song
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>

                <div className="mt-auto">
                    {user ? (
                        <div className="user-profile-container">
                            <NavLink to="/profile" className="user-profile d-flex align-items-center text-decoration-none" onClick={onClose}>
                                <PersonCircle className="me-2" size={24} />
                                <span className="fw-bold">{user.name}</span>
                            </NavLink>
                            <button onClick={handleLogout} className="btn-logout" title="Log Out">
                                <BoxArrowRight size={20} />
                            </button>
                        </div>
                    ) : (
                        <NavLink to="/login" className="btn btn-primary w-100" onClick={onClose}>
                            Log In
                        </NavLink>
                    )}
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
