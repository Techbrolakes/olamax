import { PickForMe } from "@/components/features/recommendations/pick-for-me";
import {
  GenreRails,
  Hero,
  NowPlayingRail,
  PopularRail,
  TopRatedRail,
  TrendingMoviesRail,
  TrendingTvShowsRail,
  UpcomingRail,
} from "@/components/features/home/client-sections";

// Home page is a static shell. TMDB data is fetched client-side via
// TanStack Query against /api/tmdb, which is edge-cached for 1h and serves
// stale-while-revalidate for 24h. Origin TMDB is only hit on cache miss.

export default function HomePage() {
  return (
    <div className="pb-16">
      <Hero />
      <PickForMe />
      <div className="mt-4 space-y-12">
        <TrendingMoviesRail />
        <TrendingTvShowsRail />
        <NowPlayingRail />
        <PopularRail />
        <TopRatedRail />
        <UpcomingRail />
        <GenreRails />
      </div>
    </div>
  );
}
