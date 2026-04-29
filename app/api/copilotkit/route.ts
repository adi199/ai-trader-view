import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import { NextRequest } from "next/server";

const MODEL = "minimax/minimax-m2.5:free";

// OpenRouter is OpenAI-API-compatible. We pass a custom OpenAI client with
// OpenRouter's base URL so that OpenAIAdapter.getLanguageModel() automatically
// builds a createOpenAI() provider pointed at the correct endpoint.
console.log("OPENROUTER_API_KEY", process.env.OPENROUTER_API_KEY);
const openrouterClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

const serviceAdapter = new OpenAIAdapter({
  openai: openrouterClient,
  model: MODEL,
});

const runtime = new CopilotRuntime();

export async function POST(req: NextRequest) {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
}
