import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { deleteReview } from "@/lib/db/queries/reviews";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const row = await deleteReview(user.id, id);
    if (!row) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ data: { removed: true } });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
