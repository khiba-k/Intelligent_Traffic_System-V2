import { saveSearch } from "@/lib/db/action";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { userId, startingPoint, destination } = body;

  if (!userId || !startingPoint || !destination) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const result = await saveSearch({ userId, startingPoint, destination });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data, { status: 201 });
}
