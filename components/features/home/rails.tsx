import { movies as moviesApi, tv as tvApi } from "@/lib/tmdb";
import type { Movie, Paginated, TvShow } from "@/lib/tmdb/types";
import { MovieRail } from "@/components/shared/movie-rail";
import { TvRail } from "@/components/shared/tv-rail";
import { ROUTES } from "@/lib/constants";
import { safe } from "./safe";

const emptyMovies: Paginated<Movie> = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};
const emptyTv: Paginated<TvShow> = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

export async function TrendingMoviesRail() {
  const data = await safe(moviesApi.trending("week"), emptyMovies);
  return (
    <MovieRail
      title="Trending this week"
      seeAllHref={ROUTES.movies.trending}
      movies={data.results}
      priority
    />
  );
}

export async function TrendingTvRail() {
  const data = await safe(tvApi.trending("week"), emptyTv);
  return (
    <TvRail
      title="Trending TV shows"
      seeAllHref={ROUTES.tv.trending}
      shows={data.results}
    />
  );
}

export async function NowPlayingRail() {
  const data = await safe(moviesApi.nowPlaying(), emptyMovies);
  return <MovieRail title="Now playing" movies={data.results} />;
}

export async function PopularMoviesRail() {
  const data = await safe(moviesApi.popular(), emptyMovies);
  return (
    <MovieRail
      title="Popular"
      seeAllHref={ROUTES.movies.popular}
      movies={data.results}
    />
  );
}

export async function TopRatedRail() {
  const data = await safe(moviesApi.topRated(), emptyMovies);
  return (
    <MovieRail
      title="Top rated"
      seeAllHref={ROUTES.movies.topRated}
      movies={data.results}
    />
  );
}

export async function UpcomingRail() {
  const data = await safe(moviesApi.upcoming(), emptyMovies);
  return (
    <MovieRail
      title="Upcoming"
      seeAllHref={ROUTES.movies.upcoming}
      movies={data.results}
    />
  );
}
