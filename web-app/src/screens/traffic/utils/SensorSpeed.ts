import { useRouteStatsStore } from "@/lib/useRouteStatsStore";

const updateSpeed = (speed: number) => {
  const { routeStats, setRouteStats } = useRouteStatsStore.getState();

  console.log("****Speed:", speed);
  console.log("****Routes stats:", routeStats);

  if (!routeStats || routeStats.length === 0 || speed <= 0) return;

  const updatedStats = routeStats.map((segment) => {
    const newDuration = (segment.distance / speed) * 60; // km / (km/h) * 60 = minutes
    return {
      ...segment,
      duration: newDuration,
    };
  });

  setRouteStats(updatedStats);
};

export default updateSpeed;
