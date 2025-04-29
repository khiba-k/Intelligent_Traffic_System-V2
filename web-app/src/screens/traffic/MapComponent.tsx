"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
// @ts-ignore
import "leaflet-routing-machine";

// Custom icons
const startIcon = L.icon({
    iconUrl: "start_marker.png", // Your starting point marker
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

const endIcon = L.icon({
    iconUrl: "end_marker.png", // Your destination marker
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

// Default Position
const DEFAULT_POSITION: L.LatLngExpression = [-29.3167, 27.4833]; // Lesotho center fallback

const RoutingMachine = ({
    fromPosition,
    toPosition,
}: {
    fromPosition: L.LatLngExpression;
    toPosition: L.LatLngExpression | null;
}) => {
    const map = useMap();
    const routingControlRef = useRef<any>(null);

    useEffect(() => {
        if (!map || !toPosition) return;

        // Remove old route if it exists
        if (routingControlRef.current) {
            try {
                map.removeControl(routingControlRef.current);
            } catch (error) {
                console.warn("Failed to remove previous route control:", error);
            }
        }

        // Create new route
        routingControlRef.current = L.Routing.control({
            waypoints: [L.latLng(fromPosition), L.latLng(toPosition)],
            routeWhileDragging: true,
            lineOptions: { styles: [{ color: "blue", weight: 4 }] },
        }).addTo(map);

        // Cleanup on unmount
        return () => {
            if (routingControlRef.current) {
                try {
                    map.removeControl(routingControlRef.current);
                } catch (error) {
                    console.warn("Cleanup error:", error);
                }
            }
        };
    }, [map, fromPosition, toPosition]);

    return null;
};

const MapComponent = () => {
    const [position, setPosition] = useState<L.LatLngExpression>(DEFAULT_POSITION);
    const [destination, setDestination] = useState("");
    const [toPosition, setToPosition] = useState<L.LatLngExpression | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition([latitude, longitude]);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                },
                {
                    enableHighAccuracy: true,
                }
            );
        } else {
            console.warn("Geolocation not available or running on server");
        }
    }, []);

    const handleSearch = async () => {
        if (!destination) return;

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
            const firstResult = data[0];
            setToPosition([parseFloat(firstResult.lat), parseFloat(firstResult.lon)]);
        } else {
            alert("Destination not found. Try something else.");
        }
    };

    return (
        <div style={{ height: "70vh", width: "100%", position: "relative" }}>
            {/* Search bar */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white p-4 rounded-xl shadow-md flex gap-2">
                <Input
                    type="text"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-64"
                />
                <Button onClick={handleSearch}>Find Route</Button>
            </div>

            {/* Map */}
            <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={position} icon={startIcon} />
                {toPosition && <Marker position={toPosition} icon={endIcon} />}
                {toPosition && <RoutingMachine fromPosition={position} toPosition={toPosition} />}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
