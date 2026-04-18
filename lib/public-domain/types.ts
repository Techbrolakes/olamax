export type PublicDomainFilm = {
  slug: string;
  tmdbId: number;
  source: "archive.org";
  sourceId: string;
  stream: {
    type: "hls" | "mp4";
    url: string;
  };
  title: string;
  year: number;
  runtime?: number;
  director?: string;
  synopsis?: string;
  posterPath?: string;
};
