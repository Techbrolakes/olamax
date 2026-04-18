import "server-only";

import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { movieEmbeddings } from "@/lib/db/schema/movie-embeddings";
import { movies as moviesApi } from "@/lib/tmdb/endpoints";
import type { Movie } from "@/lib/tmdb/types";
import {
  buildMovieEmbeddingSource,
  embedTexts,
  hashEmbeddingSource,
} from "./embeddings";
import {
  getMovieEmbeddingsByIds,
  upsertMovieEmbedding,
} from "@/lib/db/queries/movie-embeddings";

/**
 * Count rows in movie_embeddings. Used to decide whether to warm the catalog.
 */
export async function countMovieEmbeddings(): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(movieEmbeddings);
  return row?.count ?? 0;
}

/**
 * Fetch trending + popular, embed what's missing, upsert. Idempotent (skips
 * anything whose sourceHash hasn't changed). Used by the daily cron and by
 * the mood route for self-healing on cold starts.
 *
 * Accepts an optional second page for each endpoint to pull in more titles
 * during the initial warm-up.
 */
export async function warmCatalog(pages = 1): Promise<{
  scanned: number;
  embedded: number;
  skipped: number;
}> {
  const pageList = Array.from({ length: pages }, (_, i) => i + 1);

  const [trendingPages, popularPages, genreList] = await Promise.all([
    Promise.all(pageList.map((p) => moviesApi.trending("week", p))),
    Promise.all(pageList.map((p) => moviesApi.popular(p))),
    moviesApi.genres(),
  ]);

  const genreMap = new Map<number, string>(
    genreList.genres.map((g) => [g.id, g.name])
  );

  const deduped = new Map<number, Movie>();
  for (const page of [...trendingPages, ...popularPages]) {
    for (const m of page.results) {
      if (!m.overview) continue;
      deduped.set(m.id, m);
    }
  }

  const candidates = [...deduped.values()].map((m) => ({
    movieId: m.id,
    source: buildMovieEmbeddingSource({
      id: m.id,
      title: m.title,
      overview: m.overview,
      genreNames: m.genre_ids
        .map((id) => genreMap.get(id))
        .filter(Boolean) as string[],
      releaseYear: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    }),
  }));

  if (candidates.length === 0) {
    return { scanned: 0, embedded: 0, skipped: 0 };
  }

  const existing = await getMovieEmbeddingsByIds(
    candidates.map((c) => c.movieId)
  );
  const existingByMovie = new Map(existing.map((e) => [e.movieId, e.sourceHash]));

  const toEmbed = candidates.filter((c) => {
    const hash = hashEmbeddingSource(c.source);
    return existingByMovie.get(c.movieId) !== hash;
  });

  if (toEmbed.length === 0) {
    return { scanned: candidates.length, embedded: 0, skipped: candidates.length };
  }

  const embeddings = await embedTexts(toEmbed.map((c) => c.source));

  await Promise.all(
    toEmbed.map((c, i) =>
      upsertMovieEmbedding({
        movieId: c.movieId,
        embedding: embeddings[i],
        sourceHash: hashEmbeddingSource(c.source),
      })
    )
  );

  return {
    scanned: candidates.length,
    embedded: toEmbed.length,
    skipped: candidates.length - toEmbed.length,
  };
}
