import "server-only";

import { InferAgentUIMessage, ToolLoopAgent, tool } from "ai";
import { z } from "zod";
import { movies as moviesApi } from "@/lib/tmdb/endpoints";
import { AI_MODELS } from "./gateway";
import { embedText } from "./embeddings";
import { findSimilarByVector } from "@/lib/db/queries/movie-embeddings";
import { getTasteVector } from "./taste-vector";

const movieSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  year: z.string().nullable(),
  posterPath: z.string().nullable(),
  overview: z.string(),
  voteAverage: z.number(),
});

function summarize(m: {
  id: number;
  title: string;
  release_date?: string | null;
  poster_path: string | null;
  overview: string;
  vote_average: number;
}) {
  return {
    id: m.id,
    title: m.title,
    year: m.release_date ? m.release_date.slice(0, 4) : null,
    posterPath: m.poster_path,
    overview: m.overview,
    voteAverage: m.vote_average,
  };
}

function createTools(userId: string | null) {
  return {
    searchMovies: tool({
      description:
        "Full-text search across TMDB's movie catalog. Use when the user mentions a title or wants classical keyword matching.",
      inputSchema: z.object({
        query: z.string().min(1).describe("Search query (title, keywords)"),
      }),
      execute: async ({ query }) => {
        const data = await moviesApi.search(query, 1);
        return { results: data.results.slice(0, 8).map(summarize) };
      },
    }),

    getMovieDetails: tool({
      description: "Fetch full details for a single movie by its TMDB id.",
      inputSchema: z.object({
        movieId: z.number().int().positive(),
      }),
      execute: async ({ movieId }) => {
        const m = await moviesApi.details(movieId);
        return {
          ...summarize(m),
          runtime: m.runtime,
          tagline: m.tagline,
          genres: m.genres.map((g) => g.name),
          status: m.status,
        };
      },
    }),

    getSimilar: tool({
      description:
        "Find movies similar to a given movie via TMDB's own 'similar' endpoint (useful for like-this-one queries).",
      inputSchema: z.object({
        movieId: z.number().int().positive(),
      }),
      execute: async ({ movieId }) => {
        const data = await moviesApi.similar(movieId, 1);
        return { results: data.results.slice(0, 8).map(summarize) };
      },
    }),

    recommendForTaste: tool({
      description:
        "Semantic recommendation using vector similarity. Pass a seedDescription that captures the vibe/mood/themes the user wants. Blends with the user's own taste profile when signed in.",
      inputSchema: z.object({
        seedDescription: z
          .string()
          .min(10)
          .describe(
            "A prose description of the films to recommend — vibe, mood, themes, setting. NOT a title."
          ),
        limit: z.number().int().min(1).max(10).default(6),
      }),
      execute: async ({ seedDescription, limit }) => {
        const seedEmbedding = await embedText(seedDescription);
        let queryVector = seedEmbedding;

        if (userId) {
          const taste = await getTasteVector(userId);
          if (taste.embedding) {
            queryVector = seedEmbedding.map(
              (v, i) => 0.65 * v + 0.35 * taste.embedding![i]
            );
          }
        }

        const result = await findSimilarByVector(queryVector, limit);
        const rows = result.rows as { movie_id: number; similarity: number }[];
        const detailed = await Promise.all(
          rows.map(async (r) => {
            try {
              const m = await moviesApi.details(Number(r.movie_id));
              return { ...summarize(m), similarity: Number(r.similarity) };
            } catch {
              return null;
            }
          })
        );
        return {
          results: detailed.flatMap((d) => (d ? [d] : [])),
          blendedWithUserTaste: Boolean(userId),
        };
      },
    }),

    getWatchProviders: tool({
      description:
        "Return streaming/rent/buy availability for a movie in a given region. Default region is US if not specified.",
      inputSchema: z.object({
        movieId: z.number().int().positive(),
        region: z.string().length(2).default("US"),
      }),
      execute: async ({ movieId, region }) => {
        const data = await moviesApi.watchProviders(movieId);
        const regional = data.results[region.toUpperCase()] ?? null;
        return {
          region: region.toUpperCase(),
          flatrate: regional?.flatrate?.map((p) => p.provider_name) ?? [],
          rent: regional?.rent?.map((p) => p.provider_name) ?? [],
          buy: regional?.buy?.map((p) => p.provider_name) ?? [],
          link: regional?.link ?? null,
        };
      },
    }),
  } as const;
}

const INSTRUCTIONS = `You are OlaMax's Film Concierge — a restrained, editorial film-discovery assistant.

Rules:
- Always ground recommendations in real films by calling tools. Never invent titles, years, or plot details.
- For vibe/mood queries ("something for a rainy Sunday", "slow-burn neo-noir with a female lead"), prefer recommendForTaste.
- For "like movie X" queries, prefer getSimilar.
- For title lookups, use searchMovies then getMovieDetails.
- For "where can I watch X", use getWatchProviders.
- Keep prose tight: 1–2 sentences of editorial framing, then let the tool results speak.
- Voice: calm, curated, editorial. No hype, no emoji, no exclamation marks.
- Never reveal tool names or internals to the user.`;

export function createConciergeAgent(userId: string | null) {
  return new ToolLoopAgent({
    model: AI_MODELS.chat,
    instructions: INSTRUCTIONS,
    tools: createTools(userId),
  });
}

export const referenceConciergeAgent = createConciergeAgent(null);
export type FilmConciergeUIMessage = InferAgentUIMessage<typeof referenceConciergeAgent>;
export type { } from "zod";
// movieSummarySchema is exported for consumer type-narrowing if needed.
export { movieSummarySchema };
