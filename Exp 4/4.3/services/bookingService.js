const redisClient = require('../config/redis');

class BookingService {
    constructor() {
        this.LOCK_TIMEOUT = 10; // seconds
        this.SEAT_PREFIX = 'seat:';
        this.BOOKING_PREFIX = 'booking:';
    }

    /**
     * Initialize seats in Redis
     * @param {number} totalSeats - Total number of seats to initialize
     */
    async initializeSeats(totalSeats) {
        try {
            for (let i = 1; i <= totalSeats; i++) {
                const seatKey = `${this.SEAT_PREFIX}${i}`;
                await redisClient.set(seatKey, 'available');
            }
            console.log(`Initialized ${totalSeats} seats`);
            return { success: true, message: `Initialized ${totalSeats} seats` };
        } catch (error) {
            console.error('Error initializing seats:', error);
            throw error;
        }
    }

    /**
     * Get all available seats
     */
    async getAvailableSeats() {
        try {
            const keys = await redisClient.keys(`${this.SEAT_PREFIX}*`);
            const availableSeats = [];

            for (const key of keys) {
                const status = await redisClient.get(key);
                const seatNumber = key.replace(this.SEAT_PREFIX, '');
                
                if (status === 'available') {
                    availableSeats.push(parseInt(seatNumber));
                }
            }

            return availableSeats.sort((a, b) => a - b);
        } catch (error) {
            console.error('Error getting available seats:', error);
            throw error;
        }
    }

    /**
     * Book a seat with distributed locking
     * @param {number} seatNumber - Seat number to book
     * @param {string} userId - User ID making the booking
     */
    async bookSeat(seatNumber, userId) {
        const seatKey = `${this.SEAT_PREFIX}${seatNumber}`;
        const lockKey = `lock:${seatKey}`;
        const bookingId = `${this.BOOKING_PREFIX}${Date.now()}_${seatNumber}`;

        try {
            // Try to acquire lock using SET NX (SET if Not eXists) with expiration
            const lockAcquired = await redisClient.set(lockKey, userId, {
                NX: true, // Only set if key doesn't exist
                EX: this.LOCK_TIMEOUT // Expire after LOCK_TIMEOUT seconds
            });

            if (!lockAcquired) {
                return {
                    success: false,
                    message: 'Seat is being processed by another user. Please try again.'
                };
            }

            // Check if seat is available
            const seatStatus = await redisClient.get(seatKey);

            if (!seatStatus) {
                await redisClient.del(lockKey);
                return {
                    success: false,
                    message: 'Seat does not exist'
                };
            }

            if (seatStatus !== 'available') {
                await redisClient.del(lockKey);
                return {
                    success: false,
                    message: 'Seat is already booked'
                };
            }

            // Simulate processing time (e.g., payment processing)
            await this.simulateProcessing(100);

            // Book the seat
            await redisClient.set(seatKey, 'booked');

            // Store booking details
            await redisClient.hSet(bookingId, {
                seatNumber: seatNumber.toString(),
                userId: userId,
                timestamp: new Date().toISOString(),
                status: 'confirmed'
            });

            // Release lock
            await redisClient.del(lockKey);

            return {
                success: true,
                message: 'Seat booked successfully',
                bookingId: bookingId,
                seatNumber: seatNumber,
                userId: userId
            };

        } catch (error) {
            // Ensure lock is released in case of error
            try {
                await redisClient.del(lockKey);
            } catch (unlockError) {
                console.error('Error releasing lock:', unlockError);
            }

            console.error('Error booking seat:', error);
            throw error;
        }
    }

    /**
     * Cancel a booking
     * @param {number} seatNumber - Seat number to cancel
     */
    async cancelBooking(seatNumber) {
        const seatKey = `${this.SEAT_PREFIX}${seatNumber}`;
        const lockKey = `lock:${seatKey}`;

        try {
            // Acquire lock
            const lockAcquired = await redisClient.set(lockKey, 'system', {
                NX: true,
                EX: this.LOCK_TIMEOUT
            });

            if (!lockAcquired) {
                return {
                    success: false,
                    message: 'Seat is being processed. Please try again.'
                };
            }

            // Check if seat is booked
            const seatStatus = await redisClient.get(seatKey);

            if (seatStatus !== 'booked') {
                await redisClient.del(lockKey);
                return {
                    success: false,
                    message: 'Seat is not currently booked'
                };
            }

            // Release the seat
            await redisClient.set(seatKey, 'available');

            // Release lock
            await redisClient.del(lockKey);

            return {
                success: true,
                message: 'Booking cancelled successfully',
                seatNumber: seatNumber
            };

        } catch (error) {
            try {
                await redisClient.del(lockKey);
            } catch (unlockError) {
                console.error('Error releasing lock:', unlockError);
            }

            console.error('Error cancelling booking:', error);
            throw error;
        }
    }

    /**
     * Get booking statistics
     */
    async getStats() {
        try {
            const seatKeys = await redisClient.keys(`${this.SEAT_PREFIX}*`);
            let available = 0;
            let booked = 0;

            for (const key of seatKeys) {
                const status = await redisClient.get(key);
                if (status === 'available') {
                    available++;
                } else if (status === 'booked') {
                    booked++;
                }
            }

            return {
                total: seatKeys.length,
                available,
                booked
            };
        } catch (error) {
            console.error('Error getting stats:', error);
            throw error;
        }
    }

    /**
     * Simulate processing delay
     * @param {number} ms - Milliseconds to delay
     */
    simulateProcessing(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Reset all seats (for testing purposes)
     */
    async resetAllSeats() {
        try {
            const seatKeys = await redisClient.keys(`${this.SEAT_PREFIX}*`);
            const bookingKeys = await redisClient.keys(`${this.BOOKING_PREFIX}*`);
            const lockKeys = await redisClient.keys('lock:*');

            const allKeys = [...seatKeys, ...bookingKeys, ...lockKeys];

            if (allKeys.length > 0) {
                await redisClient.del(allKeys);
            }

            return { success: true, message: 'All seats and bookings reset' };
        } catch (error) {
            console.error('Error resetting seats:', error);
            throw error;
        }
    }
}

module.exports = new BookingService();
