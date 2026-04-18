import Link from "next/link";
import { APP_NAME, ROUTES } from "@/lib/constants";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function AuthShell({ eyebrow, title, subtitle, footer, children }: Props) {
  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-3 text-center">
        <Link
          href={ROUTES.home}
          className="meta-label inline-flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <span
            aria-hidden
            className="grid h-6 w-6 place-items-center rounded-sm bg-foreground font-serif text-sm text-background"
          >
            O
          </span>
          {APP_NAME}
        </Link>
        <p className="meta-label">{eyebrow}</p>
        <h1 className="font-serif text-5xl tracking-[-0.02em]">
          <span className="italic">{title}</span>
        </h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </header>

      <div className="rounded-md border border-border/60 bg-card/60 p-6 shadow-2xl backdrop-blur-sm md:p-8">
        {children}
      </div>

      {footer ? <div className="text-center text-sm text-muted-foreground">{footer}</div> : null}
    </div>
  );
}
