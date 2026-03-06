const redis = require('redis');

// Create Redis client
const client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                return new Error('Max reconnection attempts reached');
            }
            return retries * 100; // Reconnect after retries * 100ms
        }
    }
});

// Event handlers
client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

client.on('ready', () => {
    console.log('Redis client ready');
});

// Connect to Redis
(async () => {
    try {
        await client.connect();
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
})();

module.exports = client;
