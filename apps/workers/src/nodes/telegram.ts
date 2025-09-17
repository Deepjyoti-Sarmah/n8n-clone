import { prisma } from "@repo/db";
import { fetch } from "bun";
import Mustache from "mustache";

type TelegramCred = {
  botToken: string;
  chatId: string;
};

export const sendTelegramMessage = async (
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
      throw new Error("Telegram credentials not found");
    }

    const data =
      typeof creds.data === "string" ? JSON.parse(creds.data) : creds.data;

    const { botToken, chatId } = data as TelegramCred;
    if (!botToken || !chatId) {
      throw new Error("Telegram credentials invalid");
    }

    const message = Mustache.render(config.message, context);

    const resp = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      },
    );

    console.log("Telegram status: ", resp.status);

    const text = await resp.text();
    console.log("Telegram raw response:", text);

    let result: any = {};
    try {
      result = JSON.parse(text);
    } catch (error) {
      throw new Error(`Telegram returned invalid JSON: ${text}`);
    }

    if (!result.ok) {
      throw new Error(
        `Telegram API error: ${result.description || JSON.stringify(result)}`,
      );
    }

    return { message };
  } catch (error) {
    console.error("Telegram node error", error);
    throw error;
  }
};
