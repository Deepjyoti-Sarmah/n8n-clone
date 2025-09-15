import { Hono, type Context } from "hono";
import type { Variables } from "../../middlewares/auth";
import { updateCredentialsSchema } from "@repo/commons";
import { prisma } from "@repo/db";

const updateCredentials = new Hono<{ Variables: Variables }>();

updateCredentials.put(
  "/:credentialsId",
  async (c: Context<{ Variables: Variables }>) => {
    const { credentialsId } = c.req.param();

    if (!credentialsId) {
      return c.json(
        {
          message: "Invalid CredentialId",
        },
        400,
      );
    }

    const result = updateCredentialsSchema.safeParse(c.req.json());
    if (!result.success) {
      return c.json(
        {
          message: "Validation failed",
          error: result.error.issues,
        },
        400,
      );
    }

    try {
      const data = result.data;
      if (!data) {
        return c.json(
          {
            message: "Not enough details",
          },
          404,
        );
      }

      const userId = c.get("userId");

      const credentials = await prisma.credentials.findUnique({
        where: {
          id: credentialsId,
          userId: userId,
        },
      });

      if (!credentials || credentials.userId !== userId) {
        return c.json(
          {
            message:
              "Credentials doesnot exists or Not allowed to update credentials",
          },
          403,
        );
      }

      const updatedCredentials = await prisma.credentials.update({
        where: {
          id: credentialsId,
          userId: userId,
        },
        data: {
          title: data.title,
          platform: data.platform,
          data: data.data,
        },
      });

      return c.json(
        {
          message: "Credentials Updated succefully",
          credentials: updatedCredentials,
        },
        200,
      );
    } catch (error) {
      console.error("Cannot update credentials", error);
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

export default updateCredentials;
