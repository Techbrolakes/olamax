import Link from "next/link";
import {
  Bookmark,
  Clapperboard,
  Film,
  Flame,
  Home,
  Palette,
  Popcorn,
  Search,
  Sparkles,
  Star,
  Tv,
  Users,
  Wand2,
} from "lucide-react";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { SidebarUser } from "./sidebar-user";
import { SidebarLink } from "./sidebar-link";

const PRIMARY = [
  { label: "Home", href: ROUTES.home, icon: Home },
  { label: "Search", href: ROUTES.search, icon: Search },
  { label: "Moods", href: ROUTES.moods.index, icon: Palette },
  { label: "Free to watch", href: ROUTES.watch.index, icon: Popcorn },
  { label: "Trending", href: ROUTES.movies.trending, icon: Flame },
  { label: "Popular", href: ROUTES.movies.popular, icon: Sparkles },
  { label: "Top rated", href: ROUTES.movies.topRated, icon: Star },
  { label: "Upcoming", href: ROUTES.movies.upcoming, icon: Clapperboard },
  { label: "TV Shows", href: ROUTES.tv.index, icon: Tv },
  { label: "Actors", href: ROUTES.actors.index, icon: Users },
] as const;

const PERSONAL = [
  { label: "Watchlist", href: ROUTES.watchlist, icon: Bookmark },
  { label: "Reviews", href: ROUTES.reviews, icon: Film },
] as const;

export function AppSidebar() {
  return (
    <aside className="group/sidebar fixed left-0 top-0 z-40 hidden h-screen w-16 flex-col border-r border-border/60 bg-surface/60 backdrop-blur-xl transition-[width] duration-300 ease-out hover:w-56 md:flex">
      <div className="flex h-16 items-center px-4">
        <Link href={ROUTES.home} className="flex cursor-pointer items-center gap-3">
          <span
            aria-hidden
            className="grid h-8 w-8 flex-none place-items-center rounded-sm bg-foreground font-serif text-lg text-background"
          >
            O
          </span>
          <span className="overflow-hidden whitespace-nowrap font-serif text-xl tracking-[-0.02em] opacity-0 transition-opacity group-hover/sidebar:opacity-100">
            {APP_NAME}
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-hidden py-3">
        <SidebarHeading>Discover</SidebarHeading>
        {PRIMARY.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={<Icon className="h-5 w-5" />}
            />
          );
        })}

        <SidebarHeading className="mt-4">You</SidebarHeading>
        {PERSONAL.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={<Icon className="h-5 w-5" />}
            />
          );
        })}
      </nav>

      <SidebarAskAi />
      <SidebarUser />
    </aside>
  );
}

function SidebarAskAi() {
  return (
    <div className="px-2 pb-2">
      <Link
        href={ROUTES.concierge}
        title="Ask OlaMax AI"
        className="group/ai flex cursor-pointer items-center gap-3 overflow-hidden rounded-full bg-primary px-2 py-2 text-primary-foreground shadow-[0_4px_14px_-4px_hsl(var(--primary)/0.6)] transition-all hover:shadow-[0_6px_20px_-4px_hsl(var(--primary)/0.8)]"
      >
        <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-background/15 ring-1 ring-white/25">
          <Wand2 className="h-[15px] w-[15px]" strokeWidth={2.25} />
        </span>
        <span className="flex flex-col items-start leading-none opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100">
          <span className="font-mono text-[9px] font-semibold tracking-[0.22em] uppercase opacity-75">
            Ask
          </span>
          <span className="mt-0.5 whitespace-nowrap font-sans text-sm font-semibold tracking-tight">
            OlaMax AI
          </span>
        </span>
      </Link>
    </div>
  );
}

function SidebarHeading({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={`meta-label px-4 py-2 opacity-0 transition-opacity group-hover/sidebar:opacity-100 ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

