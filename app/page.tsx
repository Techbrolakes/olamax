import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { movies as moviesApi, tv as tvApi } from "@/lib/tmdb";
import type { Genre, Movie, Paginated, TvShow } from "@/lib/tmdb/types";
import { MovieRail } from "@/components/shared/movie-rail";
import { TvRail } from "@/components/shared/tv-rail";
import { TmdbImage } from "@/components/shared/tmdb-image";
import { PickForMe } from "@/components/features/recommendations/pick-for-me";
import { ROUTES } from "@/lib/constants";
import { formatRating, formatYear } from "@/lib/utils";

export const revalidate = 3600;

async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const emptyPaginated: Paginated<Movie> = { page: 1, results: [], total_pages: 0, total_results: 0 };
  const emptyTvPaginated: Paginated<TvShow> = { page: 1, results: [], total_pages: 0, total_results: 0 };

  const [trending, popular, topRated, upcoming, nowPlaying, trendingTv, genresRes] = await Promise.all([
    safe(moviesApi.trending("week"), emptyPaginated),
    safe(moviesApi.popular(), emptyPaginated),
    safe(moviesApi.topRated(), emptyPaginated),
    safe(moviesApi.upcoming(), emptyPaginated),
    safe(moviesApi.nowPlaying(), emptyPaginated),
    safe(tvApi.trending("week"), emptyTvPaginated),
    safe(moviesApi.genres(), { genres: [] as Genre[] }),
  ]);

  const genres = genresRes.genres;

  const genreData = await Promise.all(
    genres.map(async (g) => ({ genre: g, data: await safe(moviesApi.byGenre(g.id), emptyPaginated) }))
  );

  const hero = trending.results[0];

  return (
    <div className="pb-16">
      {hero ? (
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
              <span className="meta-label">★ {formatRating(hero.vote_average)}</span>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {hero.overview}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={ROUTES.movies.detail(hero.id)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
              >
                <Play className="h-4 w-4 fill-background" />
                Details
              </Link>
              <Link
                href={ROUTES.movies.trending}
                className="meta-label inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/60 px-5 py-2.5 hover:border-border hover:text-foreground"
              >
                More like this <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <PickForMe />

      <div className="mt-4 space-y-12">
        <MovieRail
          title="Trending this week"
          seeAllHref={ROUTES.movies.trending}
          movies={trending.results}
          priority
        />
        <TvRail
          title="Trending TV shows"
          seeAllHref={ROUTES.tv.trending}
          shows={trendingTv.results}
        />
        <MovieRail title="Now playing" movies={nowPlaying.results} />
        <MovieRail
          title="Popular"
          seeAllHref={ROUTES.movies.popular}
          movies={popular.results}
        />
        <MovieRail
          title="Top rated"
          seeAllHref={ROUTES.movies.topRated}
          movies={topRated.results}
        />
        <MovieRail
          title="Upcoming"
          seeAllHref={ROUTES.movies.upcoming}
          movies={upcoming.results}
        />

        {genreData.map(({ genre, data }) =>
          data.results.length ? (
            <MovieRail
              key={genre.id}
              title={genre.name}
              seeAllHref={ROUTES.genre(genre.id)}
              movies={data.results}
            />
          ) : null
        )}
      </div>
    </div>
  );
}
