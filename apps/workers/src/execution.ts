import { ExecStatus, prisma } from "@repo/db";
import { publishEvent } from "./publish";
import { runNode } from "./nodes/runner";

export const processExecution = async (
  executionId: string,
  workflowId: string,
): Promise<void> => {
  const workflow = await prisma.workflows.findUnique({
    where: { id: workflowId },
  });

  if (!workflow) {
    console.error("Workflow not found:", workflowId);
    return;
  }

  const execution = await prisma.executions.findUnique({
    where: { id: executionId },
  });

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

  await publishEvent(workflowId, {
    type: "execution_started",
    executionId,
    workflowId,
    totalTasks: execution?.totalTask ?? 0,
  });

  const nodes = workflow.nodes as Record<string, any>;
  const connections = workflow.connections as Record<string, string[]>;

  // Initialize context with trigger payload
  let context: Record<string, any> = {
    $json: { body: triggerPayload },
    $node: {},
  };

  let tasksDone = 0;

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

      await publishEvent(workflowId, {
        type: "node_succeeded",
        executionId,
        workflowId,
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

      await publishEvent(workflowId, {
        type: "node_failed",
        executionId,
        workflowId,
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
    await publishEvent(workflowId, {
      type: "execution_finished",
      executionId,
      workflowId,
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

    await publishEvent(workflowId, {
      type: "execution_finished",
      executionId,
      workflowId,
      status: "SUCCESS",
      tasksDone,
    });
  }

  console.log("Execution finished:", executionId);
};
