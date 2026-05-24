const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { protect, admin } = require('../middleware/authMiddleware');
const {
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
    getPendingSongsCount // <--- Naya function yahan import kiya hai
} = require('../controllers/songController');

// --- Multer File Upload Setup ---
const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (file.fieldname === 'audio_file') {
            cb(null, 'uploads/music/');
        } else if (file.fieldname === 'cover_art') {
            cb(null, 'uploads/covers/');
        }
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// ===== PUBLIC ROUTES =====
router.get('/', getAllApprovedSongs);
router.get('/search', searchSongs);

// ===== PRIVATE USER ROUTES =====
router.get('/mysongs', protect, getMySongs);
router.post(
    '/upload', 
    protect, 
    upload.fields([{ name: 'audio_file', maxCount: 1 }, { name: 'cover_art', maxCount: 1 }]), 
    uploadSong
);

// ===== PRIVATE ADMIN ROUTES & COMMON ROUTES FOR SONG ID =====

// Admin: Pending songs ki count fetch karega
router.get('/pending/count', protect, admin, getPendingSongsCount); // <--- YEH NAYA ROUTE HAI

// **CRITICAL FIX: '/pending' route ko '/:id' route se pehle move kiya**
router.get('/pending', protect, admin, getPendingSongs); // <--- YEAH WALA ROUTE UPAR AAYEGA

// Admin Upload
router.post(
    '/admin-upload', 
    protect, 
    admin, 
    upload.fields([{ name: 'audio_file', maxCount: 1 }, { name: 'cover_art', maxCount: 1 }]), 
    adminUploadSong
);

// Fetch a single song by ID (Used by EditSongPage)
router.get('/:id', protect, admin, getSongById); // <--- Yeh route ab /pending ke baad hai

// Update a song by ID (Used by EditSongPage)
router.put(
    '/:id', 
    protect, 
    admin, 
    upload.fields([{ name: 'audio_file', maxCount: 1 }, { name: 'cover_art', maxCount: 1 }]), 
    updateSongDetails
);

// Update song status (should also be specific or use :id wisely)
// Since this uses /:id, it should come after /pending
router.put('/:id/status', protect, admin, updateSongStatus); 

// Delete a song (also uses :id)
router.delete('/:id', protect, admin, deleteSong);

module.exports = router;