import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { listWatchlist } from "@/lib/db/queries/watchlist";
import { movies as moviesApi } from "@/lib/tmdb";
import { PageHeader } from "@/components/shared/page-header";
import { MovieGrid } from "@/components/shared/movie-grid";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "Watchlist" };

export default async function WatchlistPage() {
  const user = await getCurrentUser();
  if (!user) redirect(ROUTES.auth.signIn);

  const items = await listWatchlist(user.id);
  const movies = (
    await Promise.all(items.map((i) => moviesApi.details(i.movieId).catch(() => null)))
  ).filter(Boolean) as Awaited<ReturnType<typeof moviesApi.details>>[];

  return (
    <div className="px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Saved"
        title="Watchlist"
        description={
          movies.length
            ? `${movies.length} title${movies.length === 1 ? "" : "s"} waiting for you.`
            : "Films you save land here."
        }
      />
      <MovieGrid movies={movies} />
    </div>
  );
}
