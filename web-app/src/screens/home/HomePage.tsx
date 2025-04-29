"use client";

import Header from "../Header/Header";
import Body from "./Body";

const HomePage = () => {
    return (
        <div className="flex flex-col h-screen border-red-200">
            <section id="header" className="h-1/12">
                <Header />
            </section>
            <section className="h-10/12 bg-gray-600" id="body">
                <Body />
            </section>
            <section id="footer" className="bg-[#288066] h-1/12 flex justify-center items-center">
                <p className="text-lg font-semibold" style={{ textAlign: "center", color: "white" }}>Cultivating Smoother Journeys with Cutting-Edge Technology</p>
            </section>
        </div>
    )
}

export default HomePage;
