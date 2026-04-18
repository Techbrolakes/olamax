"use client";

import Image from "next/image";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { CameraIcon, CircleNotchIcon } from "@phosphor-icons/react";
import { useUpdateAvatar } from "./use-profile";
import { cn } from "@/lib/utils";

type Props = {
  initialUrl: string | null;
  fallback: string;
};

export function AvatarUploader({ initialUrl, fallback }: Props) {
  const [preview, setPreview] = useState<string | null>(initialUrl);
  const [error, setError] = useState<string | null>(null);
  const update = useUpdateAvatar();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/png": [], "image/jpeg": [], "image/webp": [] },
    maxSize: 3 * 1024 * 1024,
    multiple: false,
    onDrop: async ([file]) => {
      if (!file) return;
      setError(null);
      setPreview(URL.createObjectURL(file));
      try {
        const result = await update.mutateAsync(file);
        if (result?.avatarUrl) setPreview(result.avatarUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    },
    onDropRejected: () => setError("File too large or wrong type (max 3MB, png/jpg/webp)."),
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "group relative aspect-square w-44 cursor-pointer overflow-hidden rounded-full border border-border/60 bg-card transition-colors",
          isDragActive && "border-primary"
        )}
      >
        <input {...getInputProps()} />
        {preview ? (
          <Image src={preview} alt="Avatar" fill sizes="176px" className="object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-primary text-5xl font-serif text-primary-foreground">
            {fallback}
          </div>
        )}
        <div className="absolute inset-0 grid place-items-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
          {update.isPending ? (
            <CircleNotchIcon className="h-6 w-6 animate-spin text-foreground" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-foreground">
              <CameraIcon className="h-6 w-6" />
              <span className="meta-label">Change</span>
            </div>
          )}
        </div>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
