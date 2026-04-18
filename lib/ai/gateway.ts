import "server-only";

export const AI_MODELS = {
  embedding: "openai/text-embedding-3-small",
  chat: "anthropic/claude-sonnet-4.6",
  chatFast: "anthropic/claude-haiku-4.5",
} as const;

export const EMBEDDING_DIMENSIONS = 1536;

export function assertAiGatewayConfigured() {
  if (!process.env.AI_GATEWAY_API_KEY) {
    throw new Error(
      "AI_GATEWAY_API_KEY is not set — add it to .env (get one from https://vercel.com/dashboard → AI Gateway → API Keys)"
    );
  }
}
