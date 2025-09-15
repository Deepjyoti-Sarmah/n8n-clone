import { Hono, type Context } from "hono";
import type { Variables } from "../../middlewares/auth";

const updateWorkflow = new Hono<{ Variables: Variables }>();

updateWorkflow.put(
  "/:workflowId",
  async (c: Context<{ Variables: Variables }>) => {
    return c.json({
      message: "Updating workflowId",
    });
  },
);

export default updateWorkflow;
