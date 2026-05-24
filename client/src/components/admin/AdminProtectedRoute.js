import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom'; // Outlet ko hata diya hai
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar'; // AdminSidebar yahan import hoga aur render bhi

// Yeh component check karega ki user admin hai ya nahi
const AdminProtectedRoute = ({ children }) => { // children prop ko receive karega
    const { user } = useContext(AuthContext);

    // Agar user login nahi hai ya uska role 'admin' nahi hai, to use admin login par bhejo
    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    // Agar user admin hai, to AdminSidebar ke saath children (jo App.js se <AdminLayout /> hoga) dikhao
    return (
        // *** IMPORTANT CHANGE: min-vh-100, d-flex classes added ***
        // Is outer div ko full viewport height do, taaki AdminSidebar apni height 100% le sake.
        <div className="d-flex min-vh-100 admin-page-wrapper"> 
            <AdminSidebar /> {/* <--- AdminSidebar ab sirf yahan render hoga (ek baar) */}
            {/* children prop yahan render hoga, jo ki <AdminLayout /> hoga */}
            {children} 
        </div>
    );
};

export default AdminProtectedRoute;