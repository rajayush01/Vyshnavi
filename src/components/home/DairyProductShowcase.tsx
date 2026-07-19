/**
 * DairyProductShowcase.tsx — Vyshnavi Dairy
 *
 * Category showcase: one card per product category (Milk, Curd, Beverages,
 * Paneer, Butter, Ghee, Sweets), each with a representative image (now
 * cyclable via next/previous arrows through all images in that category),
 * a live item count, and a "Shop Category" button that routes to the full
 * listing for that category — /ghee for Ghee (its own bespoke page), and
 * /category/:key for everything else.
 *
 * Fully driven by CATEGORIES from vyshnaviData.ts.
 */

import React, { useRef, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// ── Data source ──────────────────────────────────────────────────────────
import { CATEGORIES, type ProductCategory } from "../../data/vyshnaviData";

const FALLBACK_GRADIENT: Record<string, string> = {
  milk:      "linear-gradient(135deg,#bfdbfe,#dbeafe)",
  curd:      "linear-gradient(135deg,#bbf7d0,#dcfce7)",
  beverages: "linear-gradient(135deg,#e9d5ff,#f3e8ff)",
  paneer:    "linear-gradient(135deg,#fed7aa,#ffedd5)",
  butter:    "linear-gradient(135deg,#fef08a,#fefce8)",
  ghee:      "linear-gradient(135deg,#fde68a,#fffbeb)",
  sweets:    "linear-gradient(135deg,#fbcfe8,#fdf2f8)",
};

function categoryHref(category: ProductCategory): string {
  // Ghee has its own bespoke store page; everything else uses the generic one
  return category.key === "ghee" ? "/ghee" : `/category/${category.key}`;
}

// All images available for a category (one per item that actually has one)
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
  const images = categoryImages(category);
  const href = categoryHref(category);
  const [imgIndex, setImgIndex] = useState(0);

  const hasMultipleImages = images.length > 1;
  const activeImage = images.length > 0 ? images[imgIndex] : null;

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
      {/* Subtle corner milk-drop watermark */}
      <svg className="absolute top-3 right-3 w-6 h-6 opacity-20 pointer-events-none z-10" viewBox="0 0 64 64" fill="none">
        <path d="M32 10 C38 22 46 28 46 38 C46 46 40 51 32 51 C24 51 18 46 18 38 C18 28 26 22 32 10 Z" fill="#ffffff" />
      </svg>

      {/* Image */}
      <div className="relative h-52 sm:h-56 flex items-center justify-center overflow-hidden">
        <div className="absolute w-2/3 h-2/3 rounded-full bg-white/40 blur-2xl" />
        {activeImage ? (
          <img
            key={activeImage}
            src={activeImage}
            alt={`${category.name} ${imgIndex + 1}`}
            className="relative h-40 sm:h-44 object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105 animate-fade-in"
          />
        ) : (
          <div
            className="relative w-36 h-36 rounded-2xl flex items-center justify-center opacity-70"
            style={{ background: FALLBACK_GRADIENT[category.key] ?? "#e5e7eb" }}
          >
            <span className="text-xs text-gray-500 font-semibold text-center px-3">
              {category.name}
            </span>
          </div>
        )}

        {/* Item count badge */}
        <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm text-gray-700 shadow-sm">
          {category.items.length} item{category.items.length !== 1 ? "s" : ""}
        </span>

        {/* Image prev / next arrows — only when there's more than one image */}
        {hasMultipleImages && (
          <>
            <button
              onClick={showPrev}
              aria-label={`Previous ${category.name} image`}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-300 z-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={showNext}
              aria-label={`Next ${category.name} image`}
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

      {/* Text block */}
      <div className="p-6 sm:p-7 flex flex-col flex-grow">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1.5">
          {category.tagline}
        </p>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">
          {category.name}
        </h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {category.subtitle}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(href);
          }}
          className="mt-auto inline-flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-gray-900 font-bold text-sm py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group/btn"
        >
          Shop {category.name}
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
      <svg className="hidden md:block absolute top-2 left-[2%] w-14 h-14 opacity-50 animate-float-slow pointer-events-none" viewBox="0 0 64 64" fill="none">
        <path d="M32 6 C40 22 50 30 50 42 C50 52 42 58 32 58 C22 58 14 52 14 42 C14 30 24 22 32 6 Z" fill="#ffffff" stroke="#60a5fa" strokeWidth="2" />
        <ellipse cx="27" cy="40" rx="4" ry="6" fill="#bfdbfe" opacity="0.7" />
      </svg>
      <svg className="hidden md:block absolute top-1/3 right-[2%] w-16 h-16 opacity-50 animate-float pointer-events-none" viewBox="0 0 64 64" fill="none">
        <path d="M20 24 L44 24 L41 56 L23 56 Z" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
        <path d="M24 24 L20 14 L44 14 L40 24 Z" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
        <rect x="27" y="8" width="10" height="6" rx="2" fill="#3b82f6" />
        <line x1="20" y1="34" x2="44" y2="34" stroke="#93c5fd" strokeWidth="1.5" />
      </svg>
      <svg className="hidden md:block absolute bottom-24 left-[4%] w-12 h-12 opacity-50 animate-float pointer-events-none" viewBox="0 0 64 64" fill="none">
        <path d="M8 44 L52 20 L58 44 Z" fill="#ffffff" stroke="#fbbf24" strokeWidth="2" />
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
                <path d="M16 2 C22 14 28 20 28 28 C28 34.6 22.6 40 16 40 C9.4 40 4 34.6 4 28 C4 20 10 14 16 2 Z" fill="#2563eb" />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-700">
                Shop By Category
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Our Products
            </h2>
          </div>

          {/* Rail nav arrows */}
          <div className="hidden sm:flex items-center gap-2">
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
              <CategoryCard key={category.key} category={category} navigate={navigate} />
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