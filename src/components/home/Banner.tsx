import React from 'react';

const Banner = () => {
  return (
    <div className="w-full">
      {/* Blue scroll banner */}
      <div className="relative overflow-hidden bg-white border-y-4 border-slate-200 shadow-inner">
        <div className="py-5">
          <div className="flex animate-scroll-reverse">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="text-xl md:text-2xl font-semibold whitespace-nowrap flex items-center"
              >
                <span className="text-slate-700">Fresh Daily</span>
                <span className="mx-6 text-cyan-500">•</span>
                <span className="text-blue-600">Premium Quality</span>
                <span className="mx-6 text-red-500">•</span>
                <span className="text-slate-700">Local Sourced</span>
                <span className="mx-6 text-cyan-500">•</span>
                <span className="text-blue-600">100% Pure</span>
                <span className="mx-6 text-red-500">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-reverse {
          from {
            transform: translateX(-33.333%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-scroll-reverse {
          animation: scroll-reverse 30s linear infinite;
          display: flex;
        }
      `}</style>
    </div>
  );
};

export default Banner;