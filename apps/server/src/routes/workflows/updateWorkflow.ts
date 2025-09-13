import { Hono } from "hono";

const updateWorkflow = new Hono();

updateWorkflow.put("/:workflowId", (c) => {
  return c.json({
    message: "Updating workflowId",
  });
});

export default updateWorkflow;
