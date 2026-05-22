// server/controllers/userController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require('express-async-handler'); // <--- Import asyncHandler

// Helper: JWT generate (agar aap isko utils/generateToken.js mein move nahi kar rahe hain)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // 30 din ke liye token valid
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => { // <--- asyncHandler use karein
  const { name, email, password } = req.body;

  // Check user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create new user (password hash pre-save hook me hoga)
  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender, // <--- Naye fields add kiye
      address: user.address,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate user (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => { // <--- asyncHandler use karein
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Check password
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender, // <--- Naye fields add kiye
      address: user.address,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Get user profile (currently unused, but good to have)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            gender: user.gender,
            address: user.address,
            phone: user.phone,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id); // req.user authMiddleware se aata hai

    if (user) {
        user.name = req.body.name || user.name;
        user.gender = req.body.gender !== undefined ? req.body.gender : user.gender; // Handle explicit 'Prefer not to say'
        user.address = req.body.address !== undefined ? req.body.address : user.address;
        user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

        // Note: Email update karna yahan thoda complicated ho sakta hai
        // Kyunki email unique hota hai aur ho sakta hai koi aur user us email ko use kar raha ho.
        // Abhi ke liye hum email update nahi kar rahe hain.

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            gender: updatedUser.gender,
            address: updatedUser.address,
            phone: updatedUser.phone,
            token: generateToken(updatedUser._id), // Token regenerate karein agar user data change hua hai
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile }; // <--- New functions export karein