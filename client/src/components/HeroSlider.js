import React from 'react';
import { Carousel } from 'react-bootstrap';
import { PlayFill } from 'react-bootstrap-icons'; // Bootstrap Icons ka istemal karein
import './HeroSlider.css';

function HeroSlider({ songs, onPlay }) {
    // Hum sirf un gaano ko lenge jinki cover_path hai aur pehle 3 gaane
    const sliderSongs = songs.filter(song => song.cover_path).slice(0, 3);

    // Yadi slider ke liye koi gaana nahi hai, to ek placeholder dikhayein
    if (sliderSongs.length === 0) {
        return (
            <div className="hero-placeholder d-flex flex-column align-items-center justify-content-center p-4">
                <h1 className="display-4 text-muted text-center">No featured songs yet.</h1>
            </div>
        );
    }

    return (
        <Carousel fade>
            {sliderSongs.map((song) => (
                <Carousel.Item key={song._id} className="hero-slide-item">
                    <img
                        className="d-block w-100 hero-slide-img"
                        src={`http://localhost:5000/uploads/covers/${song.cover_path}`}
                        alt={song.title}
                    />
                    <div className="hero-gradient-overlay"></div>
                    
                    {/* Caption aur Play Button wapas add kiye gaye hain */}
                    <Carousel.Caption className="hero-slide-caption">
                        <p className="fw-bold mb-2">New Release</p>
                        <h1 className="display-2 fw-bolder text-truncate">{song.title}</h1>
                        <h3 className="mb-4">{song.artist}</h3>
                        <button className="btn btn-success btn-lg rounded-pill px-4" onClick={() => onPlay(song)}>
                            <PlayFill className="me-1" size={30} /> Play Now
                        </button>
                    </Carousel.Caption>

                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default HeroSlider;