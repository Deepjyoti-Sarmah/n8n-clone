import { config } from "@repo/commons";
import { createClient } from "redis";

const redisClient = createClient({ url: config.redis.url });

redisClient.on("error", (err) => {
  console.error("Redis client error", err);
});

await redisClient.connect();

export default redisClient;
export * from "./queues";
export * from "./memory";
export * from "./pub-sub";
