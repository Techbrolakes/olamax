import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const isDbConfigured = Boolean(process.env.DATABASE_URL);

if (!isDbConfigured && process.env.NODE_ENV !== "production") {
  console.warn("[db] DATABASE_URL not set — database queries will throw when invoked.");
}

function createDb() {
  if (!isDbConfigured) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle({ client: sql, schema, casing: "snake_case" });
}

type Db = ReturnType<typeof createDb>;
let _db: Db | null = null;

export const db = new Proxy({} as Db, {
  get(_target, prop) {
    if (!_db) _db = createDb();
    return Reflect.get(_db, prop);
  },
});

export * from "./schema";
