import { NextResponse } from "next/server";
import { createAgentUIStreamResponse } from "ai";
import { getCurrentUser } from "@/lib/auth/server";
import { createConciergeAgent } from "@/lib/ai/concierge-agent";
import { assertAiGatewayConfigured } from "@/lib/ai/gateway";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    assertAiGatewayConfigured();
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 503 }
    );
  }

  try {
    const user = await getCurrentUser();
    const body = (await request.json()) as { messages: unknown[] };
    const agent = createConciergeAgent(user?.id ?? null);
    return createAgentUIStreamResponse({
      agent,
      uiMessages: body.messages ?? [],
    });
  } catch (error) {
    console.error("[concierge] failed", error);
    return NextResponse.json({ error: "concierge failed" }, { status: 500 });
  }
}
