import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import img1 from '../../assets/butter-200-bg.png';
import img2 from '../../assets/curd-box.png';
import img3 from '../../assets/curd.png';

const DairyProductShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const products = [
    {
      title: "BUTTER",
      tagline: "PURE & NUTRITIOUS",
      subtitle: "FARM FRESH DAILY",
      description:
        "Our premium quality milk is sourced directly from local farms, ensuring maximum freshness and nutritional value for your family.",
      color: "bg-yellow-100",
      image: img1,
    },
    {
      title: "CURD",
      tagline: "CREAMY & DELICIOUS",
      subtitle: "PROBIOTIC GOODNESS",
      description:
        "Our premium quality milk is sourced directly from local farms, ensuring maximum freshness and nutritional value for your family.",
      color: "bg-blue-100",
      image: img3,
    },
    {
      title: "CHEESE",
      tagline: "ARTISAN CRAFTED",
      subtitle: "PREMIUM QUALITY",
      description:
        "Our premium quality milk is sourced directly from local farms, ensuring maximum freshness and nutritional value for your family.",
      color: "bg-green-100",
      image: img2,
    },
    {
      title: "BUTTER",
      tagline: "NATURAL & PURE",
      subtitle: "TRADITIONAL CHURNED",
      description:
        "Our premium quality milk is sourced directly from local farms, ensuring maximum freshness and nutritional value for your family.",
      color: "bg-orange-100",
      image: img1,
    },
    {
      title: "PANEER",
      tagline: "FRESH & SOFT",
      subtitle: "COTTAGE CHEESE",
      description:
        "Our premium quality milk is sourced directly from local farms, ensuring maximum freshness and nutritional value for your family.",
      color: "bg-purple-100",
      image: img1,
    },
    {
      title: "CREAM",
      tagline: "THICK & RICH",
      subtitle: "WHIPPING PERFECTION",
      description:
        "Our premium quality milk is sourced directly from local farms, ensuring maximum freshness and nutritional value for your family.",
      color: "bg-pink-100",
      image: img1,
    },
  ];

  const handleNext = () => {
    if (currentIndex < products.length - 3) {
      setCurrentIndex(currentIndex + 3);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 3);
    }
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + 3);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-all ${
            currentIndex === 0
              ? 'opacity-30 cursor-not-allowed'
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          <ChevronLeft className="w-10 h-10 text-gray-600" />
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex >= products.length - 3}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 transition-all ${
            currentIndex >= products.length - 3
              ? 'opacity-30 cursor-not-allowed'
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          <ChevronRight className="w-10 h-10 text-gray-600" />
        </button>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {visibleProducts.map((product, index) => (
            <div
              key={currentIndex + index}
              className={`${product.color} rounded-lg overflow-hidden shadow-md transition-transform`}
            >
              <div className="p-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-3">
                  {product.title}
                </h2>
                <p className="text-green-600 font-bold text-base mb-2 uppercase">
                  {product.tagline}
                </p>
                <p className="text-gray-600 font-medium text-base mb-6 uppercase">
                  {product.subtitle}
                </p>
                <p className="text-gray-600 text-base mb-6 leading-relaxed">
                  {product.description}
                </p>
                <button className="text-base font-semibold text-gray-900 hover:text-gray-600 transition-colors">
                  View More →
                </button>
              </div>

              {/* Product Image */}
              <div className="h-64 flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-72 object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {Array.from({ length: Math.ceil(products.length / 3) }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * 3)}
                className={`h-3 rounded-full transition-all ${
                  Math.floor(currentIndex / 3) === index
                    ? 'bg-gray-800 w-10'
                    : 'bg-gray-400 w-3 hover:bg-gray-500'
                }`}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DairyProductShowcase;