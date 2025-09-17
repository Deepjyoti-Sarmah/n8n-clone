import redisClient from "@repo/redis";

export const publishEvent = async (workflowId: string, payload: any) => {
  try {
    const channel = `workflow:${workflowId}:events`;

    const eventData = {
      ...payload,
      timestamp: Date.now(),
    };

    await redisClient.publish(channel, JSON.stringify(eventData));
  } catch (error) {
    console.error("Failed to publish event:", error);
  }
};
