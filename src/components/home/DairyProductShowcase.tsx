/**
 * DairyProductShowcase.tsx — Vyshnavi Dairy
 *
 * Category showcase: one card per product category, each with a
 * representative image (cyclable via prev/next arrows), and a CTA button.
 *
 * Every piece of card content (badge, eyebrow, title, description, CTA label,
 * link, images) is read from `category.showcase` in vyshnaviData.ts, so each
 * card can have completely different content. If a showcase field is missing,
 * it falls back to the category's own data.
 */

import React, { useRef, useState, useEffect } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// ── Data source ──────────────────────────────────────────────────────────
import { CATEGORIES, type ProductCategory } from "../../data/vyshnaviData";

const FALLBACK_GRADIENT: Record<string, string> = {
  milk: "linear-gradient(135deg,#bfdbfe,#dbeafe)",
  curd: "linear-gradient(135deg,#bbf7d0,#dcfce7)",
  beverages: "linear-gradient(135deg,#e9d5ff,#f3e8ff)",
  paneer: "linear-gradient(135deg,#fed7aa,#ffedd5)",
  butter: "linear-gradient(135deg,#fef08a,#fefce8)",
  ghee: "linear-gradient(135deg,#fde68a,#fffbeb)",
  sweets: "linear-gradient(135deg,#fbcfe8,#fdf2f8)",
};

const FALLBACK_MOOD: Record<string, string> = {
  milk: "#60a5fa",
  curd: "#4ade80",
  beverages: "#c084fc",
  paneer: "#fb923c",
  butter: "#facc15",
  ghee: "#eab308",
  sweets: "#f472b6",
};

function categoryHref(category: ProductCategory): string {
  // Ghee has its own bespoke store page; everything else uses the generic one
  return category.key === "ghee" ? "/ghee" : `/category/${category.key}`;
}

// Fallback images: one per item that actually has one
function categoryImages(category: ProductCategory): string[] {
  return category.items
    .map((i) => i.image)
    .filter((img): img is string => !!img);
}

