import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";

const model = new ChatGoogleGenerativeAI({
  model: "",
  maxOutputTokens: 2048,
  temperature: 0,
});

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);

  return { message: [response] };
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent");

const app = workflow.compile();

const finalState = await app.invoke({});

console.log(finalState.messages[finalState.messages.length - 1]?.content);
