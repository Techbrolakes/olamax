"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Review = {
  id: string;
  userId: string;
  movieId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

async function fetchMovieReviews(movieId: number): Promise<{ items: Review[]; mine: Review | null }> {
  const res = await fetch(`/api/reviews?movieId=${movieId}&scope=mine`, { credentials: "include" });
  if (!res.ok) return { items: [], mine: null };
  const body = await res.json();
  return body.data ?? { items: [], mine: null };
}

async function fetchMyReviews(): Promise<Review[]> {
  const res = await fetch("/api/reviews", { credentials: "include" });
  if (!res.ok) return [];
  const body = await res.json();
  return body.data ?? [];
}

export function useMovieReviews(movieId: number) {
  return useQuery({
    queryKey: ["reviews", "movie", movieId],
    queryFn: () => fetchMovieReviews(movieId),
  });
}

export function useMyReviews() {
  return useQuery({ queryKey: ["reviews", "mine"], queryFn: fetchMyReviews });
}

export function useUpsertReview(movieId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { rating: number; comment: string }) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ movieId, ...input }),
      });
      if (!res.ok) throw new Error("Failed to save review");
      return (await res.json()).data as Review;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", "movie", movieId] });
      qc.invalidateQueries({ queryKey: ["reviews", "mine"] });
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete review");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
