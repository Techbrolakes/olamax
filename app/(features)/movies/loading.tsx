import { MovieRailSkeleton } from "@/components/shared/poster-skeleton";
import { Shimmer } from "@/components/shared/poster-skeleton";

export default function Loading() {
  return (
    <div className="space-y-12 py-10">
      <div className="space-y-4 px-4 md:px-8">
        <Shimmer className="h-3 w-24 rounded-sm" />
        <Shimmer className="h-14 w-72 rounded-sm md:h-16" />
        <Shimmer className="h-4 w-[52ch] max-w-full rounded-sm" />
      </div>
      <MovieRailSkeleton title="Trending this week" />
      <MovieRailSkeleton title="Popular" />
      <MovieRailSkeleton title="Upcoming" />
    </div>
  );
}
