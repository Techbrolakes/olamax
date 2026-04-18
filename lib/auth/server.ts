import "server-only";
import { NextResponse } from "next/server";
import { createNeonAuth } from "@neondatabase/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL;
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;

export const isAuthConfigured = Boolean(baseUrl && cookieSecret);

type AuthInstance = ReturnType<typeof createNeonAuth>;

const realAuth: AuthInstance | null = isAuthConfigured
  ? createNeonAuth({ baseUrl: baseUrl!, cookies: { secret: cookieSecret! } })
  : null;

if (!isAuthConfigured && process.env.NODE_ENV !== "production") {
  console.warn(
    "[auth] NEON_AUTH_BASE_URL / NEON_AUTH_COOKIE_SECRET not set — running in signed-out mode."
  );
}

function unauthorized() {
  return NextResponse.json({ message: "Auth is not configured" }, { status: 501 });
}

export const auth = {
  async getSession() {
    if (!realAuth) return { data: null };
    return realAuth.getSession();
  },
  handler() {
    if (!realAuth) {
      return { GET: unauthorized, POST: unauthorized };
    }
    return realAuth.handler();
  },
  middleware(options: Parameters<AuthInstance["middleware"]>[0]) {
    if (!realAuth) return () => NextResponse.next();
    return realAuth.middleware(options);
  },
  signIn: realAuth?.signIn,
  signUp: realAuth?.signUp,
  signOut: realAuth?.signOut,
};

export async function getCurrentUser() {
  const { data } = await auth.getSession();
  return data?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
