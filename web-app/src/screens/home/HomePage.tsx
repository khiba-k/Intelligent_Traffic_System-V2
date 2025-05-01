"use client";

import Header from "../Header/Header";
import Body from "./Body";

const HomePage = () => {
    return (
        <div className="flex flex-col h-screen">
            <section id="header" className="h-[80px] shrink-0">
                <Header />
            </section>

            <section id="body" className="flex-grow">
                <Body />
            </section>

            <section id="footer" className="h-[60px] shrink-0 bg-[#288066] flex justify-center items-center">
                <p className="text-center text-white text-sm md:text-base font-semibold">
                    Cultivating Smoother Journeys with Cutting-Edge Technology
                </p>
            </section>
        </div>
    );
};

export default HomePage;
