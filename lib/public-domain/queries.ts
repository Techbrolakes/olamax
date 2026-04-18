import { PUBLIC_DOMAIN_CATALOG } from "./catalog";
import type { PublicDomainFilm } from "./types";

export function listFreeToWatch(): PublicDomainFilm[] {
  return PUBLIC_DOMAIN_CATALOG;
}

export function getFreeToWatchBySlug(slug: string): PublicDomainFilm | null {
  return PUBLIC_DOMAIN_CATALOG.find((f) => f.slug === slug) ?? null;
}

export function getFreeToWatchByTmdbId(tmdbId: number): PublicDomainFilm | null {
  return PUBLIC_DOMAIN_CATALOG.find((f) => f.tmdbId === tmdbId) ?? null;
}
