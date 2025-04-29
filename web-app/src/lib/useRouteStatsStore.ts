// useRouteStatsStore.ts
import { create } from "zustand";

type RouteSegment = {
  name: string;
  distance: number;
  duration: number;
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
