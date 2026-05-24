import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    const { user, updateUser, logout } = useContext(AuthContext); 
    const navigate = useNavigate();

    // Form states for profile details
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    
    // Message state
    const [profileMessage, setProfileMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [phoneError, setPhoneError] = useState(''); // New state for phone validation error

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setGender(user.gender || 'Prefer not to say'); 
            setAddress(user.address || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhone(value);
        // Basic 10-digit validation
        if (value.length > 0 && !/^\d{10}$/.test(value)) {
            setPhoneError('Phone number must be exactly 10 digits.');
        } else {
            setPhoneError(''); // Clear error if valid or empty
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setProfileMessage('');
        setPhoneError(''); // Clear phone error on submit

        // Client-side validation for phone number
        if (phone.length > 0 && !/^\d{10}$/.test(phone)) {
            setPhoneError('Phone number must be exactly 10 digits.');
            setLoading(false);
            return; // Stop if validation fails
        }

        try {
            const config = { 
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}` 
                } 
            };
            
            const { data } = await axios.put('/api/users/profile', { 
                name, 
                gender, 
                address, 
                phone 
            }, config);
            
            updateUser(data); 
            setProfileMessage(data.message || 'Profile updated successfully!'); 
            
        } catch (error) {
            console.error("Profile update frontend error:", error); 
            setProfileMessage(error.response?.data?.message || 'Error updating profile');
            
        } finally {
            setLoading(false); 
        }
    };

    // Logout Handler Restore
    const handleLogout = () => {
        logout(); 
        navigate('/login');
    };

    if (!user) {
        return <p>Loading user profile...</p>; 
    }

    return (
        <div className="container py-4 position-relative"> {/* Added position-relative */}
            
            {/* FIX 1: Log Out Button Top-Right */}
            <button 
                onClick={handleLogout} 
                className="btn btn-danger btn-sm position-absolute top-0 end-0 mt-4 me-3 fw-bold"
            >
                Log Out
            </button>
            
            {/* Title Alignment */}
            <h1 className="display-5 fw-bold mb-4 text-white">Edit Profile</h1> 
            
            <div className="row justify-content-center"> 
                <div className="col-lg-8"> 
                    {/* CARD FIX: White background, Dark text */}
                    <div className="card upload-card bg-white text-dark" style={{ border: '1px solid #ccc' }}> 
                        <div className="card-body p-4">
                            <h5 className="card-title mb-4 text-dark">Your Details</h5>
                            {profileMessage && (
                                <div className={`alert ${profileMessage.includes('success') ? 'alert-success' : 'alert-danger'} mt-3`}>
                                    {profileMessage}
                                </div>
                            )}
                            <form onSubmit={handleProfileUpdate}>
                                {/* Email (Read-only) */}
                                <div className="mb-3">
                                    <label className="form-label text-dark">Email</label> 
                                    <input type="email" className="form-control bg-light text-dark border-secondary" value={user.email} disabled readOnly />
                                </div>
                                {/* Name */}
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label text-dark">Name</label> 
                                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="form-control bg-white text-dark border-secondary" required />
                                </div>
                                {/* Gender */}
                                <div className="mb-3">
                                    <label htmlFor="gender" className="form-label text-dark">Gender</label> 
                                    <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="form-select bg-white text-dark border-secondary">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>
                                {/* Address */}
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label text-dark">Address</label> 
                                    <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control bg-white text-dark border-secondary" />
                                </div>
                                {/* Phone Number */}
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label text-dark">Phone Number</label> 
                                    <input 
                                        type="tel" 
                                        id="phone" 
                                        value={phone} 
                                        onChange={handlePhoneChange} 
                                        className={`form-control bg-white text-dark border-secondary ${phoneError ? 'is-invalid' : ''}`} 
                                        maxLength="10" 
                                    />
                                    {phoneError && <div className="invalid-feedback">{phoneError}</div>}
                                </div>

                                <button type="submit" className="btn btn-primary w-100 mt-3" disabled={loading || !!phoneError}>
                                    {loading ? 'Saving Profile...' : 'Save Profile'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;