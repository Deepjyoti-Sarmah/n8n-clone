import { config } from "@repo/commons";
import { prisma } from "@repo/db";
import { Hono, type Context, type Next } from "hono";
import { verify } from "hono/jwt";

// Define types for context variables
export type Variables = {
  user: {
    id: string;
    email: string;
  };
  userId: string;
};

// Define JWT payload type
interface JWTPayload {
  id: string;
  [key: string]: any;
}

export const authMiddleware = async (
  c: Context<{ Variables: Variables }>,
  next: Next,
) => {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return c.json(
      {
        message: "Authorization token required",
        error: "Token not available",
      },
      401,
    );
  }

  try {
    const decoded = (await verify(
      token,
      config.server.jwtSecret,
    )) as JWTPayload;

    const User = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!User) {
      return c.json(
        {
          message: "User not found",
        },
        401,
      );
    }

    c.set("user", User);
    c.set("userId", User.id);

    await next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return c.json(
      {
        message: "Authorization error",
        error: "Invalid or expired token",
      },
      401,
    );
  }
};
