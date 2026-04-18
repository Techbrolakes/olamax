import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const movieDeepDives = pgTable("movie_deep_dives", {
  movieId: integer("movie_id").primaryKey(),
  content: text("content").notNull(),
  generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type MovieDeepDive = typeof movieDeepDives.$inferSelect;
export type NewMovieDeepDive = typeof movieDeepDives.$inferInsert;
