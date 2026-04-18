"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfileValues } from "./schemas";

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: ProfileValues) => {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: values.username || null,
          fullName: values.fullName || null,
          bio: values.bio || null,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Failed to save profile");
      }
      return (await res.json()).data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useUpdateAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "Failed to upload avatar");
      }
      return (await res.json()).data as { avatarUrl: string | null };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}
