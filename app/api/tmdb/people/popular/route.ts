import { NextResponse } from "next/server";
import { people } from "@/lib/tmdb";

export const revalidate = 3600;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  try {
    const data = await people.popular(page);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/tmdb/people/popular] failed", err);
    return NextResponse.json({ error: "tmdb_unavailable" }, { status: 502 });
  }
}
