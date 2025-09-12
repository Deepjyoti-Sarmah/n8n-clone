import { Hono, type Context } from "hono";
import { signupSchema } from "@repo/zod";
import { prisma } from "@repo/db";

const signup = new Hono();

signup.post(async (c: Context) => {
  const result = signupSchema.safeParse(c.body);
  if (!result.success) {
    return c.json(
      {
        message: "Invalid credentials",
        error: result.error.issues,
      },
      400,
    );
  }

  try {
    const newUser = result.data;

    if (!newUser) {
      return c.json(
        {
          message: "Not enough details",
        },
        404,
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: newUser.email,
      },
    });

    if (existingUser) {
      return c.json(
        {
          message: "User already exists",
        },
        409,
      );
    }
  } catch (error) {
    console.error("Cannot singup user", error);
    return c.json(
      {
        message: "Internal server error",
        error: error,
      },
      500,
    );
  }
});

export default signup;
