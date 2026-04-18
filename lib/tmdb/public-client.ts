// Browser-safe TMDB client. Talks to the same-origin /api/tmdb proxy so the
// TMDB_API_KEY stays on the server. Used by TanStack Query hooks.

export async function tmdbFetch<T>(
  endpoint: string,
  params?: Record<string, string | number | undefined | null>,
): Promise<T> {
  const search = new URLSearchParams();
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      search.set(k, String(v));
    }
  }
  const qs = search.toString();
  const url = `/api/tmdb${endpoint}${qs ? `?${qs}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB proxy ${endpoint} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
