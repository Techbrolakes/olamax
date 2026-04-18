import "server-only";
import { eq } from "drizzle-orm";
import { db } from "../index";
import { userTasteVectors, type UserTasteVector } from "../schema/user-taste-vectors";

export async function getUserTasteVector(userId: string): Promise<UserTasteVector | null> {
  const [row] = await db
    .select()
    .from(userTasteVectors)
    .where(eq(userTasteVectors.userId, userId))
    .limit(1);
  return row ?? null;
}

export async function upsertUserTasteVector(input: {
  userId: string;
  embedding: number[] | null;
  signalCount: number;
}) {
  await db
    .insert(userTasteVectors)
    .values({
      userId: input.userId,
      embedding: input.embedding,
      signalCount: input.signalCount,
      stale: false,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: userTasteVectors.userId,
      set: {
        embedding: input.embedding,
        signalCount: input.signalCount,
        stale: false,
        updatedAt: new Date(),
      },
    });
}

export async function markUserTasteStale(userId: string) {
  await db
    .insert(userTasteVectors)
    .values({ userId, embedding: null, signalCount: 0, stale: true })
    .onConflictDoUpdate({
      target: userTasteVectors.userId,
      set: { stale: true },
    });
}
