import { integer, pgTable, text, timestamp, vector } from "drizzle-orm/pg-core";

export const movieEmbeddings = pgTable("movie_embeddings", {
  movieId: integer("movie_id").primaryKey(),
  embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  sourceHash: text("source_hash").notNull(),
  embeddedAt: timestamp("embedded_at", { withTimezone: true }).defaultNow().notNull(),
});

export type MovieEmbedding = typeof movieEmbeddings.$inferSelect;
export type NewMovieEmbedding = typeof movieEmbeddings.$inferInsert;
