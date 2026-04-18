import { MovieGridSkeleton, Shimmer } from "@/components/shared/poster-skeleton";

export default function Loading() {
  return (
    <div className="px-4 py-10 md:px-8">
      <div className="mb-10 space-y-3">
        <Shimmer className="h-3 w-16 rounded-sm" />
        <Shimmer className="h-14 w-56 rounded-sm md:h-16" />
      </div>
      <MovieGridSkeleton count={14} />
    </div>
  );
}
