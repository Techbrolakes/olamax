"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bookmark,
  Clapperboard,
  Film,
  Home,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Tv,
  Users,
} from "lucide-react";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SidebarUser } from "./sidebar-user";
import { SidebarLink } from "./sidebar-link";
import { SidebarSearch } from "./sidebar-search";

const STORAGE_KEY = "olamax.sidebar";

const PRIMARY = [
  { label: "Home", href: ROUTES.home, icon: Home },
  { label: "Movies", href: ROUTES.movies.index, icon: Clapperboard },
  { label: "TV", href: ROUTES.tv.index, icon: Tv },
  { label: "Actors", href: ROUTES.actors.index, icon: Users },
  { label: "Moods", href: ROUTES.moods.index, icon: Palette },
] as const;

const PERSONAL = [
  { label: "Watchlist", href: ROUTES.watchlist, icon: Bookmark },
  { label: "Reviews", href: ROUTES.reviews, icon: Film },
] as const;

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setCollapsed(saved === "collapsed");
  }, []);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    const state = next ? "collapsed" : "expanded";
    localStorage.setItem(STORAGE_KEY, state);
    document.documentElement.setAttribute("data-sidebar-state", state);
  }

  return (
    <aside
      data-sidebar-state={collapsed ? "collapsed" : "expanded"}
      className="group/sidebar fixed left-0 top-0 z-40 hidden h-screen w-[var(--sidebar-w)] flex-col border-r border-border/60 bg-surface/60 backdrop-blur-xl transition-[width] duration-300 ease-out md:flex"
    >
      <div className="flex h-16 items-center px-4">
        <Link href={ROUTES.home} className="flex cursor-pointer items-center gap-3">
          <span
            aria-hidden
            className="grid h-8 w-8 flex-none place-items-center rounded-sm bg-foreground font-serif text-lg text-background"
          >
            O
          </span>
          <span className="sidebar-label font-serif text-xl tracking-[-0.02em]">{APP_NAME}</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-3 overflow-hidden py-4">
        <SidebarSearch />

        <SidebarHeading className="mt-4">Discover</SidebarHeading>
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

        <SidebarHeading className="mt-5">You</SidebarHeading>
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

      <div className="px-2 pb-2">
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-md px-2 py-2 text-sm",
            "text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          )}
        >
          <span className="flex h-5 w-5 flex-none items-center justify-center">
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </span>
          <span className="sidebar-label">Collapse</span>
        </button>
      </div>

      <SidebarAskAi />
      <SidebarUser />
    </aside>
  );
}

function SidebarAskAi() {
  return (
    <div className="px-2 pb-3">
      <Link
        href={ROUTES.concierge}
        title="Ask OlaMax AI"
        className="group/ai relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg border border-border/60 bg-gradient-to-br from-muted/60 via-card/40 to-background/20 px-3 py-2.5 shadow-[0_1px_0_0_hsl(var(--foreground)/0.04)_inset,0_6px_20px_-12px_rgba(0,0,0,0.6)] transition-all hover:border-border hover:from-muted/80 hover:via-card/60"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-foreground/25 to-transparent"
        />
        <span className="relative grid h-7 w-7 flex-none place-items-center rounded-md bg-background/70 ring-1 ring-inset ring-border/60">
          <Sparkles
            className="h-[13px] w-[13px] text-foreground transition-transform duration-300 group-hover/ai:-rotate-6 group-hover/ai:scale-110"
            strokeWidth={2}
          />
        </span>
        <span className="sidebar-label flex min-w-0 flex-1 flex-col leading-tight">
          <span className="meta-label text-[9px] opacity-70">OlaMax AI</span>
          <span className="mt-0.5 truncate font-serif text-[15px] italic tracking-tight text-foreground">
            Describe a vibe…
          </span>
        </span>
        <ArrowUpRight
          className="sidebar-label h-4 w-4 flex-none text-muted-foreground transition-all duration-300 group-hover/ai:translate-x-0.5 group-hover/ai:-translate-y-0.5 group-hover/ai:text-foreground"
          strokeWidth={1.75}
        />
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
  return <p className={cn("meta-label sidebar-label px-4 py-2", className)}>{children}</p>;
}
