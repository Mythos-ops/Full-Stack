# Quick Start Guide

## Prerequisites
1. Ensure **Node.js 18+** is installed
2. Ensure **Redis** is installed and running

## Step 1: Install Dependencies
```bash
cd "Exp 4/4.3"
npm install
```

## Step 2: Start Redis

### Windows (using Docker):
```powershell
docker run -d -p 6379:6379 --name redis redis:latest
```

### Windows (native):
Download and install from: https://github.com/microsoftarchive/redis/releases

### Linux/Mac:
```bash
# Check if Redis is running
redis-cli ping

# If not running, start it
sudo systemctl start redis    # Linux
brew services start redis     # macOS
```

## Step 3: Start the Server
```bash
npm start
```

The server will start on http://localhost:3000

## Step 4: Test the System

### Option 1: Run the automated test script
```bash
npm run test:simple
```

### Option 2: Test manually with curl

**Initialize seats:**
```bash
curl -X POST http://localhost:3000/api/seats/initialize -H "Content-Type: application/json" -d "{\"totalSeats\": 100}"
```

**Book a seat:**
```bash
curl -X POST http://localhost:3000/api/book -H "Content-Type: application/json" -d "{\"seatNumber\": 1, \"userId\": \"user1\"}"
```

**Check available seats:**
```bash
curl http://localhost:3000/api/seats/available
```

**Get statistics:**
```bash
curl http://localhost:3000/api/stats
```

### Option 3: Run load tests
```bash
npm test
```

## Troubleshooting

### Redis not connecting?
- Check if Redis is running: `redis-cli ping`
- Verify .env file settings
- Check firewall settings

### Port 3000 already in use?
- Change PORT in .env file
- Or stop the process using port 3000

## Next Steps
- Read the full [README.md](README.md) for detailed documentation
- Explore the API endpoints
- Run load tests to see concurrent booking in action
