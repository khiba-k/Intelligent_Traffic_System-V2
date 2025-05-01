// app/api/polling/route.ts
import { redis } from "@/lib/db/redis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  const routeStats = await redis.get(`route-stats:${userId}`);
  const sensorValue = await redis.get("sensor1");

  if (!routeStats) {
    // Correctly return 204 *without* a body
    return new Response(null, { status: 204 });
  }

  return NextResponse.json({ routeStats, sensorValue });
}
