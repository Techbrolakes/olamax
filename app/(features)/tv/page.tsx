import type { Metadata } from "next";
import Link from "next/link";
import { tv as tvApi } from "@/lib/tmdb";
import { TvRail } from "@/components/shared/tv-rail";
import { PageHeader } from "@/components/shared/page-header";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "TV Shows" };
export const revalidate = 3600;

const CATEGORIES = [
  { label: "Trending", href: ROUTES.tv.trending },
  { label: "Popular", href: ROUTES.tv.popular },
  { label: "Top rated", href: ROUTES.tv.topRated },
  { label: "Airing today", href: ROUTES.tv.airingToday },
];

export default async function TvIndexPage() {
  const [trending, popular, topRated, airing, onAir] = await Promise.all([
    tvApi.trending("week"),
    tvApi.popular(),
    tvApi.topRated(),
    tvApi.airingToday(),
    tvApi.onTheAir(),
  ]);

  return (
    <div className="pb-16">
      <div className="px-4 pt-10 md:px-8">
        <PageHeader
          eyebrow="Discover"
          title="TV Shows"
          description="The serialized side of storytelling — limited dramas, returning classics, and everything currently airing."
        />
        <nav className="flex flex-wrap gap-3 pb-4">
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
      </div>

      <div className="mt-6 space-y-12">
        <TvRail title="Trending this week" seeAllHref={ROUTES.tv.trending} shows={trending.results} priority />
        <TvRail title="Popular" seeAllHref={ROUTES.tv.popular} shows={popular.results} />
        <TvRail title="Top rated" seeAllHref={ROUTES.tv.topRated} shows={topRated.results} />
        <TvRail title="Airing today" seeAllHref={ROUTES.tv.airingToday} shows={airing.results} />
        <TvRail title="Currently on air" shows={onAir.results} />
      </div>
    </div>
  );
}
