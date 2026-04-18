import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="meta-label">404</p>
      <h1 className="font-serif text-6xl tracking-[-0.02em]">
        <span className="italic">Nothing</span> here.
      </h1>
      <p className="max-w-md text-muted-foreground">
        The reel you were looking for doesn&rsquo;t exist — or has been moved to the cutting-room floor.
      </p>
      <Link
        href={ROUTES.home}
        className="meta-label cursor-pointer rounded-full bg-foreground px-5 py-2.5 text-background hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
