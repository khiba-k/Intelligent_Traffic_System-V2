// components/RouteTable.tsx
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Gauge, Hourglass } from "lucide-react";

type Route = {
    name: string;
    distance: number;
    duration: number;
    speed: number;
    timeOfArrival: string;
};;

export default function RouteTable({ routeStats }: { routeStats: Route[] }) {
    if (!routeStats || routeStats.length === 0) return null;

    return (
        <Card className="p-4 bg-white/0 lg:bg-white border-none shadow-none">
            {/* Mobile layout */}
            <div className="flex flex-col gap-4 lg:hidden bg-white-10">
                {routeStats.map((route, index) => (
                    <div key={index} className="border rounded-lg p-3 shadow-sm bg-gray-50">
                        <p className="font-semibold text-base mb-2">{route.name}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                            <div className="flex items-center gap-1">
                                <Gauge size={14} className="text-muted-foreground" />
                                {route.speed} km/h
                            </div>
                            <div>
                                Distance: {(route.distance / 1000).toFixed(2)} km
                            </div>
                            <div>
                                Arrival: {new Date(route.timeOfArrival).toLocaleTimeString()}
                            </div>
                            <div className="flex items-center gap-1">
                                <Hourglass size={14} className="text-muted-foreground" />
                                {Math.round(route.duration / 60)} min
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop table layout */}
            <Table className="w-full text-sm hidden lg:table">
                <TableBody>
                    {routeStats.map((route, index) => (
                        <TableRow key={index} className="border-b">
                            <TableCell>{route.name}</TableCell>
                            <TableCell className="flex items-center gap-1 whitespace-nowrap">
                                <Gauge size={16} className="text-muted-foreground" />
                                {route.speed} km/h
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                Distance: {(route.distance / 1000).toFixed(2)} km
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                Arrival: {new Date(route.timeOfArrival).toLocaleTimeString()}
                            </TableCell>
                            <TableCell className="flex items-center gap-1 whitespace-nowrap">
                                <Hourglass size={16} className="text-muted-foreground" />
                                {Math.round(route.duration / 60)} min
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
