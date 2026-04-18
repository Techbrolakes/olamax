import { boolean, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

const neonAuthSchema = pgSchema("neon_auth");

export const users = neonAuthSchema.table("user", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  emailVerified: boolean("emailVerified"),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("createdAt", { withTimezone: true }),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export type User = typeof users.$inferSelect;
