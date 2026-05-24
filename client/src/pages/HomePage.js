import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Fetch ki jagah axios ka istemal karein
import { AuthContext } from '../context/AuthContext';
import HeroSlider from '../components/HeroSlider';
import SongCard from '../components/SongCard';
import './HomePage.css';

function HomePage({ onPlaySong }) {
    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Error ke liye nayi state
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [songsResponse, artistsResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/songs'),
                    axios.get('http://localhost:5000/api/artists')
                ]);
                
                setSongs(songsResponse.data);
                setArtists(artistsResponse.data.slice(0, 4));
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to load data. Is the backend server running?"); // Error message set karein
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Agar data fetch karte waqt error aata hai, to error message dikhayein
    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center text-center" style={{ height: '80vh' }}>
                <div>
                    <h2 className="text-danger">Oops! Something went wrong.</h2>
                    <p className="text-secondary">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <HeroSlider songs={songs} onPlay={onPlaySong} user={user} />
            
            <div className="container-fluid px-4">
                {/* Sections... */}
                <div className="mt-5">
                    <h2 className="section-title">All Song</h2>
                    <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
                        {songs.slice(0, 5).map(song => (
                            <div className="col" key={song._id}>
                                <SongCard song={song} onPlay={onPlaySong} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-5">
                    <h2 className="section-title">Featured Artists</h2>
                    <div className="row row-cols-2 row-cols-md-4 g-4">
                        {artists.map(artist => (
                            <div key={artist._id} className="col text-center">
                                <Link to={`/artist/${artist._id}`} className="text-decoration-none">
                                    <div className="artist-card">
                                        <img 
                                            src={`http://localhost:5000/uploads/artists/${artist.image_path}`} 
                                            alt={artist.name} 
                                            className="artist-img rounded-circle mb-2"
                                        />
                                        <h5 className="fw-bold mt-2 text-white">{artist.name}</h5>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;