const asyncHandler = require('express-async-handler');
const Song = require('../models/Song.js');
const fs = require('fs');
const path = require('path');

// @desc    Get all approved songs
const getAllApprovedSongs = asyncHandler(async (req, res) => {
    const songs = await Song.find({ status: 'approved' });
    res.json(songs);
});

// @desc    Search for songs (Updated to handle genre and q)
const searchSongs = asyncHandler(async (req, res) => {
    const { q, genre } = req.query; // q aur genre dono ko extract karein
    let filter = { status: 'approved' }; // Default filter: sirf approved songs

    console.log('Backend Search - Received q:', q, 'Genre:', genre); // Debug log

    // ************************************************************
    // *** CORRECTION: !q check removed/modified to allow genre only searches ***
    // Agar na to 'q' hai, na hi 'genre' hai, tab hi 400 error return karein.
    // Agar sirf 'genre' hai, toh allow karein.
    if (!q && !genre) {
        return res.status(400).json({ message: 'Search query (q) or genre is required.' });
    }
    // ************************************************************

    // Agar search query (q) hai
    if (q) {
        const regex = new RegExp(q, 'i');
        filter.$or = [{ title: regex }, { artist: regex }, { album: regex }]; // Album mein bhi search
    }

    // Agar genre query hai
    if (genre) {
        // Agar q bhi hai, toh genre ko $and operator ke saath combine karein
        if (filter.$or) {
            // $and ka use karke $or aur genre को combine karein
            filter.$and = [{ $or: filter.$or }, { genre: { $regex: genre, $options: 'i' } }];
            delete filter.$or; // Purani $or property ko hata do, ab $and mein hai
        } else {
            // Agar sirf genre filter hai
            filter.genre = { $regex: genre, $options: 'i' };
        }
    }
    
    console.log('Final Mongoose Filter Object:', JSON.stringify(filter)); // Debug log

    try {
        const songs = await Song.find(filter);
        console.log('Songs found for search/genre:', songs.length); // Debug log
        res.json(songs);
    } catch (error) {
        console.error("Error searching/filtering songs:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get user's own uploaded songs
const getMySongs = asyncHandler(async (req, res) => {
    const songs = await Song.find({ uploaded_by_user_id: req.user._id }).sort({ createdAt: -1 });
    res.json(songs);
});

// @desc    Upload new song (User)
const uploadSong = asyncHandler(async (req, res) => {
    const { title, artist, album, genre, duration } = req.body;
    
    if (!req.files || !req.files.audio_file || req.files.audio_file.length === 0) {
        res.status(400);
        throw new Error('Audio file is required.');
    }

    const audioFile = req.files.audio_file[0];
    const coverFile = req.files.cover_art ? req.files.cover_art[0] : null;

    const song = new Song({
        title,
        artist,
        album,
        genre,
        duration,
        file_path: audioFile.filename,
        cover_path: coverFile ? coverFile.filename : null,
        uploaded_by_user_id: req.user._id,
        status: 'pending', // User uploads are pending by default
    });

    const createdSong = await song.save();

    res.status(201).json({ 
        message: 'Song uploaded successfully! Submitted for admin approval.', 
        song: createdSong 
    });
});

// @desc    Get all pending songs (Admin)
const getPendingSongs = asyncHandler(async (req, res) => {
    const songs = await Song.find({ status: 'pending' })
        .populate('uploaded_by_user_id', 'name email')
        .sort({ createdAt: -1 });
    res.json(songs);
});

// <--- Naya Function Add Kiya Hai Yahin Par -->
// @desc    Pending songs ki count fetch karega
// @route   GET /api/songs/pending/count
// @access  Private/Admin (sirf admin access kar paayega)
const getPendingSongsCount = asyncHandler(async (req, res) => {
    // Database se 'pending' status wale songs ko count karein
    const count = await Song.countDocuments({ status: 'pending' });
    res.status(200).json({ count }); // Count ko JSON response mein bhejenge
});
// <--- Naya Function Yahan Tak Hai -->


// @desc    Get a single song by ID (Admin)
const getSongById = asyncHandler(async (req, res) => {
    const song = await Song.findById(req.params.id);
    if (song) {
        const audioUrl = `/uploads/music/${song.file_path}`;
        const imageUrl = song.cover_path ? `/uploads/covers/${song.cover_path}` : null;

        res.json({
            _id: song._id,
            title: song.title,
            artist: song.artist,
            album: song.album,
            genre: song.genre,
            duration: song.duration,
            audioUrl: audioUrl,
            image: imageUrl,
            status: song.status,
            uploaded_by_user_id: song.uploaded_by_user_id,
            createdAt: song.createdAt,
            updatedAt: song.updatedAt
        });
    } else {
        res.status(404);
        throw new Error('Song not found');
    }
});


// @desc    Update song status (Admin)
const updateSongStatus = asyncHandler(async (req, res) => {
    const song = await Song.findById(req.params.id);
    if (song) {
        song.status = req.body.status;
        const updatedSong = await song.save();
        res.json(updatedSong);
    } else {
        res.status(404);
        throw new Error('Song not found');
    }
});

// @desc    Update song details (Admin/Uploader)
const updateSongDetails = asyncHandler(async (req, res) => {
    const songId = req.params.id;
    const { title, artist, album, genre, duration } = req.body;

    let song = await Song.findById(songId);
    if (!song) {
        res.status(404);
        throw new Error('Song not found');
    }

    // --- Authorization Check (Example) ---
    // if (req.user.role !== 'admin' && song.uploaded_by_user_id.toString() !== req.user._id.toString()) {
    //     res.status(403);
    //     throw new Error('Not authorized to update this song');
    // }
    // --- End Authorization Check ---

    song.title = title || song.title;
    song.artist = artist || song.artist;
    song.album = album || song.album;
    song.genre = genre || song.genre;
    song.duration = duration || song.duration;

    if (req.files) {
        if (req.files.audio_file && req.files.audio_file.length > 0) {
            if (song.file_path && fs.existsSync(path.join(__dirname, '..', 'uploads', 'music', song.file_path))) {
                fs.unlinkSync(path.join(__dirname, '..', 'uploads', 'music', song.file_path));
            }
            song.file_path = req.files.audio_file[0].filename;
        }
        if (req.files.cover_art && req.files.cover_art.length > 0) {
            if (song.cover_path && fs.existsSync(path.join(__dirname, '..', 'uploads', 'covers', song.cover_path))) {
                fs.unlinkSync(path.join(__dirname, '..', 'uploads', 'covers', song.cover_path));
            }
            song.cover_path = req.files.cover_art[0].filename;
        }
    }

    const updatedSong = await song.save();

    const audioUrl = `/uploads/music/${updatedSong.file_path}`;
    const imageUrl = updatedSong.cover_path ? `/uploads/covers/${updatedSong.cover_path}` : null;

    res.json({
        message: 'Song updated successfully!',
        song: {
            _id: updatedSong._id,
            title: updatedSong.title,
            artist: updatedSong.artist,
            album: updatedSong.album,
            genre: updatedSong.genre,
            duration: updatedSong.duration,
            audioUrl: audioUrl,
            image: imageUrl,
            status: updatedSong.status,
            uploaded_by_user_id: updatedSong.uploaded_by_user_id,
            createdAt: updatedSong.createdAt,
            updatedAt: updatedSong.updatedAt
        }
    });
});


// @desc    Admin upload new song (Instantly Approved)
const adminUploadSong = asyncHandler(async (req, res) => {
    const { title, artist, album, genre, duration } = req.body;
    
    if (!req.files || !req.files.audio_file || req.files.audio_file.length === 0) {
        res.status(400);
        throw new Error('Audio file is required for admin upload.');
    }

    const audioFile = req.files.audio_file[0];
    const coverFile = req.files.cover_art ? req.files.cover_art[0] : null;

    const song = new Song({
        title,
        artist,
        album,
        genre,
        duration,
        file_path: audioFile.filename,
        cover_path: coverFile ? coverFile.filename : null,
        uploaded_by_user_id: req.user._id,
        status: 'approved',
    });

    const createdSong = await song.save();

    res.status(201).json({ 
        message: 'Song uploaded and instantly approved by Admin.', 
        song: createdSong 
    });
});


// @desc    Delete a song (Admin)
const deleteSong = asyncHandler(async (req, res) => {
    const song = await Song.findById(req.params.id);
    if (song) {
        const audioFilePath = path.join(__dirname, '..', 'uploads', 'music', song.file_path);
        if (fs.existsSync(audioFilePath)) { fs.unlinkSync(audioFilePath); }
        if (song.cover_path) {
            const coverFilePath = path.join(__dirname, '..', 'uploads', 'covers', song.cover_path);
            if (fs.existsSync(coverFilePath)) { fs.unlinkSync(coverFilePath); }
        }
        await song.deleteOne();
        res.json({ message: 'Song removed successfully' });
    } else {
        res.status(404);
        throw new Error('Song not found');
    }
});


// FINAL EXPORT OBJECT
module.exports = {
    getAllApprovedSongs,
    searchSongs,
    getMySongs,
    uploadSong,
    getPendingSongs,
    updateSongStatus,
    adminUploadSong,
    deleteSong,
    getSongById,
    updateSongDetails,
    getPendingSongsCount, // <--- Naya function yahan export kiya hai
};