import { TavilyExtract } from "@langchain/tavily";

export const webSearchTool = new TavilyExtract({
  extractDepth: "basic",
  includeImages: false,
  description:
    "A tool that can be used to search for information on the internet. Use it to find up-to-date information on any topic.",
});
