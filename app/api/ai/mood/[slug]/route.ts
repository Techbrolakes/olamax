import { NextResponse } from "next/server";
import { movies as moviesApi } from "@/lib/tmdb/endpoints";
import { getMoodBySlug, getMoodEmbedding } from "@/lib/ai/moods";
import { findSimilarByVector } from "@/lib/db/queries/movie-embeddings";
import { assertAiGatewayConfigured } from "@/lib/ai/gateway";
import { countMovieEmbeddings, warmCatalog } from "@/lib/ai/warm-catalog";

export const runtime = "nodejs";
export const maxDuration = 60;
export const revalidate = 3600;

const LIMIT = 24;
const MIN_CATALOG_SIZE = 30;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const mood = getMoodBySlug(slug);
  if (!mood) return NextResponse.json({ error: "unknown_mood" }, { status: 404 });

  try {
    assertAiGatewayConfigured();
  } catch {
    return NextResponse.json({ error: "ai_not_configured" }, { status: 503 });
  }

  try {
    // Self-heal: if the embedding catalog is thin, warm it up first so
    // semantic kNN has something meaningful to match against.
    const catalogSize = await countMovieEmbeddings();
    let warmed: Awaited<ReturnType<typeof warmCatalog>> | null = null;
    if (catalogSize < MIN_CATALOG_SIZE) {
      warmed = await warmCatalog(2);
    }

    const embedding = await getMoodEmbedding(mood);
    const result = await findSimilarByVector(embedding, LIMIT);
    const rows = result.rows as { movie_id: number; similarity: number }[];
    const detailed = await Promise.all(
      rows.map(async (r) => {
        try {
          return await moviesApi.details(Number(r.movie_id));
        } catch {
          return null;
        }
      })
    );
    const picks = detailed.flatMap((m) => (m ? [m] : []));
    return NextResponse.json({
      mood: { slug: mood.slug, name: mood.name },
      picks,
      catalogSize: warmed ? catalogSize + warmed.embedded : catalogSize,
    });
  } catch (error) {
    console.error(`[mood/${slug}] failed`, error);
    return NextResponse.json({ error: "mood_failed" }, { status: 502 });
  }
}
