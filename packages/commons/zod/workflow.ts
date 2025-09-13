import * as z from "zod";
import { Platform } from "@repo/db";

const nodeSchema = z.object({
  id: z.string(),
  type: z.enum([Platform.ResendEmail, Platform.Telegram, Platform.Gemini]),
  config: z.record(z.string(), z.any()),
  credentialsId: z.string().optional(),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
});

const webhookSchema = z.object({
  title: z.string(),
  method: z.enum(["GET", "POST"]),
  secret: z.string().optional(),
});

export const createWorkFlowSchema = z.object({
  title: z.string().min(1, "Workflow title needed"),
  nodes: z.record(z.string(), nodeSchema),
  connections: z.record(z.string(), z.array(z.string())),
  triggerType: z.enum(["Manual", "Webhook"]),
  webhook: webhookSchema.optional(),
  enabled: z.boolean().optional(),
});

export const updateWorkFlowSchema = createWorkFlowSchema.partial();
