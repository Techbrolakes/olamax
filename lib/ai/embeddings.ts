import "server-only";

import { createHash } from "node:crypto";
import { embed, embedMany } from "ai";
import { AI_MODELS, assertAiGatewayConfigured } from "./gateway";

export type MovieForEmbedding = {
  id: number;
  title: string;
  overview?: string | null;
  genreNames?: string[];
  releaseYear?: number | null;
};

export function buildMovieEmbeddingSource(movie: MovieForEmbedding): string {
  const parts = [movie.title];
  if (movie.overview) parts.push(movie.overview);
  if (movie.genreNames?.length) parts.push(`Genres: ${movie.genreNames.join(", ")}.`);
  if (movie.releaseYear) parts.push(`Year: ${movie.releaseYear}.`);
  return parts.join(" ");
}

export function hashEmbeddingSource(source: string): string {
  return createHash("sha256").update(source).digest("hex").slice(0, 32);
}

export async function embedText(value: string) {
  assertAiGatewayConfigured();
  const { embedding } = await embed({
    model: AI_MODELS.embedding,
    value,
  });
  return embedding;
}

export async function embedTexts(values: string[]) {
  assertAiGatewayConfigured();
  const { embeddings } = await embedMany({
    model: AI_MODELS.embedding,
    values,
    maxParallelCalls: 4,
  });
  return embeddings;
}

export async function embedMovie(movie: MovieForEmbedding) {
  const source = buildMovieEmbeddingSource(movie);
  const embedding = await embedText(source);
  return { embedding, sourceHash: hashEmbeddingSource(source) };
}
