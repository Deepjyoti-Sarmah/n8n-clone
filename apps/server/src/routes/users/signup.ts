import { Hono, type Context } from "hono";
import { prisma } from "@repo/db";
import { signupSchema } from "@repo/commons";
import { config } from "@repo/commons";
import { sign } from "hono/jwt";

const signup = new Hono();

signup.post(async (c: Context) => {
  const result = signupSchema.safeParse(c.req.json());
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

    const hashedPassword = await Bun.password.hash(newUser.password, {
      algorithm: "bcrypt",
    });

    const User = await prisma.user.create({
      data: {
        email: newUser.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    const token = await sign({ id: User.id }, config.server.jwtSecret);

    return c.json({
      message: "User Sign Up Successful",
      token: token,
      user: User,
    });
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
