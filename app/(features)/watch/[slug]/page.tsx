import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getFreeToWatchBySlug } from "@/lib/public-domain";
import { movies as moviesApi } from "@/lib/tmdb";
import { backdropUrl } from "@/lib/tmdb/images";
import { VideoPlayer } from "@/components/shared/video-player";
import { CastRail } from "@/components/shared/cast-rail";
import { ROUTES } from "@/lib/constants";
import { formatRuntime } from "@/lib/utils";

export const revalidate = 3600;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const film = getFreeToWatchBySlug(slug);
  if (!film) return { title: "Not found" };
  return {
    title: `${film.title} — Watch free`,
    description: film.synopsis,
  };
}

export default async function WatchPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const film = getFreeToWatchBySlug(slug);
  if (!film) notFound();

  const details = await moviesApi.details(film.tmdbId).catch(() => null);
  const credits = await moviesApi.credits(film.tmdbId).catch(() => null);

  return (
    <div className="pb-20">
      <div className="mx-auto max-w-6xl px-4 pt-8 md:px-8">
        <p className="meta-label mb-4 text-primary">Free · Public domain · Internet Archive</p>
        <h1 className="mb-6 font-serif text-4xl leading-[0.95] tracking-[-0.02em] md:text-6xl">
          <span className="italic">{film.title}</span>
        </h1>

        <VideoPlayer
          src={film.stream.url}
          type={film.stream.type}
          poster={
            details?.backdrop_path
              ? (backdropUrl(details.backdrop_path, "large") ?? undefined)
              : undefined
          }
          title={film.title}
        />

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="meta-label">{film.year}</span>
          {film.runtime ? <span className="meta-label">{formatRuntime(film.runtime)}</span> : null}
          {film.director ? <span className="meta-label">Dir · {film.director}</span> : null}
          {details?.genres.length ? (
            <div className="flex flex-wrap gap-2">
              {details.genres.map((g) => (
                <Link
                  key={g.id}
                  href={ROUTES.genre(g.id)}
                  className="meta-label cursor-pointer rounded-full border border-border/60 px-3 py-1 transition-colors hover:border-foreground hover:text-foreground"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid gap-8 border-t border-border/60 pt-8 md:grid-cols-[1fr_260px]">
          <div className="space-y-3">
            <p className="meta-label">Synopsis</p>
            <p className="max-w-2xl font-serif text-xl leading-snug">
              {details?.overview ?? film.synopsis ?? "A public-domain film."}
            </p>
          </div>
          <aside className="space-y-3 border-l-0 md:border-l md:border-border/60 md:pl-8">
            <p className="meta-label">Source</p>
            <a
              href={`https://archive.org/details/${film.sourceId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-foreground hover:underline"
            >
              Internet Archive <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <Link
              href={ROUTES.movies.detail(film.tmdbId)}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-foreground hover:underline"
            >
              View on OlaMax <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </aside>
        </div>
      </div>

      {credits?.cast.length ? (
        <section className="mt-14">
          <CastRail cast={credits.cast.slice(0, 16)} />
        </section>
      ) : null}
    </div>
  );
}
