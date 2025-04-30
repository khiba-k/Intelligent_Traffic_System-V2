"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import Cookies from "js-cookie";
import { useEffect } from "react";
import TrafficPage from "./TrafficPage";

const TrafficWrapper = () => {
    const { userId, isSignedIn } = useAuth();

    useEffect(() => {
        if (isSignedIn && userId && !Cookies.get("userId")) {
            Cookies.set("userId", userId, { path: "/", sameSite: "Lax" });
        }
    }, [isSignedIn, userId]);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex justify-end h-[5%] bg-[#288066] pr-5" >
                <UserButton />
            </div>
            <div className="h-[90%] bg-gradient-to-br from-white via-gray-400 to-white">
                <TrafficPage />
            </div>
            <div className="h-[5%] bg-[#288066] flex justify-center items-center">
                <p className="font-semibold text-center text-white">
                    Cultivating Smoother Journeys with Cutting-Edge Technology
                </p>
            </div>
        </div>
    );
};

export default TrafficWrapper;
