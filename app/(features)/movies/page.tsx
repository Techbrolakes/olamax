import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { movies as moviesApi } from "@/lib/tmdb";
import { MovieGrid } from "@/components/shared/movie-grid";
import { PageHeader } from "@/components/shared/page-header";
import { ForYouRail } from "@/components/features/recommendations/for-you-rail";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "Movies" };
export const revalidate = 3600;

const CATEGORIES = [
  { label: "Trending", href: ROUTES.movies.trending },
  { label: "Popular", href: ROUTES.movies.popular },
  { label: "Top rated", href: ROUTES.movies.topRated },
  { label: "Upcoming", href: ROUTES.movies.upcoming },
];

export default async function MoviesPage() {
  const [trending, popular, upcoming] = await Promise.all([
    moviesApi.trending("week"),
    moviesApi.popular(),
    moviesApi.upcoming(),
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
