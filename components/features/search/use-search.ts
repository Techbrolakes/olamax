"use client";

import { useQuery } from "@tanstack/react-query";
import type { Movie, Person, TvShow } from "@/lib/tmdb/types";

type SearchResponse = { movies: Movie[]; people: Person[]; shows: TvShow[] };

async function fetchSearch(query: string): Promise<SearchResponse> {
  const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return { movies: [], people: [], shows: [] };
  return (await res.json()) as SearchResponse;
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearch(query),
    enabled: query.trim().length >= 2,
    staleTime: 60_000,
  });
}
