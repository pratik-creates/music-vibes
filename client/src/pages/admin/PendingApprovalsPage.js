import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Check, X, PlayFill, MusicNoteBeamed } from 'react-bootstrap-icons';
import { Modal } from 'react-bootstrap';

function PendingApprovalsPage() {
    const { user } = useContext(AuthContext);
    const [pendingSongs, setPendingSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [songToPlay, setSongToPlay] = useState(null);

    const fetchPendingSongs = useCallback(async () => {
        if (user?.token) {
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/songs/pending', config);
                setPendingSongs(data);
            } catch (err) {
                setError('Failed to fetch pending songs.');
            }
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPendingSongs();
    }, [fetchPendingSongs]);

    const handleUpdateStatus = async (songId, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/songs/${songId}/status`, { status }, config);
            fetchPendingSongs();
        } catch (err) {
            setError(`Failed to ${status} song.`);
        }
    };

    const handleListen = (song) => { setSongToPlay(song); setShowModal(true); };
    const handleCloseModal = () => { setShowModal(false); setSongToPlay(null); };

    if (loading) {
        return <div className="text-center p-5"><div className="spinner-border text-primary" /></div>;
    }

    return (
        <div>
            <h1 className="display-5 fw-bold mb-4">Pending Approvals</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="card border-secondary">
                <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0 align-middle">
                        <thead>
                            <tr>
                                <th>Song Title / Artist</th>
                                <th>Uploaded By</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingSongs.length > 0 ? (
                                pendingSongs.map((song) => (
                                    <tr key={song._id}>
                                        <td>
                                            <p className="fw-bold mb-0">{song.title}</p>
                                            <p className="small text-muted mb-0">{song.artist}</p>
                                        </td>
                                        {/* Yahaan populate kiya hua user data use ho raha hai */}
                                        <td>{song.uploaded_by_user_id?.name || 'N/A'}</td>
                                        <td className="text-center">
                                            <button className="btn btn-sm btn-outline-light me-2" onClick={() => handleListen(song)} title="Listen"><PlayFill size={20} /></button>
                                            <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdateStatus(song._id, 'approved')} title="Approve"><Check size={20} /></button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleUpdateStatus(song._id, 'rejected')} title="Reject"><X size={20} /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" className="text-center text-muted py-5">No pending songs to review.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton closeVariant="white" className="bg-dark text-white border-secondary">
                    <Modal.Title><MusicNoteBeamed className="me-2" />{songToPlay?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark">
                    {songToPlay && <audio src={`http://localhost:5000/uploads/music/${songToPlay.file_path}`} controls autoPlay className="w-100"></audio>}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default PendingApprovalsPage;
