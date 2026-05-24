// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile,       // <--- IMP: Import new functions
    updateUserProfile     // <--- IMP: Import new functions
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware"); // <--- IMP: Protect middleware import karein

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private Routes (Protected by authMiddleware's 'protect' function)
// GET /api/users/profile - Current user ki profile details fetch karega
router.get("/profile", protect, getUserProfile); 

// PUT /api/users/profile - Current user ki profile details update karega
router.put("/profile", protect, updateUserProfile); 

module.exports = router;