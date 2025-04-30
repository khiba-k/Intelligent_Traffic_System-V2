// components/RouteTable.tsx
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Gauge, Hourglass } from "lucide-react";

type Route = {
    name: string;
    distance: number;
    duration: number;
};

export default function RouteTable({ routeStats }: { routeStats: Route[] }) {
    if (!routeStats || routeStats.length === 0) return null;

    return (
        <Card className="p-4 bg-white border-none shadow-md">
            <Table className="w-full text-sm">
                <TableBody>
                    {routeStats.map((route, index) => (
                        <TableRow key={index} className="border-b">
                            <TableCell>{route.name}</TableCell>
                            <TableCell className="flex items-center gap-1">
                                <Gauge size={16} className="text-muted-foreground" />
                                {/* Placeholder for speed */}
                                0 km/h
                            </TableCell>
                            <TableCell>
                                Distance: {(route.distance / 1000).toFixed(2)} km
                            </TableCell>
                            <TableCell>Arrival Time: --:--</TableCell>
                            <TableCell className="flex items-center gap-1">
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
