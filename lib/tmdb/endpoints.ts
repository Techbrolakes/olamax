import "server-only";
import { tmdb } from "./client";
import type {
  Genre,
  Movie,
  MovieCredits,
  MovieDetails,
  Paginated,
  Person,
  PersonDetails,
  SeasonDetails,
  TvCredits,
  TvShow,
  TvShowDetails,
  WatchProvidersResponse,
} from "./types";

export const movies = {
  trending: (window: "day" | "week" = "week", page = 1) =>
    tmdb<Paginated<Movie>>(`/trending/movie/${window}`, { params: { page } }),
  popular: (page = 1) => tmdb<Paginated<Movie>>("/movie/popular", { params: { page } }),
  nowPlaying: (page = 1) => tmdb<Paginated<Movie>>("/movie/now_playing", { params: { page } }),
  topRated: (page = 1) => tmdb<Paginated<Movie>>("/movie/top_rated", { params: { page } }),
  upcoming: (page = 1) => tmdb<Paginated<Movie>>("/movie/upcoming", { params: { page } }),
  details: (id: number) =>
    tmdb<MovieDetails>(`/movie/${id}`, {
      params: { append_to_response: "videos,images" },
    }),
  credits: (id: number) => tmdb<MovieCredits>(`/movie/${id}/credits`),
  similar: (id: number, page = 1) =>
    tmdb<Paginated<Movie>>(`/movie/${id}/similar`, { params: { page } }),
  recommendations: (id: number, page = 1) =>
    tmdb<Paginated<Movie>>(`/movie/${id}/recommendations`, { params: { page } }),
  byGenre: (genreId: number, page = 1) =>
    tmdb<Paginated<Movie>>("/discover/movie", { params: { with_genres: genreId, page } }),
  search: (query: string, page = 1) =>
    tmdb<Paginated<Movie>>("/search/movie", { params: { query, page }, revalidate: 60 }),
  genres: () => tmdb<{ genres: Genre[] }>("/genre/movie/list"),
  watchProviders: (id: number) => tmdb<WatchProvidersResponse>(`/movie/${id}/watch/providers`),
};

export const people = {
  popular: (page = 1) => tmdb<Paginated<Person>>("/person/popular", { params: { page } }),
  details: (id: number) => tmdb<PersonDetails>(`/person/${id}`),
  credits: (id: number) => tmdb<{ id: number; cast: Movie[]; crew: Movie[] }>(`/person/${id}/movie_credits`),
  search: (query: string, page = 1) =>
    tmdb<Paginated<Person>>("/search/person", { params: { query, page }, revalidate: 60 }),
};

export const tv = {
  trending: (window: "day" | "week" = "week", page = 1) =>
    tmdb<Paginated<TvShow>>(`/trending/tv/${window}`, { params: { page } }),
  popular: (page = 1) => tmdb<Paginated<TvShow>>("/tv/popular", { params: { page } }),
  topRated: (page = 1) => tmdb<Paginated<TvShow>>("/tv/top_rated", { params: { page } }),
  airingToday: (page = 1) => tmdb<Paginated<TvShow>>("/tv/airing_today", { params: { page } }),
  onTheAir: (page = 1) => tmdb<Paginated<TvShow>>("/tv/on_the_air", { params: { page } }),
  details: (id: number) =>
    tmdb<TvShowDetails>(`/tv/${id}`, {
      params: { append_to_response: "videos,images" },
    }),
  credits: (id: number) => tmdb<TvCredits>(`/tv/${id}/aggregate_credits`),
  similar: (id: number, page = 1) =>
    tmdb<Paginated<TvShow>>(`/tv/${id}/similar`, { params: { page } }),
  recommendations: (id: number, page = 1) =>
    tmdb<Paginated<TvShow>>(`/tv/${id}/recommendations`, { params: { page } }),
  season: (id: number, seasonNumber: number) =>
    tmdb<SeasonDetails>(`/tv/${id}/season/${seasonNumber}`),
  watchProviders: (id: number) => tmdb<WatchProvidersResponse>(`/tv/${id}/watch/providers`),
  search: (query: string, page = 1) =>
    tmdb<Paginated<TvShow>>("/search/tv", { params: { query, page }, revalidate: 60 }),
  byGenre: (genreId: number, page = 1) =>
    tmdb<Paginated<TvShow>>("/discover/tv", { params: { with_genres: genreId, page } }),
  genres: () => tmdb<{ genres: Genre[] }>("/genre/tv/list"),
};
