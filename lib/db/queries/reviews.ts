import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../index";
import { reviews, type Review } from "../schema/reviews";
import { markUserTasteStale } from "./user-taste-vectors";

export async function listReviewsForUser(userId: string): Promise<Review[]> {
  return db.select().from(reviews).where(eq(reviews.userId, userId)).orderBy(desc(reviews.createdAt));
}

export async function listReviewsForMovie(movieId: number): Promise<Review[]> {
  return db.select().from(reviews).where(eq(reviews.movieId, movieId)).orderBy(desc(reviews.createdAt));
}

export async function getUserReviewForMovie(userId: string, movieId: number) {
  const [row] = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.userId, userId), eq(reviews.movieId, movieId)))
    .limit(1);
  return row ?? null;
}

export async function upsertReview(input: {
  userId: string;
  movieId: number;
  rating: number;
  comment: string;
}) {
  const [row] = await db
    .insert(reviews)
    .values(input)
    .onConflictDoUpdate({
      target: [reviews.userId, reviews.movieId],
      set: { rating: input.rating, comment: input.comment, updatedAt: new Date() },
    })
    .returning();
  await markUserTasteStale(input.userId);
  return row;
}

export async function deleteReview(userId: string, id: string) {
  const [row] = await db
    .delete(reviews)
    .where(and(eq(reviews.id, id), eq(reviews.userId, userId)))
    .returning();
  if (row) await markUserTasteStale(userId);
  return row ?? null;
}
