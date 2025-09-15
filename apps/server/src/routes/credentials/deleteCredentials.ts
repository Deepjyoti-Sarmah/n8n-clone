import { Hono, type Context } from "hono";
import type { Variables } from "../../middlewares/auth";
import { prisma } from "@repo/db";

const deleteCredentials = new Hono<{ Variables: Variables }>();

deleteCredentials.delete(
  "/:credentialId",
  async (c: Context<{ Variables: Variables }>) => {
    const { credentialId } = c.req.param();

    if (!credentialId) {
      return c.json(
        {
          message: "credentialId Invaild",
        },
        400,
      );
    }

    try {
      const userId = c.get("userId");
      const credentials = await prisma.credentials.findUnique({
        where: {
          id: credentialId,
          userId: userId,
        },
      });

      if (!credentials || credentials.userId !== userId) {
        return c.json(
          {
            message:
              "crdentials does not exists or Not allowed to delete credentials",
          },
          403,
        );
      }

      const deletedCredentials = await prisma.credentials.delete({
        where: {
          id: credentialId,
          userId: userId,
        },
      });

      return c.json(
        {
          message: "Credentials Deleted succefully",
          credentials: deleteCredentials,
        },
        200,
      );
    } catch (error) {
      console.error("Cannot delete credentials", error);
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

export default deleteCredentials;
