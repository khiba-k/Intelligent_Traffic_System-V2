"use client";
import Logo from "@/assets/TKT_logo.png";
import { useAuth, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import TrafficPage from "./TrafficPage";

const TrafficWrapper = () => {
    const { userId, isSignedIn } = useAuth();



    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <div className="flex flex-row justify-between h-[5%] bg-[#288066] pr-5">
                <Image
                    src={Logo}
                    alt="Logo"
                    className="object-cover h-10 w-10 sm:h-12 sm:w-12 ml-2"
                    priority
                />
                <UserButton />
            </div>

            {/* Fill the rest */}
            <div className="flex-1 relative bg-gradient-to-br from-white via-gray-400 to-white">
                <TrafficPage />
            </div>

            <div className="h-[5%] bg-[#288066] flex justify-center items-center">
                <p className="font-semibold text-center text-white text-xs sm:text-sm">
                    Cultivating Smoother Journeys with Cutting-Edge Technology
                </p>
            </div>
        </div>
    );
};

export default TrafficWrapper;
