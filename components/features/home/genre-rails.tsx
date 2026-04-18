import { Suspense } from "react";
import { movies as moviesApi } from "@/lib/tmdb";
import type { Movie, Paginated } from "@/lib/tmdb/types";
import { MovieRail } from "@/components/shared/movie-rail";
import { RailSkeleton } from "@/components/shared/rail-skeleton";
import { ROUTES } from "@/lib/constants";
import { safe } from "./safe";

// Curated set — keeps the home page lean instead of rendering a rail for
// every TMDB genre (~19). Rest of the catalog lives under /genre.
const CURATED_GENRES: Array<{ id: number; name: string }> = [
  { id: 28, name: "Action" },
  { id: 18, name: "Drama" },
  { id: 35, name: "Comedy" },
  { id: 53, name: "Thriller" },
  { id: 878, name: "Science fiction" },
];

const emptyPaginated: Paginated<Movie> = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

async function GenreRail({ id, name }: { id: number; name: string }) {
  const data = await safe(moviesApi.byGenre(id), emptyPaginated);
  if (!data.results.length) return null;
  return (
    <MovieRail
      title={name}
      seeAllHref={ROUTES.genre(id)}
      movies={data.results}
    />
  );
}

export function GenreRails() {
  return (
    <>
      {CURATED_GENRES.map((g) => (
        <Suspense
          key={g.id}
          fallback={<RailSkeleton title={g.name} />}
        >
          <GenreRail id={g.id} name={g.name} />
        </Suspense>
      ))}
    </>
  );
}
