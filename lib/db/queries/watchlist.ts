import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../index";
import { watchlist, type WatchlistItem } from "../schema/watchlist";
import { markUserTasteStale } from "./user-taste-vectors";

export async function listWatchlist(userId: string): Promise<WatchlistItem[]> {
  return db.select().from(watchlist).where(eq(watchlist.userId, userId)).orderBy(desc(watchlist.createdAt));
}

export async function isOnWatchlist(userId: string, movieId: number): Promise<boolean> {
  const [row] = await db
    .select({ id: watchlist.id })
    .from(watchlist)
    .where(and(eq(watchlist.userId, userId), eq(watchlist.movieId, movieId)))
    .limit(1);
  return Boolean(row);
}

export async function addToWatchlist(userId: string, movieId: number) {
  const [row] = await db
    .insert(watchlist)
    .values({ userId, movieId })
    .onConflictDoNothing({ target: [watchlist.userId, watchlist.movieId] })
    .returning();
  if (row) await markUserTasteStale(userId);
  return row;
}

export async function removeFromWatchlist(userId: string, movieId: number) {
  await db
    .delete(watchlist)
    .where(and(eq(watchlist.userId, userId), eq(watchlist.movieId, movieId)));
  await markUserTasteStale(userId);
}
