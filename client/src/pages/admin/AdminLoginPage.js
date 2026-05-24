import React, { useState, useContext, useEffect } from 'react'; // useEffect import kiya
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../Auth.css';

function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useContext(AuthContext); // 'user' ko AuthContext se nikala
    const navigate = useNavigate();

    // Jab component mount ho, toh fields ko empty karein
    useEffect(() => {
        setEmail('');
        setPassword('');
        setError('');

        // *** Conditional Redirect: Agar user already logged in hai AUR admin hai toh dashboard par bhej do ***
        if (user && user.role === 'admin') { 
            navigate('/admin/dashboard');
        }
    }, [user, navigate]); // user aur navigate par dependency

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const userData = await login(email, password);
            // Check karein ki user admin hai ya nahi
            if (userData && userData.role === 'admin') {
                navigate('/admin/dashboard'); // Agar admin hai, to dashboard par bhejein
            } else {
                // Agar user logged in ho gaya lekin admin nahi hai
                // Toh use logout kar dein aur error dikhayein
                setError('Access Denied. You are not an admin. Logging out...');
                // Optional: Yahan par aap AuthContext ka logout function call kar sakte hain
                // taaki non-admin user agar admin login page se login karle toh logout ho jaye
                // For example: AuthContext.logout();
                // Iske liye AuthContext se logout bhi extract karna hoga.
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to log in');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <div className="text-center mb-4">
                    <h1 className="auth-title"><Link to="/"><span className="purple-text">Music</span>Vibes</Link></h1>
                    <p className="auth-subtitle">Admin Panel Login</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Admin Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="username" // Browser auto-fill ke liye
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password" // Browser auto-fill ke liye
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Log In as Admin</button>
                </form>
                <p className="text-center mt-4"><Link to="/" className="text-muted small">&larr; Back to Main Site</Link></p>
            </div>
        </div>
    );
}

export default AdminLoginPage;