import { Hono, type Context } from "hono";

const signup = new Hono();

signup.post(async (c: Context) => {});

export default signup;
