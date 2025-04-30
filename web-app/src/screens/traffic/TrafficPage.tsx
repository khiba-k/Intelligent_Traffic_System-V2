"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouteStatsStore } from '@/lib/useRouteStatsStore';
import { useUser } from "@clerk/nextjs";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import RouteTable from "./StatsComponent";

// Dynamically import the MapComponent with SSR disabled
const MapComponent = dynamic(() => import("@/screens/traffic/MapComponent"), {
    ssr: false,
});

const TrafficPage = () => {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const { routeStats, setRouteStats, clearRouteStats } = useRouteStatsStore();
    const [searchParams, setSearchParams] = useState<{
        origin: string | undefined;
        destination: string | undefined;
        isSearchMode: boolean;
    }>({
        origin: undefined,
        destination: undefined,
        isSearchMode: false
    });

    const { user, isLoaded } = useUser();
    const userId = user?.id;

    // Log userId to ensure it's available
    useEffect(() => {
        if (isLoaded) {
            console.log("User ID loaded:", userId);
        }
    }, [isLoaded, userId]);

    const handleRouteStats = useCallback(
        async (routes: { name: string; distance: number; duration: number }[]) => {
            setRouteStats(routes);

            // Only make API call if userId is available
            if (userId) {
                try {
                    const response = await fetch("/api/cache-route-stats", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ userId, stats: routes }),
                    });

                    if (!response.ok) {
                        console.error("Failed to cache route stats:", await response.text());
                    }
                } catch (error) {
                    console.error("Error caching route stats:", error);
                }
            } else {
                console.warn("User ID not available. Route stats will not be cached.");
            }
        },
        [userId, setRouteStats] // Include userId in dependencies
    );

    const onSearch = () => {
        if (!destination) {
            alert("Please enter a destination.");
            return;
        }

        setSearchParams({
            origin: origin.trim() || undefined,
            destination: destination.trim(),
            isSearchMode: true
        });
    };

    return (
        <>
            <div className="w-full flex justify-center py-4">
                <div className="flex flex-row gap-4 w-[80%]">
                    <Input
                        className="bg-white"
                        placeholder="Current Location (optional)"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                    />
                    <Input
                        className="bg-white"
                        placeholder="Destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                    <Button
                        className="w-12 flex items-center justify-center"
                        onClick={onSearch}
                    >
                        <Search className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col items-center p-4 gap-32">
                <div className="pt-5 w-[80%] h-[80%]">
                    <MapComponent
                        origin={searchParams.origin}
                        destination={searchParams.destination}
                        isSearchMode={searchParams.isSearchMode}
                        onRouteStats={handleRouteStats}
                    />
                </div>
                <div className="w-[80%]">
                    <RouteTable routeStats={routeStats} />
                </div>
            </div>
        </>
    );
};

export default TrafficPage;