import { calculateTools } from "./calculate";
import { webSearchTool } from "./webSearch";

export const allTools = [...calculateTools, webSearchTool];
