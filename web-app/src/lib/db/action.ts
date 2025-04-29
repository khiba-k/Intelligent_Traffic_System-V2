import { Sensor1Schema, Sensor1Type } from "@/lib/db/db_types";
import { prisma } from "@/lib/db/prisma"; // Adjust to your actual prisma client path

export async function createSensor1(data: Sensor1Type) {
  try {
    const parsed = Sensor1Schema.parse(data);

    return await prisma.sensor1.create({
      data: {
        speed: parsed.speed,
      },
    });
  } catch (error: any) {
    throw new error();
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
