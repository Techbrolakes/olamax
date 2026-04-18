import { NextResponse } from "next/server";
import { warmCatalog } from "@/lib/ai/warm-catalog";

export const runtime = "nodejs";
export const maxDuration = 300;

function unauthorized() {
  return new NextResponse("Unauthorized", { status: 401 });
}

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;
  if (!expected || auth !== `Bearer ${expected}`) {
    return unauthorized();
  }

  try {
    const result = await warmCatalog(1);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[cron/embed-trending] failed", error);
    return NextResponse.json({ error: "embed-trending failed" }, { status: 500 });
  }
}
