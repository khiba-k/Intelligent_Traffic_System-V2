// app/api/cache-route-stats/route.ts
import { redis } from "@/lib/db/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json(); // Parse the JSON body
  console.log("Body:  ", body);

  const { userId, stats } = body;

  if (!userId || !Array.isArray(stats)) {
    return NextResponse.json(
      { error: "Missing userId or stats" },
      { status: 400 }
    );
  }

  await redis.set(`route-stats:${userId}`, JSON.stringify(stats));

  return NextResponse.json({ message: "Cached successfully" });
}
