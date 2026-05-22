import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { HouseDoorFill, Search, CollectionPlayFill, CloudArrowUpFill, PersonCircle, BoxArrowRight, ShieldLockFill } from 'react-bootstrap-icons';
import './Sidebar.css';

function Sidebar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Logout ke baad login page par bhejein
    };

    return (
        <aside className="sidebar d-flex flex-column flex-shrink-0 p-3">
            {/* THEEK KIYA GAYA: <a> tag ko NavLink se badla gaya */}
            <NavLink to="/" className="sidebar-brand text-decoration-none h4 mb-4">
                <span className="brand-accent">Music</span>Vibes
            </NavLink>
            
            <ul className="sidebar-nav nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <NavLink to="/" className="nav-link" end>
                        <HouseDoorFill className="me-2" size={20} />
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/search" className="nav-link">
                        <Search className="me-2" size={20} />
                        Search
                    </NavLink>
                </li>
                {user && (
                    <>
                        <li>
                            <NavLink to="/library" className="nav-link">
                                <CollectionPlayFill className="me-2" size={20} />
                                Your Library
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/upload" className="nav-link">
                                <CloudArrowUpFill className="me-2" size={20} />
                                Upload Song
                            </NavLink>
                        </li>
                    </>
                )}
            </ul>
            
            <div className="mt-auto">
                <div className="text-center mb-3 border-top pt-3">
                    <NavLink to="/admin/login" className="admin-icon-link" title="Admin Login">
                        <ShieldLockFill size={24} />
                        <span className="d-block small mt-1">Admin Panel</span>
                    </NavLink>
                </div>

                {user ? (
                    <div className="user-profile-container">
                         <NavLink to="/profile" className="user-profile d-flex align-items-center text-decoration-none">
                            <PersonCircle className="me-2" size={24} />
                            <span className="fw-bold">{user.name}</span>
                        </NavLink>
                        <button onClick={handleLogout} className="btn-logout" title="Log Out">
                            <BoxArrowRight size={20} />
                        </button>
                    </div>
                ) : (
                    <NavLink to="/login" className="btn btn-primary w-100">
                        Log In
                    </NavLink>
                )}
            </div>
        </aside>
    );
}

export default Sidebar;