import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth/server";
import {
  getUserReviewForMovie,
  listReviewsForMovie,
  listReviewsForUser,
  upsertReview,
} from "@/lib/db/queries/reviews";

const upsertSchema = z.object({
  movieId: z.number().int().positive(),
  rating: z.number().int().min(1).max(10),
  comment: z.string().max(2000).default(""),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const movieIdParam = searchParams.get("movieId");
  const scope = searchParams.get("scope");

  if (movieIdParam) {
    const movieId = Number(movieIdParam);
    const items = await listReviewsForMovie(movieId);
    if (scope === "mine") {
      try {
        const user = await requireUser();
        const mine = await getUserReviewForMovie(user.id, movieId);
        return NextResponse.json({ data: { items, mine } });
      } catch {
        return NextResponse.json({ data: { items, mine: null } });
      }
    }
    return NextResponse.json({ data: { items } });
  }

  try {
    const user = await requireUser();
    const items = await listReviewsForUser(user.id);
    return NextResponse.json({ data: items });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = upsertSchema.parse(await req.json());
    const row = await upsertReview({ userId: user.id, ...body });
    return NextResponse.json({ data: row });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid body" }, { status: 400 });
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
