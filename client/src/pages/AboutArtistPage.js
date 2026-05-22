import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // URL se ID nikalne ke liye
import axios from 'axios';

const AboutArtistPage = () => {
    const { id } = useParams(); // URL se artist ki ID nikalta hai
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/artists/${id}`);
                setArtist(response.data);
            } catch (error) {
                console.error("Failed to fetch artist:", error);
            }
            setLoading(false);
        };

        fetchArtist();
    }, [id]); // Yeh effect tab chalega jab ID badlegi

    if (loading) {
        return <div className="p-4"><h2>Loading Artist...</h2></div>;
    }

    if (!artist) {
        return <div className="p-4"><h2>Artist not found.</h2></div>;
    }

    return (
        <main className="main-content flex-grow-1 p-4">
            <div className="about-artist-container container">
                <div className="row align-items-center">
                    <div className="col-md-4 text-center">
                        <img 
                            src={`http://localhost:5000/uploads/artists/${artist.image_path}`} 
                            className="img-fluid rounded-circle shadow-lg" 
                            alt={artist.name} 
                        />
                    </div>
                    <div className="col-md-8">
                        <h1 className="display-4 fw-bold mt-4 mt-md-0">{artist.name}</h1>
                        <p className="lead text-secondary">Artist</p>
                        <p className="artist-bio mt-4">
                            {artist.bio}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AboutArtistPage;