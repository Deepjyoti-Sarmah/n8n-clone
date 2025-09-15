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
        404,
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

getCredentials.get(
  "/:credentialId",
  async (c: Context<{ Variables: Variables }>) => {
    const { credentialId } = c.req.param();
    if (!credentialId) {
      return c.json(
        {
          message: "CredentialId Invalid",
        },
        400,
      );
    }

    try {
      const userId = c.get("userId");

      const credentials = await prisma.credentials.findUnique({
        where: {
          id: credentialId,
        },
      });

      if (!credentials) {
        return c.json(
          {
            message: "Credentials not found",
          },
          404,
        );
      }

      if (credentials.userId !== userId) {
        return c.json(
          {
            message: "You don't have access to this specific credentials",
          },
          403,
        );
      }

      return c.json(
        {
          message: "Credentials fetch successfully using id",
          credentials: credentials,
        },
        200,
      );
    } catch (error) {
      console.error("Error getting credentials using id");
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

export default getCredentials;
