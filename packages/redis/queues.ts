import redisClient from ".";

type ReadMessage = {
  id: string;
  message: Record<string, string>;
};

type ReadStream = {
  name: string;
  messages: ReadMessage[];
};

const STREAM_KEY = "workflow:execution";

export const enqueueExecution = async (
  executionId: string,
  workflowId: string,
  payload: any = {},
) => {
  try {
    await redisClient.xAdd(
      STREAM_KEY,
      "*",
      {
        executionId,
        workflowId,
        payload: JSON.stringify(payload),
        timestamp: new Date().toISOString(),
      },
      {
        TRIM: {
          strategy: "MAXLEN",
          strategyModifier: "~",
          threshold: 10000,
        },
      },
    );

    console.log(`Exectuion ${executionId} enqueue for worflow ${workflowId}`);
  } catch (error) {
    console.error("Error enqueuing execution:", error);
    throw new Error(`Failed to enqueue execution: ${error}`);
  }
};

// export const dequeueExecution = async (
//   consumerGroup = "workflowGroup",
//   consumer = `worker-${process.pid}`,
// ) => {
//   try {
//     try {
//       await redisClient.xGroupCreate(STREAM_KEY, consumerGroup, "0", {
//         MKSTREAM: true,
//       });
//     } catch (error: any) {
//       if (!error.message?.includes("BUSYGROUP")) throw error;
//     }

//     const results = (await redisClient.xReadGroup(
//       consumerGroup,
//       consumer,
//       [{ key: STREAM_KEY, id: ">" }],
//       { BLOCK: 1000, COUNT: 1 },
//     )) as ReadStream[] | null;

//     if (!results || results.length <= 0) {
//       return null;
//     }

//     const stream = results[0] as ReadStream;
//     if (!stream.messages || stream.messages.length <= 0) {
//       return null;
//     }

//     const message = stream.messages[0] as ReadMessage;
//     return {
//       id: message.id,
//       executionId: message.message.executionId,
//       workflowId: message.message.workflowId,
//       payload: JSON.parse(message.message.payload || "{}"),
//       timestamp: message.message.timestamp,
//     };
//   } catch (error) {
//     console.error("Error dequeuing execution:", error);
//     throw new Error(`Failed to dequeue execution: ${error}`);
//   }
// };

// export const acknowledgeExecution = async (
//   messageId: string,
//   consumerGroup = "workflowGroup",
// ) => {
//   try {
//     await redisClient.xAck(STREAM_KEY, consumerGroup, messageId);
//   } catch (error) {
//     console.error("Failed to acknowledge execution:", error);
//   }
// };
