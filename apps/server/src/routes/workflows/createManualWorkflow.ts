import { Hono, type Context } from "hono";
import type { Variables } from "../../middlewares/auth";
import { createWorkFlowSchema } from "@repo/commons";
import { prisma } from "@repo/db";
import { enqueueExecution } from "@repo/redis";

const createManualWorkflow = new Hono<{ Variables: Variables }>();

createManualWorkflow.post(
  "/:workflowId",
  async (c: Context<{ Variables: Variables }>) => {
    const { workflowId } = c.req.param();
    if (!workflowId) {
      return c.json(
        {
          message: "Invlaid workflowId",
        },
        400,
      );
    }

    const result = createWorkFlowSchema.safeParse(c.req.json());
    if (!result.success) {
      return c.json(
        {
          message: "Validation failed",
          error: result.error.issues,
        },
        400,
      );
    }

    let triggerPayload = {};
    try {
      const userId = c.get("userId");

      const data = result.data;

      const workflow = await prisma.workflows.findUnique({
        where: {
          id: workflowId,
        },
      });
      if (!workflow || workflow.userId !== userId) {
        return c.json(
          {
            message: "Workflow not found or Not allowed to run the workflow",
          },
          403,
        );
      }

      if (workflow.triggerType !== "Manual") {
        return c.json(
          {
            message: "The worflow is not Manual",
          },
          400,
        );
      }

      const totalTasks = Object.keys(workflow.nodes as object).length;

      const exection = await prisma.executions.create({
        data: {
          workflowsId: workflowId,
          totalTask: totalTasks,
          output: {
            triggerPayload: triggerPayload,
          },
        },
      });

      //TODO: add redis execution trigger
      await enqueueExecution(exection.id, workflowId, triggerPayload);

      return c.json({
        message: "Manual worflow triggered",
        exectionId: exection.id,
      });
    } catch (error) {
      console.error("Error triggering manual workflow", error);
      return c.json(
        {
          message: "Interval server error",
          error: error,
        },
        500,
      );
    }
  },
);

export default createManualWorkflow;
