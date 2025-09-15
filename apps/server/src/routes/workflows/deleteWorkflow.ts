import { Hono, type Context } from "hono";
import type { Variables } from "../../middlewares/auth";
import { prisma } from "@repo/db";

const deleteWorkflow = new Hono<{ Variables: Variables }>();

deleteWorkflow.delete(
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

    try {
      const userId = c.get("userId");

      const workflow = await prisma.workflows.findUnique({
        where: {
          id: workflowId,
          userId: userId,
        },
      });

      if (!workflow || workflow.userId !== userId) {
        return c.json(
          {
            message:
              "Workflow doesnot exists or Not allowed to delete workflow",
          },
          403,
        );
      }

      const deletedWorkflow = await prisma.workflows.delete({
        where: {
          id: workflowId,
          userId: userId,
        },
        include: {
          execution: true,
        },
      });

      return c.json(
        {
          message: "Deleted workflow successfully",
          deletedWorkflow: deletedWorkflow,
        },
        200,
      );
    } catch (error) {
      console.error("Cannot delete workflow", error);
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

export default deleteWorkflow;
