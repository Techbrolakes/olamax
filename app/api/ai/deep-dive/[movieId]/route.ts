import { NextResponse } from "next/server";
import { streamText } from "ai";
import { movies as moviesApi } from "@/lib/tmdb/endpoints";
import { AI_MODELS, assertAiGatewayConfigured } from "@/lib/ai/gateway";
import {
  getMovieDeepDive,
  upsertMovieDeepDive,
} from "@/lib/db/queries/movie-deep-dives";

export const runtime = "nodejs";
export const maxDuration = 60;

function streamCached(content: string) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(content));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Deep-Dive-Source": "cache",
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ movieId: string }> }
) {
  const { movieId: raw } = await params;
  const movieId = Number(raw);
  if (!Number.isInteger(movieId) || movieId <= 0) {
    return new NextResponse("Bad movie id", { status: 400 });
  }

  const cached = await getMovieDeepDive(movieId);
  if (cached) return streamCached(cached.content);

  try {
    assertAiGatewayConfigured();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  let movie;
  try {
    movie = await moviesApi.details(movieId);
  } catch (error) {
    console.error("[deep-dive] tmdb details failed", error);
    return new NextResponse("Not found", { status: 404 });
  }

  const promptParts = [
    `Write an editorial "deep dive" piece about the film "${movie.title}" (${movie.release_date?.slice(0, 4) ?? "unknown year"}).`,
    ``,
    `Reference facts for grounding:`,
    `- Genres: ${movie.genres.map((g) => g.name).join(", ") || "unknown"}`,
    `- Runtime: ${movie.runtime ? `${movie.runtime} min` : "unknown"}`,
    `- Tagline: ${movie.tagline || "—"}`,
    `- Overview: ${movie.overview}`,
    `- Production: ${movie.production_companies.map((c) => c.name).slice(0, 3).join(", ")}`,
    ``,
    `Structure the piece with these exact markdown headings:`,
    `## The pitch`,
    `A single confident paragraph (3–4 sentences) framing what this film is *really* about, beyond the logline. Sell the vibe, not the plot.`,
    ``,
    `## Context`,
    `Where it sits in the filmography of its director / the genre / the cultural moment of its release. One paragraph.`,
    ``,
    `## Worth noticing`,
    `Three bullet points — craft details, themes, or under-appreciated beats that reward a careful viewer. Each bullet one sentence, evocative.`,
    ``,
    `## Pair it with`,
    `Two specific real film titles (with year) that share the same DNA, one sentence each on why.`,
    ``,
    `Rules:`,
    `- Do NOT invent facts. If you don't know something, elide it rather than guess.`,
    `- Restrained editorial tone. No hype, no emoji, no exclamation marks.`,
    `- Use real film titles only (verifiable works).`,
    `- Keep total under ~350 words.`,
  ].join("\n");

  let accumulated = "";

  const result = streamText({
    model: AI_MODELS.chat,
    prompt: promptParts,
    onError({ error }) {
      console.error("[deep-dive] stream error", error);
    },
    onFinish({ text }) {
      accumulated = text;
      if (accumulated.trim().length > 0) {
        upsertMovieDeepDive({ movieId, content: accumulated }).catch((err) =>
          console.error("[deep-dive] cache write failed", err)
        );
      }
    },
  });

  return result.toTextStreamResponse({
    headers: { "X-Deep-Dive-Source": "generated" },
  });
}
