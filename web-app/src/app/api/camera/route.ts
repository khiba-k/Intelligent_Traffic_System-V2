import { prisma } from "@/lib/db/prisma";
// import updateAndCacheRouteStats from "@/lib/db/updateSpeed";
import { redis } from "@/lib/db/redis";
import { differenceInMilliseconds } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { time } = await req.json();

    if (!time) {
      return NextResponse.json({ error: "Missing time" }, { status: 400 });
    }

    const targetTime = new Date(time);
    console.log("Target Time (UTC):", targetTime.toISOString());

    const recentDocs = await prisma.sensor1.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    if (recentDocs.length === 0) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    const closest = recentDocs.reduce((prev, curr) => {
      const prevDiff = Math.abs(
        differenceInMilliseconds(new Date(prev.createdAt), targetTime)
      );
      const currDiff = Math.abs(
        differenceInMilliseconds(new Date(curr.createdAt), targetTime)
      );

      if (prevDiff > 5 * 60 * 1000) return curr;
      if (currDiff > 5 * 60 * 1000) return prev;

      return currDiff < prevDiff ? curr : prev;
    });

    await redis.set(`sensor1`, JSON.stringify(closest.speed));

    return NextResponse.json({
      time: targetTime.toISOString(),
      speed: closest.speed,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
