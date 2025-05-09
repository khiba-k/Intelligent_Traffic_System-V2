import { Sensor1Schema, Sensor1Type } from "@/lib/db/db_types";
import { prisma } from "@/lib/db/prisma"; // Adjust to your actual prisma client path

// Create Sensor1 Data
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

// Create Sensor2 Data
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

// Save user searches

type SaveSearchInput = {
  userId: string;
  startingPoint: string;
  destination: string;
};

export async function saveSearch({
  userId,
  startingPoint,
  destination,
}: SaveSearchInput) {
  try {
    const newSearch = await prisma.savedSearches.create({
      data: {
        userId,
        startingPoint,
        destination,
      },
    });

    return { success: true, data: newSearch };
  } catch (error) {
    console.error("Error saving search:", error);
    return { success: false, error: "Could not save search" };
  }
}
