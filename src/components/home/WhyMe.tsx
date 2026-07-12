// WhyMe.tsx
import React from 'react';
import { Leaf, Sparkles, Package, Heart, ShieldCheck } from 'lucide-react';
import "../../fonts.css";

export default function WhyMe() {
  const features = [
    {
      icon: <Leaf className="w-7 h-7" />,
      title: "Farm-Fresh Dairy",
      description: "Pure milk and dairy straight from local farms, collected before sunrise so nothing sits waiting.",
      big: true,
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "100% Natural Goodness",
      description: "No preservatives, additives, or artificial flavors — ever.",
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Hygienic Packaging",
      description: "Sealed to maintain freshness and purity from farm to fridge.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Rich in Nutrition",
      description: "Packed with calcium, protein, and vitamins your family needs.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Trusted Quality",
      description: "Tested for purity, safety, and taste at every step.",
    },
  ];

  const bigFeature = features[0];
  const restFeatures = features.slice(1);

  return (
    <section className="relative w-full overflow-hidden bg-white py-20 sm:py-24 px-4">
      {/* Decorative dairy illustrations */}
      <svg className="hidden md:block absolute top-10 left-[5%] w-16 h-16 opacity-70 animate-float-slow" viewBox="0 0 64 64" fill="none">
        <path d="M26 10 L38 10 L38 18 L42 24 L42 56 L22 56 L22 24 L26 18 Z" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
        <rect x="22" y="30" width="20" height="10" fill="#dbeafe" />
        <rect x="24" y="6" width="16" height="4" rx="1" fill="#3b82f6" />
      </svg>
      <svg className="hidden md:block absolute bottom-8 right-[6%] w-20 h-20 opacity-70 animate-float" viewBox="0 0 64 64" fill="none">
        <ellipse cx="32" cy="38" rx="22" ry="14" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
        <circle cx="16" cy="30" r="3" fill="#ef4444" />
        <circle cx="30" cy="26" r="3" fill="#ef4444" />
        <circle cx="42" cy="32" r="2.5" fill="#ef4444" />
        <circle cx="22" cy="42" r="2" fill="#ef4444" />
        <ellipse cx="14" cy="38" rx="6" ry="8" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
      </svg>

      <div className="relative max-w-7xl mx-auto">
        {/* Eyebrow */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100">
            <svg width="9" height="11" viewBox="0 0 32 40" fill="none">
              <path d="M16 2 C22 14 28 20 28 28 C28 34.6 22.6 40 16 40 C9.4 40 4 34.6 4 28 C4 20 10 14 16 2 Z" fill="#2563eb" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-700">
              The Vyshnavi Standard
            </span>
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-semibold text-center mb-14 sm:mb-16 text-black cinzel tracking-tight">
          Why <span className="text-blue-600">Vyshnavi Dairy</span>?
        </h2>

        {/* Bento grid: one large feature + rest in a side grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Large feature card */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-9 flex flex-col justify-between min-h-[280px] shadow-[0_30px_60px_-25px_rgba(37,99,235,0.55)]">
            <svg className="absolute -bottom-6 -right-6 w-40 h-40 opacity-15" viewBox="0 0 64 64" fill="none">
              <path d="M32 6 C40 22 50 30 50 42 C50 52 42 58 32 58 C22 58 14 52 14 42 C14 30 24 22 32 6 Z" fill="#ffffff" />
            </svg>
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-6">
                {bigFeature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">{bigFeature.title}</h3>
              <p className="text-blue-50/90 leading-relaxed text-[15px]">{bigFeature.description}</p>
            </div>
            <span className="relative mt-6 h-0.5 w-10 rounded-full bg-white/60" />
          </div>

          {/* Remaining features in a 2x2 grid */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {restFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative flex flex-col px-6 py-7 rounded-[22px] border border-gray-100 bg-white transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-blue-100 hover:shadow-[0_25px_50px_-25px_rgba(37,99,235,0.3)]"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 text-red-500 group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-black mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="mt-16 flex justify-center">
          <div className="h-1 w-32 bg-gradient-to-r from-red-500 via-blue-600 to-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Ambient keyframes */}
      <style>{`
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: floatUpDown 5s ease-in-out infinite; }
        .animate-float-slow { animation: floatUpDown 7s ease-in-out infinite; }
      `}</style>
    </section>
  );
}