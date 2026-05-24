const asyncHandler = require('express-async-handler');
// Sahi file names ke saath models ko import karein
const User = require('../models/User.js'); 
const Song = require('../models/Song.js'); 

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalSongs = await Song.countDocuments({ status: 'approved' });
    const pendingSongs = await Song.countDocuments({ status: 'pending' });
    
    res.json({ totalUsers, totalSongs, pendingSongs });
});

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (user) {
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete an admin user');
        }
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = { 
    getDashboardStats, 
    getAllUsers, 
    deleteUser 
};