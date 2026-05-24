// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User ka blueprint (Schema) banayein
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Har email unique hona chahiye
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Sirf ye do values ho sakti hain
        default: 'user'
    },
    // --- Naye Fields Yahan Add Kiye Gaye Hain ---
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        default: 'Prefer not to say' // Default value set kiya
    },
    address: {
        type: String,
        trim: true,
        default: '' // Default value empty string
    },
    phone: {
        type: String,
        trim: true,
        default: '' // Default value empty string
    }
    // --- Naye Fields Ka Ant ---
}, {
    timestamps: true // 'createdAt' aur 'updatedAt' fields apne aap ban jayengi
});

// Password ko save karne se PEHLE hash karne ka logic
userSchema.pre('save', async function(next) {
    // Yadi password modify nahi hua hai, to aage badh jaayein
    if (!this.isModified('password')) {
        return next();
    }
    // Password ko hash karein
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Model banayein
const User = mongoose.model('User', userSchema);

module.exports = User;