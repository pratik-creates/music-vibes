import React from 'react';
// Lucide ki jagah react-bootstrap-icons se PlayFill import karein
import { PlayFill } from 'react-bootstrap-icons'; 
import './SongCard.css';

function SongCard({ song, onPlay }) {
  const coverImage = song.cover_path
    ? `http://localhost:5000/uploads/covers/${song.cover_path}`
    : 'https://placehold.co/300x300/1DB954/FFFFFF?text=Music';

  const handleCardClick = () => {
    onPlay(song);
  };

  return (
    <div className="song-card card text-white" onClick={handleCardClick}>
      <div className="card-img-container">
        <img src={coverImage} className="card-img-top" alt={song.title} />
        <button className="play-button btn btn-success rounded-circle">
          {/* <Play> ki jagah <PlayFill> ka istemal karein */}
          <PlayFill />
        </button>
      </div>
      <div className="card-body">
        <h5 className="card-title text-truncate">{song.title}</h5>
        <p className="card-text text-truncate">{song.artist}</p>
      </div>
    </div>
  );
}

export default SongCard;