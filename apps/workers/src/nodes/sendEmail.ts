import { prisma } from "@repo/db";
import { Resend } from "resend";
import Mustache from "mustache";

export const sendEmail = async (
  config: any,
  credentialsId: string,
  context: Record<string, any>,
) => {
  try {
    const creds = await prisma.credentials.findUnique({
      where: {
        id: credentialsId,
      },
    });
    if (!creds) {
      throw new Error("Email credentials not found");
    }

    const data =
      typeof creds.data === "string" ? JSON.parse(creds.data) : creds.data;
    if (!data.apiKey) {
      throw new Error("Email API key missing in credentials");
    }

    const resend = new Resend(data.apiKey);

    const to = Mustache.render(config.to, context);
    const subject = Mustache.render(config.subject, context);
    const body = Mustache.render(config.body, context);

    const result = await resend.emails.send({
      from: data.resendDomainMail || "onboarding@resend.dev",
      to,
      subject,
      html: body,
    });

    console.log(result);

    return { to, subject, body };
  } catch (error) {
    console.error("Telegram node error", error);
    throw error;
  }
};
