import Link from "next/link";
import { Search } from "lucide-react";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { NavUser } from "./nav-user";

const NAV_ITEMS = [
  { label: "Movies", href: ROUTES.movies.index },
  { label: "Actors", href: ROUTES.actors.index },
  { label: "Concierge", href: ROUTES.concierge },
  { label: "Watchlist", href: ROUTES.watchlist },
  { label: "Reviews", href: ROUTES.reviews },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6 md:px-10">
        <Link
          href={ROUTES.home}
          className="cursor-pointer font-serif text-2xl tracking-[-0.02em] text-foreground"
        >
          {APP_NAME}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="meta-label cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.search}
            aria-label="Search"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Link>
          <NavUser />
        </div>
      </div>
    </header>
  );
}
