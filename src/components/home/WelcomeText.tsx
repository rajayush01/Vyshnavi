import React from "react";
import { Milk, Sparkles } from "lucide-react";
import "../../fonts.css";

const WelcomeText = () => {
  return (
    <div className="relative py-20 px-4 overflow-hidden -mb-16">
      {/* Soft animated dairy background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blurred gradient blobs */}
        
        {/* Milk splash illustration (SVG) */}
        <svg
          className="absolute bottom-0 left-0 w-full h-48 opacity-10 text-black"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#bae6fd"
            d="M0,192L80,208C160,224,320,256,480,245.3C640,235,800,181,960,170.7C1120,160,1280,192,1360,208L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>

        {/* Faint milk bottle */}
        <div className="absolute top-10 left-10 opacity-10 rotate-12">
          <Milk className="w-24 h-24 text-cyan-600" />
        </div>

        {/* Decorative cow pattern spots */}
        <div className="absolute top-1/3 left-1/3 w-24 h-16 bg-white opacity-10 rounded-full rotate-[25deg]"></div>
        <div className="absolute top-2/3 right-1/4 w-20 h-12 bg-white opacity-10 rounded-full rotate-[15deg]"></div>
        <div className="absolute bottom-1/4 left-1/5 w-16 h-10 bg-white opacity-10 rounded-full rotate-[30deg]"></div>

        {/* Small floating sparkles */}
        <Sparkles className="absolute top-20 right-10 text-cyan-400 opacity-40 animate-pulse w-10 h-10" />
        <Sparkles className="absolute bottom-32 left-20 text-blue-300 opacity-30 animate-pulse w-8 h-8" />
      </div>

      {/* Foreground Content */}
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center space-y-6">
          <h1 className="text-4xl cinzel sm:text-5xl md:text-6xl lg:text-3xl font-black leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600">
              Pure. Fresh. <span className="text-[#FF0000]">Vyshnavi</span>
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default WelcomeText;
