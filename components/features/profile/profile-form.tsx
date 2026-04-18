"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleNotchIcon } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { profileSchema, type ProfileValues } from "./schemas";
import { useUpdateProfile } from "./use-profile";

type Props = {
  initial: ProfileValues;
  email: string;
};

export function ProfileForm({ initial, email }: Props) {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initial,
  });
  const update = useUpdateProfile();

  async function onSubmit(values: ProfileValues) {
    try {
      await update.mutateAsync(values);
    } catch (err) {
      form.setError("root", {
        type: "manual",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Field label="Email" description="Managed via your account settings.">
        <p className="text-sm text-muted-foreground">{email}</p>
      </Field>

      <Field label="Username" error={form.formState.errors.username?.message}>
        <input
          {...form.register("username")}
          placeholder="olamilekan"
          className="w-full rounded-sm border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </Field>

      <Field label="Full name" error={form.formState.errors.fullName?.message}>
        <input
          {...form.register("fullName")}
          placeholder="Your full name"
          className="w-full rounded-sm border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </Field>

      <Field label="Bio" error={form.formState.errors.bio?.message}>
        <textarea
          {...form.register("bio")}
          rows={4}
          placeholder="A sentence or two about your taste in film."
          className="w-full resize-none rounded-sm border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </Field>

      {form.formState.errors.root ? (
        <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
      ) : null}

      {update.isSuccess && !form.formState.isDirty ? (
        <p className="text-sm text-muted-foreground">Saved.</p>
      ) : null}

      <button
        type="submit"
        disabled={update.isPending}
        className="meta-label inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {update.isPending ? <CircleNotchIcon className="h-4 w-4 animate-spin" /> : null}
        Save changes
      </button>
    </form>
  );
}

function Field({
  label,
  description,
  error,
  children,
}: {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="meta-label block">{label}</label>
      {children}
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
