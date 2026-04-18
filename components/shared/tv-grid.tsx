import type { TvShow } from "@/lib/tmdb/types";
import { TvCard } from "./tv-card";

export function TvGrid({ shows, priorityCount = 0 }: { shows: TvShow[]; priorityCount?: number }) {
  if (!shows.length) {
    return <p className="text-sm text-muted-foreground">No shows found.</p>;
  }
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
      {shows.map((show, i) => (
        <TvCard key={show.id} show={show} priority={i < priorityCount} />
      ))}
    </div>
  );
}
