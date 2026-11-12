import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import img1 from "../../assets/no-bg.png"
import img2 from "../../assets/m1.png"
import img3 from "../../assets/CB1.png"
/**
 * Hero section — static copy on the right, auto-scrolling product slides on the left.
 * Slides emerge from the hand-drawn curve and exit off the left edge.
 *
 * Setup:
 *   npm i framer-motion
 *   Add to index.html <head>:
 *   <link href="https://fonts.googleapis.com/css2?family=Staatliches&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">
 *   Tailwind config (optional): fontFamily: { display: ["Staatliches"], body: ["Figtree"] }
 */

type Slide = {
  id: string;
  src: string; // replace with your product images (transparent PNG / WebP)
  alt: string;
  blob: string; // soft backdrop color per slide
};

const SLIDES: Slide[] = [
  { id: "lassi-buttermilk", src: img1, alt: "Sweet lassi and buttermilk cups", blob: "#EEF3DA" },
  { id: "curd", src: img2, alt: "Fresh curd cups", blob: "#E4EEF8" },
  { id: "milk", src: img3, alt: "Tested milk packets", blob: "#F6EFD8" },
];

const MARQUEE_ITEMS = ["🥛&nbsp; 25+ Years of Family Trust", "Every Batch Lab-Tested", "Zero Palm Oil", "Zero Vegetable Oil", "Zero Chemicals", "Honest Quality at Everyday Family Prices"];

const SLIDE_INTERVAL = 3800;

/* Hand-drawn curve, in a 100 x 100 box. Used for both the clip mask and the ink line. */
// const CURVE_PATH =
//   "M 92 0 C 97 14, 101 22, 102 36 C 103.5 52, 106 62, 103 76 C 101 88, 98 94, 97 100";

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || reduceMotion) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_INTERVAL);
    return () => clearInterval(t);
  }, [paused, reduceMotion]);

  const slide = SLIDES[index];

  return (
    <section className="relative w-full overflow-hidden bg-white font-body mt-10 max-h-screen">
      {/* clip-path definition: the left panel is cut along the curve */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id="heroCurveClip" clipPathUnits="objectBoundingBox">
            <path d="M 0 0 L 0.92 0 C 0.97 0.14, 1.01 0.22, 1.02 0.36 C 1.035 0.52, 1.06 0.62, 1.03 0.76 C 1.01 0.88, 0.98 0.94, 0.97 1 L 0 1 Z" transform="scale(0.94 1)" />
          </clipPath>
        </defs>
      </svg>

      <div className="grid min-h-[560px] grid-cols-1 md:min-h-[640px] md:grid-cols-[56%_44%]">
        {/* ---------- LEFT: animated slides ---------- */}
        <div
          className="relative h-[420px] md:h-auto md:[clip-path:url(#heroCurveClip)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* static doodles */}
          <svg className="absolute right-[12%] top-[10%] z-10 h-20 w-20 text-neutral-800 md:h-24 md:w-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
            <path d="M50 8 L47 20 M68 12 L62 22 M82 28 L72 34 M30 12 L35 22" />
            <path d="M70 40 a16 16 0 0 0 -30 -4 a12 12 0 0 0 -12 18 a9 9 0 0 0 6 14 h28 a14 14 0 0 0 8 -28z" />
            <path d="M82 52 q-2 14 -14 18" />
          </svg>
          <svg className="absolute bottom-[12%] left-[7%] z-10 h-10 w-24 text-neutral-700" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
            <path d="M82 6 l-6 6 M86 2 l-4 4 M72 14 l-6 6 M2 38 h8 M16 38 h62" />
          </svg>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={slide.id}
              className="absolute inset-0 flex items-center justify-center"
              initial={reduceMotion ? { opacity: 0 } : { x: "70%", opacity: 0, scale: 0.92 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "-70%", opacity: 0, scale: 0.96 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* organic blob */}
              <svg className="absolute h-[88%] w-[78%]" viewBox="0 0 400 400" aria-hidden>
                <path
                  d="M60 210 C40 120 130 40 220 50 C320 60 370 150 360 240 C352 320 290 360 220 360 C140 362 80 310 60 210Z"
                  fill={slide.blob}
                />
              </svg>
              <img
                src={slide.src}
                alt={slide.alt}
                draggable={false}
                className={`relative z-10 h-[78%] w-auto max-w-[80%] object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,0.12)] ${
                  index === 0 ? "-translate-y-28 h-[90%]" : ""
                }`}
              />
            </motion.div>
          </AnimatePresence>

          {/* slide indicators */}
          {/* <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:left-[42%]">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                  i === index ? "w-6 bg-neutral-900" : "w-2 bg-neutral-400 hover:bg-neutral-600"
                }`}
              />
            ))}
          </div> */}
        </div>

        {/* ink curve drawn on top of the clip edge (desktop only) */}
        {/* <svg
          className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden h-full w-[56%] overflow-visible md:block"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <motion.path
            d={CURVE_PATH}
            transform="scale(0.94 1)"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: reduceMotion ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
        </svg> */}

        {/* ---------- RIGHT: static content ---------- */}
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center md:px-12">
          <h1 className="font-display text-3xl leading-tight tracking-[0.08em] text-neutral-900 sm:text-4xl">
            Milk that's tested for safety – everyday
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-7 tracking-wide text-neutral-600">
            Tested daily for antibiotics, hormones, and additives – it takes more tests than any college kid! Only milk
            that aces every test is delivered to your doorstep.
          </p>

          <a
            href="#order"
            className="group mt-10 inline-flex items-center gap-4 rounded-2xl border-2 border-neutral-900 bg-white px-9 py-5 text-xl font-semibold text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
          >
            Get your packet of Health
            <svg className="h-6 w-6 transition-transform duration-300 group-hover:translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3v13M6 11l6 6 6-6M5 21h14" />
            </svg>
          </a>
        </div>
      </div>

      {/* ---------- Marquee strip ---------- */}
      <div className="overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 py-4 text-white" aria-label="No adulterants, no antibiotics, no induced hormones, no preservatives">
        <motion.div
          className="flex w-max whitespace-nowrap"
          animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={item} className="flex items-center text-2xl font-semibold md:text-3xl">
                  <span className="px-6">{item}</span>
                  <span className="text-xl">{i === MARQUEE_ITEMS.length - 1 ? "|" : "•"}</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}