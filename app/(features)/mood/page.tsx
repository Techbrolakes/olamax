import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { MOODS } from "@/lib/ai/moods";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Browse by mood",
  description:
    "Find films by vibe — cozy, cerebral, pulse-pounding, melancholic, and more.",
};

export default function MoodIndexPage() {
  return (
    <div className="px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="OlaMax AI"
        title="Browse by mood"
        description="Pick a feeling. OlaMax finds films that match."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MOODS.map((mood) => (
          <Link
            key={mood.slug}
            href={ROUTES.moods.detail(mood.slug)}
            className="group relative flex min-h-[140px] cursor-pointer flex-col justify-between overflow-hidden rounded-[6px] border border-border/60 bg-gradient-to-br from-card/60 via-card/30 to-card/60 p-5 transition-all hover:border-primary/50 hover:shadow-[0_6px_24px_-8px_hsl(var(--primary)/0.4)]"
          >
            <div>
              <p className="meta-label text-primary transition-colors">{mood.name}</p>
              <h2 className="pt-2 font-serif text-2xl leading-tight tracking-[-0.02em]">
                {mood.tagline}
              </h2>
            </div>
            <div className="pt-4">
              <span className="meta-label inline-flex items-center gap-1.5 text-muted-foreground transition-colors group-hover:text-foreground">
                Explore <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
