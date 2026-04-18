import Link from "next/link";
import { APP_NAME, ROUTES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[2fr_1fr_1fr_1fr] md:px-10">
        <div className="space-y-3">
          <p className="font-serif text-3xl tracking-[-0.02em]">{APP_NAME}</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            A quiet corner of the internet for film watchers — browse, collect, and write.
          </p>
        </div>

        <FooterColumn title="Discover">
          <FooterLink href={ROUTES.movies.trending}>Trending</FooterLink>
          <FooterLink href={ROUTES.movies.popular}>Popular</FooterLink>
          <FooterLink href={ROUTES.movies.topRated}>Top rated</FooterLink>
          <FooterLink href={ROUTES.movies.upcoming}>Upcoming</FooterLink>
        </FooterColumn>

        <FooterColumn title="You">
          <FooterLink href={ROUTES.watchlist}>Watchlist</FooterLink>
          <FooterLink href={ROUTES.reviews}>Reviews</FooterLink>
          <FooterLink href={ROUTES.profile}>Profile</FooterLink>
        </FooterColumn>

        <FooterColumn title="Data">
          <p className="text-sm text-muted-foreground">
            Film data courtesy of{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer underline-offset-4 hover:underline"
            >
              TMDB
            </a>
            .
          </p>
        </FooterColumn>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <p className="meta-label">© {new Date().getFullYear()} {APP_NAME}</p>
          <p className="meta-label">Made with care</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="meta-label">{title}</p>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="cursor-pointer text-sm text-foreground/80 transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}
