const mongoose = require('mongoose');

// Database se connect karne ka function
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Yadi connection fail ho to server ko band kar dein
    }
};

module.exports = connectDB;
