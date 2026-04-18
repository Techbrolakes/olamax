import { getCurrentUser } from "@/lib/auth/server";
import { getUserTasteVector } from "@/lib/db/queries/user-taste-vectors";
import { MIN_SIGNALS_FOR_PERSONALIZATION } from "@/lib/ai/taste-vector";
import { WhyYoullLoveThisStream } from "./why-youll-love-this-stream";

export async function WhyYoullLoveThis({ movieId }: { movieId: number }) {
  const user = await getCurrentUser();
  if (!user) return null;

  const vector = await getUserTasteVector(user.id);
  if (!vector || vector.signalCount < MIN_SIGNALS_FOR_PERSONALIZATION) return null;

  return <WhyYoullLoveThisStream movieId={movieId} />;
}
