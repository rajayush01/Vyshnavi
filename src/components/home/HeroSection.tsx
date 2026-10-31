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
      title: 'Where Honest Quality Meets Everyday Affordability',
     subtitle: 'Good Dairy Shouldn’t Be a Luxury. Lab-Tested Purity, Honest Quality, and Everyday Prices for Every Family.',
      cta: 'Explore Our Products',
      badge: 'TRUSTED BY FAMILIES FOR 25+ YEARS'
    },
    {
      image: bnr,
     title: 'No Palm Oil. No Chemicals. Just Great Taste',
     subtitle: 'Collected at Verified Centers, Hygienically Processed & Lab-Tested Every Batch',
      cta: 'See How We Test Every Batch ',
      badge: 'ZERO ADULTERATION GUARANTEE '
    },
    {
      image: bnr2,
      title: 'Aromatic Ghee & Soft Malai Paneer for Every Kitchen',
      subtitle: '100% real milk ghee and protein-rich Malai Paneer with zero vegetable oil, zero vanaspati, and zero starch — authentic taste that fits your monthly grocery budget.',
      cta: 'Shop Ghee & Paneer',
      badge: 'REAL MILK FAT • GRANULAR TEXTURE'
    },
    {
      image: bnr2,
      title: 'Thick Creamy Curd, Milk & Refreshing Beverages',
      subtitle: 'From morning tea and kids tiffins to wholesome family meals — enjoy rich milk variants, thick curd, buttermilk, lassi, and badam milk every day.',
      cta: 'View All Daily Products',
      badge: 'EVERYDAY FAMILY ESSENTIALS'
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
   <div className="absolute inset-x-0 bottom-0 z-20 px-3 sm:px-8 lg:px-12">
  <div className="max-w-[250px] sm:max-w-sm lg:max-w-md pb-3 sm:pb-8 lg:pb-10">
    <div
      key={currentSlide}
      className="rounded-xl sm:rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 p-3 sm:p-5 lg:p-6 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.6)] animate-[heroFadeUp_0.8s_cubic-bezier(0.25,0.46,0.45,0.94)_both]"
    >
      <span className="inline-block mb-2 sm:mb-3 px-2.5 sm:px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em] bg-cyan-400/15 border border-cyan-300/30 text-cyan-300">
        {slide.badge}
      </span>

      <h1 className="text-base sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight mb-1.5 sm:mb-3">
        {slide.title}
      </h1>

      <p className="text-[10px] sm:text-sm text-slate-300 leading-snug sm:leading-relaxed mb-3 sm:mb-5 max-w-[210px] sm:max-w-xs">
        {slide.subtitle}
      </p>

      {/* CTA row */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <button className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full font-semibold text-[10px] sm:text-xs tracking-wide shadow-[0_12px_25px_-10px_rgba(6,182,212,0.65)] hover:scale-105 transition-all duration-300">
          {slide.cta}
        </button>

        <div className="flex items-center gap-1 sm:gap-2 bg-white/5 border border-white/15 rounded-full pl-1 pr-2 sm:pr-3 py-1">
          <button
            onClick={goToPrevious}
            aria-label="Previous slide"
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 hover:bg-cyan-400/25 border border-white/15 flex items-center justify-center transition-all group"
          >
            <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300 group-hover:text-cyan-300 transition-all" />
          </button>

          <span className="text-[9px] sm:text-[11px] font-bold tabular-nums text-white">
            {String(currentSlide + 1).padStart(2, "0")}
            <span className="text-slate-400 mx-0.5">/</span>
            <span className="text-slate-400 font-medium">
              {String(slides.length).padStart(2, "0")}
            </span>
          </span>

          <button
            onClick={goToNext}
            aria-label="Next slide"
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 hover:bg-cyan-400/25 border border-white/15 flex items-center justify-center transition-all group"
          >
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300 group-hover:text-cyan-300 transition-all" />
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