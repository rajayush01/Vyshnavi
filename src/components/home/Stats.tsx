import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, useInView, useReducedMotion } from "framer-motion";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, reduce]);

  return <span ref={ref}>{n}{suffix}</span>;
}

const STATS = [
  { to: 25, suffix: "+", label: "Years of family trust", offset: "" },
  { to: 100, suffix: "%", label: "Batches lab-tested", offset: "md:pt-28" },
  { to: 0, suffix: "", label: "Palm or vegetable oil, ever", offset: "" },
];

export default function Stats() {
  return (
    <section className="px-6 py-24 font-body">
      <div className="mx-auto grid max-w-5xl items-start gap-14 text-center md:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className={s.offset}>
            <p className="font-display text-7xl leading-none text-[#1B2430] md:text-8xl">
              <Counter to={s.to} suffix={s.suffix} />
            </p>
            <p className="mt-4 text-xl font-medium text-[#1B2430]">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-16 text-center">
        <Link
          to="/about"
          className="font-display text-lg tracking-[0.08em] text-[#1B2430] underline decoration-2 underline-offset-8 transition-colors hover:text-[#2F6FA3]"
        >
          SEE OUR JOURNEY
        </Link>
      </div>
    </section>
  );
}