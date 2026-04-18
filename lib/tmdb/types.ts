export type Genre = { id: number; name: string };

export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  adult: boolean;
  video: boolean;
};

export type Image = {
  file_path: string;
  width: number;
  height: number;
  aspect_ratio: number;
  iso_639_1: string | null;
  vote_average: number;
  vote_count: number;
};

export type ImagesPayload = {
  backdrops: Image[];
  posters: Image[];
  logos: Image[];
};

export type ProductionCompany = {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
};

export type SpokenLanguage = {
  iso_639_1: string;
  english_name: string;
  name: string;
};

export type Video = {
  id: string;
  key: string;
  name: string;
  site: "YouTube" | "Vimeo" | string;
  type: "Trailer" | "Teaser" | "Clip" | "Featurette" | "Behind the Scenes" | string;
  official: boolean;
  published_at: string;
};

export type Collection = {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
};

export type MovieDetails = Movie & {
  genres: Genre[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string | null;
  homepage: string | null;
  imdb_id: string | null;
  original_title: string;
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
  belongs_to_collection: Collection | null;
  videos?: { results: Video[] };
  images?: ImagesPayload;
};

export type Person = {
  id: number;
  name: string;
  profile_path: string | null;
  adult: boolean;
  popularity: number;
  known_for_department: string;
};

export type PersonDetails = Person & {
  also_known_as: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  imdb_id: string;
  place_of_birth: string | null;
};

export type Cast = {
  id: number;
  cast_id?: number;
  character: string;
  credit_id: string;
  gender: number | null;
  name: string;
  order: number;
  profile_path: string | null;
};

export type Crew = {
  id: number;
  credit_id: string;
  department: string;
  gender: number | null;
  job: string;
  name: string;
  profile_path: string | null;
};

export type MovieCredits = { id: number; cast: Cast[]; crew: Crew[] };

export type Paginated<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

// Watch providers
export type WatchProvider = {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
};

export type WatchProvidersByRegion = {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  ads?: WatchProvider[];
  free?: WatchProvider[];
};

export type WatchProvidersResponse = {
  id: number;
  results: Record<string, WatchProvidersByRegion | undefined>;
};

// TV
export type TvShow = {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
};

export type Creator = {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string | null;
};

export type Network = {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
};

export type Season = {
  id: number;
  air_date: string | null;
  episode_count: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average?: number;
};

export type Episode = {
  id: number;
  air_date: string | null;
  episode_number: number;
  name: string;
  overview: string;
  production_code?: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
};

export type TvShowDetails = TvShow & {
  genres: Genre[];
  created_by: Creator[];
  episode_run_time: number[];
  in_production: boolean;
  last_air_date: string | null;
  number_of_episodes: number;
  number_of_seasons: number;
  networks: Network[];
  production_companies: ProductionCompany[];
  production_countries: { iso_3166_1: string; name: string }[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string | null;
  type: string;
  homepage: string | null;
  videos?: { results: Video[] };
  images?: ImagesPayload;
};

export type SeasonDetails = Season & {
  episodes: Episode[];
};

export type AggregateCastRole = {
  credit_id: string;
  character: string;
  episode_count: number;
};

export type AggregateCast = {
  id: number;
  name: string;
  original_name: string;
  profile_path: string | null;
  total_episode_count: number;
  roles: AggregateCastRole[];
  order: number;
};

export type AggregateCrew = {
  id: number;
  name: string;
  profile_path: string | null;
  total_episode_count: number;
  jobs: { credit_id: string; job: string; episode_count: number }[];
  department: string;
};

export type TvCredits = {
  id: number;
  cast: AggregateCast[];
  crew: AggregateCrew[];
};
