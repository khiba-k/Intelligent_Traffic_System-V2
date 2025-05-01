"use client";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
// @ts-ignore
import "leaflet-routing-machine";

// Custom Icons
const startIcon = L.icon({
    iconUrl: "start_marker.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

const endIcon = L.icon({
    iconUrl: "end_marker.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

L.Routing.osrmv1 = function (options: any) {
    return new L.Routing.OSRMv1({
        serviceUrl: options.serviceUrl || "https://router.project-osrm.org/route/v1",
        profile: options.profile || "driving",
        timeout: options.timeout || 30 * 1000,
        showAlternatives: options.showAlternatives || false,
        alternatives: options.alternatives || false,
    });
};

// Default fallback position
const DEFAULT_POSITION: L.LatLngExpression = [-29.3167, 27.4833];

// 🧭 Component to re-center map after coordinates load
const RecenterMap = ({ coords }: { coords: L.LatLngExpression }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(coords, 13);
    }, [coords, map]);
    return null;
};

// 🗺️ Routing logic
const RoutingMachine = ({
    fromPosition,
    toPosition,
    isSearchMode,
    onRouteStats,
}: {
    fromPosition: L.LatLngExpression;
    toPosition: L.LatLngExpression | null;
    isSearchMode: boolean;
    onRouteStats?: (stats: {
        name: string; distance: number; duration: number;
        speed: number;
        timeOfArrival: string;
    }[]) => void;
}) => {
    const map = useMap();
    const routingControlRef = useRef<any>(null);

    useEffect(() => {
        if (!map || !toPosition || !isSearchMode) {
            // Remove any existing route if we're not in search mode
            if (routingControlRef.current) {
                try {
                    map.removeControl(routingControlRef.current);
                    routingControlRef.current = null;
                } catch (error) {
                    console.warn("Failed to remove previous route control:", error);
                }
            }
            return;
        }

        // Always clear previous route if it exists
        if (routingControlRef.current) {
            try {
                map.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            } catch (error) {
                console.warn("Failed to remove previous route control:", error);
            }
        }

        // Create a new routing control
        const control = L.Routing.control({
            waypoints: [L.latLng(fromPosition), L.latLng(toPosition)],
            routeWhileDragging: false,
            showAlternatives: false,
            lineOptions: { styles: [{ color: "blue", weight: 4 }] },
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            createMarker: () => null,
            router: L.Routing.osrmv1({
                serviceUrl: "https://router.project-osrm.org/route/v1",
                showAlternatives: false,
                alternatives: false,
            }),
        })
            .on("routesfound", function (e: any) {
                const routes = e.routes;
                if (!routes || routes.length === 0) return;

                const routeSummaries: { name: string; distance: number; duration: number; speed: number; timeOfArrival: string }[] = [];

                routes.forEach((route: any) => {
                    const seen = new Set<string>();
                    const importantRoads: string[] = [];

                    // Prefer instructions first
                    if (route.instructions && route.instructions.length > 0) {
                        route.instructions.forEach((instruction: any) => {
                            const text = instruction.text;
                            const roadMatch = text.match(/onto\s(.+?)(?:,|$)/i);
                            if (roadMatch) {
                                const roadName = roadMatch[1].trim();
                                if (!seen.has(roadName)) {
                                    seen.add(roadName);
                                    importantRoads.push(roadName);
                                }
                            }
                        });
                    }

                    // Fallback to segments if instructions are empty
                    if (importantRoads.length === 0 && route.segments) {
                        route.segments.forEach((seg: any) => {
                            if (seg.road && !seen.has(seg.road)) {
                                seen.add(seg.road);
                                importantRoads.push(seg.road);
                            }
                        });
                    }

                    // Pick the important road names to summarize the route
                    let summaryName = "Unnamed Route";
                    if (importantRoads.length === 1) {
                        summaryName = importantRoads[0];
                    } else if (importantRoads.length >= 2) {
                        summaryName = `${importantRoads[0]}, ${importantRoads[1]}`;
                    }

                    const now = new Date();
                    routeSummaries.push({
                        name: summaryName,
                        distance: route.summary?.totalDistance || route.summary?.distance || 0,
                        duration: route.summary?.totalTime || route.summary?.duration || 0,
                        speed: 0,
                        timeOfArrival: new Date(now.getTime() + (route.summary?.totalTime || route.summary?.duration || 0) * 1000).toISOString(),
                    });
                });

                // Send extracted route stats up
                if (onRouteStats) {
                    onRouteStats(routeSummaries);
                }
            })
            .addTo(map);

        routingControlRef.current = control;

        return () => {
            // Cleanup on unmount or dependency change
            if (routingControlRef.current) {
                try {
                    map.removeControl(routingControlRef.current);
                    routingControlRef.current = null;
                } catch (error) {
                    console.warn("Cleanup error:", error);
                }
            }
        };
    }, [map, fromPosition, toPosition, isSearchMode, onRouteStats]);


    return null;
};

// 🗺️ Main component
const MapComponent = ({
    origin,
    destination,
    isSearchMode = false,
    onRouteStats,
}: {
    origin?: string;
    destination?: string;
    isSearchMode?: boolean;
    onRouteStats?: (stats: { name: string; distance: number; duration: number; speed: number; timeOfArrival: string }[]) => void;
}) => {
    const [fromCoords, setFromCoords] = useState<L.LatLngExpression>(DEFAULT_POSITION);
    const [toCoords, setToCoords] = useState<L.LatLngExpression | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const getCurrentLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const { latitude, longitude } = pos.coords;
                        setFromCoords([latitude, longitude]);
                        setIsLoading(false);
                    },
                    (err) => {
                        console.log("Geolocation error:", err);
                        setIsLoading(false);
                    },
                    { enableHighAccuracy: true }
                );
            } else {
                console.warn("Geolocation not supported.");
                setIsLoading(false);
            }
        };

        getCurrentLocation();
    }, []);

    useEffect(() => {
        if (!isSearchMode) {
            setToCoords(null);
            return;
        }

        const resolveCoordinates = async () => {
            setIsLoading(true);
            try {
                if (origin) {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                            origin
                        )}`
                    );
                    const data = await res.json();
                    if (data.length > 0) {
                        setFromCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                    } else {
                        alert("Origin not found.");
                    }
                }

                if (destination) {
                    const resDest = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                            destination
                        )}`
                    );
                    const dataDest = await resDest.json();
                    if (dataDest.length > 0) {
                        setToCoords([parseFloat(dataDest[0].lat), parseFloat(dataDest[0].lon)]);
                    } else {
                        alert("Destination not found.");
                    }
                } else {
                    setToCoords(null);
                }
            } catch (error) {
                console.error("Error fetching coordinates:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isSearchMode && (origin || destination)) {
            resolveCoordinates();
        }
    }, [origin, destination, isSearchMode]);

    return (
        <div className="w-full h-full lg:h-[50vh] rounded-lg overflow-hidden border">
            <MapContainer
                center={fromCoords}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"

                />
                <RecenterMap coords={fromCoords} />
                <Marker position={fromCoords} icon={startIcon} />
                {isSearchMode && toCoords && (
                    <Marker position={toCoords} icon={endIcon} />
                )}
                <RoutingMachine
                    fromPosition={fromCoords}
                    toPosition={toCoords}
                    isSearchMode={isSearchMode}
                    onRouteStats={onRouteStats}
                />
            </MapContainer>
        </div>
    );
};

export default MapComponent;
