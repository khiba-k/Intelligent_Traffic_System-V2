import { prisma } from "@/lib/db/prisma";
// import updateAndCacheRouteStats from "@/lib/db/updateSpeed";
import { redis } from "@/lib/db/redis";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { time } = await req.json();

    if (!time) {
      return NextResponse.json({ error: "Missing time" }, { status: 400 });
    }

    const latestDoc = await prisma.sensor1.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestDoc) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    await redis.set(`sensor1`, JSON.stringify(latestDoc.speed));

    return NextResponse.json({
      speed: latestDoc.speed,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
