import { redis } from "@/lib/db/redis"; // or wherever your Redis client is
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  const key = `route-stats:${userId}`;
  await redis.del(key);

  return NextResponse.json({ message: `Cleared cache for ${key}` });
}
