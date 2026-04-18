CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movie_embeddings" (
	"movie_id" integer PRIMARY KEY NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"source_hash" text NOT NULL,
	"embedded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_taste_vectors" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"embedding" vector(1536),
	"signal_count" integer DEFAULT 0 NOT NULL,
	"stale" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_taste_vectors" ADD CONSTRAINT "user_taste_vectors_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "movie_embeddings_embedding_hnsw_idx"
  ON "movie_embeddings" USING hnsw ("embedding" vector_cosine_ops);
