"use client";

import Link from "next/link";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
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
          <span className="overflow-hidden whitespace-nowrap opacity-0 transition-opacity group-hover/sidebar:opacity-100">
            Sign in
          </span>
        </Link>
      </div>
    );
  }

  const initial = (user.name ?? user.email ?? "?").charAt(0).toUpperCase();

  return (
    <div className="border-t border-border/60 p-2">
      <Link
        href={ROUTES.profile}
        className="flex cursor-pointer items-center gap-3 overflow-hidden rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
      >
        <span
          aria-hidden
          className="grid h-7 w-7 flex-none place-items-center rounded-full bg-primary font-serif text-xs text-primary-foreground"
        >
          {initial}
        </span>
        <span className="overflow-hidden whitespace-nowrap opacity-0 transition-opacity group-hover/sidebar:opacity-100">
          {user.name ?? user.email.split("@")[0]}
        </span>
      </Link>
      <button
        type="button"
        onClick={() => signOut()}
        className="flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
      >
        <LogOut className="h-5 w-5 flex-none" />
        <span className="overflow-hidden whitespace-nowrap opacity-0 transition-opacity group-hover/sidebar:opacity-100">
          Sign out
        </span>
      </button>
      <Link
        href={ROUTES.auth.account}
        className="flex cursor-pointer items-center gap-3 overflow-hidden rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
      >
        <UserIcon className="h-5 w-5 flex-none" />
        <span className="overflow-hidden whitespace-nowrap opacity-0 transition-opacity group-hover/sidebar:opacity-100">
          Account
        </span>
      </Link>
    </div>
  );
}
