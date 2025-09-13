import { Hono } from "hono";

const deleteWorkflow = new Hono();

deleteWorkflow.delete("/:workflowId", (c) => {
  return c.json({
    message: "Deletting workflowId",
  });
});

export default deleteWorkflow;
