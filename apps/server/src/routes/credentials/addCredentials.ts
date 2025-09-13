import { Hono } from "hono";

const addCredentials = new Hono();

addCredentials.post("/", (c) => {
  return c.json({
    message: "Adding credentials",
  });
});

export default addCredentials;
