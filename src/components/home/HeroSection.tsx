import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    }, 5500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);
  const goToNext = () => goToSlide((currentSlide + 1) % slides.length);

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full h-[480px] sm:h-[640px] lg:h-[92vh] lg:max-h-[760px] overflow-hidden bg-slate-900 mt-28">
      {/* Slides — background images crossfade */}
      {slides.map((s, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-[1.04]"
            style={{ backgroundImage: `url(${s.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/40" />
          </div>
        </div>
      ))}

      {/* Floating glass content card — anchored bottom-left, overlapping edge */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-4 sm:px-10 lg:px-16">
        <div className="max-w-[280px] sm:max-w-md lg:max-w-lg pb-5 sm:pb-14 lg:pb-16">
          <div
            key={currentSlide}
            className="rounded-2xl sm:rounded-[32px] bg-white/10 backdrop-blur-xl border border-white/15 p-4 sm:p-8 lg:p-10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] animate-[heroFadeUp_0.8s_cubic-bezier(0.25,0.46,0.45,0.94)_both]"
          >
            <span className="inline-block mb-2.5 sm:mb-4 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] bg-cyan-400/15 border border-cyan-300/30 text-cyan-300">
              {slide.badge}
            </span>
            <h1 className="text-lg sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] sm:leading-[1.08] tracking-tight mb-2 sm:mb-4">
              {slide.title}
            </h1>
            <p className="text-[11px] sm:text-base text-slate-300 leading-snug sm:leading-relaxed mb-3.5 sm:mb-7 max-w-[220px] sm:max-w-sm">
              {slide.subtitle}
            </p>

            {/* CTA row: button + prev/next + counter */}
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <button className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 sm:px-7 py-2 sm:py-3 rounded-full font-semibold text-[11px] sm:text-sm tracking-wide shadow-[0_15px_35px_-10px_rgba(6,182,212,0.65)] hover:shadow-[0_20px_45px_-8px_rgba(6,182,212,0.85)] hover:scale-105 transition-all duration-300">
                {slide.cta}
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2.5 bg-white/5 border border-white/15 rounded-full pl-1 sm:pl-1.5 pr-2.5 sm:pr-4 py-1 sm:py-1.5">
                <button
                  onClick={goToPrevious}
                  aria-label="Previous slide"
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-cyan-400/25 border border-white/15 hover:border-cyan-400/50 flex items-center justify-center transition-all duration-300 group"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-slate-300 group-hover:text-cyan-300 group-hover:-translate-x-0.5 transition-all" />
                </button>

                <span className="text-[9px] sm:text-xs font-bold tabular-nums text-white tracking-wide">
                  {String(currentSlide + 1).padStart(2, '0')}
                  <span className="text-slate-400 font-medium mx-0.5">/</span>
                  <span className="text-slate-400 font-medium">{String(slides.length).padStart(2, '0')}</span>
                </span>

                <button
                  onClick={goToNext}
                  aria-label="Next slide"
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-cyan-400/25 border border-white/15 hover:border-cyan-400/50 flex items-center justify-center transition-all duration-300 group"
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-300 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile dot indicators */}
      <div className="lg:hidden absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentSlide ? 'bg-cyan-400 w-6' : 'bg-white/40 w-1.5'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 z-30"></div>

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;