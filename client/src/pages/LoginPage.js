import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // login function ko call karein
            await login(email, password);
            // Agar login successful hai, to homepage par navigate karein
            navigate('/');
        } catch (err) {
            // Agar koi error aati hai, to use display karein
            setError(err.response?.data?.message || 'Failed to log in. Please check your credentials.');
        }
    };
    
    return (
        <div className="auth-container">
             <div className="auth-form-container">
                <div className="text-center mb-4">
                    <h1 className="auth-title"><Link to="/"><span className="purple-text">Music</span>Vibes</Link></h1>
                    <p className="auth-subtitle">Welcome back! Please log in.</p>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input type="email" className="form-control" id="email" placeholder="enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" placeholder="enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Log In</button>
                </form>
                <p className="auth-switch-text mt-4">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;

