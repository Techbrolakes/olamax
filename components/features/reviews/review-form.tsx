"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { RatingStars } from "@/components/shared/rating-stars";
import { useUpsertReview, type Review } from "./use-reviews";

type Props = {
  movieId: number;
  initial?: Review | null;
  onDone?: () => void;
};

export function ReviewForm({ movieId, initial, onDone }: Props) {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [comment, setComment] = useState(initial?.comment ?? "");
  const [error, setError] = useState<string | null>(null);
  const upsert = useUpsertReview(movieId);

  useEffect(() => {
    setRating(initial?.rating ?? 0);
    setComment(initial?.comment ?? "");
  }, [initial?.id, initial?.rating, initial?.comment]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError("Pick a rating.");
      return;
    }
    try {
      await upsert.mutateAsync({ rating, comment });
      onDone?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-md border border-border/60 bg-card p-6">
      <div className="space-y-2">
        <p className="meta-label">Your rating</p>
        <RatingStars value={rating} onChange={setRating} size="lg" />
      </div>
      <div className="space-y-2">
        <label htmlFor="review-comment" className="meta-label block">
          Your notes
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="What stayed with you?"
          className="w-full resize-none rounded-sm border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={upsert.isPending}
          className="meta-label inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {upsert.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {initial ? "Update review" : "Publish review"}
        </button>
      </div>
    </form>
  );
}
