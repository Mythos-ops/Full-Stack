const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // These options are no longer needed in Mongoose 7+
            // but keeping them won't cause errors
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📚 Database: ${conn.connection.name}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected');
        });

        return conn;
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
