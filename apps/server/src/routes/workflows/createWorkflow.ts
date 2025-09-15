import { Hono, type Context } from "hono";
import { addCredentialsSchema, createWorkFlowSchema } from "@repo/commons";
import type { Variables } from "../../middlewares/auth";
import { prisma } from "@repo/db";

const createWorkflow = new Hono<{ Variables: Variables }>();

createWorkflow.post("/", async (c: Context<{ Variables: Variables }>) => {
  const result = createWorkFlowSchema.safeParse(c.req.json());
  if (!result.success) {
    return c.json(
      {
        message: "Validation failed",
        errors: result.error.issues,
      },
      400,
    );
  }

  try {
    const data = result.data;
    if (!data) {
      return c.json(
        {
          message: "Not enough details",
        },
        404,
      );
    }

    let webhookRecord = null;

    if (data.triggerType === "Webhook" && data.webhook) {
      webhookRecord = await prisma.webhooks.create({
        data: {
          title: data.webhook.title,
          method: data.webhook.method,
          secret: data.webhook.secret,
        },
      });
    }

    const userId = c.get("userId");

    const workflow = await prisma.workflows.create({
      data: {
        title: data.title,
        nodes: data.nodes,
        connections: data.connections,
        userId: userId,
        triggerType: data.triggerType,
        webhooksId: webhookRecord?.id ?? null,
      },
    });

    const totalTasks = Object.keys(data.nodes).length;

    const execution = await prisma.executions.create({
      data: {
        workflowsId: workflow.id,
        totalTask: totalTasks,
      },
    });

    return c.json(
      {
        message: "Created workflow successfully",
        workflow: workflow,
      },
      200,
    );
  } catch (error) {
    console.error("Error creating workflow", error);
    return c.json(
      {
        message: "Internal server error",
        error: error,
      },
      500,
    );
  }
});

export default createWorkflow;
