// lib/validation.ts

import { z } from "zod";

// Sensor1 Schema
export const Sensor1Schema = z.object({
  _id: z.string().optional(),
  speed: z.number().default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type Sensor1Type = z.infer<typeof Sensor1Schema>;

// Sensor2 Schema
export const Sensor2Schema = z.object({
  _id: z.string().optional(),
  speed: z.number().default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type Sensor2Type = z.infer<typeof Sensor2Schema>;

// Users Schema
export const UsersSchema = z.object({
  _id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  userId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type UsersType = z.infer<typeof UsersSchema>;

// SavedSearches Schema
export const SavedSearchesSchema = z.object({
  _id: z.string().optional(),
  startingPoint: z.string(),
  destination: z.string(),
  userId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type SavedSearchesType = z.infer<typeof SavedSearchesSchema>;
