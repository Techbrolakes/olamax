"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type WatchlistItem = {
  id: string;
  userId: string;
  movieId: number;
  createdAt: string;
};

async function fetchWatchlist(): Promise<WatchlistItem[]> {
  const res = await fetch("/api/watchlist", { credentials: "include" });
  if (!res.ok) return [];
  const body = await res.json();
  return body.data ?? [];
}

async function fetchIsOnWatchlist(movieId: number): Promise<boolean> {
  const res = await fetch(`/api/watchlist/${movieId}`, { credentials: "include" });
  if (!res.ok) return false;
  const body = await res.json();
  return Boolean(body.data?.onWatchlist);
}

export function useWatchlist() {
  return useQuery({ queryKey: ["watchlist"], queryFn: fetchWatchlist });
}

export function useIsOnWatchlist(movieId: number) {
  return useQuery({
    queryKey: ["watchlist", movieId],
    queryFn: () => fetchIsOnWatchlist(movieId),
  });
}

export function useToggleWatchlist(movieId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (currentlyOn: boolean) => {
      if (currentlyOn) {
        const res = await fetch(`/api/watchlist/${movieId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to remove from watchlist");
      } else {
        const res = await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ movieId }),
        });
        if (!res.ok) throw new Error("Failed to add to watchlist");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist"] });
      qc.invalidateQueries({ queryKey: ["watchlist", movieId] });
    },
  });
}
