/**
 * Portfolio.tsx — Vyshnavi Dairy Product Showcase
 *
 * Images and gallery are read directly from item.image / item.gallery
 * as defined in vyshnaviData.ts. No local IMAGE_MAP needed.
 *
 * GHEE SPECIAL CASE:
 * Ghee items (Cow Ghee / Buffalo Ghee) have no single "item.image" that
 * makes sense across all pack sizes — each variant (5ml, 100ml, 200ml,
 * 500ml, 1L, 5L…) has its own photo set in `variant.images`. So for the
 * "ghee" category we flatten variants into individual carousel cards
 * instead of showing one card per item. Every other category behaves
 * exactly as before.
 *
 * NOTE: all carousel math (getPos / animateTo / resetAutoPlay / gsap refs)
 * is unchanged from the original — only the surrounding visual layer was
 * elevated.
 *
 * FULLSCREEN LIGHTBOX BEHAVIOUR (updated):
 *  - Overlay is white, close/nav icons are black.
 *  - Carousel autoplay and the drifting background watermark are frozen
 *    for as long as the lightbox is open, and resume the instant it closes.
 *  - You can page left/right through every sub-image of the product that
 *    was open when the lightbox launched (buttons, filmstrip, and arrow
 *    keys), not just view a single static image.
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight, X, Sparkles, ShoppingCart } from "lucide-react";
import { CATEGORIES, type ProductCategory, type ProductItem, type ProductVariant } from "../data/vyshnaviData";
import { useCart } from "../context/cartContext";

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
    className="w-64 h-80 rounded-[28px] flex items-end justify-center pb-4 shadow-[0_30px_60px_-25px_rgba(15,23,42,0.35)]"
    style={{ background: CATEGORY_GRADIENT[category] ?? "#f3f4f6" }}
  >
    <span className="text-xs font-semibold text-gray-500 opacity-70 text-center px-2 leading-tight">
      {name}
    </span>
  </div>
);

// Lightbox now tracks the gallery INDEX (not just a src string) so the
// user can page through every sub-image of the currently selected product.
interface SelectedThumb { index: number; name: string }

// A single carousel-displayable entity. For most categories this maps
// 1:1 to a ProductItem. For "ghee" it maps 1:1 to a variant of an item.
interface DisplayItem {
  id: string | number;
  name: string;
  image: string;
  gallery: string[];
  description: string;
  content: string;
  tag?: "Best Seller" | "New Launch";
  variant?: ProductVariant;   // set when this card represents one specific pack size
  sourceItem: ProductItem;    // the underlying item (for cart / "available sizes")
}

// ── Main component ────────────────────────────────────────────────────────

const Portfolio: React.FC = () => {
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>(CATEGORIES[0].key);
  const [currentIndex, setCurrentIndex]           = useState<number>(0);
  const [selectedThumb, setSelectedThumb]         = useState<SelectedThumb | null>(null);
  const [justAdded, setJustAdded]                 = useState<boolean>(false);
  // Which ghee item (Cow Ghee / Buffalo Ghee) is selected — only relevant
  // when activeCategoryKey === "ghee". null = default to the first item.
  const [activeGheeItemId, setActiveGheeItemId]   = useState<number | null>(null);

  const { addToCart } = useCart();

  const itemsRef     = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bgTextRef    = useRef<HTMLDivElement | null>(null);
  const pillsRef     = useRef<HTMLDivElement | null>(null);

  const activeCategory: ProductCategory =
    CATEGORIES.find((c) => c.key === activeCategoryKey) ?? CATEGORIES[0];

  const isGhee = activeCategoryKey === "ghee";

  // Cow Ghee / Buffalo Ghee — the two selectable ghee "tabs". Falls back to
  // the first item until the user picks one explicitly.
  const selectedGheeItem: ProductItem | undefined = isGhee
    ? activeCategory.items.find((it) => it.id === activeGheeItemId) ?? activeCategory.items[0]
    : undefined;

  // Ghee shows the variants of ONE selected item (Cow or Buffalo) as its own
  // cards; every other category stays item-level.
  const displayItems: DisplayItem[] = useMemo(() => {
    if (isGhee) {
      if (!selectedGheeItem) return [];
      return selectedGheeItem.variants.map((v, vi) => ({
        id: `${selectedGheeItem.id}-${vi}`,
        name: `${selectedGheeItem.name} — ${v.size}`,
        image: v.images?.[0] ?? selectedGheeItem.image,
        gallery: v.images && v.images.length > 0 ? v.images : (selectedGheeItem.image ? [selectedGheeItem.image] : []),
        description: selectedGheeItem.description,
        content: selectedGheeItem.content,
        tag: selectedGheeItem.tag,
        variant: v,
        sourceItem: selectedGheeItem,
      }));
    }
    return activeCategory.items.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      gallery: item.gallery,
      description: item.description,
      content: item.content,
      tag: item.tag,
      variant: undefined,
      sourceItem: item,
    }));
  }, [activeCategory, isGhee, selectedGheeItem]);

  const currentItems = displayItems;
  const singleItem = currentItems.length === 1;
  const accent = activeCategory.accentHex;

  // ── Carousel helpers (unchanged math) ──────────────────────

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
    // Never (re)start the carousel autoplay while the fullscreen
    // lightbox is open — the background must stay perfectly still.
    if (selectedThumb) return;
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % currentItems.length;
        animateTo(next);
        return next;
      });
    }, 5000);
  }, [singleItem, currentItems.length, animateTo, selectedThumb]);

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

  const scrollByPill = (direction: 1 | -1) => {
    const nextIndex =
      (currentIndex + direction + currentItems.length) % currentItems.length;

    jumpTo(nextIndex);
  };

  const changeCategory = (key: string) => {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, {
      opacity: 0, duration: 0.25,
      onComplete: () => {
        setActiveCategoryKey(key);
        setActiveGheeItemId(null); // reset to default (first) ghee item on re-entry
        setCurrentIndex(0);
        gsap.to(containerRef.current, { opacity: 1, duration: 0.25 });
      },
    });
  };

  // Switch between Cow Ghee / Buffalo Ghee tabs
  const changeGheeItem = (id: number) => {
    if (!containerRef.current || id === selectedGheeItem?.id) return;
    gsap.to(containerRef.current, {
      opacity: 0, duration: 0.25,
      onComplete: () => {
        setActiveGheeItemId(id);
        setCurrentIndex(0);
        gsap.to(containerRef.current, { opacity: 1, duration: 0.25 });
      },
    });
  };

  // ── Init on category (or ghee item) change ──────────────────
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
  }, [activeCategoryKey, selectedGheeItem?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pause / resume everything while the fullscreen lightbox is open ──
  useEffect(() => {
    if (selectedThumb) {
      // Freeze the autoplay carousel and the drifting background watermark
      // the instant fullscreen opens.
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      if (bgTextRef.current) gsap.killTweensOf(bgTextRef.current);
    } else {
      // Resume normal behaviour once fullscreen is closed.
      resetAutoPlay();
    }
  }, [selectedThumb]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = currentItems[currentIndex];
  const gallery    = current.gallery.length > 0 ? current.gallery : (current.image ? [current.image] : []);
  const hasGallery = gallery.length > 0;

  // Reset the "added" confirmation whenever the featured card changes
  useEffect(() => {
    setJustAdded(false);
  }, [currentIndex, activeCategoryKey]);

  // Ghee cards ARE a specific variant already, so the variant to add is
  // simply the one attached to the current card.
  const cartVariant = isGhee ? current.variant : undefined;

  const handleAddToCart = () => {
    if (!cartVariant) return;
    addToCart(current.sourceItem, cartVariant, 1);
    setJustAdded(true);
  };

  // ── Lightbox navigation (page through this product's sub-images) ──
  const showNextThumb = useCallback(() => {
    setSelectedThumb((prevThumb) => {
      if (!prevThumb || gallery.length === 0) return prevThumb;
      return { ...prevThumb, index: (prevThumb.index + 1) % gallery.length };
    });
  }, [gallery]);

  const showPrevThumb = useCallback(() => {
    setSelectedThumb((prevThumb) => {
      if (!prevThumb || gallery.length === 0) return prevThumb;
      return { ...prevThumb, index: (prevThumb.index - 1 + gallery.length) % gallery.length };
    });
  }, [gallery]);

  // Keyboard support (Esc to close, arrows to page) while fullscreen is open
  useEffect(() => {
    if (!selectedThumb) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedThumb(null);
      else if (e.key === "ArrowRight") showNextThumb();
      else if (e.key === "ArrowLeft") showPrevThumb();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedThumb, showNextThumb, showPrevThumb]);

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="relative w-full min-h-[100svh] sm:h-screen bg-[#0b1220] overflow-x-hidden overflow-y-auto sm:overflow-y-hidden pt-16 sm:pt-0 pb-6 sm:pb-0">
      {/* Cinematic layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ background: `radial-gradient(circle at 30% 25%, ${accent}22, transparent 55%), radial-gradient(circle at 75% 75%, ${accent}18, transparent 50%)` }}
      />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,0.6)" }} />

      {/* ── Eyebrow + product counter ── */}
      <div className="absolute top-3 sm:top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
        <Sparkles className="w-3.5 h-3.5" style={{ color: accent }} />
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/70">
          The Collection
        </span>
      </div>

      {!singleItem && (
        <div className="hidden sm:flex absolute top-8 right-8 z-50 items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/60 text-xs font-bold tabular-nums">
          <span style={{ color: accent }}>{String(currentIndex + 1).padStart(2, "0")}</span>
          <span className="w-3 h-px bg-white/20" />
          <span>{String(currentItems.length).padStart(2, "0")}</span>
        </div>
      )}

      {/* ── Category Tab Bar ── */}
      {/* <div className="absolute w-full top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 flex gap-2 flex-wrap justify-center px-3 sm:px-4"> */}
      <div className="absolute w-full top-16 sm:top-20 left-0 z-50 px-3 sm:px-4">
        <div className="flex max-w-full gap-1.5 p-2 sm:p-1.5 rounded-[2rem] sm:rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex-wrap justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => changeCategory(cat.key)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-[11px] sm:text-xs uppercase tracking-wide sm:tracking-wider transition-all duration-300 ${
                activeCategoryKey === cat.key
                  ? "text-white shadow-lg scale-105"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
              style={activeCategoryKey === cat.key ? { backgroundColor: accent, boxShadow: `0 8px 24px -8px ${accent}99` } : undefined}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Ghee Type Tabs (Cow / Buffalo) ── */}
      {isGhee && activeCategory.items.length > 1 && (
        <div className="absolute top-[8.5rem] sm:top-[8.25rem] left-1/2 -translate-x-1/2 z-50 flex gap-2 mt-2 sm:mt-5 px-4 flex-wrap justify-center">
          {activeCategory.items.map((item) => {
            const isActive = item.id === selectedGheeItem?.id;
            return (
              <button
                key={item.id}
                onClick={() => changeGheeItem(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                  isActive ? "text-white scale-105" : "text-white/50 hover:text-white/80 border-white/10 hover:bg-white/5"
                }`}
                style={
                  isActive
                    ? { backgroundColor: accent, borderColor: accent, boxShadow: `0 8px 20px -8px ${accent}99` }
                    : { backgroundColor: "rgba(255,255,255,0.03)" }
                }
              >
                {item.name}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Subtype / Variant Pill Row ── */}
      {!singleItem && ( 
        <div className={`absolute ${isGhee ? "top-[11.5rem] sm:top-[10.75rem]" : "top-[10.75rem] sm:top-[8.25rem]"} left-0 right-0 z-50 flex items-center justify-center gap-2 px-3 sm:px-6 mt-2 sm:mt-8`}>
       
          <button
            onClick={() => scrollByPill(-1)}
            aria-label="Scroll varieties left"
            className="hidden sm:flex flex-shrink-0 w-8 h-8 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-white/70" />
          </button>

          <div className="relative max-w-[calc(100vw-2rem)] sm:max-w-3xl">
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#0b1220] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0b1220] to-transparent z-10 pointer-events-none" />
            <div
              ref={pillsRef}
              className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {currentItems.map((item, i) => {
                const isActive = i === currentIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => jumpTo(i)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold transition-all duration-300 whitespace-nowrap"
                    style={
                      isActive
                        ? { backgroundColor: accent, color: "#fff", boxShadow: `0 4px 16px ${accent}66`, transform: "scale(1.06)" }
                        : { backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.08)" }
                    }
                  >
                    {isActive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-white opacity-80" />}
                    {isGhee && item.variant ? item.variant.size : item.name}
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

          <button
            onClick={() => scrollByPill(1)}
            aria-label="Scroll varieties right"
            className="hidden sm:flex flex-shrink-0 w-8 h-8 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5 text-white/70" />
          </button>
        </div>
      )}

      {/* ── Background watermark text ── */}
      <div
        ref={bgTextRef}
        className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
        style={{ opacity: 0.06 }}
      >
        <h1
          className="text-[8rem] font-black whitespace-nowrap select-none bg-clip-text text-transparent"
          style={{ backgroundImage: `linear-gradient(135deg, ${accent}, #ffffff)`, WebkitTextStroke: "1px rgba(255,255,255,0.08)" }}
        >
          {current.sourceItem.name.toUpperCase()}
        </h1>
      </div>

      {/* ── Product carousel ── */}
      <div ref={containerRef} className={`relative w-full h-[22rem] sm:h-full ${isGhee ? "mt-[15.5rem] sm:mt-16" : "mt-[13.5rem] sm:mt-10"}`}>
        {currentItems.map((item, i) => {
          const isActive = i === currentIndex;
          return (
            <div
              key={item.id}
              ref={(el) => (itemsRef.current[i] = el)}
              className="absolute opacity-0 cursor-pointer"
              style={{ willChange: "transform, opacity" }}
              onClick={() => jumpTo(i)}
            >
              <div className="relative flex items-center justify-center">
                {/* Ambient glow behind the active product */}
                {isActive && (
                  <div
                    className="absolute w-52 h-52 sm:w-72 sm:h-72 rounded-full blur-3xl transition-colors duration-700"
                    style={{ background: `${accent}33` }}
                  />
                )}
                {/* Ground shadow ellipse for premium studio feel */}
                {isActive && (
                  <div className="absolute -bottom-6 w-32 h-6 rounded-full bg-black/40 blur-xl" />
                )}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="relative w-40 h-52 sm:w-56 sm:h-72 object-contain drop-shadow-2xl"
                  />
                ) : (
                  <ImagePlaceholder category={activeCategoryKey} name={item.name} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Left description panel ── */}
      <div className="absolute left-4 right-4 sm:right-auto sm:left-6 bottom-16 sm:bottom-32 z-40 max-w-none sm:max-w-xs">
        <div
          key={current.id}
          className="relative bg-white/[0.06] backdrop-blur-2xl rounded-[26px] p-4 sm:p-6 shadow-2xl border border-white/10 animate-[panelFadeUp_0.5s_cubic-bezier(0.25,0.46,0.45,0.94)_both]"
        >
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          {current.tag && (
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 text-white"
              style={{ backgroundColor: current.tag === "Best Seller" ? accent : "#16a34a" }}
            >
              {current.tag}
            </span>
          )}
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1 tracking-tight">
            {current.sourceItem.name}
            {current.variant && (
              <span className="ml-2 text-sm font-semibold" style={{ color: accent }}>
                {current.variant.size}
              </span>
            )}
          </h3>
          <p className="text-xs font-bold uppercase tracking-wide mb-2.5" style={{ color: accent }}>
            {current.description}
          </p>
          <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-4">{current.content}</p>

          {hasGallery && (
            <button
              onClick={() => setSelectedThumb({ index: 0, name: current.name })}
              className="sm:hidden mb-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/85"
            >
              View gallery
            </button>
          )}

          {current.sourceItem.variants.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
                Available sizes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {current.sourceItem.variants.map((v, vi) => {
                  const isSelected = current.variant?.size === v.size;
                  return (
                    <span
                      key={vi}
                      className="text-[10px] font-semibold border rounded-md px-2 py-1"
                      style={
                        isSelected
                          ? { borderColor: accent, color: "#fff", backgroundColor: accent }
                          : { borderColor: `${accent}40`, color: accent, backgroundColor: `${accent}14` }
                      }
                    >
                      {v.size}{v.packType ? ` (${v.packType})` : ""}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {isGhee && cartVariant && (
            <>
              {cartVariant.price != null && (
                <p className="mt-4 text-lg font-bold text-white">
                  ₹{cartVariant.price}
                  {cartVariant.perUnit && <span className="text-white/40 text-xs font-medium"> / {cartVariant.perUnit}</span>}
                </p>
              )}
              <button
                onClick={handleAddToCart}
                className="mt-3 w-full flex items-center justify-center gap-2 text-white font-bold text-sm py-3 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: justAdded ? "#16a34a" : accent,
                  boxShadow: `0 15px 30px -14px ${justAdded ? "#16a34a" : accent}aa`,
                }}
              >
                <ShoppingCart size={16} />
                {justAdded ? "Added to cart" : "Add to cart"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Prev / Next buttons ── */}
      {!singleItem && (
        <div className="hidden sm:flex absolute left-6 bottom-8 z-40 gap-3">
          <button
            onClick={prev}
            className="w-12 h-12 bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-full shadow-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-5 h-5 text-white/80" strokeWidth={2.5} />
          </button>
          <button
            onClick={next}
            className="w-12 h-12 bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-full shadow-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            aria-label="Next product"
          >
            <ChevronRight className="w-5 h-5 text-white/80" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* ── Right thumbnail rail ── */}
      {hasGallery && (
        <div className="hidden sm:flex absolute right-6 bottom-8 z-40 flex-col gap-2.5">
          {gallery.map((src, gi) => (
            <button
              key={gi}
              onClick={() => setSelectedThumb({ index: gi, name: current.name })}
              className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-110 ring-2 ring-white/10 hover:ring-2 group"
              style={{ ["--tw-ring-color" as any]: `${accent}` }}
            >
              <img src={src} alt={`${current.name} ${gi + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}
        </div>
      )}

      {/* ── Progress bar ── */}
      {!singleItem && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {currentItems.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === currentIndex ? "2.25rem" : "0.5rem",
                backgroundColor: i === currentIndex ? accent : "rgba(255,255,255,0.15)",
                boxShadow: i === currentIndex ? `0 0 16px ${accent}88` : "none",
              }}
              aria-label={`Go to product ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Thumbnail lightbox modal ──
           White overlay + black chrome per spec, with left/right paging
           through every sub-image of the current product, and the rest of
           the page (autoplay + watermark drift) frozen while it's open. */}
      {selectedThumb && gallery.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-[lightboxFadeIn_0.25s_ease-out]"
          onClick={() => setSelectedThumb(null)}
        >
          <div
            className="relative max-w-[calc(100vw-2rem)] sm:max-w-3xl max-h-full animate-[lightboxZoomIn_0.3s_cubic-bezier(0.25,0.46,0.45,0.94)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Milk category gets a black card behind the image in fullscreen;
                every other category stays on the plain white overlay. */}
            <div
              className="rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: activeCategoryKey === "milk" ? "#99BFEB" : "#99BFEB" }}
            >
              <img
                src={gallery[selectedThumb.index]}
                alt={`${selectedThumb.name} ${selectedThumb.index + 1}`}
                className="w-full h-full object-contain max-h-[80vh]"
              />
            </div>

            {/* Close — black icon on light chrome, per spec */}
            <button
              onClick={() => setSelectedThumb(null)}
              className="absolute top-3 right-3 w-10 h-10 bg-black/50 backdrop-blur-xl border border-black/10 rounded-full flex items-center justify-center hover:bg-black/40 transition-colors shadow-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>

            {/* Paging through this product's other sub-images */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={showPrevThumb}
                  className="absolute top-1/2 -translate-y-1/2 left-3 w-10 h-10 bg-black/50 backdrop-blur-xl border border-black/10 rounded-full flex items-center justify-center hover:bg-black/40 transition-colors shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
                </button>
                <button
                  onClick={showNextThumb}
                  className="absolute top-1/2 -translate-y-1/2 right-3 w-10 h-10 bg-black/50 backdrop-blur-xl border border-black/10 rounded-full flex items-center justify-center hover:bg-black/40 transition-colors shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-white" strokeWidth={2.5} />
                </button>

                {/* Scrollable filmstrip of every sub-image for this product */}
                <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-2 py-1 scrollbar-hide">
                  {gallery.map((src, gi) => (
                    <button
                      key={gi}
                      onClick={() => setSelectedThumb({ index: gi, name: selectedThumb.name })}
                      className="relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden shadow-md transition-all duration-200"
                      style={{
                        outline: gi === selectedThumb.index ? `2px solid ${accent}` : "2px solid transparent",
                        opacity: gi === selectedThumb.index ? 1 : 0.55,
                      }}
                    >
                      <img src={src} alt={`${selectedThumb.name} ${gi + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/5 backdrop-blur-xl border border-black/10 px-5 py-2 rounded-full shadow">
              <p className="text-black text-sm font-semibold">
                {selectedThumb.name}
                {gallery.length > 1 && (
                  <span className="text-black/40 font-normal">
                    {" "}· {selectedThumb.index + 1}/{gallery.length}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes panelFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lightboxFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lightboxZoomIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </div>
  );
};

export default Portfolio;
