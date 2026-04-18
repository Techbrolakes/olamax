"use client";

import { format } from "date-fns";
import { RatingStars } from "@/components/shared/rating-stars";
import type { Review } from "./use-reviews";

export function ReviewList({ items }: { items: Review[] }) {
  if (!items.length) {
    return <p className="text-muted-foreground">No reviews yet — be the first.</p>;
  }
  return (
    <ul className="divide-y divide-border/60">
      {items.map((review) => (
        <li key={review.id} className="space-y-3 py-6">
          <div className="flex items-center justify-between">
            <RatingStars value={review.rating} readOnly size="sm" />
            <p className="meta-label">{format(new Date(review.createdAt), "d MMM yyyy")}</p>
          </div>
          {review.comment ? (
            <p className="font-serif text-lg leading-relaxed text-foreground">{review.comment}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
