import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * Stats.tsx — Vyshnavi Dairy (redesign v2)
 *
 * No shapes, no cards, no tinted blocks. The numbers are the design:
 * oversized numerals set as full-width ledger rows separated by hairlines,
 * with the label on the right. A short intro + link sits beside them on
 * desktop (sticky while the rows scroll past). Background stays white.
 *
 * Motion: counters tick up once when the row scrolls into view; nothing
 * else animates. Reduced motion shows the final values.
 */

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => c.stop();
  }, [inView, to, reduce]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {n}
        {suffix}
      </span>
      <span className="sr-only">
        {to}
        {suffix}
      </span>
    </span>
  );
}

const STATS = [
  { to: 25, suffix: "+", label: "Years of family trust" },
  { to: 100, suffix: "%", label: "Batches lab-tested" },
  { to: 0, suffix: "", label: "Palm or vegetable oil, ever" },
];

export default function Stats() {
  return (
    <section
      className="bg-white px-6 py-20 font-body md:py-32"
      aria-labelledby="stats-title"
    >
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12 md:gap-16">
        {/* Intro */}
        <div className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <h2
              id="stats-title"
              className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[#12263A] md:text-5xl"
            >
              Ghee we’re happy to put our name on.
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-[#4A5E72]">
              Three promises we’ve kept on every jar, from our family’s
              kitchen to yours.
            </p>
            <Link
              to="/about"
              className="group mt-8 inline-flex items-center gap-2 rounded-sm font-semibold text-[#1E5FA8] underline decoration-2 underline-offset-8 transition-colors hover:text-[#12263A] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#1E5FA8]"
            >
              See our journey
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </div>
        </div>

        {/* Ledger rows */}
        <ul className="m-0 list-none border-t border-[#12263A]/20 p-0 md:col-span-8">
          {STATS.map((s) => (
            <li
              key={s.label}
              className="grid items-end gap-x-8 gap-y-2 border-b border-[#12263A]/20 py-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,14rem)] md:py-10"
            >
              <p className="font-display text-[5.5rem] font-semibold leading-[0.85] tabular-nums tracking-tight text-[#12263A] sm:text-[7rem] md:text-[9rem]">
                <Counter to={s.to} suffix={s.suffix} />
              </p>
              <p className="pb-1 text-lg font-medium leading-snug text-[#12263A] sm:text-right md:pb-3 md:text-xl">
                {s.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}