import { queryOptions } from "@tanstack/react-query";
import type { Movie, Paginated, TvShow } from "./types";
import { tmdbFetch } from "./public-client";

// TMDB content turns over on the order of hours (trending updates daily,
// popular/top-rated even less). A long staleTime keeps TanStack Query from
// re-fetching on every mount / route change — the data we already have is
// plenty fresh.
const LONG_LIVED = {
  staleTime: 60 * 60 * 1000, // 1 hour
  gcTime: 24 * 60 * 60 * 1000, // 1 day
} as const;

export const trendingMoviesQuery = () =>
  queryOptions({
    queryKey: ["tmdb", "trending", "movie", "week"] as const,
    queryFn: () => tmdbFetch<Paginated<Movie>>("/trending/movie/week"),
    ...LONG_LIVED,
  });

export const trendingTvQuery = () =>
  queryOptions({
    queryKey: ["tmdb", "trending", "tv", "week"] as const,
    queryFn: () => tmdbFetch<Paginated<TvShow>>("/trending/tv/week"),
    ...LONG_LIVED,
  });

export const popularMoviesQuery = () =>
  queryOptions({
    queryKey: ["tmdb", "movie", "popular"] as const,
    queryFn: () => tmdbFetch<Paginated<Movie>>("/movie/popular"),
    ...LONG_LIVED,
  });

export const nowPlayingMoviesQuery = () =>
  queryOptions({
    queryKey: ["tmdb", "movie", "now_playing"] as const,
    queryFn: () => tmdbFetch<Paginated<Movie>>("/movie/now_playing"),
    ...LONG_LIVED,
  });

export const topRatedMoviesQuery = () =>
  queryOptions({
    queryKey: ["tmdb", "movie", "top_rated"] as const,
    queryFn: () => tmdbFetch<Paginated<Movie>>("/movie/top_rated"),
    ...LONG_LIVED,
  });

export const upcomingMoviesQuery = () =>
  queryOptions({
    queryKey: ["tmdb", "movie", "upcoming"] as const,
    queryFn: () => tmdbFetch<Paginated<Movie>>("/movie/upcoming"),
    ...LONG_LIVED,
  });

export const byGenreQuery = (genreId: number) =>
  queryOptions({
    queryKey: ["tmdb", "discover", "movie", "genre", genreId] as const,
    queryFn: () =>
      tmdbFetch<Paginated<Movie>>("/discover/movie", {
        with_genres: genreId,
      }),
    ...LONG_LIVED,
  });
