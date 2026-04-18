import Link from "next/link";
import { Search } from "lucide-react";
import { APP_NAME, ROUTES } from "@/lib/constants";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl md:hidden">
      <Link href={ROUTES.home} className="cursor-pointer font-serif text-xl tracking-[-0.02em]">
        {APP_NAME}
      </Link>
      <Link
        href={ROUTES.search}
        aria-label="Search"
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border/60 text-muted-foreground"
      >
        <Search className="h-4 w-4" />
      </Link>
    </header>
  );
}
