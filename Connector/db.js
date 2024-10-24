const mongoose = require('mongoose');
const db = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('MongoDB connected');
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); 
    }
};

module.exports = db;