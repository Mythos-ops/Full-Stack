const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    tls: process.env.REDIS_URL?.startsWith("rediss://"),
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        return new Error("Max reconnection attempts reached");
      }
      return retries * 100;
    }
  }
});

// Event handlers
client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("ready", () => {
  console.log("Redis client ready");
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

// Connect once
(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

module.exports = client;