import { Hono, type Context } from "hono";
import type { Variables } from "../../middlewares/auth";
import { prisma } from "@repo/db";

const getWorkflows = new Hono<{ Variables: Variables }>();

getWorkflows.get("/", async (c: Context<{ Variables: Variables }>) => {
  try {
    const userId = c.get("userId");

    const workflows = await prisma.workflows.findMany({
      where: {
        userId: userId,
      },
      include: {
        Webhooks: true,
      },
    });

    if (!workflows) {
      return c.json(
        {
          message: "Workflow not found",
        },
        404,
      );
    }

    return c.json(
      {
        message: "Workflows fetched successfully",
        workflows: workflows,
      },
      200,
    );
  } catch (error) {
    console.error("Error getting workflows", error);
    return c.json(
      {
        message: "Internal server error",
        error: error,
      },
      500,
    );
  }
});

getWorkflows.get("/:workflowId", async (c) => {
  const { workflowId } = c.req.param();
  if (!workflowId) {
    return c.json(
      {
        message: "Invalid workflowId",
      },
      400,
    );
  }

  try {
    const userId = c.get("userId");

    const workflow = await prisma.workflows.findUnique({
      where: {
        id: workflowId,
      },
      select: {
        id: true,
        user: true,
        nodes: true,
        enabled: true,
        connections: true,
        title: true,
        triggerType: true,
        Webhooks: true,
        webhooksId: true,
        userId: true,
      },
    });

    if (!workflow) {
      return c.json(
        {
          message: "Workflow not found",
        },
        404,
      );
    }

    return c.json(
      {
        message: "successfully fetched workflow",
        workflow: workflow,
      },
      200,
    );
  } catch (error) {
    console.error("Cannot get workflow", error);
    return c.json(
      {
        message: "Internal server error",
        error: error,
      },
      500,
    );
  }
});

export default getWorkflows;
