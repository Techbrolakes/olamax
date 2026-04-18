import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { getCurrentUser } from "@/lib/auth/server";
import { listReviewsForUser } from "@/lib/db/queries/reviews";
import { movies as moviesApi } from "@/lib/tmdb";
import { PageHeader } from "@/components/shared/page-header";
import { RatingStars } from "@/components/shared/rating-stars";
import { ROUTES } from "@/lib/constants";
import { formatYear } from "@/lib/utils";

export const metadata: Metadata = { title: "Your reviews" };

export default async function ReviewsPage() {
  const user = await getCurrentUser();
  if (!user) redirect(ROUTES.auth.signIn);

  const reviews = await listReviewsForUser(user.id);
  const hydrated = await Promise.all(
    reviews.map(async (r) => ({
      review: r,
      movie: await moviesApi.details(r.movieId).catch(() => null),
    }))
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Your notebook"
        title="Reviews"
        description="Everything you've logged, most recent first."
      />

      {!hydrated.length ? (
        <p className="text-muted-foreground">
          You haven&rsquo;t written anything yet. Open a film page and leave a note.
        </p>
      ) : (
        <ul className="divide-y divide-border/60">
          {hydrated.map(({ review, movie }) => (
            <li key={review.id} className="grid gap-6 py-8 md:grid-cols-[1fr_3fr]">
              <div>
                {movie ? (
                  <Link
                    href={ROUTES.movies.detail(movie.id)}
                    className="cursor-pointer font-serif text-2xl leading-tight hover:underline"
                  >
                    <span className="italic">{movie.title}</span>
                  </Link>
                ) : (
                  <span className="font-serif text-2xl italic">Unknown title</span>
                )}
                {movie ? <p className="meta-label mt-2">{formatYear(movie.release_date)}</p> : null}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <RatingStars value={review.rating} readOnly size="sm" />
                  <p className="meta-label">{format(new Date(review.createdAt), "d MMM yyyy")}</p>
                </div>
                {review.comment ? (
                  <p className="font-serif text-lg leading-relaxed">{review.comment}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
