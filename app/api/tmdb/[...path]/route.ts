import { NextResponse, type NextRequest } from "next/server";

// Public read-through proxy for TMDB. Exists so the client can call TanStack
// Query against a same-origin URL while the TMDB_API_KEY stays server-side.
//
// Edge cache does the heavy lifting here: every user worldwide hits the same
// cached response for up to an hour. TMDB itself is only contacted on cache
// miss or revalidation — that's the "reduce server load" win over SSRing
// every request from the origin.

export const runtime = "nodejs";

const TMDB_BASE = "https://api.themoviedb.org/3";

// Only proxy a narrow set of read-only endpoints. Keeps the proxy from being
// abused as an open TMDB relay.
const ALLOWED_PREFIXES = [
  "trending/",
  "movie/",
  "tv/",
  "discover/",
  "genre/",
  "person/",
] as const;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const joined = path.join("/");
  if (!ALLOWED_PREFIXES.some((p) => joined.startsWith(p))) {
    return NextResponse.json({ error: "path not allowed" }, { status: 404 });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "TMDB_API_KEY not configured" },
      { status: 500 },
    );
  }

  const url = new URL(`${TMDB_BASE}/${joined}`);
  for (const [k, v] of req.nextUrl.searchParams.entries()) {
    url.searchParams.set(k, v);
  }
  url.searchParams.set("api_key", apiKey);

  const upstream = await fetch(url.toString(), {
    // Next Data Cache on top of edge cache — dedupes requests across
    // concurrent renders and survives function invocations.
    next: { revalidate: 3600 },
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "tmdb upstream error", status: upstream.status },
      { status: upstream.status },
    );
  }

  const data = await upstream.json();
  return NextResponse.json(data, {
    headers: {
      // Vercel edge: cache 1h, serve stale while revalidating for a day.
      "Cache-Control":
        "public, s-maxage=3600, stale-while-revalidate=86400, max-age=0",
    },
  });
}
