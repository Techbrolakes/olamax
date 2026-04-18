import type { Movie } from "@/lib/tmdb/types";
import { MovieCard } from "./movie-card";

export function MovieGrid({ movies, priorityCount = 0 }: { movies: Movie[]; priorityCount?: number }) {
  if (!movies.length) {
    return <p className="text-sm text-muted-foreground">No titles found.</p>;
  }
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
      {movies.map((movie, i) => (
        <MovieCard key={movie.id} movie={movie} priority={i < priorityCount} />
      ))}
    </div>
  );
}
