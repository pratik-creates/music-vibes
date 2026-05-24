import React, { useRef, useEffect, useState, useCallback } from 'react'; // useCallback import kiya
import { PlayFill, PauseFill, VolumeUpFill, VolumeMuteFill, XCircleFill } from 'react-bootstrap-icons'; 
import './Player.css';

function Player({ currentSong, isPlaying, onPlayPause, onClosePlayer }) { 
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);
    const hidePlayerTimeoutRef = useRef(null);

    const memoizedOnPlayPause = useCallback((state) => {
        onPlayPause(state);
    }, [onPlayPause]);

    // --- EFFECT 1: Update audio source when currentSong changes ---
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        const newSongSrc = `http://localhost:5000/uploads/music/${currentSong.file_path}`;
        if (audio.src !== newSongSrc) {
            audio.src = newSongSrc;
            setProgress(0);
            const handleCanPlay = () => {
                audio.play().catch(err => {
                    console.error('Autoplay error:', err);
                    memoizedOnPlayPause(false);
                });
                audio.removeEventListener('canplay', handleCanPlay);
            };
            audio.addEventListener('canplay', handleCanPlay);
            audio.load();
        }
    }, [currentSong, memoizedOnPlayPause]);


    // --- EFFECT 2: Handle play/pause for already-loaded song ---
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        // Only act if the audio source is already set (i.e. same song, just toggling)
        const expectedSrc = `http://localhost:5000/uploads/music/${currentSong.file_path}`;
        const srcMatches = audio.src === expectedSrc || audio.src.endsWith(currentSong.file_path);

        if (!srcMatches) return; // Effect 1 is handling the new song load + play

        if (isPlaying) {
            if (audio.paused) {
                audio.play().catch(error => { 
                    console.error("Error playing audio:", error); 
                    if (error.name === 'NotAllowedError' || error.name === 'AbortError') {
                        memoizedOnPlayPause(false);
                    }
                });
            }
            if (hidePlayerTimeoutRef.current) {
                clearTimeout(hidePlayerTimeoutRef.current);
                hidePlayerTimeoutRef.current = null;
            }
        } else {
            if (!audio.paused) {
                audio.pause();
            }
            if (!hidePlayerTimeoutRef.current) { 
                hidePlayerTimeoutRef.current = setTimeout(() => {
                    if (onClosePlayer) { onClosePlayer(); }
                    hidePlayerTimeoutRef.current = null; 
                }, 15000); 
            }
        }

        return () => {
            if (hidePlayerTimeoutRef.current) {
                clearTimeout(hidePlayerTimeoutRef.current);
            }
        };
    }, [isPlaying, currentSong, onClosePlayer, memoizedOnPlayPause]);

    // --- EFFECT 3: Set Volume ---
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
        }
    }, [volume]);

    // --- Handlers ---
    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio && !isNaN(audio.duration)) {
            const percentage = (audio.currentTime / audio.duration) * 100;
            setProgress(percentage);
        }
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (audio && !isNaN(audio.duration)) {
            const seekTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        }
    };
    
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
    };
    
    const formatTime = (timeInSeconds) => {
        if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSongEnded = () => { memoizedOnPlayPause(false); }; // <--- Ab memoizedOnPlayPause use kiya

    const handleCloseClick = () => {
        if (audioRef.current && isPlaying) { audioRef.current.pause(); }
        if (onClosePlayer) { onClosePlayer(); }
        if (hidePlayerTimeoutRef.current) {
            clearTimeout(hidePlayerTimeoutRef.current);
            hidePlayerTimeoutRef.current = null;
        }
    };

    if (!currentSong) { return null; }

    // const songSrc = `http://localhost:5000/uploads/music/${currentSong.file_path}`; // <--- **REMOVE THIS LINE**
    const coverSrc = currentSong.cover_path
        ? `http://localhost:5000/uploads/covers/${currentSong.cover_path}`
        : 'https://placehold.co/100x100/1DB954/FFFFFF?text=Music';

    return (
        <div className="player-container">
            <audio 
                ref={audioRef} 
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate} 
                onEnded={handleSongEnded} 
            />
            <div className="player-content-row">
                {/* Song Info */}
                <div className="player-song-info me-3">
                    <img src={coverSrc} alt={currentSong.title} className="rounded" />
                    <div className="player-song-details">
                        <h6 className="mb-0 text-white text-truncate">{currentSong.title}</h6>
                        <p className="mb-0 text-muted small">{currentSong.artist}</p>
                    </div>
                </div>

                {/* Player Controls */}
                <div className="flex-grow-1 d-flex flex-column align-items-center">
                    <button onClick={() => memoizedOnPlayPause(!isPlaying)} className="btn-play-pause">
                        {isPlaying ? <PauseFill size={32} /> : <PlayFill size={32} />}
                    </button>
                    <div className="d-flex align-items-center w-100 mt-1">
                        <span className="time-display">{formatTime(audioRef.current?.currentTime || 0)}</span>
                        <input type="range" className="form-range mx-2" value={progress || 0} onChange={handleSeek} />
                        <span className="time-display">{formatTime(audioRef.current?.duration || 0)}</span>
                    </div>
                </div>

                {/* Close Button */}
                <div className="player-close-button">
                    <XCircleFill size={24} onClick={handleCloseClick} className="text-muted" style={{cursor: 'pointer'}} />
                </div>

                {/* Volume Control */}
                <div className="player-volume-control">
                   {volume > 0 ? <VolumeUpFill size={20} /> : <VolumeMuteFill size={20} />}
                   <input type="range" className="form-range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} />
                </div>
            </div>
        </div>
    );
}

export default Player;