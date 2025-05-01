// src/app/traffic/page.tsx
'use client'; // Make sure this is a client-side component

import TrafficWrapper from "@/screens/traffic/TrafficWrapper";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const { userId, isLoaded } = useAuth();
    const router = useRouter();

    // Redirect to login if the user is not authenticated
    useEffect(() => {
        if (isLoaded && !userId) {
            router.push("/login");
        }
    }, [isLoaded, userId, router]);


    return <TrafficWrapper />;
}
