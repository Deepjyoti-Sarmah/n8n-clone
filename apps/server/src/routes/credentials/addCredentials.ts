import { Hono, type Context } from "hono";
import { addCredentialsSchema } from "@repo/commons";
import type { Variables } from "../../middlewares/auth";
import { prisma } from "@repo/db";

const addCredentials = new Hono<{ Variables: Variables }>();

addCredentials.post("/", async (c: Context<{ Variables: Variables }>) => {
  const result = addCredentialsSchema.safeParse(c.req.json());
  if (!result.success) {
    return c.json(
      {
        message: "Validation failed",
        errors: result.error.issues,
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

    const existingCredentials = await prisma.credentials.findFirst({
      where: {
        userId: userId,
        platform: data.platform,
        title: data.title,
      },
    });

    if (existingCredentials) {
      return c.json(
        {
          message: "Credentials already exists",
        },
        409,
      );
    }

    const credentials = await prisma.credentials.create({
      data: {
        title: data.title,
        platform: data.platform,
        data: data.data,
        userId,
      },
    });

    return c.json(
      {
        message: "Credentials added successfully",
        credentials: credentials,
      },
      200,
    );
  } catch (error) {
    console.error("Error adding credentials", error);
    return c.json(
      {
        message: "Internal server error",
        error: error,
      },
      500,
    );
  }
});

export default addCredentials;
