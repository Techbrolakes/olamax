import { MovieGridSkeleton, Shimmer } from "@/components/shared/poster-skeleton";

export default function Loading() {
  return (
    <div className="px-4 py-10 md:px-8">
      <div className="mb-10 space-y-3">
        <Shimmer className="h-3 w-28 rounded-sm" />
        <Shimmer className="h-14 w-72 rounded-sm md:h-16" />
      </div>
      <MovieGridSkeleton count={12} />
    </div>
  );
}
