const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const POSTER_SIZES = { small: "w185", medium: "w342", large: "w500", original: "original" } as const;
export const BACKDROP_SIZES = { small: "w300", medium: "w780", large: "w1280", original: "original" } as const;
export const PROFILE_SIZES = { small: "w45", medium: "w185", large: "h632", original: "original" } as const;
export const STILL_SIZES = { small: "w185", medium: "w300", large: "original" } as const;
export const LOGO_SIZES = { small: "w45", medium: "w92", large: "w185", xl: "w300" } as const;

export function posterUrl(
  path: string | null | undefined,
  size: keyof typeof POSTER_SIZES = "medium"
): string | null {
  return path ? `${TMDB_IMAGE_BASE_URL}/${POSTER_SIZES[size]}${path}` : null;
}

export function backdropUrl(
  path: string | null | undefined,
  size: keyof typeof BACKDROP_SIZES = "large"
): string | null {
  return path ? `${TMDB_IMAGE_BASE_URL}/${BACKDROP_SIZES[size]}${path}` : null;
}

export function profileUrl(
  path: string | null | undefined,
  size: keyof typeof PROFILE_SIZES = "medium"
): string | null {
  return path ? `${TMDB_IMAGE_BASE_URL}/${PROFILE_SIZES[size]}${path}` : null;
}

export function stillUrl(
  path: string | null | undefined,
  size: keyof typeof STILL_SIZES = "medium"
): string | null {
  return path ? `${TMDB_IMAGE_BASE_URL}/${STILL_SIZES[size]}${path}` : null;
}

export function logoUrl(
  path: string | null | undefined,
  size: keyof typeof LOGO_SIZES = "medium"
): string | null {
  return path ? `${TMDB_IMAGE_BASE_URL}/${LOGO_SIZES[size]}${path}` : null;
}
