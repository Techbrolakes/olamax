import { NextResponse } from "next/server";
import { movies } from "@/lib/tmdb";

export const revalidate = 3600;

const CATEGORY_HANDLERS = {
  trending: (page: number) => movies.trending("week", page),
  popular: (page: number) => movies.popular(page),
  "top-rated": (page: number) => movies.topRated(page),
  upcoming: (page: number) => movies.upcoming(page),
} as const;

type Category = keyof typeof CATEGORY_HANDLERS;

function isCategory(value: string): value is Category {
  return value in CATEGORY_HANDLERS;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  if (!isCategory(category)) {
    return NextResponse.json({ error: "unknown_category" }, { status: 404 });
  }
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  try {
    const data = await CATEGORY_HANDLERS[category](page);
    return NextResponse.json(data);
  } catch (err) {
    console.error(`[/api/tmdb/movies/${category}] failed`, err);
    return NextResponse.json({ error: "tmdb_unavailable" }, { status: 502 });
  }
}
