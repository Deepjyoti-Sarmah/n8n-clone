import { sendEmail } from "./sendEmail";
import { sendTelegramMessage } from "./telegram";

export const runNode = async (
  node: any,
  context: Record<string, any>,
  workflow?: string,
) => {
  try {
    switch (node.type) {
      case "ResendEmail":
        return await sendEmail(node.config, node.credentialsId, context);
      case "Telegram":
        return await sendTelegramMessage(
          node.config,
          node.credentialsId,
          context,
        );

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  } catch (error: any) {
    console.error(`Node ${node.type} failed:`, error);
    throw new Error(`Error in ${node.type}: ${error.message}`);
  }
};
