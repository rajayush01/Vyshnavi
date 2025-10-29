import React from 'react';

const ContinuousScroll = () => {
  const scrollItems = [
    "🥛 Farm Fresh Milk",
    "🧈 Pure Butter",
    "🧀 Artisan Cheese",
    "🍶 Organic Yogurt",
    "🥛 Premium Cream",
    "✨ 100% Natural",
    "❤️ Family Trusted",
    "🌟 Quality Assured"
  ];
  
  const scrollText = scrollItems.join(" • ") + " • ";
  
  return (
    <div className="w-full py-8">
      {/* Main scroll banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 shadow-xl">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"></div>
        
        <div className="py-6">
          <div className="flex animate-scroll-fast">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="text-2xl md:text-3xl font-bold text-white whitespace-nowrap flex items-center"
              >
                {scrollText}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom accent line with red highlight */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-red-500 to-cyan-500"></div>

        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-cyan-400 opacity-30"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-cyan-400 opacity-30"></div>
      </div>

      <style>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }
        
        .animate-scroll-fast {
          animation: scroll 25s linear infinite;
          display: flex;
        }
      `}</style>
    </div>
  );
};

export default ContinuousScroll;