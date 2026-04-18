export const APP_NAME = "OlaMax";
export const APP_TAGLINE = "Editorial film discovery with an AI concierge";
export const APP_DESCRIPTION =
  "Describe a vibe and let the AI find your next film. OlaMax mixes an editorial browsing experience with an AI concierge that recommends from your taste, writes deep dives on any movie, and curates films by mood.";

export const ROUTES = {
  home: "/",
  search: "/search",
  movies: {
    index: "/movies",
    trending: "/movies/trending",
    popular: "/movies/popular",
    topRated: "/movies/top-rated",
    upcoming: "/movies/upcoming",
    detail: (id: number | string) => `/movies/${id}`,
  },
  actors: {
    index: "/actors",
    popular: "/actors/popular",
    detail: (id: number | string) => `/actors/${id}`,
  },
  tv: {
    index: "/tv",
    trending: "/tv/trending",
    popular: "/tv/popular",
    topRated: "/tv/top-rated",
    airingToday: "/tv/airing-today",
    detail: (id: number | string) => `/tv/${id}`,
    season: (id: number | string, seasonNumber: number) => `/tv/${id}/season/${seasonNumber}`,
  },
  watch: {
    index: "/watch",
    detail: (slug: string) => `/watch/${slug}`,
  },
  genre: (id: number | string) => `/genre/${id}`,
  profile: "/profile",
  watchlist: "/watchlist",
  reviews: "/reviews",
  concierge: "/concierge",
  moods: {
    index: "/mood",
    detail: (slug: string) => `/mood/${slug}`,
  },
  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    account: "/account",
  },
} as const;
