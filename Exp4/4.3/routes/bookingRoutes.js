const express = require('express');
const router = express.Router();
const bookingService = require('../services/bookingService');

/**
 * POST /api/seats/initialize
 * Initialize seats in the system
 */
router.post('/seats/initialize', async (req, res) => {
    try {
        const { totalSeats } = req.body;

        if (!totalSeats || totalSeats < 1) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid number of seats'
            });
        }

        const result = await bookingService.initializeSeats(totalSeats);
        res.json(result);
    } catch (error) {
        console.error('Error initializing seats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * GET /api/seats/available
 * Get all available seats
 */
router.get('/seats/available', async (req, res) => {
    try {
        const availableSeats = await bookingService.getAvailableSeats();
        res.json({
            success: true,
            availableSeats,
            count: availableSeats.length
        });
    } catch (error) {
        console.error('Error getting available seats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * POST /api/book
 * Book a seat
 */
router.post('/book', async (req, res) => {
    try {
        const { seatNumber, userId } = req.body;

        if (!seatNumber || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide seatNumber and userId'
            });
        }

        const result = await bookingService.bookSeat(seatNumber, userId);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(409).json(result);
        }
    } catch (error) {
        console.error('Error booking seat:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * POST /api/cancel
 * Cancel a booking
 */
router.post('/cancel', async (req, res) => {
    try {
        const { seatNumber } = req.body;

        if (!seatNumber) {
            return res.status(400).json({
                success: false,
                message: 'Please provide seatNumber'
            });
        }

        const result = await bookingService.cancelBooking(seatNumber);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * GET /api/stats
 * Get booking statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const stats = await bookingService.getStats();
        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * POST /api/reset
 * Reset all seats (for testing)
 */
router.post('/reset', async (req, res) => {
    try {
        const result = await bookingService.resetAllSeats();
        res.json(result);
    } catch (error) {
        console.error('Error resetting seats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
