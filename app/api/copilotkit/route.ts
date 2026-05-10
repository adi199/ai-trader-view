import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// Use a model with proper OpenAI-compatible tool/function calling support.
// Avoid models like gpt-oss-20b that use non-standard constrained-decoding
// tokens (<|constrain|>) which break OpenRouter's streaming layer.
const MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

// CopilotKit's OpenAIAdapter requires an openai client in its constructor,
// but we override getLanguageModel() to use the OpenRouter Vercel AI SDK
// provider directly — avoiding the Responses API that OpenRouter doesn't support.
class OpenRouterAdapter extends OpenAIAdapter {
  getLanguageModel() {
    return createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY })(this.model);
  }
}

const serviceAdapter = new OpenRouterAdapter({ model: MODEL });
const runtime = new CopilotRuntime();

export async function POST(req: NextRequest) {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
}
