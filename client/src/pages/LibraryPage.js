import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, MusicNoteBeamed } from 'react-bootstrap-icons';

function LibraryPage() {
    const [mySongs, setMySongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMySongs = useCallback(async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            setError("Please login to view your library.");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get('/api/songs/mysongs', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMySongs(data);
            setError('');
        } catch (err) {
            console.error("Failed to fetch user's songs:", err);

            if (err.response && err.response.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.removeItem("token");
                window.location.href = "/login";
            } else {
                setError("Could not load your songs. Please try again later.");
            }
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        fetchMySongs();
    }, [fetchMySongs]);

    const StatusBadge = ({ status }) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="badge bg-warning text-dark">
                        <Clock size={14} className="me-1" /> Pending
                    </span>
                );
            case 'approved':
                return (
                    <span className="badge bg-success">
                        <CheckCircle size={14} className="me-1" /> Approved
                    </span>
                );
            case 'rejected':
                return (
                    <span className="badge bg-danger">
                        <XCircle size={14} className="me-1" /> Rejected
                    </span>
                );
            default:
                return <span className="badge bg-secondary">{status}</span>;
        }
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="display-4 fw-bold mb-4">Your Library</h1>
            <p className="lead text-secondary mb-4">
                Here are all the songs you've uploaded and their approval status.
            </p>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card border-secondary">
                <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Artist</th>
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mySongs.length > 0 ? (
                                mySongs.map((song) => (
                                    <tr key={song._id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <MusicNoteBeamed size={18} className="me-2 text-muted" />
                                                {song.title}
                                            </div>
                                        </td>
                                        <td>{song.artist}</td>
                                        <td className="text-center">
                                            <StatusBadge status={song.status} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted py-5">
                                        You haven't uploaded any songs yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default LibraryPage;
