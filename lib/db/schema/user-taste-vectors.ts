import { boolean, integer, pgTable, timestamp, uuid, vector } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userTasteVectors = pgTable("user_taste_vectors", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  embedding: vector("embedding", { dimensions: 1536 }),
  signalCount: integer("signal_count").notNull().default(0),
  stale: boolean("stale").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type UserTasteVector = typeof userTasteVectors.$inferSelect;
export type NewUserTasteVector = typeof userTasteVectors.$inferInsert;
