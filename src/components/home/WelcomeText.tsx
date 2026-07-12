import React from "react";
import { Milk, Sparkles, Leaf, Clock, ShieldCheck, Award } from "lucide-react";
import "../../fonts.css";

const badges = [
  { icon: <Leaf className="w-4 h-4" />, label: "Farm Fresh" },
  { icon: <ShieldCheck className="w-4 h-4" />, label: "Lab Tested Pure" },
  { icon: <Clock className="w-4 h-4" />, label: "6-Hour Delivery" },
  { icon: <Award className="w-4 h-4" />, label: "Zero Preservatives" },
  { icon: <Milk className="w-4 h-4" />, label: "A2 Milk Available" },
];

const WelcomeText = () => {
  return (
    <div className="relative py-24 sm:py-28 overflow-hidden -mb-16">
      {/* Soft animated dairy background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-cyan-100/60 via-blue-50/40 to-transparent blur-3xl" />
        <svg className="absolute bottom-0 left-0 w-full h-48 opacity-10 text-black" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#bae6fd" d="M0,192L80,208C160,224,320,256,480,245.3C640,235,800,181,960,170.7C1120,160,1280,192,1360,208L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
        <div className="absolute top-10 left-10 opacity-10 rotate-12">
          <Milk className="w-24 h-24 text-cyan-600" />
        </div>
        <Sparkles className="absolute top-20 right-10 text-cyan-400 opacity-40 animate-pulse w-10 h-10" />
        <Sparkles className="absolute bottom-32 left-20 text-blue-300 opacity-30 animate-pulse w-8 h-8" />
      </div>

      {/* Foreground Content */}
      <div className="max-w-5xl mx-auto relative z-10 px-4">
        <div className="text-center space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-blue-100 shadow-[0_2px_20px_-4px_rgba(37,99,235,0.15)]">
            <svg width="10" height="12" viewBox="0 0 32 40" fill="none">
              <path d="M16 2 C22 14 28 20 28 28 C28 34.6 22.6 40 16 40 C9.4 40 4 34.6 4 28 C4 20 10 14 16 2 Z" fill="#2563eb" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-700">
              Since the first pour
            </span>
          </div>

          <h1 className="text-4xl cinzel sm:text-5xl md:text-6xl lg:text-5xl font-black leading-[1.08] tracking-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600">
              Pure. Fresh. <span className="text-[#FF0000]">Vyshnavi</span>
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-slate-500 text-base sm:text-lg leading-relaxed font-medium">
            Milk drawn from trusted farms, delivered before the day begins —
            crafted for households who taste the difference.
          </p>
        </div>
      </div>

      {/* Trust badge marquee */}
      <div className="relative z-10 mt-14 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="flex w-max animate-marquee gap-4 py-1">
          {[...badges, ...badges, ...badges].map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-blue-50 shadow-[0_8px_20px_-14px_rgba(37,99,235,0.4)] whitespace-nowrap"
            >
              <span className="text-blue-600">{b.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wide text-slate-600">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marqueeScroll 22s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default WelcomeText;