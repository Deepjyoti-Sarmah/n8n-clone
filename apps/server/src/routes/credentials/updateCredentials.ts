import { Hono } from "hono";

const updateCredentials = new Hono();

updateCredentials.put("/:credentialsId", (c) => {
  return c.json({
    message: "updating credentials",
  });
});

export default updateCredentials;
