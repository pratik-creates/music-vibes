import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pendingSongsCount, setPendingSongsCount] = useState(0);

    const API_URL = 'http://localhost:5000/api/users';
    const SONGS_API_URL = 'http://localhost:5000/api/songs';

    // ===== LOAD USER ON REFRESH =====
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // ===== FETCH PENDING SONGS (ADMIN) =====
    const fetchPendingSongsCount = useCallback(async () => {
        const token = localStorage.getItem("token");

        if (user && token && user.role === 'admin') {
            try {
                const { data } = await axios.get(
                    `${SONGS_API_URL}/pending/count`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setPendingSongsCount(data.count);
            } catch (error) {
                console.error("Pending songs fetch error:", error);
                logout();
            }
        }
    }, [user]);

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchPendingSongsCount();
        } else {
            setPendingSongsCount(0);
        }
    }, [user, fetchPendingSongsCount]);

    // ===== REGISTER =====
    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/register`, {
                name,
                email,
                password,
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data));

            setUser(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed",
            };
        }
    };

    // ===== LOGIN (🔥 MAIN FIX HERE) =====
    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/login`, {
                email,
                password,
            });

            // 🔥 MOST IMPORTANT FIX
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data));

            setUser(data);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Invalid email or password",
            };
        }
    };

    // ===== LOGOUT =====
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setPendingSongsCount(0);
    };

    if (loading) {
        return <div>Loading MusicVibes...</div>;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                pendingSongsCount,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
