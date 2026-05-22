// src/models/Song.js
const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String },
    genre: { // <--- **YAHAN PAR GENRE FIELD ADD KAREIN**
        type: String,
        default: '', // Default value empty string ya null de sakte hain
    },
    cover_path: { type: String },
    file_path: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    uploaded_by_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // 'users' collection se jodo
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Song', songSchema);