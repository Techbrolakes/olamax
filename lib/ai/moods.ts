import "server-only";

import { embedText } from "./embeddings";

export type Mood = {
  slug: string;
  name: string;
  tagline: string;
  seedPrompt: string;
};

export const MOODS: Mood[] = [
  {
    slug: "cozy",
    name: "Cozy",
    tagline: "Warm, gentle, film-as-a-blanket.",
    seedPrompt:
      "Warm, comforting films with low stakes and gentle humor. Films that feel like a blanket on a rainy day — small-scale stories, soft lighting, intimate character moments, and a sense of ease. Feel-good, heart-warming, quietly human.",
  },
  {
    slug: "pulse-pounding",
    name: "Pulse-pounding",
    tagline: "Taut, fast, edge-of-seat.",
    seedPrompt:
      "Tense, fast-paced thrillers driven by adrenaline. High stakes, relentless pacing, suspense, chase sequences, tight plotting. Taut and edge-of-seat — films that make your chest pound.",
  },
  {
    slug: "cerebral",
    name: "Cerebral",
    tagline: "Dense, heady, thought-first.",
    seedPrompt:
      "Intellectually dense, thought-provoking films. Philosophical, abstract, ambiguous, or structurally challenging. Stories that reward careful attention — ideas-first cinema, puzzle narratives, and quiet existential weight.",
  },
  {
    slug: "melancholic",
    name: "Melancholic",
    tagline: "Wistful, bittersweet, aching.",
    seedPrompt:
      "Bittersweet films with a quiet emotional weight. Wistful, reflective, films about loss, longing, or passing time. Gentle tragedy, autumnal tone, characters carrying something unspoken.",
  },
  {
    slug: "epic",
    name: "Epic",
    tagline: "Grand scope, sweeping canvas.",
    seedPrompt:
      "Grand-scale epic cinema. Sweeping vistas, long runtimes, generational sagas, historical drama, mythic adventure. Ambitious, cinematic, big-canvas filmmaking with orchestral weight.",
  },
  {
    slug: "romantic",
    name: "Romantic",
    tagline: "Swoon-worthy, yearning, falling.",
    seedPrompt:
      "Love-forward films — romance, yearning, swooning, fate-driven connections. Emotional honesty, chemistry, slow-burn attraction, or classic love-story beats. Films that make you want to fall in love.",
  },
  {
    slug: "twisted",
    name: "Twisted",
    tagline: "Dark, subversive, uneasy.",
    seedPrompt:
      "Dark, subversive, unsettling films. Morally complex characters, disturbing atmosphere, psychological unease, pitch-black comedy, or genre-subverting narratives. Films that don't let you off the hook.",
  },
  {
    slug: "uplifting",
    name: "Uplifting",
    tagline: "Hopeful, triumphant, glowing.",
    seedPrompt:
      "Inspiring, hopeful films with a triumphant arc. Underdog victories, communities pulling together, emotional catharsis, heart-forward storytelling. Films that leave you glowing.",
  },
] as const;

export function getMoodBySlug(slug: string): Mood | undefined {
  return MOODS.find((m) => m.slug === slug);
}

// In-memory cache for mood embeddings — moods are static, so per-deployment
// lifetime is fine. First request warms, subsequent requests hit cache.
const moodEmbeddingCache = new Map<string, number[]>();

export async function getMoodEmbedding(mood: Mood): Promise<number[]> {
  const cached = moodEmbeddingCache.get(mood.slug);
  if (cached) return cached;
  const embedding = await embedText(mood.seedPrompt);
  moodEmbeddingCache.set(mood.slug, embedding);
  return embedding;
}
