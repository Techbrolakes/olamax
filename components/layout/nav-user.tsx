"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth/client";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function NavUser() {
  const { data, isPending } = useSession();
  const user = data?.user;

  if (isPending) {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href={ROUTES.auth.signIn}
          className="meta-label cursor-pointer rounded-full px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          Sign in
        </Link>
        <Link
          href={ROUTES.auth.signUp}
          className={cn(
            "meta-label cursor-pointer rounded-full bg-foreground px-4 py-2 text-background",
            "transition-opacity hover:opacity-90"
          )}
        >
          Join
        </Link>
      </div>
    );
  }

  const initial = (user.name ?? user.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <Link
        href={ROUTES.profile}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-border/60 py-1 pl-1 pr-3 transition-colors hover:border-border"
      >
        <span
          aria-hidden
          className="grid h-7 w-7 place-items-center rounded-full bg-primary font-serif text-sm text-primary-foreground"
        >
          {initial}
        </span>
        <span className="max-w-[10ch] truncate text-sm text-foreground">
          {user.name ?? user.email}
        </span>
      </Link>
      <button
        type="button"
        onClick={() => signOut()}
        className="meta-label cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
      >
        Sign out
      </button>
    </div>
  );
}
