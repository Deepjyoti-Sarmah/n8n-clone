import redisClient from "@repo/redis";
import dotenv from "dotenv";
import { processExecution } from "./execution";

dotenv.config();

type XReadMessage = {
  id: string;
  message: Record<string, string>;
};

type XReadStream = {
  name: string;
  messages: XReadMessage[];
};

const GROUP = "workflowGroup";
const CONSUMER = `worker-${process.pid}`;
const STREAM_KEY = "workflow:execution";

const main = async (): Promise<void> => {
  console.log("Worker started, waiting for jobs...");

  // Create consumer group if it doesn't exist
  try {
    await redisClient.xGroupCreate(STREAM_KEY, GROUP, "0", { MKSTREAM: true });
  } catch (error: any) {
    if (!error.message?.includes("BUSYGROUP")) {
      console.error("Failed to create consumer group:", error);
      return;
    }
  }

  while (true) {
    try {
      const resp = (await redisClient.xReadGroup(
        GROUP,
        CONSUMER,
        [{ key: STREAM_KEY, id: ">" }],
        { BLOCK: 1000, COUNT: 1 },
      )) as XReadStream[] | null;

      if (!resp) continue;

      if (resp && Array.isArray(resp)) {
        for (const stream of resp) {
          for (const message of stream?.messages) {
            const { executionId, workflowId } = message.message;
            console.log("Picked execution:", executionId);

            try {
              await processExecution(
                executionId as string,
                workflowId as string,
              );
              await redisClient.xAck(STREAM_KEY, GROUP, message.id);
            } catch (error) {
              console.error("Failed execution:", error);
              await redisClient.xAck(STREAM_KEY, GROUP, message.id);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Worker loop error:", error.message);
      // Brief pause before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

process.on("SIGINT", () => {
  console.log(`Worker ${CONSUMER} shutting down gracefully...`);
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log(`Worker ${CONSUMER} received SIGTERM, shutting down...`);
  process.exit(0);
});

main().catch((error) => {
  console.error("Failed to start worker:", error);
  process.exit(1);
});
