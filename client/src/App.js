import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';

// Components
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Footer from './components/Footer'; 
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

// User Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import UploadSongPage from './pages/UploadSongPage';
import AboutArtistPage from './pages/AboutArtistPage'; // <--- **NAYA IMPORT: AboutArtistPage add kiya**

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddSongPage from './pages/admin/AddSongPage';
import PendingApprovalsPage from './pages/admin/PendingApprovalsPage';
import ManageSongsPage from './pages/admin/ManageSongsPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import EditSongPage from './pages/admin/EditSongPage'; 

// Context
import { AuthContext } from './context/AuthContext';

// Main application CSS for global layout and sticky footer
import './App.css'; 

// ===== LAYOUT COMPONENTS =====

// Normal User ke liye Layout
const UserLayout = () => {
    return (
        <div className="d-flex user-layout-wrapper">
            <Sidebar />
            
            <div className="d-flex flex-column flex-grow-1 user-content-and-footer-wrapper">
                <main className="main-content-area p-4 player-padding-bottom"> 
                    <Outlet />
                </main>
                <Footer /> 
            </div>
        </div>
    );
};

// Admin ke liye Layout (No Change)
const AdminLayout = () => {
    const { logout } = useContext(AuthContext); 
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="flex-grow-1 d-flex flex-column admin-main-layout-content">
            <header className="admin-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Admin Panel</h4>
                <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                    Logout
                </button>
            </header>
            <main className="flex-grow-1 p-4 overflow-y-auto admin-main-content player-padding-bottom">
                <Outlet />
            </main>
        </div>
    );
};

// ===== MAIN APP COMPONENT =====

function App() {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlaySong = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
    };

    const handlePlayPause = (state) => { // Updated to accept state from Player.js
        if (currentSong) {
            setIsPlaying(state !== undefined ? state : !isPlaying); // Agar state explicit hai toh use karein, warna toggle
        }
    };

    const handleClosePlayer = () => {
        setCurrentSong(null); 
        setIsPlaying(false); 
    };

    const playerHeight = currentSong ? '90px' : '0px'; 

    return (
        <Router>
            <div className="main-app-wrapper" style={{ '--player-height': playerHeight }}>
                <div className="app-container">
                    <Routes>
                        {/* Auth pages (no layout) */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/admin/login" element={<AdminLoginPage />} />

                        {/* Normal User Routes (UserLayout ke andar) */}
                        <Route element={<UserLayout />}>
                            <Route path="/" element={<HomePage onPlaySong={handlePlaySong} />} />
                            <Route path="/search" element={<SearchPage onPlaySong={handlePlaySong} />} />
                            
                            {/* <--- **NAYA ROUTE: AboutArtistPage add kiya** ---> */}
                            <Route path="/artist/:id" element={<AboutArtistPage />} /> 

                            {/* Protected Routes AuthContext ka use kar rahe hain */}
                            <Route path="/library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                            <Route path="/upload" element={<ProtectedRoute><UploadSongPage /></ProtectedRoute>} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Route>

                        {/* Admin Routes (AdminProtectedRoute ke andar) */}
                        <Route path="/admin/*" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="add-song" element={<AddSongPage />} />
                            <Route path="pending-approvals" element={<PendingApprovalsPage />} />
                            <Route path="manage-songs" element={<ManageSongsPage />} />
                            <Route path="manage-users" element={<ManageUsersPage />} />
                            <Route path="edit-song/:songId" element={<EditSongPage />} /> 
                            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                        </Route>
                    </Routes>
                </div>
                
                {/* Player component, conditionally rendered and fixed at bottom */}
                {currentSong && !window.location.pathname.startsWith('/admin') && (
                    <Player 
                        currentSong={currentSong} 
                        isPlaying={isPlaying} 
                        onPlayPause={handlePlayPause}
                        onClosePlayer={handleClosePlayer}
                    />
                )}
            </div>
        </Router>
    );
}

export default App;