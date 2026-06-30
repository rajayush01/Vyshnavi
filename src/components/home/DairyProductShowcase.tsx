/**
 * DairyProductShowcase.tsx — Vyshnavi Dairy
 *
 * 3-up paginated card grid driven entirely by vyshnaviData.ts.
 * Each card shows one ProductItem. Pages through items in steps of 3,
 * with dot-pagination and prev/next arrows.
 *
 * Pass a `categoryKey` prop to show only one category's items,
 * or omit it to show all products across all categories.
 *
 * IMAGE NOTE: Extend IMAGE_MAP below as you add real product images.
 */

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── Real asset imports ───────────────────────────────────────────────────
import butter200    from "../../assets/butter-200-bg.png";
import butter500    from "../../assets/butter-500-bg.png";
// import buttermilk   from "../../assets/buttermilk.png";
import curd1        from "../../assets/curd-pouch.png";
import curd_pouch   from "../../assets/curd.png";
import curd_box     from "../../assets/curd-box.png";
import badam_milk   from "../../assets/badam-milk.png";
import chocolate_milk from "../../assets/chocolate-milk.png";
import spl_badam_milk from "../../assets/spl-badam-milk.png";
import img_ghee1    from "../../assets/cow-ghee1l-1.png";
import img_ghee2    from "../../assets/cow-ghee5l-1.png";
import img_ghee3    from "../../assets/buffalo-ghee1l-1.png";

// ── Data source ──────────────────────────────────────────────────────────
import {
  CATEGORIES,
  type ProductItem,
  type ProductCategory,
} from "../../data/vyshnaviData";

// ── Image map ────────────────────────────────────────────────────────────
const IMAGE_MAP: Record<number, string> = {
  // 301: buttermilk,
  304: spl_badam_milk,
  305: badam_milk,
  306: chocolate_milk,
  201: curd1,
  202: curd_pouch,
  203: curd_box,
  501: butter200,
  502: butter500,
  601: img_ghee1,
  602: img_ghee3,
  603: img_ghee2,
};

// ── Category accent colour for the tagline text ──────────────────────────
const ACCENT_COLOR: Record<string, string> = {
  milk:      "text-blue-600",
  curd:      "text-green-600",
  beverages: "text-purple-600",
  paneer:    "text-orange-600",
  butter:    "text-yellow-600",
  ghee:      "text-amber-600",
  sweets:    "text-pink-600",
};

const FALLBACK_GRADIENT: Record<string, string> = {
  milk:      "linear-gradient(135deg,#bfdbfe,#dbeafe)",
  curd:      "linear-gradient(135deg,#bbf7d0,#dcfce7)",
  beverages: "linear-gradient(135deg,#e9d5ff,#f3e8ff)",
  paneer:    "linear-gradient(135deg,#fed7aa,#ffedd5)",
  butter:    "linear-gradient(135deg,#fef08a,#fefce8)",
  ghee:      "linear-gradient(135deg,#fde68a,#fffbeb)",
  sweets:    "linear-gradient(135deg,#fbcfe8,#fdf2f8)",
};

// ── Props ────────────────────────────────────────────────────────────────
interface DairyProductShowcaseProps {
  /** If supplied, only items from this category are shown */
  categoryKey?: string;
}

// ── Flat entry type ──────────────────────────────────────────────────────
interface Entry {
  item: ProductItem;
  category: ProductCategory;
}

