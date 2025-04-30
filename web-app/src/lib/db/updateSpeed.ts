import { redis } from "@/lib/db/redis"; // Assuming redis is properly configured

// Function to update speed and recache stats
const updateAndCacheRouteStats = async (
  userId: string | null,
  speed: number
) => {
  // Fetch the cached stats for the user
  const cachedStats = await redis.get(`route-stats:${userId}`);

  if (!cachedStats) {
    throw new Error("No cached data found for user");
  }

  // Parse the cached stats
  const stats = JSON.parse(
    typeof cachedStats === "string" ? cachedStats : JSON.stringify(cachedStats)
  );

  // Update the first route segment with the new speed
  const updatedStats = stats.map(
    (
      segment: { name: string; distance: number; duration: number },
      index: number
    ) => {
      if (index === 0 && speed > 0) {
        // Recalculate the duration using the new speed
        const newDuration = (segment.distance / speed) * 60; // km / (km/h) * 60 = minutes
        return { ...segment, duration: newDuration };
      }
      return segment;
    }
  );

  // Recache the updated stats
  await redis.set(`route-stats:${userId}`, JSON.stringify(updatedStats));
};

export default updateAndCacheRouteStats;
