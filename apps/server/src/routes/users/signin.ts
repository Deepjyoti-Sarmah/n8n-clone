import { config, signinSchema } from "@repo/commons";
import { prisma } from "@repo/db";
import { Hono } from "hono";
import { sign } from "hono/jwt";

const signin = new Hono();

signin.post(async (c) => {
  const result = signinSchema.safeParse(c.req.json());
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
    const oldUser = result.data;

    if (!oldUser) {
      return c.json(
        {
          message: "Not enough details",
        },
        404,
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: oldUser.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!existingUser) {
      return c.json(
        {
          message: "User doesn't exists",
        },
        409,
      );
    }

    const comparedPassword = await Bun.password.verify(
      oldUser.password,
      existingUser.password,
    );

    if (!comparedPassword) {
      return c.json(
        {
          message: "Password are not same",
        },
        400,
      );
    }

    const token = await sign({ id: existingUser.id }, config.server.jwtSecret);

    return c.json({
      message: "User Signed In Successfully",
      token: token,
      userId: existingUser.id,
      user: {
        id: existingUser.id,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.error("Cannot signin user", error);
    return c.json(
      {
        message: "Internal server error",
        error: error,
      },
      500,
    );
  }
});

export default signin;
