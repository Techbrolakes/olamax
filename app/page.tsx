import { Suspense } from "react";
import { PickForMe } from "@/components/features/recommendations/pick-for-me";
import { RailSkeleton } from "@/components/shared/rail-skeleton";
import { Hero } from "@/components/features/home/hero";
import {
  NowPlayingRail,
  PopularMoviesRail,
  TopRatedRail,
  TrendingMoviesRail,
  TrendingTvRail,
  UpcomingRail,
} from "@/components/features/home/rails";
import { GenreRails } from "@/components/features/home/genre-rails";

export const revalidate = 3600;

export default function HomePage() {
  return (
    <div className="pb-16">
      <Suspense fallback={<div className="h-[78vh] min-h-[520px]" />}>
        <Hero />
      </Suspense>

      <PickForMe />

      <div className="mt-4 space-y-12">
        <Suspense fallback={<RailSkeleton title="Trending this week" />}>
          <TrendingMoviesRail />
        </Suspense>
        <Suspense fallback={<RailSkeleton title="Trending TV shows" />}>
          <TrendingTvRail />
        </Suspense>
        <Suspense fallback={<RailSkeleton title="Now playing" />}>
          <NowPlayingRail />
        </Suspense>
        <Suspense fallback={<RailSkeleton title="Popular" />}>
          <PopularMoviesRail />
        </Suspense>
        <Suspense fallback={<RailSkeleton title="Top rated" />}>
          <TopRatedRail />
        </Suspense>
        <Suspense fallback={<RailSkeleton title="Upcoming" />}>
          <UpcomingRail />
        </Suspense>

        <GenreRails />
      </div>
    </div>
  );
}
