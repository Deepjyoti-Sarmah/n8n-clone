import { Hono } from "hono";

const deleteCredentials = new Hono();

deleteCredentials.delete("/:credentialId", (c) => {
  return c.json({
    message: "deleting credentialId",
  });
});

export default deleteCredentials;
