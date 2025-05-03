import { useRouteStatsStore } from "@/lib/useRouteStatsStore";

export const pollRedis = async (userId?: string) => {
  try {
    const res = await fetch("/api/poll-cache", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (res.status === 204) return; // No route data

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Polling failed:", error);
  }
};

export const handleRedisData = (data: any) => {
  if (!data || !Array.isArray(data.routeStats) || data.routeStats.length === 0)
    return;

  const { routeStats, sensorValue } = data;

  const first = routeStats[0];
  const speed = Number(sensorValue); // assuming km/h
  const distance = first.distance / 1000; // meters to km

  const newDuration = (distance / speed) * 3600; // seconds

  const newArrivalTime = new Date(
    Date.now() + newDuration * 1000
  ).toISOString();

  const updatedRouteStats = [
    {
      ...first,
      duration: newDuration,
      speed: speed,
      timeOfArrival: newArrivalTime,
    },
    ...routeStats.slice(1),
  ];

  // Update Zustand store
  useRouteStatsStore.getState().setRouteStats(updatedRouteStats);
};
