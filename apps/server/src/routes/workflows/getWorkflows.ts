import { Hono } from "hono";

const getWorkflows = new Hono();

getWorkflows.get("/", (c) => {
  return c.json({
    message: "Get workflows",
  });
});

getWorkflows.get("/:workflowId", (c) => {
  return c.json({
    message: "Get workflowId",
  });
});

export default getWorkflows;
