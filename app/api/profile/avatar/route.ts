import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { deleteBlob, uploadAvatar } from "@/lib/blob";
import { getProfile, upsertProfile } from "@/lib/db/queries/profiles";

const MAX_BYTES = 3 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/webp"];

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Missing file" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ message: "File too large (max 3MB)" }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ message: "Unsupported file type" }, { status: 400 });
    }

    const current = await getProfile(user.id);
    const blob = await uploadAvatar(user.id, file);
    const row = await upsertProfile({ userId: user.id, avatarUrl: blob.url });
    if (current?.avatarUrl) await deleteBlob(current.avatarUrl);

    return NextResponse.json({ data: row });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
