const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Yeh check karega ki user logged-in hai ya nahi
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Header se token nikalo (Bearer .....)
            token = req.headers.authorization.split(' ')[1];

            // Token ko verify karo
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // User ki details (bina password ke) database se nikalo aur request mein daal do
            req.user = await User.findById(decoded.id).select('-password');
            
            next(); // Agle function par jaao
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Yeh check karega ki user admin hai ya nahi
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
