const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const songRoutes = require('./routes/songRoutes');
const adminRoutes = require('./routes/adminRoutes');
const artistRoutes = require('./routes/artistRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('MusicVibes API is running...');
});

// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/artists', artistRoutes);

// 'uploads' folder ko static banayein
// Yeh line bahut zaroori hai taaki frontend images/songs ko access kar sake
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

// Chhota sa badlav: console.log ko ek function ke andar rakha gaya hai
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});