import { config } from "@repo/commons";
import {
  cleanupSubscriptions,
  subscribeToExecution,
  subscribeToWorkflow,
} from "@repo/redis";

type WebSocketData = {
  subscriptions: Map<string, () => Promise<void>>;
  clinetId: string;
};

const activeConnections = new Set<any>();

const server = Bun.serve<WebSocketData>({
  fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/ws") {
      const success = server.upgrade(req, {
        data: {
          subscriptions: new Map(),
          clientId: crypto.randomUUID(),
        },
      });

      return success
        ? undefined
        : new Response("WebSocket upgrade failed", { status: 400 });
    }

    // Health check
    if (url.pathname === "/health") {
      return new Response(
        JSON.stringify({
          status: "ok",
          connections: activeConnections.size,
          timestamp: Date.now(),
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response("WebSocket server - Connect to /ws", { status: 404 });
  },

  websocket: {
    async open(ws) {
      activeConnections.add(ws);
      console.log(
        `Client ${ws.data.clinetId} connected. Total connections: ${activeConnections.size}`,
      );

      ws.send(
        JSON.stringify({
          type: "connected",
          clinetId: ws.data.clinetId,
          timestamp: Date.now(),
        }),
      );
    },

    async message(ws, message) {
      try {
        const data = JSON.parse(message.toString());
        console.log(`Message from ${ws.data.clinetId}:`, data.type);

        switch (data.type) {
          case "subscribe_workflow":
            await handleWorkflowSubscription(ws, data.workflowId);
            break;

          case "subscribe_execution":
            await handleExecutionSubscription(
              ws,
              data.executionId,
              data.workflowId,
            );
            break;

          case "unsbscribe":
            await handleUnsubscribe(ws, data.channel);
            break;

          case "unsubscribe_all":
            await handleUnsubscribeAll(ws);
            break;

          case "ping":
            ws.send(
              JSON.stringify({
                type: "pong",
                timestamp: Date.now(),
              }),
            );
            break;
          default:
            ws.send(
              JSON.stringify({
                type: "error",
                message: `Unknown message type: ${data.type}`,
              }),
            );
        }
      } catch (error) {
        console.error(
          `Error handling message from ${ws.data.clinetId}:`,
          error,
        );
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Invaild JSON message",
          }),
        );
      }
    },

    async close(ws, code, message) {
      console.log(`Client ${ws.data.clinetId} disconnected (${code})`);

      await handleUnsubscribeAll(ws);
      activeConnections.delete(ws);

      console.log(`Total connections: ${activeConnections.size}`);
    },

    drain(ws) {
      console.log(`Socket ${ws.data.clinetId} is ready for more data`);
    },
  },

  port: Number(config.server.port) || 8082,
});

async function handleWorkflowSubscription(ws: any, workflowId: string) {
  if (!workflowId) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "workflowId is required for workflow subscription",
      }),
    );
    return;
  }

  try {
    const channel = `workflow:${workflowId}`;

    if (ws.data.subscriptions.has(channel)) {
      ws.send(
        JSON.stringify({
          type: "already_subscribed",
          channel,
          workflowId,
        }),
      );
      return;
    }

    const unsubscribe = await subscribeToWorkflow(workflowId, (data) => {
      if (ws.readyState === 1) {
        ws.send(
          JSON.stringify({
            type: "workflow_event",
            workflowId,
            data,
          }),
        );
      }
    });

    ws.data.subscriptions.set(channel, unsubscribe);

    ws.send(
      JSON.stringify({
        type: "subscribe",
        channel,
        workflowId,
        timestamp: Date.now(),
      }),
    );

    console.log(
      `Client ${ws.data.clientId} subscribe to workflow: ${workflowId}`,
    );
  } catch (error) {
    console.error(`Failed to subscribe to workflow ${workflowId}:`, error);
    ws.send(
      JSON.stringify({
        type: "error",
        message: `Failed to subscribe to workflow: ${workflowId}`,
      }),
    );
  }
}

async function handleExecutionSubscription(
  ws: any,
  executionId: string,
  workflowId: string,
) {
  if (!executionId) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "executionId is required for execution subscription",
      }),
    );
    return;
  }

  try {
    const channel = `execution:${executionId}`;

    if (ws.data.subscriptions.has(channel)) {
      ws.send(
        JSON.stringify({
          type: "already_subscribed",
          channel,
          executionId,
        }),
      );
      return;
    }

    const unsbscribe = await subscribeToExecution(executionId, (data) => {
      if (ws.readyState === 1) {
        ws.send(
          JSON.stringify({
            type: "execution_event",
            executionId,
            data,
          }),
        );
      }
    });

    ws.data.subscriptions.set(channel, unsbscribe);

    ws.send(
      JSON.stringify({
        type: "subscribed",
        channel,
        executionId,
        workflowId,
        timestamp: Date.now(),
      }),
    );

    console.log(
      `Client ${ws.data.clientId} subscribed to execution: ${executionId}`,
    );
  } catch (error) {
    console.error(`Failed to subscribe to execution ${executionId}:`, error);
    ws.send(
      JSON.stringify({
        type: "error",
        message: `Failed to subscribe to execution: ${executionId}`,
      }),
    );
  }
}

async function handleUnsubscribe(ws: any, channel: string) {
  if (!channel) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "channel is required for unsubscribe",
      }),
    );
    return;
  }

  try {
    const unsubscribe = ws.data.subscriptions.get(channel);
    if (unsubscribe) {
      await unsubscribe();
      ws.data.subscriptions.delete(channel);

      ws.send(
        JSON.stringify({
          type: "unsubscribed",
          channel,
          timestamp: Date.now(),
        }),
      );

      console.log(`Client ${ws.data.clientId} unsubscribed from: ${channel}`);
    } else {
      ws.send(
        JSON.stringify({
          type: "not_subscribed",
          channel,
        }),
      );
    }
  } catch (error) {
    console.error(`Failed to unsubscribe from ${channel}:`, error);
    ws.send(
      JSON.stringify({
        type: "error",
        message: `Failed to unsubscribe from: ${channel}`,
      }),
    );
  }
}

async function handleUnsubscribeAll(ws: any) {
  try {
    const channels = Array.from(ws.data.subscriptions.keys());

    for (const [channel, unsubscribe] of ws.data.subscriptions.entries()) {
      try {
        await unsubscribe();
      } catch (error) {
        console.error(`Error unsubscribing from ${channel}:`, error);
      }
    }

    ws.data.subscriptions.clear();

    if (channels.length > 0 && ws.readyState === 1) {
      ws.send(
        JSON.stringify({
          type: "unsubscribe_all",
          channels,
          timestamp: Date.now(),
        }),
      );
    }

    if (channels.length > 0) {
      console.log(
        `Client ${ws.data.clientId} unsubscribed from ${channels.length} channels`,
      );
    }
  } catch (error) {
    console.error(
      `Failed to unsubscribe all for client ${ws.data.clientId}:`,
      error,
    );
  }
}

process.on("SIGINT", async () => {
  console.log("Shutting down WebSocket server...");

  activeConnections.forEach((ws) => {
    try {
      ws.close(1000, "Server shutting down");
    } catch (error) {
      console.error("Error closing connection:", error);
    }
  });

  await cleanupSubscriptions();

  server.stop();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  await cleanupSubscriptions();
  server.stop();
  process.exit(0);
});

console.log(`WebSocket server started on ws://localhost:${server.port}/ws`);

console.log(`Health check avaiable at http://localhost:${server.port}/health`);

export default server;
