"use client"
import qrCode from "@/assets/frame.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { sweepRouteStats, useRouteStatsStore } from '@/lib/useRouteStatsStore';
import { useUser } from "@clerk/nextjs";
import { BookMarkedIcon, Search } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import RouteTable from "./StatsComponent";
import { handleRedisData, pollRedis } from "./utils/CachePoller";
import { saveSearch } from "./utils/SaveSearches";


// Dynamically import the MapComponent with SSR disabled
const MapComponent = dynamic(() => import("@/screens/traffic/MapComponent"), {
    ssr: false,
});

const TrafficPage = () => {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const { routeStats, setRouteStats, clearRouteStats } = useRouteStatsStore();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
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

    //Poll Redis for route stats
    useEffect(() => {
        sweepRouteStats(userId); // Clear route stats on mount

        const fetchAndHandle = async () => {
            const data = await pollRedis(userId);
            handleRedisData(data);
        };

        const initialDelay = 5000; // 5 seconds

        const timeout = setTimeout(() => {
            fetchAndHandle(); // First run after delay
            const interval = setInterval(fetchAndHandle, 15000); // Then poll every 15s

            // Save interval ID for cleanup
            intervalRef.current = interval;
        }, initialDelay);

        // Cleanup
        return () => {
            if (intervalRef.current !== null) clearInterval(intervalRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [userId]);

    const handleRouteStats = useCallback(
        async (routes: {
            name: string; distance: number; duration: number;
            speed: number;
            timeOfArrival: string;
        }[]) => {
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

    const saveSearchInfo = {
        userId: userId,
        startingPoint: origin.trim(),
        destination: destination.trim(),
    }


    return (
        <>
            <div className="w-full h-full relative">
                {/* For sm screens: Map as background */}
                <div className="lg:hidden absolute inset-0 z-0 w-full h-full">
                    <MapComponent
                        origin={searchParams.origin}
                        destination={searchParams.destination}
                        isSearchMode={searchParams.isSearchMode}
                        onRouteStats={handleRouteStats}
                    />
                </div>

                {/* For lg+ screens: Normal stacked layout */}
                <div className="hidden lg:flex h-full flex-row px-2 pt-6 pb-6 relative z-10">
                    <div className="h-full w-[12%] p-5">

                    </div>
                    <div className="flex flex-col justify-around w-[76%]">
                        <div className="w-full flex justify-center">
                            <div className="flex flex-col sm:flex-row gap-4 w-full">
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
                                <Button
                                    className="w-12 flex items-center justify-center"
                                    onClick={() => saveSearch(saveSearchInfo)}
                                >
                                    <BookMarkedIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="w-full h-[80%] pt-20">
                            <MapComponent
                                origin={searchParams.origin}
                                destination={searchParams.destination}
                                isSearchMode={searchParams.isSearchMode}
                                onRouteStats={handleRouteStats}
                            />
                        </div>

                        <div className="w-full">
                            <RouteTable routeStats={routeStats} />
                        </div>
                    </div>
                    <div className="h-full w-[12%] p-5"><Image
                        src={qrCode}
                        alt="QR Code"
                        className="object-cover"
                    /></div>
                </div>

                {/* For sm screens: Popover-triggered input form on top of map */}
                <div className="lg:hidden absolute top-4 left-4 z-10 w-full flex justify-center px-4">
                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                className="bg-black/70 text-white"
                                onClick={() => setIsPopoverOpen(true)}
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Search
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-gradient-to-b from-black to-transparent text-white border-none shadow-lg w-[90vw] space-y-4">
                            <Input
                                className="bg-white text-black"
                                placeholder="Current Location (optional)"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                            />
                            <Input
                                className="bg-white text-black"
                                placeholder="Destination"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                            <Button
                                onClick={() => {
                                    onSearch();                // ✅ Call your search logic
                                    setIsPopoverOpen(false);  // ✅ Close the popover
                                }}
                                className="w-full bg-[#288066] hover:bg-[#206852] text-white"
                            >
                                Search Route
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* For sm screens: Route table below the popover */}
                <div className="lg:hidden absolute bottom-4 w-full z-10 px-4">
                    <RouteTable routeStats={routeStats} />
                </div>
            </div>
        </>
    );
};

export default TrafficPage;