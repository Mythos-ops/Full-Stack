const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        return new Error("Max reconnection attempts reached");
      }
      return retries * 100;
    }
  }
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("ready", () => {
  console.log("Redis client ready");
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

module.exports = client;