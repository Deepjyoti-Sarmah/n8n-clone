import { prisma } from "@repo/db";
import { Hono } from "hono";

const webhooks = new Hono();

webhooks.all("/:webhookId", async (c) => {
  const { webhookId } = c.req.param();

  if (!webhookId) {
    return c.json(
      {
        message: "webhook id does not exists",
      },
      404,
    );
  }

  try {
    const webhook = await prisma.webhooks.findUnique({
      where: {
        id: webhookId,
      },
      include: {
        workflow: true,
      },
    });

    if (!webhook) {
      return c.json(
        {
          message: "Webhook not found",
        },
        404,
      );
    }
    if (webhook.secret) {
      const authHeader = c.req.header("Authorization");
      if (authHeader !== webhook.secret) {
        return c.json(
          {
            message: "Unauthorized",
          },
          401,
        );
      }
    }

    const totalTasks = Object.keys(webhook.workflow?.nodes as object).length;

    const execution = await prisma.executions.create({
      data: {
        workflowsId: webhook.workflow?.id!,
        totalTask: totalTasks,
        output: {
          triggerPayload: c.body ?? {},
        },
      },
    });

    console.log("Webhook trigger execution: ", execution.id);

    return c.json(
      {
        message: "Workflow triggered",
        executionId: execution.id,
      },
      200,
    );
  } catch (error) {
    console.error("Cannot parse webhooks");
    return c.json(
      {
        message: "Internal server error",
        error: error,
      },
      500,
    );
  }
});

export default webhooks;
