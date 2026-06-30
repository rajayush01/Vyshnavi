/**
 * Portfolio.tsx — Vyshnavi Dairy Product Showcase
 *
 * Images and gallery are read directly from item.image / item.gallery
 * as defined in vyshnaviData.ts. No local IMAGE_MAP needed.
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { CATEGORIES, type ProductCategory, type ProductItem } from "../data/vyshnaviData";

// ── Category helpers (derived from data) ─────────────────────────────────

const CATEGORY_GRADIENT: Record<string, string> = {
  milk:      "linear-gradient(135deg,#bfdbfe,#dbeafe)",
  curd:      "linear-gradient(135deg,#bbf7d0,#dcfce7)",
  beverages: "linear-gradient(135deg,#e9d5ff,#f3e8ff)",
  paneer:    "linear-gradient(135deg,#fed7aa,#ffedd5)",
  butter:    "linear-gradient(135deg,#fef08a,#fefce8)",
  ghee:      "linear-gradient(135deg,#fde68a,#fffbeb)",
  sweets:    "linear-gradient(135deg,#fbcfe8,#fdf2f8)",
};

// ── Sub-components ────────────────────────────────────────────────────────

interface PlaceholderProps { category: string; name: string }

const ImagePlaceholder: React.FC<PlaceholderProps> = ({ category, name }) => (
  <div
    className="w-64 h-80 rounded-2xl flex items-end justify-center pb-4"
    style={{ background: CATEGORY_GRADIENT[category] ?? "#f3f4f6" }}
  >
    <span className="text-xs font-semibold text-gray-500 opacity-70 text-center px-2 leading-tight">
      {name}
    </span>
  </div>
);

interface SelectedThumb { src: string; name: string }

// ── Main component ────────────────────────────────────────────────────────

const Portfolio: React.FC = () => {
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>(CATEGORIES[0].key);
  const [currentIndex, setCurrentIndex]           = useState<number>(0);
  const [selectedThumb, setSelectedThumb]         = useState<SelectedThumb | null>(null);

  const itemsRef     = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bgTextRef    = useRef<HTMLDivElement | null>(null);
  const pillsRef     = useRef<HTMLDivElement | null>(null);

  const activeCategory: ProductCategory =
    CATEGORIES.find((c) => c.key === activeCategoryKey) ?? CATEGORIES[0];
  const currentItems: ProductItem[] = activeCategory.items;
  const singleItem = currentItems.length === 1;
  const accent = activeCategory.accentHex;

  // ── Carousel helpers ──────────────────────────────────────

  const getPos = (idx: number, current: number, total: number) => {
    const diff = (idx - current + total) % total;
    if (diff === 0) {
      return { x: "50%", tx: "-50%", scale: 1.3, y: "50%", ty: "-50%", z: 30, opacity: 1, rot: 0 };
    }
    const side  = diff <= total / 2 ? 1 : -1;
    const depth = Math.min(diff, total - diff);
    return {
      x:       side > 0 ? "65%" : "35%",
      tx:      "-50%",
      scale:   Math.max(0.25, 0.75 - depth * 0.15),
      y:       "50%",
      ty:      "-50%",
      z:       30 - depth * 5,
      opacity: Math.max(0, 0.5 - depth * 0.15),
      rot:     side * depth * 4,
    };
  };

  const animateTo = useCallback((newIdx: number) => {
    currentItems.forEach((_, i) => {
      const p = getPos(i, newIdx, currentItems.length);
      if (itemsRef.current[i]) {
        gsap.to(itemsRef.current[i], {
          left: p.x, x: p.tx, top: p.y, y: p.ty,
          scale: p.scale, zIndex: p.z, opacity: p.opacity,
          rotation: p.rot, duration: 0.8, ease: "power2.inOut",
        });
      }
    });

    if (bgTextRef.current) {
      gsap.to(bgTextRef.current, {
        x: -40, opacity: 0.15, duration: 0.35, ease: "power2.inOut",
        onComplete: () => {
          gsap.to(bgTextRef.current, { x: 0, opacity: 0.06, duration: 0.35, ease: "power2.inOut" });
        },
      });
    }

    setCurrentIndex(newIdx);

    if (pillsRef.current) {
      const pill = pillsRef.current.children[newIdx] as HTMLElement | undefined;
      pill?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [currentItems]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (singleItem) return;
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % currentItems.length;
        animateTo(next);
        return next;
      });
    }, 5000);
  }, [singleItem, currentItems.length, animateTo]);

  const next = () => {
    if (singleItem) return;
    animateTo((currentIndex + 1) % currentItems.length);
    resetAutoPlay();
  };

  const prev = () => {
    if (singleItem) return;
    animateTo((currentIndex - 1 + currentItems.length) % currentItems.length);
    resetAutoPlay();
  };

  const jumpTo = (idx: number) => {
    animateTo(idx);
    resetAutoPlay();
  };

  const changeCategory = (key: string) => {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, {
      opacity: 0, duration: 0.25,
      onComplete: () => {
        setActiveCategoryKey(key);
        setCurrentIndex(0);
        gsap.to(containerRef.current, { opacity: 1, duration: 0.25 });
      },
    });
  };

  // ── Init on category change ────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      currentItems.forEach((_, i) => {
        const p = getPos(i, 0, currentItems.length);
        if (itemsRef.current[i]) {
          gsap.set(itemsRef.current[i], {
            left: p.x, x: p.tx, top: p.y, y: p.ty,
            scale: p.scale, zIndex: p.z, opacity: p.opacity, rotation: p.rot,
          });
        }
      });

      if (itemsRef.current[0]) {
        gsap.from(itemsRef.current[0], {
          scale: 0, rotation: -180, duration: 1, ease: "elastic.out(1, 0.5)",
        });
      }

      resetAutoPlay();
    }, 0);

    return () => {
      clearTimeout(t);
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [activeCategoryKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = currentItems[currentIndex];
  // Read image and gallery directly from the data item
  const gallery    = current.gallery.length > 0 ? current.gallery : (current.image ? [current.image] : []);
  const primaryImg = current.image;

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">

      {/* ── Category Tab Bar ── */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 z-50 flex gap-2 flex-wrap justify-center px-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => changeCategory(cat.key)}
            className={`px-5 py-2.5 rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-300 ${
              activeCategoryKey === cat.key
                ? "text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-amber-50 shadow-md"
            }`}
            style={activeCategoryKey === cat.key ? { backgroundColor: accent } : undefined}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Subtype Pill Row ── */}
      {!singleItem && (
        <div className="absolute top-[7.5rem] left-0 right-0 z-50 flex justify-center px-6 mt-8">
          <div
            ref={pillsRef}
            className="flex gap-2 overflow-x-auto pb-1 max-w-3xl scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {currentItems.map((item, i) => {
              const isActive = i === currentIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => jumpTo(i)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-300 whitespace-nowrap"
                  style={
                    isActive
                      ? { backgroundColor: accent, color: "#fff", boxShadow: `0 2px 12px ${accent}55`, transform: "scale(1.06)" }
                      : { backgroundColor: "rgba(255,255,255,0.85)", color: "#374151", border: "1px solid rgba(0,0,0,0.08)" }
                  }
                >
                  {isActive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-white opacity-80" />}
                  {item.name}
                  {item.tag && (
                    <span
                      className="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: isActive ? "rgba(255,255,255,0.25)" : accent,
                        color: "#fff",
                      }}
                    >
                      {item.tag === "Best Seller" ? "★" : "New"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Background watermark text ── */}
      <div
        ref={bgTextRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
        style={{ opacity: 0.06 }}
      >
        <h1 className="text-[8rem] font-black text-gray-800 whitespace-nowrap select-none">
          {current.name.toUpperCase()}
        </h1>
      </div>

      {/* ── Product carousel ── */}
      <div ref={containerRef} className="relative w-full h-full mt-10">
        {currentItems.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => (itemsRef.current[i] = el)}
            className="absolute opacity-0 cursor-pointer"
            style={{ willChange: "transform, opacity" }}
            onClick={() => jumpTo(i)}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-56 h-72 object-contain drop-shadow-2xl"
              />
            ) : (
              <ImagePlaceholder category={activeCategoryKey} name={item.name} />
            )}
          </div>
        ))}
      </div>

      {/* ── Left description panel ── */}
      <div className="absolute left-6 bottom-32 z-40 max-w-xs">
        <div className="bg-white/85 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/60">
          {current.tag && (
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-3 text-white"
              style={{ backgroundColor: current.tag === "Best Seller" ? "#1d4ed8" : "#16a34a" }}
            >
              {current.tag}
            </span>
          )}
          <h3 className="text-xl font-bold text-gray-900 mb-1">{current.name}</h3>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: accent }}>
            {current.description}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">{current.content}</p>
          {current.variants.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                Available sizes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {current.variants.map((v, vi) => (
                  <span
                    key={vi}
                    className="text-[10px] font-semibold border rounded px-2 py-0.5"
                    style={{ borderColor: `${accent}40`, color: accent, backgroundColor: `${accent}0d` }}
                  >
                    {v.size}{v.packType ? ` (${v.packType})` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Prev / Next buttons ── */}
      {!singleItem && (
        <div className="absolute left-6 bottom-8 z-40 flex gap-3">
          <button onClick={prev} className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center hover:bg-amber-50 transition-colors" aria-label="Previous product">
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={next} className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center hover:bg-amber-50 transition-colors" aria-label="Next product">
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Right thumbnail rail ── */}
      {gallery.length > 0 && (
        <div className="absolute right-6 bottom-8 z-40 flex flex-col gap-2">
          {gallery.map((src, gi) => (
            <button
              key={gi}
              onClick={() => setSelectedThumb({ src, name: current.name })}
              className="w-14 h-14 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-110 ring-2 ring-transparent hover:ring-blue-400"
            >
              <img src={src} alt={`${current.name} ${gi + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ── Dot progress ── */}
      {!singleItem && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {currentItems.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              className="h-2 rounded-full transition-all"
              style={{ width: i === currentIndex ? "1.75rem" : "0.5rem", backgroundColor: i === currentIndex ? accent : "#d1d5db" }}
              aria-label={`Go to product ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Thumbnail lightbox modal ── */}
      {selectedThumb && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8" onClick={() => setSelectedThumb(null)}>
          <div className="relative max-w-3xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img src={selectedThumb.src} alt={selectedThumb.name} className="w-full h-full object-contain rounded-2xl shadow-2xl max-h-[80vh]" />
            <button onClick={() => setSelectedThumb(null)} className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg" aria-label="Close">
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow">
              <p className="text-gray-800 text-sm font-semibold">{selectedThumb.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;