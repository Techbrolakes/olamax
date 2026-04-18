"use client";

import Link from "next/link";
import { Loader2, LogOut } from "lucide-react";
import { useSession, signOut } from "@/lib/auth/client";
import { ROUTES } from "@/lib/constants";
import { AuthShell } from "./auth-shell";

export function AccountView() {
  const { data, isPending } = useSession();
  const user = data?.user;

  if (isPending) {
    return (
      <AuthShell eyebrow="Settings" title="Account">
        <div className="grid place-items-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </AuthShell>
    );
  }

  if (!user) {
    return (
      <AuthShell eyebrow="Settings" title="Account" subtitle="Sign in to manage your account.">
        <Link
          href={ROUTES.auth.signIn}
          className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background hover:opacity-90"
        >
          Go to sign-in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="Settings" title="Account">
      <div className="space-y-5">
        <Field label="Name" value={user.name ?? "—"} />
        <Field label="Email" value={user.email} />

        <div className="flex flex-col gap-2 pt-2">
          <Link
            href={ROUTES.profile}
            className="inline-flex cursor-pointer items-center justify-center rounded-full border border-border/60 px-5 py-2.5 text-sm transition-colors hover:border-foreground"
          >
            Edit profile
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm text-background hover:opacity-90"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </AuthShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 border-t border-border/60 pt-3 first:border-t-0 first:pt-0">
      <p className="meta-label">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}
