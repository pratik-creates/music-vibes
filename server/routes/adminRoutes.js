const express = require('express');
const router = express.Router();
const { 
    getDashboardStats, 
    getAllUsers, 
    deleteUser // Naye function ko import karein
} = require('../controllers/AdminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Sabhi admin routes
router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);

// NAYA ROUTE: User ko delete karne ke liye
router.delete('/users/:id', protect, admin, deleteUser);

// Promote wala route (agar aapne banaya hai)
// router.put('/users/promote/:id', protect, admin, promoteUserToAdmin);

module.exports = router;