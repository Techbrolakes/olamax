import { NextResponse } from "next/server";
import { movies } from "@/lib/tmdb/endpoints";
import { embedTexts, buildMovieEmbeddingSource, hashEmbeddingSource } from "@/lib/ai/embeddings";
import { getMovieEmbeddingsByIds, upsertMovieEmbedding } from "@/lib/db/queries/movie-embeddings";
import type { Movie } from "@/lib/tmdb/types";

export const runtime = "nodejs";
export const maxDuration = 300;

function unauthorized() {
  return new NextResponse("Unauthorized", { status: 401 });
}

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;
  if (!expected || auth !== `Bearer ${expected}`) {
    return unauthorized();
  }

  try {
    return await embedTrendingMovies();
  } catch (error) {
    console.error("[cron/embed-trending] failed", error);
    return NextResponse.json({ error: "embed-trending failed" }, { status: 500 });
  }
}

async function embedTrendingMovies() {
  const [trending, popular, genreList] = await Promise.all([
    movies.trending("week", 1),
    movies.popular(1),
    movies.genres(),
  ]);

  const genreMap = new Map<number, string>(genreList.genres.map((g) => [g.id, g.name]));

  const deduped = new Map<number, Movie>();
  for (const m of [...trending.results, ...popular.results]) {
    if (!m.overview) continue;
    deduped.set(m.id, m);
  }

  const candidates = [...deduped.values()].map((m) => ({
    movieId: m.id,
    genreNames: m.genre_ids.map((id) => genreMap.get(id)).filter(Boolean) as string[],
    releaseYear: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    source: buildMovieEmbeddingSource({
      id: m.id,
      title: m.title,
      overview: m.overview,
      genreNames: m.genre_ids.map((id) => genreMap.get(id)).filter(Boolean) as string[],
      releaseYear: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    }),
  }));

  const existing = await getMovieEmbeddingsByIds(candidates.map((c) => c.movieId));
  const existingByMovie = new Map(existing.map((e) => [e.movieId, e.sourceHash]));

  const toEmbed = candidates.filter((c) => {
    const hash = hashEmbeddingSource(c.source);
    return existingByMovie.get(c.movieId) !== hash;
  });

  if (toEmbed.length === 0) {
    return NextResponse.json({
      scanned: candidates.length,
      embedded: 0,
      skipped: candidates.length,
    });
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

  return NextResponse.json({
    scanned: candidates.length,
    embedded: toEmbed.length,
    skipped: candidates.length - toEmbed.length,
  });
}

