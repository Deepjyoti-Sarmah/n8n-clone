import * as z from "zod";

export const signupSchema = z.object({
  email: z.email().describe("email is required"),
  password: z.string().min(4).describe("password is required"),
});

export const signinSchema = z.object({
  email: z.email().describe("email is required"),
  password: z.string().min(4).describe("password is required"),
});
