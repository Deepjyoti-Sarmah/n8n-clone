import { runGeminiNode } from "./gemini/gemini";
import { sendEmail } from "./sendEmail";
import { sendTelegramMessage } from "./telegram";

export const runNode = async (
  node: any,
  context: Record<string, any>,
  workflowId?: string,
) => {
  try {
    if (!node.type) {
      throw new Error("Node type is missing");
    }

    if (!node.credentialsId) {
      throw new Error("Node credentials ID is missing");
    }

    switch (node.type) {
      case "ResendEmail":
        return await sendEmail(node.config, node.credentialsId, context);
      case "Telegram":
        return await sendTelegramMessage(
          node.config,
          node.credentialsId,
          context,
        );
      case "Gemini":
        return await runGeminiNode(node, context, workflowId);

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  } catch (error: any) {
    console.error(`Node ${node.type} failed:`, error);
    throw new Error(`Error in ${node.type}: ${error.message}`);
  }
};
