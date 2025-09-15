import { Hono, type Context } from "hono";
import type { Variables } from "../../middlewares/auth";
import { updateWorkFlowSchema } from "@repo/commons";
import { prisma } from "@repo/db";

const updateWorkflow = new Hono<{ Variables: Variables }>();

updateWorkflow.put(
  "/:workflowId",
  async (c: Context<{ Variables: Variables }>) => {
    const { workflowId } = c.req.param();

    if (!workflowId) {
      return c.json(
        {
          message: "Invalid workflowId",
        },
        400,
      );
    }

    const result = updateWorkFlowSchema.safeParse(c.req.json());
    if (!result.success) {
      return c.json(
        {
          message: "Validation failed",
          error: result.error.issues,
        },
        400,
      );
    }

    try {
      const userId = c.get("userId");
      const data = result.data;

      const existingWorkflow = await prisma.workflows.findUnique({
        where: {
          id: workflowId,
          userId: userId,
        },
      });

      if (!existingWorkflow || existingWorkflow.userId !== userId) {
        return c.json(
          {
            message: "workflow doesn't exist or Not allowed to update workflow",
          },
          403,
        );
      }

      const updatedWorkflow = await prisma.$transaction(async (tx) => {
        let webhookId = existingWorkflow.webhooksId;

        if (data.webhook) {
          if (webhookId) {
            await tx.webhooks.update({
              where: {
                id: webhookId,
              },
              data: {
                title: data.webhook.title,
                method: data.webhook.method,
                secret: data.webhook.secret,
              },
            });
          } else {
            const newWebhook = await tx.webhooks.create({
              data: {
                title: data.webhook.title,
                method: data.webhook.method,
                secret: data.webhook.secret,
              },
            });
            webhookId = newWebhook.id;
          }
        }

        if (data.triggerType === "Manual" && webhookId) {
          await tx.webhooks.delete({
            where: {
              id: webhookId,
            },
          });
          webhookId = null;
        }

        const workflowUpdated = await tx.workflows.update({
          where: {
            id: workflowId,
          },
          data: {
            title: data.title,
            enabled: data.enabled,
            nodes: data.nodes,
            connections: data.connections,
            triggerType: data.triggerType,
            webhooksId: webhookId,
          },
        });

        return workflowUpdated;
      });

      return c.json(
        {
          message: "Updating workflow successfully",
          workflow: updatedWorkflow,
        },
        200,
      );
    } catch (error) {
      console.error("Error updating workflow", error);
      return c.json(
        {
          message: "Internal server error",
          error: error,
        },
        500,
      );
    }
  },
);

export default updateWorkflow;
