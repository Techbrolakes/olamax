import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/server";
import { addToWatchlist, listWatchlist } from "@/lib/db/queries/watchlist";

const postSchema = z.object({ movieId: z.number().int().positive() });

export async function GET() {
  try {
    const user = await requireUser();
    const items = await listWatchlist(user.id);
    return NextResponse.json({ data: items });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = postSchema.parse(await req.json());
    const row = await addToWatchlist(user.id, body.movieId);
    return NextResponse.json({ data: row });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid body" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
