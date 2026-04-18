import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { movies as moviesApi } from "@/lib/tmdb/endpoints";
import { getTasteVector, MIN_SIGNALS_FOR_PERSONALIZATION } from "@/lib/ai/taste-vector";
import { getPersonalizedMovieIds } from "@/lib/db/queries/recommendations";
import type { Movie, Paginated } from "@/lib/tmdb/types";

export const runtime = "nodejs";
export const maxDuration = 20;

const PICK_COUNT = 3;

type SourceTag =
  | "trending"
  | "popular"
  | "top-rated"
  | "now-playing"
  | "upcoming"
  | "personalized";

type PoolEntry = { movie: Movie; sources: SourceTag[] };

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Collect results from all 5 TMDB discovery endpoints in parallel. */
async function buildBroadPool(): Promise<Map<number, PoolEntry>> {
  const safe = async <T>(p: Promise<T>, fallback: T): Promise<T> => {
    try {
      return await p;
    } catch {
      return fallback;
    }
  };
  const empty: Paginated<Movie> = { page: 1, results: [], total_pages: 0, total_results: 0 };

  const [trending, popular, topRated, nowPlaying, upcoming] = await Promise.all([
    safe(moviesApi.trending("week", 1), empty),
    safe(moviesApi.popular(1), empty),
    safe(moviesApi.topRated(1), empty),
    safe(moviesApi.nowPlaying(1), empty),
    safe(moviesApi.upcoming(1), empty),
  ]);

  const pool = new Map<number, PoolEntry>();
  const buckets: { tag: SourceTag; list: Movie[] }[] = [
    { tag: "trending", list: trending.results },
    { tag: "popular", list: popular.results },
    { tag: "top-rated", list: topRated.results },
    { tag: "now-playing", list: nowPlaying.results },
    { tag: "upcoming", list: upcoming.results },
  ];

  for (const { tag, list } of buckets) {
    for (const m of list) {
      if (!m.overview) continue;
      const existing = pool.get(m.id);
      if (existing) existing.sources.push(tag);
      else pool.set(m.id, { movie: m, sources: [tag] });
    }
  }

  return pool;
}

/**
 * Stratified sample: pick up to n movies from different sources. Falls back to
 * random sampling from any remaining movies if not enough unique sources exist.
 */
function stratifiedPick(
  pool: Map<number, PoolEntry>,
  n: number
): { movie: Movie; source: SourceTag }[] {
  const bySource = new Map<SourceTag, Movie[]>();
  for (const { movie, sources } of pool.values()) {
    for (const src of sources) {
      const list = bySource.get(src) ?? [];
      list.push(movie);
      bySource.set(src, list);
    }
  }

  const result: { movie: Movie; source: SourceTag }[] = [];
  const chosenIds = new Set<number>();
  const shuffledSources = shuffle([...bySource.keys()]);

  for (const src of shuffledSources) {
    if (result.length >= n) break;
    const candidates = (bySource.get(src) ?? []).filter((m) => !chosenIds.has(m.id));
    if (candidates.length === 0) continue;
    const picked = candidates[randomInt(candidates.length)];
    result.push({ movie: picked, source: src });
    chosenIds.add(picked.id);
  }

  if (result.length < n) {
    const rest = [...pool.values()]
      .map((e) => e.movie)
      .filter((m) => !chosenIds.has(m.id));
    const shuffled = shuffle(rest);
    for (const m of shuffled) {
      if (result.length >= n) break;
      const entry = pool.get(m.id);
      result.push({ movie: m, source: entry?.sources[0] ?? "trending" });
      chosenIds.add(m.id);
    }
  }

  return result;
}

export async function GET() {
  try {
    return await pick();
  } catch (error) {
    console.error("[api/ai/pick] failed", error);
    return NextResponse.json({ error: "pick_failed" }, { status: 500 });
  }
}

async function pick() {
  const user = await getCurrentUser();
  const pool = await buildBroadPool();

  // If the user is personalized, inject a "personalized" bucket by pulling
  // the top ~20 from their taste-vector kNN. Add those into the pool tagged
  // as "personalized" so stratification can pick one from that bucket.
  if (user) {
    try {
      const { embedding, signalCount } = await getTasteVector(user.id);
      if (embedding && signalCount >= MIN_SIGNALS_FOR_PERSONALIZATION) {
        const personalizedIds = await getPersonalizedMovieIds(user.id, embedding, 20);
        const personalizedMovies = await Promise.all(
          personalizedIds.map(async (p) => {
            try {
              return await moviesApi.details(p.movieId);
            } catch {
              return null;
            }
          })
        );
        for (const m of personalizedMovies) {
          if (!m) continue;
          const existing = pool.get(m.id);
          if (existing) existing.sources.push("personalized");
          else pool.set(m.id, { movie: m, sources: ["personalized"] });
        }
      }
    } catch (error) {
      console.warn("[pick] personalized bucket failed, continuing with broad pool", error);
    }
  }

  if (pool.size === 0) {
    return NextResponse.json({ error: "pool_empty" }, { status: 502 });
  }

  const picks = stratifiedPick(pool, PICK_COUNT);
  const hasPersonalized = picks.some((p) => p.source === "personalized");

  return NextResponse.json({
    picks: picks.map((p) => p.movie),
    sources: picks.map((p) => p.source),
    source: hasPersonalized ? ("personalized" as const) : ("trending" as const),
  });
}
