import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css'; // Assuming Auth.css contains styling for this page

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Har submit par error ko clear karein

        // --- Client-side Validations ---
        if (!name.trim()) {
            setError('Please enter your full name.');
            return;
        }

        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }
        // Basic email format validation (more robust server-side validation is recommended)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (password.length < 6) { // Example: Minimum 6 characters for password
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        // --- End Client-side Validations ---

        try {
            const result = await register(name, email, password); // AuthContext se result lein
            
            if (result.success) {
                navigate('/'); // Register successful hone par homepage par bhej do
            } else {
                // Agar register function ne success: false return kiya (e.g., email already exists)
                setError(result.message || 'Registration failed.');
            }
        } catch (err) {
            // Network error ya AuthContext ke andar handle na kiya gaya error
            console.error("Registration failed:", err);
            setError('An unexpected error occurred. Please try again.');
        }
    };
    
    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <div className="text-center mb-4">
                    <h1 className="auth-title"><Link to="/"><span className="purple-text">Music</span>Vibes</Link></h1>
                    <p className="auth-subtitle">Create your account</p>
                </div>
                {/* Error message */}
                {error && <div className="alert alert-danger">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="name" 
                            placeholder="enter your full name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required // HTML5 validation bhi rakhein
                            autoComplete="name"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            placeholder="enter your email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password" 
                            placeholder="enter your password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="confirmPassword" 
                            placeholder="enter your confirm password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Create Account</button>
                </form>
                <p className="auth-switch-text mt-4">
                    Already have an account? <Link to="/login">Log in here</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;