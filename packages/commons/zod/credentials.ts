import * as z from "zod";
import { Platform } from "@repo/db";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resendSchema = z.object({
  title: z.string().min(1, "Platform title needed"),
  platform: z.literal(Platform.ResendEmail),
  data: z.object({
    apiKey: z.string().min(1, "Resend Api Key required"),
    resendDomainMail: z
      .string()
      .regex(emailRegex, "Invalid email format")
      .optional(),
  }),
});

const telegramSchema = z.object({
  title: z.string().min(1, "Platform title needed"),
  platform: z.literal(Platform.Telegram),
  data: z.object({
    botToken: z.string().min(1, "Telegram botToken required"),
    chatId: z.string().min(1, "Telegram chatId required"),
  }),
});

const geminiSchema = z.object({
  title: z.string().min(1, "Platform title needed"),
  platform: z.literal(Platform.Gemini),
  data: z.object({
    geminiApiKey: z.string().min(1, "Gemini API key required"),
  }),
});

export const addCredentialsSchema = z.discriminatedUnion("platform", [
  resendSchema,
  telegramSchema,
  geminiSchema,
]);

export const updateCredentialsSchema = z.discriminatedUnion("platform", [
  resendSchema.partial(),
  telegramSchema.partial(),
  geminiSchema.partial(),
]);

export type addCredentialsInput = z.Infer<typeof addCredentialsSchema>;
export type updateCredentialsInput = z.Infer<typeof updateCredentialsSchema>;
