import { password } from "bun";
import * as z from "zod";
import { email } from "zod/mini";

export const SignupSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(4),
});

export const SigninSchema = z.object({
  email: z.email(),
  password: z.string().min(4),
});