// ── Individual category card (owns its own image-cycling state) ──────────
interface CategoryCardProps {
  category: ProductCategory;
  navigate: NavigateFunction;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, navigate }) => {
  const sc = category.showcase;

  // Everything below comes from data first, with a sensible fallback
  const images = sc?.images?.length ? sc.images : categoryImages(category);
  const href = sc?.href ?? categoryHref(category);
  const badge =
    sc?.badge ??
    `${category.items.length} variant${category.items.length !== 1 ? "s" : ""}`;
  const eyebrow = sc?.eyebrow ?? category.tagline;
  const title = sc?.title ?? category.name;
  const description = sc?.description ?? category.subtitle;
  const ctaLabel = sc?.ctaLabel ?? `Shop ${category.name}`;

  // const [imgIndex, setImgIndex] = useState(0);

  // const hasMultipleImages = images.length > 1;
  // const activeImage = images.length > 0 ? images[imgIndex] : null;

  const [imgIndex, setImgIndex] = useState(0);

  const hasMultipleImages = images.length > 1;
  const activeImage = images.length > 0 ? images[imgIndex] : null;

  const fallbackMood = FALLBACK_MOOD[category.key] ?? "#60a5fa";
  const [moodColor, setMoodColor] = useState(fallbackMood);

  // Extract the dominant colour from the active product image
  useEffect(() => {
    setMoodColor(fallbackMood);

    if (!activeImage) return;

    let cancelled = false;

    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.width = 32;
        canvas.height = 32;

        context.drawImage(image, 0, 0, 32, 32);

        const pixels = context.getImageData(0, 0, 32, 32).data;

        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;

        for (let i = 0; i < pixels.length; i += 4) {
          const red = pixels[i];
          const green = pixels[i + 1];
          const blue = pixels[i + 2];
          const alpha = pixels[i + 3];

          const brightness = (red + green + blue) / 3;
          const max = Math.max(red, green, blue);
          const min = Math.min(red, green, blue);
          const saturation = max === 0 ? 0 : (max - min) / max;

          // Ignore transparent, nearly white and very dark pixels
          if (
            alpha < 150 ||
            brightness > 235 ||
            brightness < 35 ||
            saturation < 0.15
          ) {
            continue;
          }

          r += red;
          g += green;
          b += blue;
          count++;
        }

        if (!cancelled && count > 0) {
          const toHex = (value: number) =>
            Math.round(value).toString(16).padStart(2, "0");

          const dominantColor = `#${toHex(r / count)}${toHex(g / count)}${toHex(b / count)}`;

          setMoodColor(dominantColor);
        }
      } catch {
        // Cross-origin images may block canvas colour extraction.
        // Keep the category fallback colour in that case.
      }
    };

    image.src = activeImage;

    return () => {
      cancelled = true;
    };
  }, [activeImage, fallbackMood]);

  // Automatically rotate product images every 3 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = window.setInterval(() => {
      setImgIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [images.length]);

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      onClick={() => navigate(href)}
      className={`${category.color} group relative rounded-3xl overflow-hidden border border-white/60 shadow-[0_15px_40px_-20px_rgba(15,23,42,0.35)] hover:shadow-[0_30px_60px_-20px_rgba(37,99,235,0.35)] transition-all duration-500 ease-out hover:-translate-y-1.5 cursor-pointer flex flex-col flex-shrink-0 w-[80%] sm:w-[340px] snap-start`}
    >
      {/* Dynamic ambient mood lighting */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-in-out"
        style={{
          background: `
      radial-gradient(
        circle at 85% 15%,
        ${moodColor}55 0%,
        transparent 45%
      ),
      radial-gradient(
        circle at 10% 85%,
        ${moodColor}40 0%,
        transparent 50%
      ),
      linear-gradient(
        135deg,
        ${moodColor}12,
        transparent 65%
      )
    `,
        }}
      />
      {/* Subtle corner milk-drop watermark */}
      <svg
        className="absolute top-3 right-3 w-6 h-6 opacity-20 pointer-events-none z-10"
        viewBox="0 0 64 64"
        fill="none"
      >
        <path
          d="M32 10 C38 22 46 28 46 38 C46 46 40 51 32 51 C24 51 18 46 18 38 C18 28 26 22 32 10 Z"
          fill="#ffffff"
        />
      </svg>

      {/* Image */}
      <div className="relative h-52 sm:h-56 flex items-center justify-center overflow-hidden">
        {/* <div className="absolute w-2/3 h-2/3 rounded-full bg-white/40 blur-2xl" /> */}

        <div
          className="absolute w-2/3 h-2/3 rounded-full blur-3xl transition-all duration-1000"
          style={{
            backgroundColor: `${moodColor}55`,
          }}
        />
        {activeImage ? (
          <img
            key={activeImage}
            src={activeImage}
            alt={`${title} ${imgIndex + 1}`}
            className="relative h-40 sm:h-44 object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105 animate-fade-in"
          />
        ) : (
          <div
            className="relative w-36 h-36 rounded-2xl flex items-center justify-center opacity-70"
            style={{ background: FALLBACK_GRADIENT[category.key] ?? "#e5e7eb" }}
          >
            <span className="text-xs text-gray-500 font-semibold text-center px-3">
              {title}
            </span>
          </div>
        )}

        {/* Badge (from data) */}
        <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm text-gray-700 shadow-sm">
          {badge}
        </span>

        {/* Image prev / next arrows — only when there's more than one image */}
        {hasMultipleImages && (
          <>
            <button
              onClick={showPrev}
              aria-label={`Previous ${title} image`}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-300 z-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={showNext}
              aria-label={`Next ${title} image`}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-300 z-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === imgIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Text block (all from data) */}
      <div className="p-6 sm:p-7 flex flex-col flex-grow">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1.5">
          {eyebrow}
        </p>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {description}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(href);
          }}
          className="mt-auto inline-flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-gray-900 font-bold text-sm py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group/btn"
        >
          {ctaLabel}
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

