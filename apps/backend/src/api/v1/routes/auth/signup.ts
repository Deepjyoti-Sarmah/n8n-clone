import { Hono } from "hono";
import { SignupSchema } from "@repo/types";

const signup = new Hono();

signup.post("/", async (c) => {
  const result = SignupSchema.safeParse(c.body);

  if (!result.success) {
    return c.json({ message: "Invalid schema" }, 401);
  }

  try {
    const { name, email, password } = result.data;
    if (!name || !email || !password) {
      return c.json({ message: "Invalid credentials" }, 401);
    }

    //TODO: check if user exists in db
  } catch (error) {
    console.error("Error signing up user", error);
  }
});

export default signup;
