"use client";

import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { useSession, signOut } from "@/lib/auth/client";
import { ROUTES } from "@/lib/constants";

export function SidebarUser() {
  const { data, isPending } = useSession();
  const user = data?.user;

  if (isPending) {
    return <div className="mx-2 my-3 h-10 animate-pulse rounded-md bg-muted" />;
  }

  if (!user) {
    return (
      <div className="border-t border-border/60 p-2">
        <Link
          href={ROUTES.auth.signIn}
          className="flex cursor-pointer items-center gap-3 overflow-hidden rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        >
          <LogIn className="h-5 w-5 flex-none" />
          <span className="sidebar-label">Sign in</span>
        </Link>
      </div>
    );
  }

  const initial = (user.name ?? user.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-1 border-t border-border/60 p-2">
      <Link
        href={ROUTES.auth.account}
        title="Account"
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 overflow-hidden rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
      >
        <span
          aria-hidden
          className="grid h-7 w-7 flex-none place-items-center rounded-full border border-border/60 bg-muted font-serif text-xs text-foreground"
        >
          {initial}
        </span>
        <span className="sidebar-label truncate">{user.name ?? user.email.split("@")[0]}</span>
      </Link>
      <button
        type="button"
        onClick={() => signOut()}
        title="Sign out"
        aria-label="Sign out"
        className="sidebar-only-expanded flex h-9 w-9 flex-none cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
      >
        <LogOut className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}
