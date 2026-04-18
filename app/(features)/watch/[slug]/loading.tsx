import { Shimmer } from "@/components/shared/poster-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 md:px-8">
      <Shimmer className="mb-4 h-3 w-48 rounded-sm" />
      <Shimmer className="mb-6 h-12 w-72 rounded-sm md:h-16" />
      <Shimmer className="aspect-video w-full rounded-md" />
      <div className="mt-6 flex gap-4">
        <Shimmer className="h-3 w-16 rounded-sm" />
        <Shimmer className="h-3 w-24 rounded-sm" />
        <Shimmer className="h-3 w-32 rounded-sm" />
      </div>
    </div>
  );
}
