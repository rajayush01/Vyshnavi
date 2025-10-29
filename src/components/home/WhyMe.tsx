import React from 'react';
import { Leaf, Sparkles, Package, Heart, ShieldCheck } from 'lucide-react';
import "../../fonts.css";

export default function WhyMe() {
  const features = [
  {
    icon: <Leaf className="w-12 h-12" />,
    title: "Farm-Fresh Dairy",
    description: "Pure milk and dairy straight from local farms"
  },
  {
    icon: <Sparkles className="w-12 h-12" />,
    title: "100% Natural Goodness",
    description: "No preservatives, additives, or artificial flavors"
  },
  {
    icon: <Package className="w-12 h-12" />,
    title: "Hygienic Packaging",
    description: "Sealed to maintain freshness and purity"
  },
  {
    icon: <Heart className="w-12 h-12" />,
    title: "Rich in Nutrition",
    description: "Packed with calcium, protein, and vitamins"
  },
  {
    icon: <ShieldCheck className="w-12 h-12" />,
    title: "Trusted Quality",
    description: "Tested for purity, safety, and taste at every step"
  }
];


  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 text-black cinzel">
          Why <span className="text-blue-600">Vyshnavi Dairy</span>?
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center group cursor-pointer transition-transform hover:scale-105"
            >
              {/* Icon Container */}
              <div className="mb-6 text-red-500 group-hover:text-blue-600 transition-colors">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-black mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Accent Line */}
        <div className="mt-16 flex justify-center">
          <div className="h-1 w-32 bg-gradient-to-r from-red-500 via-blue-600 to-red-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}