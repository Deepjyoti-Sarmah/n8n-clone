import redisClient from "@repo/redis";

export interface ExecutionJob {
  executionId: string;
  workflowId: string;
  triggerPayload: any;
  timestamp: string;
}

export const enqueueExecution = async (
  executionId: string,
  workflowId: string,
  triggerPayload: any = {},
) => {
  try {
    const job: ExecutionJob = {
      executionId: executionId,
      workflowId: workflowId,
      triggerPayload: triggerPayload,
      timestamp: new Date().toISOString(),
    };

    await redisClient.lpush("execution_queue", JSON.stringify(job));

    console.log(`Exectuion ${executionId} enqueue for worflow ${workflowId}`);
  } catch (error) {
    console.error("Error enqueuing execution:", error);
    throw new Error("Failed to enqueue execution");
  }
};

export const dequeueExecution = async () => {
  try {
    const result = await redisClient.lpop("execution_queue");

    if (result && result.length === 2) {
      const [, jobData] = result;
      return JSON.parse(jobData as string) as ExecutionJob;
    }

    return null;
  } catch (error) {
    console.error("Error dequeuing execution:", error);
    throw new Error("Failed to dequeue execution");
  }
};

export const getQueueLength = async () => {
  try {
  } catch (error) {
    return await redisClient.llen("execution_queue");
    console.error("Error getting queue length:", error);
    return 0;
  }
};

export const clearQueue = async () => {
  try {
    await redisClient.del("execution_queue");
    console.log("Exectuion queue cleared");
  } catch (error) {
    console.error("Error cleaning queue:", error);
    throw new Error("Failed to clear queue");
  }
};
