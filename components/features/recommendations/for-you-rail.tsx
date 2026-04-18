import { getCurrentUser } from "@/lib/auth/server";
import { getTasteVector, MIN_SIGNALS_FOR_PERSONALIZATION } from "@/lib/ai/taste-vector";
import { getPersonalizedMovieIds } from "@/lib/db/queries/recommendations";
import { movies as moviesApi } from "@/lib/tmdb/endpoints";
import { MovieGrid } from "@/components/shared/movie-grid";
import type { MovieDetails } from "@/lib/tmdb/types";

const MAX_RECOMMENDATIONS = 10;

export async function ForYouRail() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { embedding, signalCount } = await getTasteVector(user.id);
  if (!embedding || signalCount < MIN_SIGNALS_FOR_PERSONALIZATION) return null;

  const picks = await getPersonalizedMovieIds(user.id, embedding, MAX_RECOMMENDATIONS);
  if (picks.length === 0) return null;

  const detailed = await Promise.all(
    picks.map(async (p) => {
      try {
        return await moviesApi.details(p.movieId);
      } catch (error) {
        console.warn(`[for-you-rail] failed to fetch movie ${p.movieId}`, error);
        return null;
      }
    })
  );
  const results = detailed.filter((m): m is MovieDetails => Boolean(m));
  if (results.length === 0) return null;

  return (
    <section className="space-y-6 pb-16">
      <div className="flex items-end justify-between">
        <div>
          <p className="meta-label text-primary">For you</p>
          <h2 className="font-serif text-3xl tracking-[-0.02em] md:text-4xl">
            Tuned to your taste
          </h2>
        </div>
        <p className="meta-label hidden text-muted-foreground md:block">
          Based on {signalCount} signals
        </p>
      </div>
      <MovieGrid movies={results} priorityCount={3} />
    </section>
  );
}
