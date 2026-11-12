import React from "react";

export const SKY = "#E0F2FE";
export const INK = "#1B2430";
export const MUTED = "#5B6672";

/** Soft hand-drawn-feel curve that joins two sections. Place it right before a coloured
 *  section (colour = that section's bg). Use `flip` right after a coloured section. */
export const CurveDivider: React.FC<{ color?: string; flip?: boolean }> = ({ color = SKY, flip = false }) => (
  <div aria-hidden className={`pointer-events-none -my-px block w-full leading-[0] ${flip ? "rotate-180" : ""}`}>
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-12 w-full md:h-20">
      <path d="M0 78 C300 18 700 0 1000 38 C1200 62 1340 90 1440 104 L1440 120 L0 120 Z" fill={color} />
    </svg>
  </div>
);

export const SunDoodle: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`text-neutral-800 ${className}`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <path d="M50 8 L47 20 M68 12 L62 22 M82 28 L72 34 M30 12 L35 22" />
    <path d="M70 40 a16 16 0 0 0 -30 -4 a12 12 0 0 0 -12 18 a9 9 0 0 0 6 14 h28 a14 14 0 0 0 8 -28z" />
    <path d="M82 52 q-2 14 -14 18" />
  </svg>
);

export const BirdsDoodle: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={`text-neutral-700 ${className}`} viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
    <path d="M82 6 l-6 6 M86 2 l-4 4 M72 14 l-6 6 M2 38 h8 M16 38 h62" />
  </svg>
);

/** Teardrop number badge, like the numbered markers on the reference site. */
export const TearBadge: React.FC<{ n: number | string; color: string }> = ({ n, color }) => (
  <span className="relative inline-flex h-[52px] w-14 items-center justify-center font-display text-2xl text-[#1B2430]">
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 56 52" aria-hidden>
      <path d="M6 8C6 4 10 2 14 3C34 6 54 14 54 30C54 44 42 52 28 52C12 52 2 42 2 26C2 18 4 12 6 8Z" fill={color} />
    </svg>
    <span className="relative">{n}</span>
  </span>
);

export const underlineLink =
  "font-semibold text-[#1B2430] underline decoration-2 underline-offset-4 transition-colors hover:text-[#2F6FA3]";