const DairyProductShowcase: React.FC = () => {
  const navigate = useNavigate();
  const railRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? 320) + 28; // card width + gap
    rail.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-16 sm:py-20 overflow-hidden">
      {/* Decorative dairy illustrations */}
      <svg
        className="hidden md:block absolute top-2 left-[2%] w-14 h-14 opacity-50 animate-float-slow pointer-events-none"
        viewBox="0 0 64 64"
        fill="none"
      >
        <path
          d="M32 6 C40 22 50 30 50 42 C50 52 42 58 32 58 C22 58 14 52 14 42 C14 30 24 22 32 6 Z"
          fill="#ffffff"
          stroke="#60a5fa"
          strokeWidth="2"
        />
        <ellipse cx="27" cy="40" rx="4" ry="6" fill="#bfdbfe" opacity="0.7" />
      </svg>
      <svg
        className="hidden md:block absolute top-1/3 right-[2%] w-16 h-16 opacity-50 animate-float pointer-events-none"
        viewBox="0 0 64 64"
        fill="none"
      >
        <path
          d="M20 24 L44 24 L41 56 L23 56 Z"
          fill="#ffffff"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        <path
          d="M24 24 L20 14 L44 14 L40 24 Z"
          fill="#dbeafe"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        <rect x="27" y="8" width="10" height="6" rx="2" fill="#3b82f6" />
        <line
          x1="20"
          y1="34"
          x2="44"
          y2="34"
          stroke="#93c5fd"
          strokeWidth="1.5"
        />
      </svg>
      <svg
        className="hidden md:block absolute bottom-24 left-[4%] w-12 h-12 opacity-50 animate-float pointer-events-none"
        viewBox="0 0 64 64"
        fill="none"
      >
        <path
          d="M8 44 L52 20 L58 44 Z"
          fill="#ffffff"
          stroke="#fbbf24"
          strokeWidth="2"
        />
        <circle cx="30" cy="36" r="2" fill="#fbbf24" />
        <circle cx="40" cy="32" r="1.5" fill="#fbbf24" />
        <circle cx="22" cy="40" r="1.5" fill="#fbbf24" />
      </svg>

      <div className="relative">
        {/* Eyebrow + heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-4">
              <svg width="9" height="11" viewBox="0 0 32 40" fill="none">
                <path
                  d="M16 2 C22 14 28 20 28 28 C28 34.6 22.6 40 16 40 C9.4 40 4 34.6 4 28 C4 20 10 14 16 2 Z"
                  fill="#2563eb"
                />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-700">
                COMPLETE FAMILY RANGE
              </span>
            </div>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-300">
                  Our Products
                </span>

                <span className="block mt-2 text-lg md:text-xl font-semibold text-slate-800">
                  Lab-Tested Daily Essentials
                </span>
              </h2>
            </div>
          </div>

          {/* Rail nav arrows */}
          <div className="flex items-center justify-center sm:justify-end gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="Scroll categories left"
              className="w-11 h-11 rounded-full border border-blue-100 bg-white flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="Scroll categories right"
              className="w-11 h-11 rounded-full border border-blue-100 bg-white flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>

        {/* Category scroll rail */}
        <div className="relative -mx-4 px-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent z-10" />
          <div
            ref={railRef}
            className="flex gap-6 sm:gap-7 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
          >
            {CATEGORIES.map((category) => (
              <CategoryCard
                key={category.key}
                category={category}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Ambient keyframes */}
      <style>{`
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-float { animation: floatUpDown 5s ease-in-out infinite; }
        .animate-float-slow { animation: floatUpDown 7s ease-in-out infinite; }
        .animate-fade-in { animation: fadeIn 0.35s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </div>
  );
};

export default DairyProductShowcase;
