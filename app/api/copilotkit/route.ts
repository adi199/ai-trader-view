import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import { NextRequest } from "next/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const MODEL = "openai/gpt-oss-20b:free";

// OpenRouter is OpenAI-API-compatible. We pass a custom OpenAI client with
// OpenRouter's base URL so that OpenAIAdapter.getLanguageModel() automatically
// builds a createOpenAI() provider pointed at the correct endpoint.
console.log("OPENROUTER_API_KEY", process.env.OPENROUTER_API_KEY);
const openrouterClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

class CustomOpenAIAdapter extends OpenAIAdapter {
  // Override getLanguageModel to force CopilotRuntime to use the official OpenRouter provider
  // for Vercel AI SDK. This avoids the Vercel AI SDK's Responses API that OpenRouter doesn't support.
  getLanguageModel() {
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    return openrouter(this.model);
  }
}

const serviceAdapter = new CustomOpenAIAdapter({
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
