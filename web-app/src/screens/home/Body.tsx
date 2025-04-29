const Body = () => {
    const backgroundVideoUrl = 'https://videos.pexels.com/video-files/3063475/3063475-uhd_2560_1440_30fps.mp4';
    return (
        <div className="relative h-full w-full">
            {/* Video Background */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src={backgroundVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Dark Overlay */}
            <div className="absolute top-0 left-0 w-full h-full"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 py-12">
                <div className="max-w-4xl bg-white/10 bg-opacity-30 backdrop-blur-sm p-8 rounded-lg">
                    <h1 className="text-6xl md:text-7xl lg:text-8xl text-white text-center mb-8">
                        Welcome to TKT Smart Traffic
                    </h1>
                    <div className="text-white text-xl font-light mb-12">
                        TKT Smart Traffic is an innovative intelligent traffic management system designed to provide users with the most efficient routes to their destinations.
                        Leveraging advanced algorithms and real-time data analysis, our system dynamically adjusts to traffic conditions, ensuring minimal delays and optimal travel times.
                        Whether for daily commutes or special journeys, TKT Smart Traffic aims to enhance road safety, reduce congestion, and improve the overall travel experience for drivers.
                    </div>
                    <div className="flex justify-center">
                        <a
                            href="/traffic"
                            style={{
                                textDecoration: "none",
                            }}
                            className="bg-[#288066] text-xl hover:bg-[#1e6350] text-white font-medium py-3 px-6 rounded transition-colors duration-300 no-underline"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Body;