import type { Metadata } from "next";
import { ConciergeView } from "@/components/features/concierge/concierge-view";

export const metadata: Metadata = {
  title: "Concierge",
  description:
    "OlaMax's editorial film concierge — ask for a vibe, a reference, or a mood and get grounded recommendations.",
};

export default function ConciergePage() {
  return <ConciergeView />;
}
