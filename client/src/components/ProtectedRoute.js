import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Yeh component check karega ki user login hai ya nahi
const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    if (!user) {
        // Yadi user login nahi hai, to use login page par bhej do
        // state={{ from: location }} isliye taaki login ke baad user wapas اسی page par aa sake
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Yadi user login hai, to page ko dikhao
    return children;
};

export default ProtectedRoute;
