import dynamic from 'next/dynamic';
// import MapComponent from "./MapComponent";

const MapComponent = dynamic(() => import('@/screens/traffic/MapComponent'), {
    ssr: false
});

const TrafficPage = () => {
    return (
        <div className="flex flex-row justify-center items-center">
            <div id="tabs-container" >

            </div>
            <div id="map-container" className="w-[70%]"><MapComponent />
            </div>
            <div id="empty-container" ></div>

        </div>
    )
}

export default TrafficPage
