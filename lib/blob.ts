import "server-only";
import { del, put, type PutBlobResult } from "@vercel/blob";

export async function uploadAvatar(userId: string, file: File): Promise<PutBlobResult> {
  const ext = file.name.split(".").pop() ?? "png";
  const pathname = `avatars/${userId}-${Date.now()}.${ext}`;
  return put(pathname, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });
}

export async function deleteBlob(url: string) {
  if (!url) return;
  try {
    await del(url);
  } catch {
    // best-effort cleanup
  }
}
