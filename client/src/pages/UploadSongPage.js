import React, { useState, useContext } from 'react'; // useEffect ko hata diya gaya hai
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function UploadSongPage() {
    const { user } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState(user?.name || ''); // Default mein user ka naam daalein
    const [album, setAlbum] = useState('');
    const [genre, setGenre] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [coverArt, setCoverArt] = useState(null);
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!audioFile || !genre) {
            setError('Please fill all required fields (*) and upload an audio file.');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('album', album);
        formData.append('genre', genre);
        formData.append('audio_file', audioFile);
        if (coverArt) {
            formData.append('cover_art', coverArt);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post('/api/songs/upload', formData, config);
            
            setMessage('Song uploaded successfully! It is pending admin approval.');
            // Form ko reset karein
            setTitle(''); setArtist(user?.name || ''); setAlbum(''); setGenre('');
            setAudioFile(null); setCoverArt(null);
            e.target.reset();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload song.');
        }
        setLoading(false);
    };

    // Genres ki list
    const browseCategories = ["Bollywood", "Punjabi", "Pop", "Ghazals", "Workout", "Romance", "Party", "Top Hits"];

    return (
        <div>
            <header className="mb-4">
                <h1 className="display-5 fw-bold">Upload Your Music</h1>
                <p className="text-secondary">Share your talent with the MusicVibes community.</p>
            </header>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="card upload-card p-2 p-md-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            {/* Left Column: Text Inputs */}
                            <div className="col-lg-6">
                                <h5 className="mb-3">Song Details</h5>
                                <div className="mb-3"><label htmlFor="title" className="form-label">Song Title <span className="text-danger">*</span></label><input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-control bg-dark text-white border-secondary" /></div>
                                <div className="mb-3"><label htmlFor="artist" className="form-label">Artist Name <span className="text-danger">*</span></label><input type="text" id="artist" value={artist} onChange={(e) => setArtist(e.target.value)} required className="form-control bg-dark text-white border-secondary" /></div>
                                <div className="mb-3"><label htmlFor="album" className="form-label">Album (Optional)</label><input type="text" id="album" value={album} onChange={(e) => setAlbum(e.target.value)} className="form-control bg-dark text-white border-secondary" /></div>
                                <div className="mb-3"><label htmlFor="genre" className="form-label">Genre <span className="text-danger">*</span></label><select id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="form-select bg-dark text-white border-secondary" required><option value="" disabled>Select a genre</option>{browseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                            </div>
                            
                            {/* Right Column: File Inputs */}
                            <div className="col-lg-6">
                                <h5 className="mb-3">Media Files</h5>
                                <div className="mb-3"><label htmlFor="coverArt" className="form-label">Cover Art (Optional)</label><input className="form-control bg-dark text-white border-secondary" type="file" id="coverArt" onChange={(e) => setCoverArt(e.target.files[0])} accept="image/jpeg,image/png" /></div>
                                <div className="mb-3"><label htmlFor="audioFile" className="form-label">Audio File <span className="text-danger">*</span></label><input className="form-control bg-dark text-white border-secondary" type="file" id="audioFile" onChange={(e) => setAudioFile(e.target.files[0])} accept="audio/mpeg,audio/wav" required /></div>
                            </div>
                        </div>
                        
                        <hr className="my-4 border-secondary" />
                        <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
                            {loading ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : <i className="bi bi-cloud-arrow-up-fill me-2"></i>}
                            {loading ? 'Uploading...' : 'Upload and Submit'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UploadSongPage;
