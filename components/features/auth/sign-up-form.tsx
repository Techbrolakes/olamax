"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/client";
import { ROUTES } from "@/lib/constants";
import { signUpSchema, type SignUpValues } from "./schemas";
import { AuthField } from "./auth-field";

type Props = { configured: boolean };

export function SignUpForm({ configured }: Props) {
  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: SignUpValues) {
    if (!configured) {
      form.setError("root", {
        type: "manual",
        message:
          "Auth isn't configured yet. Set NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET to enable sign-up.",
      });
      return;
    }
    try {
      const result = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      const err = (result as { error?: { message?: string } }).error;
      if (err) {
        form.setError("root", { type: "manual", message: err.message ?? "Sign-up failed" });
        return;
      }
      router.push(ROUTES.home);
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
        label="Name"
        type="text"
        autoComplete="name"
        placeholder="Olamilekan"
        error={form.formState.errors.name?.message}
        {...form.register("name")}
      />

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
        autoComplete="new-password"
        placeholder="At least 8 characters"
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
        Create account
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Have an account already?{" "}
        <Link
          href={ROUTES.auth.signIn}
          className="cursor-pointer text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
