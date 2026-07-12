import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Droplet, Truck, ThermometerSnowflake, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';

import videoSrc1 from "../../assets/video1.mp4";
import videoSrc2 from "../../assets/video1.mp4";
import videoSrc3 from "../../assets/video1.mp4";

interface Slide {
  tag: string;
  heading: string;
  headingAccent: string;
  copy: string;
  video: string;
  stats: { icon: React.ReactNode; label: string }[];
}

const slides: Slide[] = [
  {
    tag: "Behind The Bottle",
    heading: "From Farm to Family:",
    headingAccent: "Our Purity Process",
    copy: "Every drop travels a short, careful journey — collected before sunrise, cooled instantly, tested for purity, and delivered while it's still fresh.",
    video: videoSrc1,
    stats: [
      { icon: <Droplet className="w-5 h-5" />, label: "Sourced fresh daily from local farms" },
      { icon: <ThermometerSnowflake className="w-5 h-5" />, label: "Cold-chain preserved at every step" },
      { icon: <Truck className="w-5 h-5" />, label: "On your doorstep within 6 hours" },
      { icon: <BadgeCheck className="w-5 h-5" />, label: "Lab tested for purity, every batch" },
    ],
  },
  {
    tag: "Where It Begins",
    heading: "Raised With Care:",
    headingAccent: "Meet Our Herds",
    copy: "Grass-fed, pasture-raised, and never rushed. Healthy cows are the first step in a glass of milk that actually tastes like something.",
    video: videoSrc2,
    stats: [
      { icon: <Droplet className="w-5 h-5" />, label: "Grass-fed, pasture-raised herds" },
      { icon: <BadgeCheck className="w-5 h-5" />, label: "No hormones, no shortcuts" },
      { icon: <ThermometerSnowflake className="w-5 h-5" />, label: "Milked in climate-controlled dairies" },
      { icon: <Truck className="w-5 h-5" />, label: "Small-batch, never mass-pooled" },
    ],
  },
  {
    tag: "Quality Control",
    heading: "Tested Twice:",
    headingAccent: "Trust, Bottled In",
    copy: "Every batch passes through independent lab testing before it ever reaches your fridge — purity isn't a promise, it's a process.",
    video: videoSrc3,
    stats: [
      { icon: <BadgeCheck className="w-5 h-5" />, label: "Third-party lab verified" },
      { icon: <Droplet className="w-5 h-5" />, label: "Zero additives, zero preservatives" },
      { icon: <ThermometerSnowflake className="w-5 h-5" />, label: "Chilled below 4°C, always" },
      { icon: <Truck className="w-5 h-5" />, label: "Delivered same-day, sealed fresh" },
    ],
  },
];

const VideoSection: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = (newIndex: number) => {
    setDirection(newIndex > index ? 1 : -1);
    setIndex((newIndex + slides.length) % slides.length);
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const active = slides[index];

  const variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 60 : -60,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -60 : 60,
    }),
  };

  const videoVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.04,
      x: dir > 0 ? 40 : -40,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.98,
      x: dir > 0 ? -40 : 40,
    }),
  };

  return (
    <div className="py-20 sm:py-24 px-4 relative overflow-hidden bg-[#e0f2fe]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse top-10 right-10"></div>
        <div className="absolute w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bottom-10 left-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: copy + stats */}
          <div className="relative min-h-[420px] sm:min-h-[380px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-blue-100 mb-6">
                  <svg width="9" height="11" viewBox="0 0 32 40" fill="none">
                    <path d="M16 2 C22 14 28 20 28 28 C28 34.6 22.6 40 16 40 C9.4 40 4 34.6 4 28 C4 20 10 14 16 2 Z" fill="#2563eb" />
                  </svg>
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-700">
                    {active.tag}
                  </span>
                </div>

                <h2 className="font-bold text-3xl sm:text-4xl text-black mb-6 tracking-tight leading-tight">
                  {active.heading} <span className="text-blue-500">{active.headingAccent}</span>
                </h2>

                <p className="text-slate-500 text-base leading-relaxed mb-9 max-w-md">
                  {active.copy}
                </p>

                <div className="space-y-4">
                  {active.stats.map((s, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/70 backdrop-blur-sm rounded-2xl px-5 py-3.5 border border-blue-50 shadow-[0_8px_20px_-14px_rgba(37,99,235,0.4)]">
                      <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                        {s.icon}
                      </span>
                      <span className="text-sm font-semibold text-slate-700">{s.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav controls */}
            <div className="flex items-center gap-4 mt-10">
              <button
                onClick={prev}
                aria-label="Previous"
                className="w-11 h-11 rounded-full bg-white border border-blue-100 flex items-center justify-center text-blue-700 hover:bg-blue-600 hover:text-white transition-colors shadow-[0_8px_20px_-14px_rgba(37,99,235,0.4)]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? "w-8 bg-blue-600" : "w-2.5 bg-blue-200 hover:bg-blue-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Next"
                className="w-11 h-11 rounded-full bg-white border border-blue-100 flex items-center justify-center text-blue-700 hover:bg-blue-600 hover:text-white transition-colors shadow-[0_8px_20px_-14px_rgba(37,99,235,0.4)]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right: Video Container */}
          <div className="relative bg-gradient-to-br from-blue-100 to-cyan-100 rounded-[28px] overflow-hidden shadow-[0_40px_80px_-30px_rgba(37,99,235,0.45)] border border-white/60 p-1.5">
            <div className="rounded-[22px] overflow-hidden relative aspect-[4/5] lg:aspect-square">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.video
                  key={index}
                  custom={direction}
                  variants={videoVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full object-cover bg-black absolute inset-0"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={active.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </motion.video>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;