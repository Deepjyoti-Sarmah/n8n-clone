import redisClient from "@repo/redis";
import { resolve } from "bun";
import dotenv from "dotenv";
import { prisma } from "../../packages/db/src/client";
import { ExecStatus } from "../../packages/db/generated/prisma";
import { publishEvent } from "./src/publish";

dotenv.config();

type XReadMessage = {
  id: string;
  message: Record<string, string>;
};

type XReadStream = {
  name: string;
  message: XReadMessage[];
};

const GROUP = "workflowGroup";
const CONSUMER = `worker-${process.pid}`;
const STREAM_KEY = "workflow:execution";

const processExecution = async (executionId: string, workflowId: string) => {
  const workflow = await prisma.workflows.findUnique({
    where: {
      id: workflowId,
    },
  });

  if (!workflow) {
    console.error("Workflow not found:", workflowId);
    return;
  }

  const execution = await prisma.executions.findUnique({
    where: {
      id: executionId,
    },
  });

  if (!execution) {
    console.error("Execution not found:", executionId);
  }

  const triggerPayload = (execution?.output as any).triggerPayload ?? {};

  await prisma.executions.update({
    where: {
      id: executionId,
    },
    data: {
      status: ExecStatus.RUNNING,
    },
  });

  await publishEvent(workflowId, {
    type: "execution_started",
    executionId,
    workflowId,
    totalTasks: execution?.totalTask ?? 0,
  });

  const nodes = workflow.nodes as Record<string, any>;
  const connections = workflow.connections as Record<string, string[]>;

  let context: Record<string, any> = {
    $json: { body: triggerPayload },
    $node: {},
  };

  let taskDone = 0;

  const indegree: Record<string, number> = {};
  Object.keys(nodes).forEach((n) => (indegree[n] = 0));
  Object.values(connections).forEach((targets) => {
    targets.forEach((t) => (indegree[t] = (indegree[t] || 0) + 1));
  });

  const queue: string[] = Object.keys(indegree).filter(
    (n) => indegree[n] === 0,
  );

  let executionFailed = false;

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodes[nodeId];

    await publishEvent(workflowId, {
      type: "node_started",
      executionId,
      workflowId,
      nodeId,
      nodeType: node.type,
    });

    console.log(`Execution node ${nodeId} (${node.type})`);

    try {
      const result = await runNode(node, context, workflowId);
      constext.$node[nodeId] = result;

      taskDone++;

      await prisma.executions.update({
        where: {
          id: executionId,
        },
        data: {
          taskDone: taskDone,
          logs: {
            ...(execution?.logs as any),
            [nodeId]: "Success",
          },
        },
      });

      await publishEvent(workflowId, {
        type: "node_succeeded",
        executionId,
        workflowId,
        nodeId,
        nodeType: node.type,
      });

      const nextNodes = connections[nodeId] || [];
      nextNodes.forEach((n) => {
        console.log(`-> Next: ${n}`);
        if (indegree[n] !== undefined) {
          indegree[n]--;
          if (indegree[n] === 0) queue.push(n);
        }
      });
    } catch (error: any) {
      console.error(`Error in node ${nodeId}:`, error);

      const errorMessage = error.message;

      await prisma.executions.update({
        where: {
          id: executionId,
        },
        data: {
          status: ExecStatus.FAILED,
          logs: {
            ...(execution?.logs as any),
            [nodeId]: `Error: ${errorMessage}`,
          },
        },
      });

      await publishEvent(workflowId, {
        type: "node_failed",
        executionId,
        workflowId,
        nodeId,
        nodeTyde: node.type,
        error: errorMessage,
      });

      executionFailed = true;
      break;
    }
  }

  if (executionFailed) {
    await publishEvent(workflowId, {
      type: "execution_failed",
      executionId,
      workflowId,
      status: "FAILED",
      taskDone,
    });
  } else {
    await prisma.executions.update({
      where: {
        id: executionId,
      },
      data: {
        status: ExecStatus.SUCCESS,
        taskDone: taskDone,
      },
    });

    await publishEvent(workflowId, {
      type: "execution_finished",
      executionId,
      workflowId,
      status: "SUCCESS",
      taskDone,
    });
  }

  console.log("Execution finished:", executionId);
};

const main = async () => {
  console.log("Worker started, waiting for jobs...");

  try {
    await redisClient.xGroupCreate(STREAM_KEY, GROUP, "0", {
      MKSTREAM: true,
    });
  } catch (error: any) {
    if (!error.message.includes("BUSYGROUP")) {
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
          for (const message of stream.message) {
            const { executionId, workflowId } = message.message;
            console.log("Picked execution:", executionId);

            try {
              await processExecution(executionId, workflowId);
            } catch (error) {
              console.error("Failed execution:", error);
              await redisClient.xAck(STREAM_KEY, GROUP, message.id);
            }
          }
        }
      }
    } catch (error) {
      console.error("Worker loop error:", error);
      // pause before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};