// ── Main component ───────────────────────────────────────────────────────
const DairyProductShowcase: React.FC<DairyProductShowcaseProps> = ({
  categoryKey,
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const PAGE_SIZE = 3;

  // Build flat entry list
  const entries: Entry[] = [];
  if (categoryKey) {
    const cat = CATEGORIES.find((c) => c.key === categoryKey);
    if (cat) cat.items.forEach((item) => entries.push({ item, category: cat }));
  } else {
    CATEGORIES.forEach((cat) =>
      cat.items.forEach((item) => entries.push({ item, category: cat }))
    );
  }

  const totalPages = Math.ceil(entries.length / PAGE_SIZE);
  const visibleEntries = entries.slice(
    pageIndex * PAGE_SIZE,
    pageIndex * PAGE_SIZE + PAGE_SIZE
  );

  const handlePrev = () => setPageIndex((p) => Math.max(0, p - 1));
  const handleNext = () => setPageIndex((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="relative">

        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          disabled={pageIndex === 0}
          aria-label="Previous page"
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 transition-all ${
            pageIndex === 0
              ? "opacity-20 cursor-not-allowed"
              : "opacity-50 hover:opacity-100"
          }`}
        >
          <ChevronLeft className="w-10 h-10 text-gray-600" />
        </button>

        <button
          onClick={handleNext}
          disabled={pageIndex >= totalPages - 1}
          aria-label="Next page"
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 transition-all ${
            pageIndex >= totalPages - 1
              ? "opacity-20 cursor-not-allowed"
              : "opacity-50 hover:opacity-100"
          }`}
        >
          <ChevronRight className="w-10 h-10 text-gray-600" />
        </button>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-10">
          {visibleEntries.map(({ item, category }, idx) => {
            const img = IMAGE_MAP[item.id] ?? null;
            const accentClass = ACCENT_COLOR[category.key] ?? "text-gray-600";

            return (
              <div
                key={item.id}
                className={`${category.color} rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col`}
              >
                {/* Text block */}
                <div className="p-8 flex-shrink-0">
                  {/* Category label */}
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                    {category.name}
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    {item.name}
                  </h2>

                  <p className={`font-bold text-sm mb-1 uppercase tracking-wide ${accentClass}`}>
                    {item.description}
                  </p>

                  {/* Variant pills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.variants.slice(0, 4).map((v, vi) => (
                      <span
                        key={vi}
                        className="text-[10px] bg-white/60 border border-white/80 rounded px-2 py-0.5 text-gray-600 font-medium"
                      >
                        {v.size}
                      </span>
                    ))}
                    {item.variants.length > 4 && (
                      <span className="text-[10px] text-gray-500 font-semibold self-center">
                        +{item.variants.length - 4}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-3">
                    {item.content}
                  </p>

                  {/* Tag badge */}
                  {item.tag && (
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 text-white ${
                        item.tag === "Best Seller" ? "bg-blue-600" : "bg-green-600"
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}

                  <button className="text-sm font-bold text-gray-900 hover:text-gray-600 transition-colors inline-flex items-center gap-1">
                    View More <span className="text-base">→</span>
                  </button>
                </div>

                {/* Product image */}
                <div className="h-56 flex items-center justify-center p-4 mt-auto">
                  {img ? (
                    <img
                      src={img}
                      alt={item.name}
                      className="h-52 object-contain drop-shadow-lg"
                    />
                  ) : (
                    <div
                      className="w-36 h-44 rounded-xl flex items-end justify-center pb-3 opacity-60"
                      style={{ background: FALLBACK_GRADIENT[category.key] ?? "#e5e7eb" }}
                    >
                      <span className="text-[10px] text-gray-500 font-semibold text-center px-2">
                        {item.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Empty slot filler so grid stays 3-col on last page */}
          {visibleEntries.length < PAGE_SIZE &&
            Array.from({ length: PAGE_SIZE - visibleEntries.length }).map((_, i) => (
              <div key={`empty-${i}`} className="hidden md:block" />
            ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-3 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPageIndex(i)}
              aria-label={`Page ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                pageIndex === i
                  ? "bg-gray-800 w-8"
                  : "bg-gray-300 w-2.5 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Page counter */}
        <p className="text-center text-xs text-gray-400 mt-3 font-medium">
          {pageIndex * PAGE_SIZE + 1}–
          {Math.min((pageIndex + 1) * PAGE_SIZE, entries.length)} of{" "}
          {entries.length} products
        </p>
      </div>
    </div>
  );
};

export default DairyProductShowcase;