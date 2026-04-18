import "server-only";
import { eq } from "drizzle-orm";
import { db } from "../index";
import { movieDeepDives, type MovieDeepDive } from "../schema/movie-deep-dives";

export async function getMovieDeepDive(movieId: number): Promise<MovieDeepDive | null> {
  const [row] = await db
    .select()
    .from(movieDeepDives)
    .where(eq(movieDeepDives.movieId, movieId))
    .limit(1);
  return row ?? null;
}

export async function upsertMovieDeepDive(input: { movieId: number; content: string }) {
  await db
    .insert(movieDeepDives)
    .values({ movieId: input.movieId, content: input.content })
    .onConflictDoUpdate({
      target: movieDeepDives.movieId,
      set: { content: input.content, generatedAt: new Date() },
    });
}
