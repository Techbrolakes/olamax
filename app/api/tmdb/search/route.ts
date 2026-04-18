import { NextResponse } from "next/server";
import { movies, people, tv } from "@/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const page = Number(searchParams.get("page") ?? "1");
  if (!q) return NextResponse.json({ movies: [], people: [], shows: [] });

  const [movieResults, peopleResults, tvResults] = await Promise.all([
    movies.search(q, page).catch(() => ({ results: [] })),
    people.search(q, page).catch(() => ({ results: [] })),
    tv.search(q, page).catch(() => ({ results: [] })),
  ]);

  return NextResponse.json({
    movies: movieResults.results,
    people: peopleResults.results,
    shows: tvResults.results,
  });
}
