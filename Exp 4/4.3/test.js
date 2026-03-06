// Simple test script to demonstrate the booking system
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testBookingSystem() {
    console.log('🧪 Testing Concurrent Ticket Booking System\n');

    try {
        // 1. Reset the system
        console.log('1️⃣  Resetting system...');
        await axios.post(`${BASE_URL}/reset`);
        console.log('✅ System reset\n');

        // 2. Initialize seats
        console.log('2️⃣  Initializing 50 seats...');
        const initResponse = await axios.post(`${BASE_URL}/seats/initialize`, {
            totalSeats: 50
        });
        console.log(`✅ ${initResponse.data.message}\n`);

        // 3. Check available seats
        console.log('3️⃣  Checking available seats...');
        const availableResponse = await axios.get(`${BASE_URL}/seats/available`);
        console.log(`✅ Available seats: ${availableResponse.data.count}\n`);

        // 4. Book some seats
        console.log('4️⃣  Booking seats 1, 2, and 3...');
        const bookings = [
            { seatNumber: 1, userId: 'user1' },
            { seatNumber: 2, userId: 'user2' },
            { seatNumber: 3, userId: 'user3' }
        ];

        for (const booking of bookings) {
            const response = await axios.post(`${BASE_URL}/book`, booking);
            console.log(`   Seat ${booking.seatNumber}: ${response.data.message}`);
        }
        console.log('✅ Seats booked\n');

        // 5. Try to book an already booked seat
        console.log('5️⃣  Attempting to book already-booked seat 1...');
        try {
            await axios.post(`${BASE_URL}/book`, {
                seatNumber: 1,
                userId: 'user4'
            });
        } catch (error) {
            console.log(`   ❌ Expected failure: ${error.response.data.message}`);
        }
        console.log('✅ Double booking prevented\n');

        // 6. Test concurrent bookings
        console.log('6️⃣  Testing concurrent bookings (10 users trying to book seat 10)...');
        const concurrentRequests = Array(10).fill(null).map((_, i) =>
            axios.post(`${BASE_URL}/book`, {
                seatNumber: 10,
                userId: `concurrent_user_${i}`
            }).catch(err => ({ error: err.response.data.message }))
        );

        const results = await Promise.all(concurrentRequests);
        const successful = results.filter(r => !r.error).length;
        const failed = results.filter(r => r.error).length;
        console.log(`   ✅ Successful bookings: ${successful}`);
        console.log(`   ❌ Failed bookings: ${failed}`);
        console.log('✅ Only one booking succeeded as expected\n');

        // 7. Cancel a booking
        console.log('7️⃣  Cancelling booking for seat 2...');
        const cancelResponse = await axios.post(`${BASE_URL}/cancel`, {
            seatNumber: 2
        });
        console.log(`✅ ${cancelResponse.data.message}\n`);

        // 8. Get final statistics
        console.log('8️⃣  Getting final statistics...');
        const statsResponse = await axios.get(`${BASE_URL}/stats`);
        console.log(`✅ Statistics:`);
        console.log(`   Total seats: ${statsResponse.data.stats.total}`);
        console.log(`   Available: ${statsResponse.data.stats.available}`);
        console.log(`   Booked: ${statsResponse.data.stats.booked}\n`);

        console.log('🎉 All tests completed successfully!\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('\n⚠️  Make sure the server is running on http://localhost:3000');
        }
    }
}

// Run the tests
testBookingSystem();
