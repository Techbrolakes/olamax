CREATE TABLE IF NOT EXISTS "movie_deep_dives" (
	"movie_id" integer PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL
);
