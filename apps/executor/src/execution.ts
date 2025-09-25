import { ExecStatus, prisma } from "@repo/db";
import { runNode } from "./nodes/runner";
import { publishExecution, publishWorkflow } from "@repo/redis";

export const processExecution = async (
  executionId: string,
  workflowId: string,
): Promise<void> => {
  const workflowWithExecution = await prisma.workflows.findUnique({
    where: { id: workflowId },
    include: {
      execution: {
        where: {
          id: executionId,
        },
        take: 1,
      },
    },
  });

  if (!workflowWithExecution) {
    console.error("Workflow not found:", workflowId);
    return;
  }

  const execution = workflowWithExecution.execution[0];

  if (!execution) {
    console.error("Execution not found:", executionId);
    return;
  }

  const triggerPayload = (execution?.output as any)?.triggerPayload ?? {};

  // Update execution status to RUNNING
  await prisma.executions.update({
    where: { id: executionId },
    data: { status: ExecStatus.RUNNING },
  });

  await publishExecution(executionId, workflowId, {
    type: "execution_started",
    totalTasks: execution?.totalTask ?? 0,
  });

  await publishWorkflow(workflowId, {
    type: "execution_started",
    executionId,
    totalTasks: execution.totalTask ?? 0,
  });

  const nodes = workflowWithExecution.nodes as Record<string, any>;
  const connections = workflowWithExecution.connections as Record<
    string,
    string[]
  >;

  // Initialize context with trigger payload
  let context: Record<string, any> = {
    $json: { body: triggerPayload },
    $node: {},
  };

  let tasksDone = 0;
  let executionFailed = false;

  // Calculate indegree for topological sort
  const indegree: Record<string, number> = {};
  Object.keys(nodes).forEach((n) => (indegree[n] = 0));
  Object.values(connections).forEach((targets) => {
    targets.forEach((t) => (indegree[t] = (indegree[t] || 0) + 1));
  });

  // Start with nodes that have no incoming connections
  const queue: string[] = Object.keys(indegree).filter(
    (n) => indegree[n] === 0,
  );

  while (queue.length > 0 && !executionFailed) {
    const nodeId = queue.shift()!;
    const node = nodes[nodeId];

    await publishExecution(executionId, workflowId, {
      type: "node_started",
      nodeId,
      nodeType: node.type,
    });

    await publishWorkflow(workflowId, {
      type: "node_started",
      executionId,
      nodeId,
      nodeType: node.type,
    });

    console.log(`Executing node ${nodeId} (${node.type})`);

    try {
      const result = await runNode(node, context, workflowId);
      context.$node[nodeId] = result;

      tasksDone++;

      await prisma.executions.update({
        where: { id: executionId },
        data: {
          taskDone: tasksDone,
          logs: {
            ...(execution!.logs as any),
            [nodeId]: "Success",
          },
        },
      });

      await publishExecution(executionId, workflowId, {
        type: "node_succeeded",
        nodeId,
        nodeType: node.type,
        result,
      });

      await publishWorkflow(workflowId, {
        type: "node_succeeded",
        executionId,
        nodeId,
        nodeType: node.type,
      });

      // Process next nodes in the dependency graph
      const nextNodes = connections[nodeId] || [];
      nextNodes.forEach((n) => {
        console.log(`→ Next: ${n}`);
        if (indegree[n] !== undefined) {
          indegree[n]--;
          if (indegree[n] === 0) queue.push(n);
        }
      });
    } catch (error: any) {
      console.error(`Error in node ${nodeId}:`, error.message);
      const errorMessage = error.message;

      await prisma.executions.update({
        where: { id: executionId },
        data: {
          status: ExecStatus.FAILED,
          logs: {
            ...(execution!.logs as any),
            [nodeId]: `Error: ${errorMessage}`,
          },
        },
      });

      await publishExecution(executionId, workflowId, {
        type: "node_failed",
        nodeId,
        nodeType: node.type,
        error: errorMessage,
      });

      await publishWorkflow(workflowId, {
        type: "node_failed",
        executionId,
        nodeId,
        nodeType: node.type,
        error: errorMessage,
      });

      executionFailed = true;
      break;
    }
  }

  // Update final execution status
  if (executionFailed) {
    await publishExecution(executionId, workflowId, {
      type: "execution_finished",
      status: "FAILED",
      tasksDone,
    });

    await publishWorkflow(workflowId, {
      type: "execution_finished",
      executionId,
      status: "FAILED",
      tasksDone,
    });
  } else {
    await prisma.executions.update({
      where: { id: executionId },
      data: {
        status: ExecStatus.SUCCESS,
        taskDone: tasksDone,
      },
    });

    await publishExecution(executionId, workflowId, {
      type: "execution_finished",
      status: "SUCCESS",
      tasksDone,
    });

    await publishWorkflow(workflowId, {
      type: "execution_finished",
      executionId,
      status: "SUCCESS",
      tasksDone,
    });
  }

  console.log("Execution finished:", executionId);
};
