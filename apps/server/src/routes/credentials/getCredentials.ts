import { Hono, type Context } from "hono";
import type { Variables } from "../../middlewares/auth";
import { prisma } from "@repo/db";

const getCredentials = new Hono<{ Variables: Variables }>();

getCredentials.get("/", async (c: Context<{ Variables: Variables }>) => {
  try {
    const userId = c.get("userId");

    const credentials = await prisma.credentials.findMany({
      where: {
        userId,
      },
    });

    if (!credentials) {
      return c.json(
        {
          message: "Credentials not found",
        },
        400,
      );
    }

    return c.json(
      {
        message: "Credentials successfully fetched",
        credentials: credentials,
      },
      200,
    );
  } catch (error) {
    console.error("Error getting credentials");
    return c.json(
      {
        message: "Internal server error",
        error: error,
      },
      500,
    );
  }
});

getCredentials.get("/:credentialId", (c) => {
  return c.json({
    message: "Get user credentials by Id",
  });
});

export default getCredentials;
