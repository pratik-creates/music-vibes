import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { TrashFill, PencilSquare } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

function ManageSongsPage() {
    const { user } = useContext(AuthContext);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSongs = async () => {
        setLoading(true);
        try {
            // Yeh ek public route hai, isliye token ki zaroorat nahi
            const { data } = await axios.get('/api/songs');
            setSongs(data);
        } catch (err) {
            setError('Failed to fetch songs.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSongs();
    }, []);

    const handleDelete = async (songId) => {
        if (window.confirm('Are you sure you want to PERMANENTLY delete this song?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                await axios.delete(`/api/songs/${songId}`, config);
                fetchSongs(); // Delete karne ke baad list ko refresh karein
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete song.');
            }
        }
    };

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" /></div>;

    return (
        <div>
            <h1 className="display-5 fw-bold mb-4">Manage Songs</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="card border-secondary">
                <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0 align-middle">
                        <thead>
                            <tr>
                                <th>Title / Artist</th>
                                <th>Album</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {songs.map(song => (
                                <tr key={song._id}>
                                    <td>
                                        <p className="fw-bold mb-0">{song.title}</p>
                                        <p className="small text-muted mb-0">{song.artist}</p>
                                    </td>
                                    <td>{song.album || 'N/A'}</td>
                                    <td className="text-center">
                                        <Link to={`/admin/edit-song/${song._id}`} className="btn btn-sm btn-primary me-2" title="Edit Song">
                                            <PencilSquare />
                                        </Link>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(song._id)} title="Delete Song">
                                            <TrashFill />
                                        </button>
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

export default ManageSongsPage;