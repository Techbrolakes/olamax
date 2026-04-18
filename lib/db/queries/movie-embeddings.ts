import "server-only";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "../index";
import { movieEmbeddings, type MovieEmbedding } from "../schema/movie-embeddings";

export async function getMovieEmbedding(movieId: number) {
  const [row] = await db
    .select()
    .from(movieEmbeddings)
    .where(eq(movieEmbeddings.movieId, movieId))
    .limit(1);
  return row ?? null;
}

export async function getMovieEmbeddingsByIds(movieIds: number[]) {
  if (movieIds.length === 0) return [] as MovieEmbedding[];
  return db.select().from(movieEmbeddings).where(inArray(movieEmbeddings.movieId, movieIds));
}

export async function upsertMovieEmbedding(input: {
  movieId: number;
  embedding: number[];
  sourceHash: string;
}) {
  await db
    .insert(movieEmbeddings)
    .values({
      movieId: input.movieId,
      embedding: input.embedding,
      sourceHash: input.sourceHash,
    })
    .onConflictDoUpdate({
      target: movieEmbeddings.movieId,
      set: {
        embedding: input.embedding,
        sourceHash: input.sourceHash,
        embeddedAt: new Date(),
      },
    });
}

export async function findSimilarByMovieId(movieId: number, limit = 20) {
  return db.execute(sql`
    SELECT
      candidate.movie_id,
      1 - (candidate.embedding <=> seed.embedding) AS similarity
    FROM ${movieEmbeddings} candidate
    CROSS JOIN (
      SELECT embedding FROM ${movieEmbeddings} WHERE movie_id = ${movieId}
    ) seed
    WHERE candidate.movie_id <> ${movieId}
    ORDER BY candidate.embedding <=> seed.embedding
    LIMIT ${limit}
  `);
}

export async function findSimilarByVector(vector: number[], limit = 20, excludeIds: number[] = []) {
  const vectorLiteral = `[${vector.join(",")}]`;
  const excludeClause = excludeIds.length
    ? sql`AND movie_id NOT IN (${sql.join(excludeIds.map((id) => sql`${id}`), sql`, `)})`
    : sql``;
  return db.execute(sql`
    SELECT movie_id, 1 - (embedding <=> ${vectorLiteral}::vector) AS similarity
    FROM ${movieEmbeddings}
    WHERE 1 = 1 ${excludeClause}
    ORDER BY embedding <=> ${vectorLiteral}::vector
    LIMIT ${limit}
  `);
}
