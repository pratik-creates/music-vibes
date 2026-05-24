import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { TrashFill } from 'react-bootstrap-icons';

function ManageUsersPage() {
    const { user: loggedInUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // useCallback use karke fetchUsers function ko stable banaya gaya hai.
    // Yehi React Hook warning ko fix karta hai.
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        if (loggedInUser?.token) {
            try {
                const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
                const { data } = await axios.get('/api/admin/users', config);
                setUsers(data);
            } catch (err) {
                // Agar 401/403 error aaye toh user ko log out kar dena chahiye.
                setError(err.response?.data?.message || 'Failed to fetch users. Check console for details.');
            }
            setLoading(false);
        } else {
            setLoading(false); // Agar user token nahi hai
        }
    }, [loggedInUser]); // Dependency sirf loggedInUser hai

    // useEffect hook ab fetchUsers par depend karta hai (jo stable hai).
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]); // Warning solved

    const handleDelete = async (userId) => {
        // IMPORTANT: window.confirm/alert use karna mana hai. Iski jagah custom modal UI use karein.
        // Hum yahaan seedha deletion proceed kar rahe hain, isko modal se replace karein.
        
        // Agar user khud ko delete kar raha hai, toh rok do
        if (userId === loggedInUser?._id) {
             setError("You cannot delete your own admin account.");
             return;
        }

        console.warn(`ACTION: User deletion initiated for ID ${userId}. Please implement a custom confirmation modal UI.`);

        try {
            const config = { headers: { Authorization: `Bearer ${loggedInUser.token}` } };
            await axios.delete(`/api/admin/users/${userId}`, config);
            
            console.log(`User ${userId} deleted successfully.`);
            setError(''); 
            
            // List refresh karein
            await fetchUsers(); 
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user.');
        }
    };

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" /></div>;

    return (
        <div>
            <h1 className="display-5 fw-bold mb-4">Manage Users</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="card border-secondary">
                <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge bg-${user.role === 'admin' ? 'success' : 'secondary'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        {/* Admin khud ko ya doosre admin ko delete nahi kar sakta */}
                                        {user.role !== 'admin' && (
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user._id)} title="Delete User">
                                                <TrashFill />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManageUsersPage;
