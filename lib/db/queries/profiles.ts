import "server-only";
import { eq } from "drizzle-orm";
import { db } from "../index";
import { userProfiles, type UserProfile } from "../schema/user-profiles";

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const [row] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return row ?? null;
}

export async function upsertProfile(input: {
  userId: string;
  username?: string | null;
  fullName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
}) {
  const [row] = await db
    .insert(userProfiles)
    .values({ ...input, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: userProfiles.userId,
      set: { ...input, updatedAt: new Date() },
    })
    .returning();
  return row;
}
