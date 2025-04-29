"use client"
import TrafficPage from "@/screens/traffic/TrafficPage"

const page = () => {
    return (
        <div className="flex flex-col h-screen">
            <div className="h-1/12">This is for the header</div>
            <div className="h-10/12"><TrafficPage /></div>
            <div className="h-1/12">This is for the footer</div>
        </div>
    )
}

export default page
