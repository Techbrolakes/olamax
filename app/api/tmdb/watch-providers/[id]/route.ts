import { NextResponse } from "next/server";
import { movies } from "@/lib/tmdb";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movieId = Number(id);
  if (!Number.isFinite(movieId)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }
  try {
    const data = await movies.watchProviders(movieId);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: { id: movieId, results: {} } });
  }
}
