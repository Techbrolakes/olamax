"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/client";
import { ROUTES } from "@/lib/constants";
import { signInSchema, type SignInValues } from "./schemas";
import { AuthField } from "./auth-field";

type Props = { configured: boolean };

export function SignInForm({ configured }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = params?.get("after_auth_return_to") ?? ROUTES.home;

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SignInValues) {
    if (!configured) {
      form.setError("root", {
        type: "manual",
        message:
          "Auth isn't configured yet. Set NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET to enable sign-in.",
      });
      return;
    }
    try {
      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });
      const err = (result as { error?: { message?: string } }).error;
      if (err) {
        form.setError("root", { type: "manual", message: err.message ?? "Sign-in failed" });
        return;
      }
      router.push(returnTo);
      router.refresh();
    } catch (err) {
      form.setError("root", {
        type: "manual",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {!configured ? (
        <div className="rounded-sm border border-border/60 bg-background/60 p-3 text-xs text-muted-foreground">
          Running in signed-out mode — set <code className="font-mono">NEON_AUTH_BASE_URL</code>{" "}
          and <code className="font-mono">NEON_AUTH_COOKIE_SECRET</code> in <code className="font-mono">.env</code>{" "}
          to enable auth.
        </div>
      ) : null}

      <AuthField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@domain.com"
        error={form.formState.errors.email?.message}
        {...form.register("email")}
      />

      <AuthField
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={form.formState.errors.password?.message}
        {...form.register("password")}
      />

      {form.formState.errors.root ? (
        <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Sign in
      </button>

      <p className="text-center text-xs text-muted-foreground">
        New here?{" "}
        <Link
          href={ROUTES.auth.signUp}
          className="cursor-pointer text-foreground underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
