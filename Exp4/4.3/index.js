const express = require('express');
const cors = require('cors');
require('dotenv').config();

const bookingRoutes = require('./routes/bookingRoutes');
const redisClient = require('./config/redis');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api', bookingRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        redis: redisClient.isOpen ? 'connected' : 'disconnected'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Concurrent Ticket Booking System API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /health',
            initialize: 'POST /api/seats/initialize',
            availableSeats: 'GET /api/seats/available',
            book: 'POST /api/book',
            cancel: 'POST /api/cancel',
            stats: 'GET /api/stats',
            reset: 'POST /api/reset'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    try {
        await redisClient.quit();
        console.log('Redis connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`\n Available endpoints:`);
    console.log(`   GET  /              - API information`);
    console.log(`   GET  /health        - Health check`);
    console.log(`   POST /api/seats/initialize - Initialize seats`);
    console.log(`   GET  /api/seats/available  - Get available seats`);
    console.log(`   POST /api/book      - Book a seat`);
    console.log(`   POST /api/cancel    - Cancel a booking`);
    console.log(`   GET  /api/stats     - Get statistics`);
    console.log(`   POST /api/reset     - Reset all seats\n`);
});

module.exports = app;
