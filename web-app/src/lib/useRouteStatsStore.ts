// useRouteStatsStore.ts
import { create } from "zustand";

type RouteSegment = {
  name: string;
  distance: number;
  duration: number;
  speed: number;
  timeOfArrival: string;
};

type RouteStatsStore = {
  routeStats: RouteSegment[];
  setRouteStats: (stats: RouteSegment[]) => void;
  clearRouteStats: () => void;
};

export const useRouteStatsStore = create<RouteStatsStore>((set) => ({
  routeStats: [],
  setRouteStats: (stats) => set({ routeStats: stats }),
  clearRouteStats: () => set({ routeStats: [] }),
}));

export const sweepRouteStats = async (userId?: string) => {
  try {
    const res = await fetch("/api/clear-route-stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      console.log("Failed to clear cache");
      return;
    }

    const data = await res.json();
    console.log("✅ Cache cleared:", data.message);
  } catch (error) {
    console.error("❌ Error clearing cache:", error);
  }
};
