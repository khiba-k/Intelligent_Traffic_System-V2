import { Sensor1Schema, Sensor1Type } from "@/lib/db/db_types";
import { prisma } from "@/lib/db/prisma"; // Adjust to your actual prisma client path

export async function createSensor1(data: Sensor1Type) {
  try {
    console.log("Data: ", data);

    // Assuming you're using Zod for validation, ensure the createdAt field is parsed correctly
    const parsed = Sensor1Schema.parse({
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(), // Convert the string to Date or use current date as fallback
    });

    console.log("Parsed: ", parsed);

    return await prisma.sensor1.create({
      data: {
        speed: parsed.speed,
        createdAt: parsed.createdAt, // Save as a Date object
      },
    });
  } catch (error: any) {
    console.error("Error in createSensor1: ", error);
    throw error; // Re-throw the actual caught error
  }
}

export async function createSensor2(data: Sensor1Type) {
  try {
    const parsed = Sensor1Schema.parse(data);

    return await prisma.sensor2.create({
      data: {
        speed: parsed.speed,
      },
    });
  } catch (error: any) {
    throw new error();
  }
}
