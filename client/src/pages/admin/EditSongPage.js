// src/pages/admin/EditSongPage.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; 

function EditSongPage() {
    const { songId } = useParams(); 
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); 
    
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState('');
    const [genre, setGenre] = useState(''); // Genre state will now hold the selected genre
    
    const [audioFile, setAudioFile] = useState(null); 
    const [coverImage, setCoverImage] = useState(null); 
    
    const [existingAudioUrl, setExistingAudioUrl] = useState(''); 
    const [existingCoverUrl, setExistingCoverUrl] = useState(''); 
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(''); 

    // --- UPDATED: Hardcoded list of genres from your browseCategories ---
    const genreOptions = [
        "Top Hits", "Bollywood", "Punjabi", "Pop", "Ghazals", 
        "Workout", "Romance", "Party"
    ];

    useEffect(() => {
        const fetchSongDetails = async () => {
            if (!user || !user.token) {
                setError("You need to be logged in to edit songs."); 
                navigate('/admin/login'); 
                return;
            }

            setLoading(true);
            setError(''); 
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                
                const { data } = await axios.get(`/api/songs/${songId}`, config);
                
                setTitle(data.title);
                setArtist(data.artist);
                setAlbum(data.album || ''); 
                
                // Set the genre. Check if the fetched genre is in our options, if not, set to a default or keep as is.
                // For now, setting directly, assuming it's either in options or user will change it.
                setGenre(data.genre || ''); 
                
                setExistingAudioUrl(data.audioUrl); 
                setExistingCoverUrl(data.image); 
                
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to fetch song details.';
                setError(errorMessage);
                // Optionally, if song not found/access denied, redirect to manage songs
                // navigate('/admin/manage-songs'); 
            } finally {
                setLoading(false);
            }
        };

        fetchSongDetails();
    }, [songId, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('album', album);
        formData.append('genre', genre); 

        if (audioFile) {
            formData.append('audio_file', audioFile); 
        }
        if (coverImage) {
            formData.append('cover_art', coverImage); 
        }

        try {
            const config = {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}` 
                },
            };
            await axios.put(`/api/songs/${songId}`, formData, config);
            alert('Song updated successfully!'); // Simple alert
            navigate('/admin/manage-songs'); 
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update song.';
            setError(errorMessage);
            // alert(errorMessage); // Simple alert for error
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error && !loading) {
        return (
            <div className="admin-edit-song-page text-center p-5">
                <div className="alert alert-danger">{error}</div>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/admin/manage-songs')}>
                    Go to Manage Songs
                </button>
            </div>
        );
    }

    return (
        <div className="admin-edit-song-page">
            <h1 className="display-5 fw-bold mb-4">Edit Song</h1>
            {error && <div className="alert alert-danger">{error}</div>} 

            <div className="card border-secondary p-4">
                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input 
                            type="text" 
                            className="form-control bg-dark text-white border-secondary" 
                            id="title" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                        />
                    </div>
                    {/* Artist */}
                    <div className="mb-3">
                        <label htmlFor="artist" className="form-label">Artist</label>
                        <input 
                            type="text" 
                            className="form-control bg-dark text-white border-secondary" 
                            id="artist" 
                            value={artist} 
                            onChange={(e) => setArtist(e.target.value)} 
                            required 
                        />
                    </div>
                    {/* Album */}
                    <div className="mb-3">
                        <label htmlFor="album" className="form-label">Album (Optional)</label>
                        <input 
                            type="text" 
                            className="form-control bg-dark text-white border-secondary" 
                            id="album" 
                            value={album} 
                            onChange={(e) => setAlbum(e.target.value)} 
                        />
                    </div>
                    {/* Genre - Now uses your specified browseCategories */}
                    <div className="mb-3">
                        <label htmlFor="genre" className="form-label">Genre</label>
                        <select 
                            className="form-select bg-dark text-white border-secondary" 
                            id="genre" 
                            value={genre} 
                            onChange={(e) => setGenre(e.target.value)} 
                            required 
                        >
                            <option value="">-- Select a Genre --</option> 
                            {genreOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Audio File Update */}
                    <div className="mb-3">
                        <label htmlFor="audioFile" className="form-label">Update Audio File (Optional)</label>
                        {existingAudioUrl && (
                            <p className="text-muted small">Current Audio: 
                                <a href={existingAudioUrl} target="_blank" rel="noopener noreferrer" className="ms-2 text-decoration-none">
                                    {existingAudioUrl.split('/').pop()}
                                </a>
                            </p>
                        )}
                        <input 
                            type="file" 
                            className="form-control bg-dark text-white border-secondary" 
                            id="audioFile" 
                            accept="audio/*" 
                            onChange={(e) => setAudioFile(e.target.files[0])} 
                        />
                        <p className="small text-muted mt-1">Leave blank to keep current audio.</p>
                    </div>

                    {/* Cover Image Update */}
                    <div className="mb-3">
                        <label htmlFor="coverImage" className="form-label">Update Cover Image (Optional)</label>
                        {existingCoverUrl && (
                            <div className="mb-2">
                                <img src={existingCoverUrl} alt="Current Cover" className="img-thumbnail" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                <p className="text-muted small mt-1">Current Image</p>
                            </div>
                        )}
                        <input 
                            type="file" 
                            className="form-control bg-dark text-white border-secondary" 
                            id="coverImage" 
                            accept="image/*" 
                            onChange={(e) => setCoverImage(e.target.files[0])} 
                        />
                        <p className="small text-muted mt-1">Leave blank to keep current image.</p>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={() => navigate('/admin/manage-songs')}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={submitting}
                        >
                            {submitting ? 'Updating...' : 'Update Song'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditSongPage;