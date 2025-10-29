import React, { useState, useEffect } from 'react';
import bnr from "../../assets/bnr.webp"
import bnr2 from "../../assets/bnr2.jpg"

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      image: bnr,
      title: 'Pure & Fresh Dairy',
      subtitle: 'Farm-Fresh Goodness Delivered Daily to Your Doorstep',
      cta: 'Shop Now',
      badge: 'Premium Quality'
    },
    {
      image: bnr,
      title: '100% Organic Milk',
      subtitle: 'Sourced Directly From Local Farms with Love & Care',
      cta: 'Learn More',
      badge: 'Farm Fresh'
    },
    {
      image: bnr2,
      title: 'Artisan Cheese Collection',
      subtitle: 'Handcrafted With Traditional Methods for Authentic Taste',
      cta: 'Explore Cheese',
      badge: 'Handmade'
    },
    {
      image: bnr2,
      title: 'Premium Yogurt Range',
      subtitle: 'Rich in Protein & Probiotics for a Healthy Lifestyle',
      cta: 'Discover More',
      badge: 'Nutritious'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  // const goToSlide = (index) => {
  //   setCurrentSlide(index);
  //   setIsAutoPlaying(false);
  //   setTimeout(() => setIsAutoPlaying(true), 10000);
  // };

  // const goToPrevious = () => {
  //   setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  //   setIsAutoPlaying(false);
  //   setTimeout(() => setIsAutoPlaying(true), 10000);
  // };

  // const goToNext = () => {
  //   setCurrentSlide((prev) => (prev + 1) % slides.length);
  //   setIsAutoPlaying(false);
  //   setTimeout(() => setIsAutoPlaying(true), 10000);
  // };

  return (
    <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[600px] overflow-hidden bg-slate-900 mt-28">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 z-30"></div>
      
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide 
              ? 'opacity-100 translate-x-0' 
              : index < currentSlide 
                ? 'opacity-0 -translate-x-full' 
                : 'opacity-0 translate-x-full'
          }`}
        >
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/70 to-slate-900/50" /> */}
          </div>

          {/* Content */}
          
        </div>
      ))}

      {/* Navigation Arrows */}
      {/* <button
        onClick={goToPrevious}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 bg-slate-800/70 hover:bg-slate-800/90 backdrop-blur-sm text-white p-3 sm:p-4 rounded-full transition-all z-20 group border-2 border-white/20 hover:border-cyan-400/50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform text-cyan-400" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 bg-slate-800/70 hover:bg-slate-800/90 backdrop-blur-sm text-white p-3 sm:p-4 rounded-full transition-all z-20 group border-2 border-white/20 hover:border-cyan-400/50"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform text-cyan-400" />
      </button> */}

      {/* Slide Indicators */}
      {/* <div className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all rounded-full ${
              index === currentSlide 
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 w-12 sm:w-14 h-3' 
                : 'bg-white/40 hover:bg-white/60 w-3 h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}

      {/* Slide Counter with enhanced design */}
      {/* <div className="absolute top-6 sm:top-8 right-6 sm:right-8 z-20">
        <div className="bg-slate-800/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold border-2 border-white/20 flex items-center gap-2">
          <span className="text-cyan-400">{currentSlide + 1}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-300">{slides.length}</span>
        </div>
      </div> */}

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border-2 border-cyan-400/20 rounded-full animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 border-2 border-blue-400/20 rounded-full animate-pulse hidden lg:block"></div>

      {/* Bottom accent line with red highlight */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-red-500 to-cyan-500 z-30"></div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.9s ease-out forwards;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;