# Concurrent Ticket Booking System

A robust concurrent ticket booking system with Redis-based seat locking to handle multiple simultaneous booking requests.

## Aim

To create a concurrent ticket booking system with seat locking using Redis to prevent race conditions and ensure data consistency during high-traffic booking scenarios.

## Features

- **Distributed Locking**: Redis-based locks to prevent concurrent access to the same seat
- **Atomic Operations**: Ensures booking operations are atomic and consistent
- **RESTful API**: Clean API endpoints for all booking operations
- **Load Testing**: Artillery configuration for stress testing the system
- **Graceful Error Handling**: Proper error messages and status codes
- **Real-time Statistics**: Get booking statistics in real-time

## Hardware/Software Requirements

- **Node.js 18+**
- **Redis** (v6.0 or higher)
- **Express.js** (v4.x)
- **Artillery** (v2.x) - for load testing

## Project Structure

```
4.3/
├── config/
│   └── redis.js              # Redis client configuration
├── services/
│   └── bookingService.js     # Core booking logic with seat locking
├── routes/
│   └── bookingRoutes.js      # Express routes
├── index.js                  # Main application file
├── load-test.yml             # Artillery load testing configuration
├── test-processor.js         # Artillery test processor
├── package.json              # Project dependencies
├── .env                      # Environment variables
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## Installation

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Install and start Redis:**
   
   **For Windows:**
   - Download Redis from [Redis for Windows](https://github.com/microsoftarchive/redis/releases)
   - Or use Windows Subsystem for Linux (WSL)
   - Or use Docker:
     ```bash
     docker run -d -p 6379:6379 --name redis redis:latest
     ```

   **For Linux/Mac:**
   ```bash
   # Using apt (Ubuntu/Debian)
   sudo apt-get install redis-server
   sudo systemctl start redis

   # Using brew (macOS)
   brew install redis
   brew services start redis
   ```

3. **Configure environment variables:**
   Edit the `.env` file to match your setup (default values should work for local development).

## Usage

### Starting the Server

```bash
# Start in production mode
npm start

# Start in development mode with auto-reload
npm run dev
```

The server will start on `http://localhost:3000`

### API Endpoints

#### 1. Initialize Seats
```http
POST /api/seats/initialize
Content-Type: application/json

{
  "totalSeats": 100
}
```

**Response:**
```json
{
  "success": true,
  "message": "Initialized 100 seats"
}
```

#### 2. Get Available Seats
```http
GET /api/seats/available
```

**Response:**
```json
{
  "success": true,
  "availableSeats": [1, 2, 3, 4, 5, ...],
  "count": 95
}
```

#### 3. Book a Seat
```http
POST /api/book
Content-Type: application/json

{
  "seatNumber": 5,
  "userId": "user123"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Seat booked successfully",
  "bookingId": "booking:1709731200000_5",
  "seatNumber": 5,
  "userId": "user123"
}
```

**Failure Response (Seat Already Booked):**
```json
{
  "success": false,
  "message": "Seat is already booked"
}
```

**Failure Response (Lock Contention):**
```json
{
  "success": false,
  "message": "Seat is being processed by another user. Please try again."
}
```

#### 4. Cancel a Booking
```http
POST /api/cancel
Content-Type: application/json

{
  "seatNumber": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "seatNumber": 5
}
```

#### 5. Get Statistics
```http
GET /api/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 100,
    "available": 95,
    "booked": 5
  }
}
```

#### 6. Reset All Seats
```http
POST /api/reset
```

**Response:**
```json
{
  "success": true,
  "message": "All seats and bookings reset"
}
```

#### 7. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-03-06T10:30:00.000Z",
  "redis": "connected"
}
```

## How the Seat Locking Works

The system uses Redis's `SET` command with the `NX` (Not eXists) option to implement distributed locking:

1. **Lock Acquisition**: When a booking request is received, the system tries to acquire a lock for that specific seat
2. **Lock Check**: If the lock is already held by another process, the request is rejected
3. **Seat Verification**: After acquiring the lock, the system checks if the seat is available
4. **Booking**: If available, the seat is marked as booked
5. **Lock Release**: The lock is released after the operation completes
6. **Lock Timeout**: Locks automatically expire after 10 seconds to prevent deadlocks

### Key Redis Operations

```javascript
// Acquire lock (atomic operation)
await redisClient.set(lockKey, userId, {
  NX: true,        // Only set if key doesn't exist
  EX: 10           // Expire after 10 seconds
});

// Check and update seat status
const status = await redisClient.get(seatKey);
if (status === 'available') {
  await redisClient.set(seatKey, 'booked');
}

// Release lock
await redisClient.del(lockKey);
```

## Load Testing

The project includes Artillery configuration for load testing the concurrent booking system.

### Run Load Test

```bash
npm test
```

Or directly with Artillery:

```bash
artillery run load-test.yml
```

### Load Test Phases

1. **Warm up**: 10 requests/second for 60 seconds
2. **Ramp up**: 50 requests/second for 120 seconds
3. **Spike test**: 100 requests/second for 60 seconds

### Test Scenarios

- **70% Concurrent Booking**: Multiple users trying to book random seats
- **20% Check Available Seats**: Users checking seat availability
- **10% Get Stats**: Users checking booking statistics

## Testing the System Manually

1. **Start the server and Redis**

2. **Initialize seats:**
   ```bash
   curl -X POST http://localhost:3000/api/seats/initialize \
     -H "Content-Type: application/json" \
     -d '{"totalSeats": 100}'
   ```

3. **Check available seats:**
   ```bash
   curl http://localhost:3000/api/seats/available
   ```

4. **Book a seat:**
   ```bash
   curl -X POST http://localhost:3000/api/book \
     -H "Content-Type: application/json" \
     -d '{"seatNumber": 1, "userId": "user1"}'
   ```

5. **Try to book the same seat again (should fail):**
   ```bash
   curl -X POST http://localhost:3000/api/book \
     -H "Content-Type: application/json" \
     -d '{"seatNumber": 1, "userId": "user2"}'
   ```

6. **Check statistics:**
   ```bash
   curl http://localhost:3000/api/stats
   ```

## Advantages of This Approach

1. **Prevents Double Booking**: Redis locks prevent two users from booking the same seat
2. **Scalable**: Can handle multiple concurrent requests efficiently
3. **Configurable Lock Timeout**: Prevents indefinite lock holding
4. **Atomic Operations**: Redis operations ensure data consistency
5. **Fast Performance**: Redis's in-memory operations provide millisecond response times

## Troubleshooting

### Redis Connection Issues

- Ensure Redis is running: `redis-cli ping` (should return `PONG`)
- Check Redis connection settings in `.env`
- Verify firewall settings if Redis is on a remote server

### Port Already in Use

- Change the PORT in `.env` file
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F

  # Linux/Mac
  lsof -ti:3000 | xargs kill -9
  ```

## Future Enhancements

- Add user authentication and authorization
- Implement seat reservation with timeout
- Add payment gateway integration
- Implement seat selection UI
- Add WebSocket support for real-time updates
- Implement booking expiration
- Add comprehensive logging and monitoring

## License

ISC

## Author

Created as part of Full Stack Development Experiment 4.3
