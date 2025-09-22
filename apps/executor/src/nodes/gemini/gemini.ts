import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  type ToolMessage,
} from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  MessagesAnnotation,
  StateGraph,
  START,
  END,
  Annotation,
} from "@langchain/langgraph";
import { resolveTemplate } from "../../../utils/utils";
import { prisma } from "@repo/db";
import { tools } from "../../tools/calculate";
import { addMemory, getMemory } from "@repo/redis";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { allTools } from "../../tools";

function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage = messages[messages.length - 1] as AIMessage;

  if (lastMessage.tool_calls?.length) {
    return "tools";
  }

  return "__end__";
}

async function callModel(
  state: typeof MessagesAnnotation.State,
  model: ReturnType<typeof ChatGoogleGenerativeAI.prototype.bindTools>,
) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

export async function runGeminiNode(
  node: any,
  context: any,
  workflowId?: string,
) {
  try {
    let {
      prompt,
      memory,
      model: configModel = "gemini-2.0-flash",
    } = node.config;

    if (prompt && typeof prompt === "string" && prompt.includes("{{")) {
      prompt = resolveTemplate(prompt, context);
    }

    const creds = await prisma.credentials.findUnique({
      where: {
        id: node.credentialId,
      },
    });

    if (!creds) {
      throw new Error("Gemini credentials not found");
    }

    const data =
      typeof creds.data === "string" ? JSON.parse(creds.data) : creds.data;
    const { geminiApiKey } = data;

    if (!geminiApiKey) {
      throw new Error("Missing Gemini API Key");
    }

    const model = new ChatGoogleGenerativeAI({
      apiKey: geminiApiKey,
      model: configModel,
    }).bindTools(allTools);

    let history: {
      role: "user" | "assistant";
      content: string;
    }[] = [];

    if (memory && workflowId) {
      history = await getMemory(workflowId);
    }

    const toolNode = new ToolNode(tools);

    const workflow = new StateGraph(MessagesAnnotation)
      .addNode("agent", async (state) => callModel(state, model))
      .addEdge("__start__", "agent")
      .addNode("tools", toolNode)
      .addEdge("tools", "agent")
      .addConditionalEdges("agent", shouldContinue);

    const app = workflow.compile();

    const messages = [];

    messages.push(
      new SystemMessage(
        `
        You are a helpful AI assistant with access to various tools and functions.

        When responding to user requests:
        - If the task can be accomplished using available tools, use them appropriately
        - Always evaluate if tools are needed before responding
        - If no tools are needed, respond naturally with your knowledge
        - Always provide clear, helpful responses
        - Use tools when they can enhance your response or perform specific actions
        - When asked to return JSON, return only valid JSON without extra text or backticks

        You can generate content freely when tools aren't needed.
        Choose the best approach based on what the user is asking for.
        `,
      ),
    );

    for (const msg of history) {
      if (msg.role === "user") {
        messages.push(new HumanMessage(msg.content));
      } else {
        messages.push(new AIMessage(msg.content));
      }
    }

    messages.push(new HumanMessage(String(prompt)));

    const finalState = await app.invoke({ messages });

    const lastMessage = finalState.messages[finalState.messages.length - 1];
    let rawText = "";

    if (lastMessage?.getType() === "ai") {
      rawText = (lastMessage as AIMessage).content as string;
    } else {
      rawText = String(lastMessage?.content);
    }

    rawText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    if (memory && workflowId) {
      await addMemory(workflowId, "user", String(prompt));
      await addMemory(workflowId, "assistant", rawText);
    }

    try {
      const parsed = JSON.parse(rawText);
      if (parsed && typeof parsed === "object") {
        return {
          text: parsed,
          query: String(prompt),
          model: configModel,
          generatedAt: new Date().toISOString(),
        };
      }
    } catch {
      console.warn("Gemini output not valid JSON, returing as text");
    }

    return {
      text: rawText,
      query: String(prompt),
      model: configModel,
      generatedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("Failed to run gemini node:", error.message);
    throw error;
  }
}
