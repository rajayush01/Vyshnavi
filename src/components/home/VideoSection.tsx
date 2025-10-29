import React, { useRef, useEffect } from 'react';
import videoSrc from "../../assets/video1.mp4";

const VideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error: unknown) => {
        console.log('Autoplay prevented:', error);
      });
    }
  }, []);

  return (
    <div className="py-16 px-4 relative overflow-hidden bg-[#e0f2fe]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-10 right-10"></div>
        <div className="absolute w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-10 left-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center font-bold text-4xl text-black mb-10">
          From Farm to Family: <span className="text-blue-500">Our Purity Process</span>
        </div>

        {/* Video Container */}
        <div className="relative bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-200">
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover bg-black"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
