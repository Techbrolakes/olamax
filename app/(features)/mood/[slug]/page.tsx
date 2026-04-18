import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { MoodResults } from "@/components/features/recommendations/mood-results";
import { getMoodBySlug, MOODS } from "@/lib/ai/moods";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return MOODS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mood = getMoodBySlug(slug);
  if (!mood) return { title: "Mood" };
  return {
    title: `${mood.name} films`,
    description: mood.tagline,
  };
}

export default async function MoodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mood = getMoodBySlug(slug);
  if (!mood) notFound();

  return (
    <div className="px-4 py-10 md:px-8">
      <PageHeader
        eyebrow={`Mood · ${mood.name}`}
        title={mood.tagline}
        description="Ranked by semantic match to the vibe. OlaMax AI."
      />
      <MoodResults slug={mood.slug} />
    </div>
  );
}
