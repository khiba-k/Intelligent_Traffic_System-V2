import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { time } = await req.json();

    if (!time) {
      return NextResponse.json({ error: "Missing time" }, { status: 400 });
    }

    console.log("🚗 Vehicle detected at:", time);

    return NextResponse.json({ message: "Vehicle detection received successfully." });
  } catch (err) {
    console.error("[ERROR] /api/camera crash:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

