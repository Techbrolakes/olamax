import "server-only";

import { movies as moviesApi } from "@/lib/tmdb/endpoints";
import { listReviewsForUser } from "@/lib/db/queries/reviews";
import { listWatchlist } from "@/lib/db/queries/watchlist";
import {
  getMovieEmbeddingsByIds,
  upsertMovieEmbedding,
} from "@/lib/db/queries/movie-embeddings";
import {
  getUserTasteVector,
  upsertUserTasteVector,
} from "@/lib/db/queries/user-taste-vectors";
import { EMBEDDING_DIMENSIONS } from "./gateway";
import { embedMovie } from "./embeddings";

const MIN_SIGNALS_FOR_PERSONALIZATION = 3;
const STALE_AFTER_MS = 60 * 60 * 1000;

type Signal = { movieId: number; weight: number };

function ratingWeight(rating: number): number {
  if (rating >= 5) return 1.0;
  if (rating === 4) return 0.7;
  if (rating === 3) return 0.3;
  return -0.5;
}

async function collectSignals(userId: string): Promise<Signal[]> {
  const [reviews, watchlist] = await Promise.all([
    listReviewsForUser(userId),
    listWatchlist(userId),
  ]);
  const byMovie = new Map<number, number>();
  for (const r of reviews) byMovie.set(r.movieId, ratingWeight(r.rating));
  for (const w of watchlist) {
    if (!byMovie.has(w.movieId)) byMovie.set(w.movieId, 0.4);
  }
  return [...byMovie.entries()].map(([movieId, weight]) => ({ movieId, weight }));
}

async function ensureEmbeddings(movieIds: number[]): Promise<Map<number, number[]>> {
  if (movieIds.length === 0) return new Map();
  const existing = await getMovieEmbeddingsByIds(movieIds);
  const byMovie = new Map<number, number[]>(existing.map((e) => [e.movieId, e.embedding]));
  const missing = movieIds.filter((id) => !byMovie.has(id));

  const fetched = await Promise.all(
    missing.map(async (id) => {
      try {
        const details = await moviesApi.details(id);
        const { embedding, sourceHash } = await embedMovie({
          id: details.id,
          title: details.title,
          overview: details.overview,
          genreNames: details.genres.map((g) => g.name),
          releaseYear: details.release_date ? Number(details.release_date.slice(0, 4)) : null,
        });
        await upsertMovieEmbedding({ movieId: id, embedding, sourceHash });
        return { id, embedding };
      } catch (error) {
        console.warn(`[taste-vector] failed to embed movie ${id}`, error);
        return null;
      }
    })
  );

  for (const row of fetched) {
    if (row) byMovie.set(row.id, row.embedding);
  }
  return byMovie;
}

function weightedCentroid(
  signals: Signal[],
  embeddings: Map<number, number[]>
): number[] | null {
  const sum = new Array<number>(EMBEDDING_DIMENSIONS).fill(0);
  let used = 0;
  for (const s of signals) {
    const e = embeddings.get(s.movieId);
    if (!e || e.length !== EMBEDDING_DIMENSIONS) continue;
    for (let i = 0; i < EMBEDDING_DIMENSIONS; i++) sum[i] += s.weight * e[i];
    used++;
  }
  if (used === 0) return null;
  const magnitude = Math.sqrt(sum.reduce((acc, v) => acc + v * v, 0));
  if (magnitude === 0) return null;
  return sum.map((v) => v / magnitude);
}

export async function computeTasteVector(userId: string) {
  const signals = await collectSignals(userId);
  if (signals.length < MIN_SIGNALS_FOR_PERSONALIZATION) {
    await upsertUserTasteVector({ userId, embedding: null, signalCount: signals.length });
    return { embedding: null, signalCount: signals.length };
  }

  const embeddings = await ensureEmbeddings(signals.map((s) => s.movieId));
  const centroid = weightedCentroid(signals, embeddings);
  await upsertUserTasteVector({
    userId,
    embedding: centroid,
    signalCount: signals.length,
  });
  return { embedding: centroid, signalCount: signals.length };
}

export async function getTasteVector(userId: string) {
  const existing = await getUserTasteVector(userId);
  const isStale =
    !existing ||
    existing.stale ||
    Date.now() - existing.updatedAt.getTime() > STALE_AFTER_MS;

  if (isStale) return computeTasteVector(userId);

  return { embedding: existing.embedding, signalCount: existing.signalCount };
}

export { MIN_SIGNALS_FOR_PERSONALIZATION };
