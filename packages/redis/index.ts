import { config } from "@repo/commons";
import { RedisClient } from "bun";

const redisClient = new RedisClient(config.redis.url);

redisClient.onconnect = () => {
  console.log("Connected to redis server");
};

redisClient.onclose = (error) => {
  console.error("Disconnected from redis server:", error);
};

await redisClient.connect();

export default redisClient;
