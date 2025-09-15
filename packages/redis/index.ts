import { config } from "@repo/commons";
import { RedisClient } from "bun";

export const redisClient = new RedisClient(config.redis.url);
