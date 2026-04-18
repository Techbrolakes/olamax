import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/server";
import { isOnWatchlist, removeFromWatchlist } from "@/lib/db/queries/watchlist";

export async function GET(_req: Request, { params }: { params: Promise<{ movieId: string }> }) {
  try {
    const user = await requireUser();
    const { movieId } = await params;
    const on = await isOnWatchlist(user.id, Number(movieId));
    return NextResponse.json({ data: { onWatchlist: on } });
  } catch {
    return NextResponse.json({ data: { onWatchlist: false } });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ movieId: string }> }) {
  try {
    const user = await requireUser();
    const { movieId } = await params;
    await removeFromWatchlist(user.id, Number(movieId));
    return NextResponse.json({ data: { removed: true } });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
