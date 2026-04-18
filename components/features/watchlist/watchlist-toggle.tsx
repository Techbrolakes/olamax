"use client";

import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth/client";
import { useIsOnWatchlist, useToggleWatchlist } from "./use-watchlist";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export function WatchlistToggle({ movieId }: { movieId: number }) {
  const { data: session, isPending: sessionPending } = useSession();
  const user = session?.user;
  const { data: isOn = false, isPending } = useIsOnWatchlist(movieId);
  const toggle = useToggleWatchlist(movieId);

  if (sessionPending) {
    return <div className="h-11 w-40 animate-pulse rounded-full bg-muted" />;
  }

  if (!user) {
    return (
      <Link
        href={ROUTES.auth.signIn}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/60 px-5 py-2.5 text-sm transition-colors hover:border-border hover:text-foreground"
      >
        <Bookmark className="h-4 w-4" />
        Sign in to save
      </Link>
    );
  }

  const disabled = isPending || toggle.isPending;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => toggle.mutate(isOn)}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors",
        isOn
          ? "bg-foreground text-background hover:opacity-90"
          : "border border-border/60 text-foreground hover:border-border"
      )}
    >
      {toggle.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isOn ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {isOn ? "On your list" : "Add to watchlist"}
    </button>
  );
}
