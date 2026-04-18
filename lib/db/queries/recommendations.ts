import "server-only";
import { eq } from "drizzle-orm";
import { db } from "../index";
import { reviews } from "../schema/reviews";
import { watchlist } from "../schema/watchlist";
import { findSimilarByVector } from "./movie-embeddings";

type SimilarityRow = { movie_id: number; similarity: number };

export async function getPersonalizedMovieIds(
  userId: string,
  userVector: number[],
  limit = 20
): Promise<{ movieId: number; similarity: number }[]> {
  const [reviewed, watchlisted] = await Promise.all([
    db.select({ movieId: reviews.movieId }).from(reviews).where(eq(reviews.userId, userId)),
    db.select({ movieId: watchlist.movieId }).from(watchlist).where(eq(watchlist.userId, userId)),
  ]);
  const excludeIds = Array.from(
    new Set([...reviewed.map((r) => r.movieId), ...watchlisted.map((w) => w.movieId)])
  );

  const result = await findSimilarByVector(userVector, limit, excludeIds);
  const rows = result.rows as SimilarityRow[];
  return rows.map((r) => ({ movieId: Number(r.movie_id), similarity: Number(r.similarity) }));
}
