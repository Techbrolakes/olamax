"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth/client";
import { useMovieReviews } from "./use-reviews";
import { ReviewForm } from "./review-form";
import { ReviewList } from "./review-list";
import { ROUTES } from "@/lib/constants";

export function ReviewPanel({ movieId }: { movieId: number }) {
  const { data: session } = useSession();
  const { data, isLoading } = useMovieReviews(movieId);

  return (
    <div className="space-y-8">
      <h2 className="font-serif text-3xl tracking-[-0.02em] md:text-4xl">Reviews</h2>

      {session?.user ? (
        <ReviewForm movieId={movieId} initial={data?.mine ?? null} />
      ) : (
        <div className="rounded-md border border-border/60 bg-card p-6">
          <p className="text-muted-foreground">
            <Link href={ROUTES.auth.signIn} className="cursor-pointer underline-offset-4 hover:underline">
              Sign in
            </Link>{" "}
            to share your take.
          </p>
        </div>
      )}

      <div>
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <ReviewList items={data?.items ?? []} />
        )}
      </div>
    </div>
  );
}
