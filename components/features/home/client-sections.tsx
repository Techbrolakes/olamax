"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, PlayIcon } from "@phosphor-icons/react/ssr";
import { MovieRail } from "@/components/shared/movie-rail";
import { TvRail } from "@/components/shared/tv-rail";
import { TmdbImage } from "@/components/shared/tmdb-image";
import { RailSkeleton } from "@/components/shared/rail-skeleton";
import { ROUTES } from "@/lib/constants";
import { formatRating, formatYear } from "@/lib/utils";
import {
  byGenreQuery,
  nowPlayingMoviesQuery,
  popularMoviesQuery,
  topRatedMoviesQuery,
  trendingMoviesQuery,
  trendingTvQuery,
  upcomingMoviesQuery,
} from "@/lib/tmdb/queries";

// Horizontal rails — most users don't scroll past the first few cards.
const LIMIT = 10;

// ──────────────────────────────────────────────────────────────────────
// Hero — reuses the trending query the first rail also uses, so TanStack
// Query serves it from cache on the rail (same key, one network call).
// ──────────────────────────────────────────────────────────────────────

export function Hero() {
  const { data, isPending } = useQuery(trendingMoviesQuery());
  if (isPending) return <HeroSkeleton />;
  const hero = data?.results[0];
  if (!hero) return null;

  return (
    <section className="relative isolate h-[78vh] min-h-[520px] overflow-hidden">
      <TmdbImage
        kind="backdrop"
        path={hero.backdrop_path}
        alt=""
        size="original"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative flex h-full flex-col justify-end gap-4 px-4 pb-16 md:max-w-2xl md:px-10">
        <p className="meta-label">Featured · Trending this week</p>
        <h1 className="font-serif text-5xl leading-[0.95] tracking-[-0.02em] md:text-7xl">
          <span className="italic">{hero.title}</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="meta-label">{formatYear(hero.release_date)}</span>
          <span className="meta-label">
            ★ {formatRating(hero.vote_average)}
          </span>
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {hero.overview}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={ROUTES.movies.detail(hero.id)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
          >
            <PlayIcon className="h-4 w-4" weight="fill" />
            Details
          </Link>
          <Link
            href={ROUTES.movies.trending}
            className="meta-label inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/60 px-5 py-2.5 hover:border-border hover:text-foreground"
          >
            More like this <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section
      aria-hidden
      className="relative isolate h-[78vh] min-h-[520px] animate-pulse bg-muted/40"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="relative flex h-full flex-col justify-end gap-4 px-4 pb-16 md:max-w-2xl md:px-10">
        <div className="h-3 w-48 rounded bg-muted/60" />
        <div className="h-16 w-3/4 rounded bg-muted/60" />
        <div className="h-4 w-40 rounded bg-muted/50" />
        <div className="h-20 w-full max-w-xl rounded bg-muted/40" />
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Rails
// ──────────────────────────────────────────────────────────────────────

export function TrendingMoviesRail() {
  const { data, isPending } = useQuery(trendingMoviesQuery());
  if (isPending) return <RailSkeleton title="Trending this week" />;
  const movies = data?.results.slice(0, LIMIT) ?? [];
  if (!movies.length) return null;
  return (
    <MovieRail
      title="Trending this week"
      seeAllHref={ROUTES.movies.trending}
      movies={movies}
      priority
    />
  );
}

export function TrendingTvShowsRail() {
  const { data, isPending } = useQuery(trendingTvQuery());
  if (isPending) return <RailSkeleton title="Trending TV shows" />;
  const shows = data?.results.slice(0, LIMIT) ?? [];
  if (!shows.length) return null;
  return (
    <TvRail
      title="Trending TV shows"
      seeAllHref={ROUTES.tv.trending}
      shows={shows}
    />
  );
}

export function NowPlayingRail() {
  const { data, isPending } = useQuery(nowPlayingMoviesQuery());
  if (isPending) return <RailSkeleton title="Now playing" />;
  const movies = data?.results.slice(0, LIMIT) ?? [];
  if (!movies.length) return null;
  return <MovieRail title="Now playing" movies={movies} />;
}

export function PopularRail() {
  const { data, isPending } = useQuery(popularMoviesQuery());
  if (isPending) return <RailSkeleton title="Popular" />;
  const movies = data?.results.slice(0, LIMIT) ?? [];
  if (!movies.length) return null;
  return (
    <MovieRail
      title="Popular"
      seeAllHref={ROUTES.movies.popular}
      movies={movies}
    />
  );
}

export function TopRatedRail() {
  const { data, isPending } = useQuery(topRatedMoviesQuery());
  if (isPending) return <RailSkeleton title="Top rated" />;
  const movies = data?.results.slice(0, LIMIT) ?? [];
  if (!movies.length) return null;
  return (
    <MovieRail
      title="Top rated"
      seeAllHref={ROUTES.movies.topRated}
      movies={movies}
    />
  );
}

export function UpcomingRail() {
  const { data, isPending } = useQuery(upcomingMoviesQuery());
  if (isPending) return <RailSkeleton title="Upcoming" />;
  const movies = data?.results.slice(0, LIMIT) ?? [];
  if (!movies.length) return null;
  return (
    <MovieRail
      title="Upcoming"
      seeAllHref={ROUTES.movies.upcoming}
      movies={movies}
    />
  );
}

// ──────────────────────────────────────────────────────────────────────
// Curated genre rails — ship a small set; rest lives at /genre
// ──────────────────────────────────────────────────────────────────────

const CURATED_GENRES: Array<{ id: number; name: string }> = [
  { id: 28, name: "Action" },
  { id: 18, name: "Drama" },
  { id: 35, name: "Comedy" },
  { id: 53, name: "Thriller" },
  { id: 878, name: "Science fiction" },
];

export function GenreRails() {
  return (
    <>
      {CURATED_GENRES.map((g) => (
        <GenreRail key={g.id} id={g.id} name={g.name} />
      ))}
    </>
  );
}

function GenreRail({ id, name }: { id: number; name: string }) {
  const { data, isPending } = useQuery(byGenreQuery(id));
  if (isPending) return <RailSkeleton title={name} />;
  const movies = data?.results.slice(0, LIMIT) ?? [];
  if (!movies.length) return null;
  return (
    <MovieRail title={name} seeAllHref={ROUTES.genre(id)} movies={movies} />
  );
}
