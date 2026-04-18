import "server-only";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

if (!process.env.TMDB_API_KEY) {
  // Soft warn; routes will throw when hit without the key.
  console.warn("TMDB_API_KEY is not set");
}

type FetchOptions = {
  params?: Record<string, string | number | undefined>;
  revalidate?: number | false;
  tags?: string[];
};

export async function tmdb<T>(endpoint: string, { params, revalidate = 3600, tags }: FetchOptions = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", process.env.TMDB_API_KEY ?? "");
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString(), {
    next: revalidate === false ? { tags } : { revalidate, tags },
  });

  if (!res.ok) {
    throw new Error(`TMDB ${endpoint} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}
