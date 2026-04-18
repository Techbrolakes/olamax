import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PlayIcon } from "@phosphor-icons/react/ssr";
import { movies as moviesApi } from "@/lib/tmdb";
import { MovieGrid } from "@/components/shared/movie-grid";
import { PageHeader } from "@/components/shared/page-header";
import { TmdbImage } from "@/components/shared/tmdb-image";
import { ForYouRail } from "@/components/features/recommendations/for-you-rail";
import { listFreeToWatch } from "@/lib/public-domain";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "Movies" };
export const revalidate = 3600;

const CATEGORIES = [
  { label: "Trending", href: ROUTES.movies.trending },
  { label: "Popular", href: ROUTES.movies.popular },
  { label: "Top rated", href: ROUTES.movies.topRated },
  { label: "Upcoming", href: ROUTES.movies.upcoming },
  { label: "Free to watch", href: ROUTES.watch.index },
];

export default async function MoviesPage() {
  const freeFilms = listFreeToWatch().slice(0, 6);
  const [trending, popular, upcoming, freeHydrated] = await Promise.all([
    moviesApi.trending("week"),
    moviesApi.popular(),
    moviesApi.upcoming(),
    Promise.all(
      freeFilms.map(async (f) => ({
        film: f,
        posterPath: (await moviesApi.details(f.tmdbId).catch(() => null))?.poster_path ?? null,
      }))
    ),
  ]);

  return (
    <div className="px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Discover"
        title="Movies"
        description="Every week's lineup, plus a deep cut of crowd favourites, all-time greats, and what's next."
      />

      <nav className="flex flex-wrap gap-3 pb-10">
        {CATEGORIES.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="meta-label cursor-pointer rounded-full border border-border/60 px-4 py-2 transition-colors hover:border-border hover:text-foreground"
          >
            {c.label}
          </Link>
        ))}
      </nav>

      <Suspense fallback={null}>
        <ForYouRail />
      </Suspense>

      <SectionWithLink title="Trending this week" href={ROUTES.movies.trending}>
        <MovieGrid movies={trending.results.slice(0, 10)} priorityCount={5} />
      </SectionWithLink>

      <SectionWithLink title="Popular" href={ROUTES.movies.popular}>
        <MovieGrid movies={popular.results.slice(0, 10)} />
      </SectionWithLink>

      <SectionWithLink title="Upcoming" href={ROUTES.movies.upcoming}>
        <MovieGrid movies={upcoming.results.slice(0, 10)} />
      </SectionWithLink>

      <SectionWithLink title="Free to watch" href={ROUTES.watch.index}>
        <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {freeHydrated.map(({ film, posterPath }) => (
            <Link
              key={film.slug}
              href={ROUTES.watch.detail(film.slug)}
              className="group block cursor-pointer"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-[3px] bg-muted ring-1 ring-border/40 transition-all duration-300 group-hover:ring-primary">
                <TmdbImage
                  kind="poster"
                  path={posterPath}
                  alt={film.title}
                  fallbackLabel={film.title}
                  size="large"
                  fill
                  sizes="(min-width: 1024px) 16vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-sm bg-primary/90 px-1.5 py-0.5 font-mono text-[10px] text-primary-foreground">
                  <PlayIcon className="h-2.5 w-2.5" weight="fill" /> FREE
                </span>
              </div>
              <div className="mt-3 space-y-1">
                <p className="line-clamp-1 font-serif text-lg italic leading-tight">{film.title}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {film.year}
                  {film.director ? ` · ${film.director}` : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </SectionWithLink>
    </div>
  );
}

function SectionWithLink({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6 pb-16">
      <div className="flex items-end justify-between">
        <h2 className="font-serif text-3xl tracking-[-0.02em] md:text-4xl">{title}</h2>
        <Link href={href} className="meta-label cursor-pointer hover:text-foreground">
          See all →
        </Link>
      </div>
      {children}
    </section>
  );
}
