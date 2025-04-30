// app/api/sensor1/deleteAll/route.ts

import { prisma } from "@/lib/db/prisma"; // Adjust if prisma client is in a different location
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    await prisma.sensor1.deleteMany({});
    return NextResponse.json(
      { message: "All documents in Sensor1 deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { message: "Failed to delete documents" },
      { status: 500 }
    );
  }
}
