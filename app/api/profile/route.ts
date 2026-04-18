import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/server";
import { getProfile, upsertProfile } from "@/lib/db/queries/profiles";

const patchSchema = z.object({
  username: z.string().trim().min(2).max(32).optional().nullable(),
  fullName: z.string().trim().max(80).optional().nullable(),
  bio: z.string().trim().max(500).optional().nullable(),
});

export async function GET() {
  try {
    const user = await requireUser();
    const profile = await getProfile(user.id);
    return NextResponse.json({ data: profile });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await requireUser();
    const body = patchSchema.parse(await req.json());
    const row = await upsertProfile({ userId: user.id, ...body });
    return NextResponse.json({ data: row });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid body", issues: err.issues }, { status: 400 });
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
