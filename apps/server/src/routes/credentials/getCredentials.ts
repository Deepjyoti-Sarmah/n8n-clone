import { Hono } from "hono";

const getCredentials = new Hono();

getCredentials.get("/", (c) => {
  return c.json({
    message: "Get user credentials",
  });
});

getCredentials.get("/:credentialId", (c) => {
  return c.json({
    message: "Get user credentials by Id",
  });
});

export default getCredentials;
