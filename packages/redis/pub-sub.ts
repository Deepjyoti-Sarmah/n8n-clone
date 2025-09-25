import redisClient from ".";

export type EventHandler = (data: any) => void | Promise<void>;

const subscriptions = new Map<string, Set<EventHandler>>();

// Publish function - send event
export const publish = async (channel: string, data: any) => {
  try {
    const payload = {
      ...data,
      timestamp: Date.now(),
    };

    await redisClient.publish(channel, JSON.stringify(payload));
  } catch (error) {
    console.error(`Failed to publish to ${channel}:`, error);
    throw error;
  }
};

//Subscribe function -listen to events
export const subscribe = async (channel: string, handler: EventHandler) => {
  try {
    if (!subscriptions.has(channel)) {
      subscriptions.set(channel, new Set());

      await redisClient.subscribe(channel, (message) => {
        handleMassage(channel, message);
      });
      console.log(`Subscribed to channel: ${channel}`);
    }

    subscriptions.get(channel)?.add(handler);

    //return unsubscribe function
    return async () => {
      const handlers = subscriptions.get(channel);
      if (handlers) {
        handlers.delete(handler);

        if (handlers.size === 0) {
          subscriptions.delete(channel);
          console.log(`Unsubscibed from channel: ${channel}`);
        }
      }
    };
  } catch (error) {
    console.error(`Failed to subscribe to ${channel}:`, error);
    throw error;
  }
};

//Hnadle message
const handleMassage = (channel: string, message: string) => {
  try {
    const data = JSON.parse(message);
    const handlers = subscriptions.get(channel);

    if (handlers) {
      handlers.forEach(async (handler) => {
        try {
          await handler(data);
        } catch (error) {
          console.error(`Handler error for ${channel}:`, error);
        }
      });
    }
  } catch (error) {
    console.error(`Failed to parse message from ${channel}:`, error);
  }
};

export const publishExecution = async (
  executionId: string,
  workflowId: string,
  event: any,
) => {
  const channel = `execution:${executionId}`;
  await publish(channel, {
    ...event,
    executionId,
    workflowId,
  });
};

export const subscribeToExecution = async (
  exectionId: string,
  handler: EventHandler,
) => {
  const channel = `execution:${exectionId}`;
  return subscribe(channel, handler);
};

export const publishWorkflow = async (workflowId: string, event: any) => {
  const channel = `workflow:${workflowId}`;
  await publish(channel, {
    ...event,
    workflowId,
  });
};

export const subscribeToWorkflow = async (
  workflowId: string,
  handler: EventHandler,
) => {
  const channel = `workflow:${workflowId}`;
  return subscribe(channel, handler);
};

export const getSubscriptionCount = () => {
  return Array.from(subscriptions.values()).reduce(
    (total, handlers) => total + handlers.size,
    0,
  );
};

export const cleanupSubscriptions = async () => {
  try {
    const channels = Array.from(subscriptions.keys());

    for (const channel of channels) {
      await redisClient.unsubscribe(channel);
    }

    subscriptions.clear();
  } catch (error) {
    console.error("Cleanup failed:", error);
  }
};
