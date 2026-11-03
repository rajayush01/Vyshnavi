import { useEffect, useRef, useState } from "react";

export default function FreshnessJourney() {
  const ref = useRef<SVGSVGElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFilled(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const textProps = {
    x: 600,
    y: 150,                 // baseline (was 215)
    textAnchor: "middle" as const,
    fontSize: 200,          // was 230
    fontWeight: 700,
    letterSpacing: 8,
    style: { fontFamily: "Cinzel, serif" },
  };

  return (
    <div className="relative mt-4 mb-2">
      <svg
        ref={ref}
        viewBox="0 0 1200 220"   // height reduced from 260
        className="w-full h-auto select-none"
        role="img"
        aria-label="Vyshnavi"
      >
        <defs>
          <clipPath id="vf-letters">
            <text {...textProps}>VYSHNAVI</text>
          </clipPath>
        </defs>

        {/* Outline (the empty glass) */}
        <text {...textProps} fill="none" stroke="#2563eb" strokeOpacity="0.35" strokeWidth="2">
          VYSHNAVI
        </text>

        {/* Milk rising inside the letters */}
        <g clipPath="url(#vf-letters)">
          <g
            style={{
              transform: filled ? "translateY(0)" : "translateY(240px)",
              transition: "transform 3s cubic-bezier(.22,1,.36,1)",
            }}
          >
            {/* back wave */}
            <g className="vf-wave-slow" opacity="0.45">
              <path
                d="M0 28 Q150 -2 300 28 T600 28 T900 28 T1200 28 T1500 28 T1800 28 T2100 28 T2400 28 V400 H0 Z"
                fill="#22d3ee"
              />
            </g>
            {/* front wave */}
            <g className="vf-wave">
              <path
                d="M0 32 Q150 2 300 32 T600 32 T900 32 T1200 32 T1500 32 T1800 32 T2100 32 T2400 32 V400 H0 Z"
                fill="#2563eb"
              />
            </g>
          </g>
        </g>
      </svg>

      <p className="text-center text-[11px] font-bold uppercase tracking-[0.35em] text-blue-700/70 -mt-1">
        Pure · Honest · Family-made
      </p>

      <style>{`
        @keyframes vfWave { from { transform: translateX(0); } to { transform: translateX(-600px); } }
        .vf-wave      { animation: vfWave 6s linear infinite; }
        .vf-wave-slow { animation: vfWave 11s linear infinite reverse; }
        @media (prefers-reduced-motion: reduce) {
          .vf-wave, .vf-wave-slow { animation: none; }
        }
      `}</style>
    </div>
  );
}