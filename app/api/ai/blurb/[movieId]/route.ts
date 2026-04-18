import { NextResponse } from "next/server";
import { streamText } from "ai";
import { getCurrentUser } from "@/lib/auth/server";
import { listReviewsForUser } from "@/lib/db/queries/reviews";
import { movies as moviesApi } from "@/lib/tmdb/endpoints";
import { AI_MODELS, assertAiGatewayConfigured } from "@/lib/ai/gateway";

export const runtime = "nodejs";
export const maxDuration = 30;

const MIN_SIGNALS = 3;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ movieId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { movieId: movieIdParam } = await params;
  const movieId = Number(movieIdParam);
  if (!Number.isInteger(movieId) || movieId <= 0) {
    return new NextResponse("Bad movie id", { status: 400 });
  }

  const [reviews, movie] = await Promise.all([
    listReviewsForUser(user.id),
    moviesApi.details(movieId),
  ]);

  const positives = reviews.filter((r) => r.rating >= 4).sort((a, b) => b.rating - a.rating);
  if (positives.length < MIN_SIGNALS) {
    return new NextResponse(null, { status: 204 });
  }

  const highlights = await Promise.all(
    positives.slice(0, 3).map(async (r) => {
      try {
        const m = await moviesApi.details(r.movieId);
        return { title: m.title, year: m.release_date?.slice(0, 4), rating: r.rating };
      } catch {
        return null;
      }
    })
  );
  const validHighlights = highlights.flatMap((h) => (h ? [h] : []));

  try {
    assertAiGatewayConfigured();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const userPrompt = [
    `You are writing a personalized, one-paragraph (max 3 sentences) editorial pitch for why this viewer will likely enjoy "${movie.title}" (${movie.release_date?.slice(0, 4) ?? "unknown year"}).`,
    ``,
    `This viewer's most-loved recent films:`,
    ...validHighlights.map(
      (h) => `  - "${h.title}"${h.year ? ` (${h.year})` : ""} — rated ${h.rating}/5`
    ),
    ``,
    `Target film info:`,
    `  - Genres: ${movie.genres.map((g) => g.name).join(", ") || "unknown"}`,
    `  - Overview: ${movie.overview}`,
    ``,
    `Rules:`,
    `- Reference at least one of the viewer's loved films by name.`,
    `- Do NOT recap the plot; sell the vibe.`,
    `- Restrained, editorial tone — no hype words, no emoji, no exclamation marks.`,
    `- Max 3 sentences. Prose only, no headings or lists.`,
  ].join("\n");

  const result = streamText({
    model: AI_MODELS.chat,
    prompt: userPrompt,
    onError({ error }) {
      console.error("[blurb] stream error", error);
    },
  });

  return result.toTextStreamResponse();
}
