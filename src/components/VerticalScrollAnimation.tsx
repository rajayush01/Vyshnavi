/**
 * MobilePortfolio.tsx — Vyshnavi Dairy, mobile-only experience
 *
 * Same product data and behaviour as Portfolio.tsx (categories, ghee
 * variant flattening, cart, image galleries) but built as a distinct,
 * touch-native design rather than a shrunk-down desktop carousel.
 *
 * DESIGN CONCEPT — "the milk pouch deck"
 * Everyday Indian dairy comes in two familiar objects: the torn-open
 * plastic pouch, and the steel tiffin box you unpack it into. That's
 * the whole visual system here:
 *   - Products are a stacked deck of "pouch" cards with a torn top
 *     edge and a stitched seam — drag left/right to move through them.
 *   - Category switching happens on a "clothesline": a thread strung
 *     across the top with a wooden pin marking the active category.
 *   - Details live in a tiffin-lid sheet that you drag up from the
 *     bottom — closed it just shows name + price, pulled up it reveals
 *     description, sizes, and (for ghee) the buy button.
 *   - Tapping the pouch opens a fullscreen gallery you page through
 *     with a swipe, same white-overlay / black-chrome language as the
 *     desktop lightbox.
 *
 * This file is self-contained and only touches mobile viewports — mount
 * it behind your own breakpoint/device check (e.g. render <MobilePortfolio />
 * instead of <Portfolio /> under a `useIsMobile()` hook or a `md:hidden`
 * wrapper in the parent route).
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ShoppingCart, Pin } from "lucide-react";
import { CATEGORIES, type ProductCategory, type ProductItem, type ProductVariant } from "../data/vyshnaviData";
import { useCart } from "../context/cartContext";

// ── Shared display model (mirrors Portfolio.tsx) ──────────────────────────

interface DisplayItem {
  id: string | number;
  name: string;
  image: string;
  gallery: string[];
  description: string;
  content: string;
  tag?: "Best Seller" | "New Launch";
  variant?: ProductVariant;
  sourceItem: ProductItem;
}

const SWIPE_THRESHOLD = 70;      // px of horizontal drag to change product
const SHEET_PEEK = 128;          // px of the tiffin sheet visible when closed

const VerticalScrollAnimation: React.FC = () => {
  const { addToCart } = useCart();

  const [activeCategoryKey, setActiveCategoryKey] = useState<string>(CATEGORIES[0].key);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeGheeItemId, setActiveGheeItemId] = useState<number | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<{ index: number } | null>(null);
  const [hintVisible, setHintVisible] = useState(true);

  // drag state for the card deck (not React state — avoids re-render storms)
  const dragRef = useRef({ active: false, startX: 0, dx: 0 });
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  // drag state for the tiffin sheet
  const sheetDragRef = useRef({ active: false, startY: 0 });
  const [sheetDragY, setSheetDragY] = useState(0);
  const [sheetDragging, setSheetDragging] = useState(false);

  // drag state for the lightbox
  const lbDragRef = useRef({ active: false, startX: 0, dx: 0 });
  const [lbDragX, setLbDragX] = useState(0);
  const [lbDragging, setLbDragging] = useState(false);

  const activeCategory: ProductCategory =
    CATEGORIES.find((c) => c.key === activeCategoryKey) ?? CATEGORIES[0];
  const isGhee = activeCategoryKey === "ghee";
  const accent = activeCategory.accentHex;

  const selectedGheeItem: ProductItem | undefined = isGhee
    ? activeCategory.items.find((it) => it.id === activeGheeItemId) ?? activeCategory.items[0]
    : undefined;

  const displayItems: DisplayItem[] = useMemo(() => {
    if (isGhee) {
      if (!selectedGheeItem) return [];
      return selectedGheeItem.variants.map((v, vi) => ({
        id: `${selectedGheeItem.id}-${vi}`,
        name: `${selectedGheeItem.name} — ${v.size}`,
        image: v.images?.[0] ?? selectedGheeItem.image,
        gallery: v.images && v.images.length > 0 ? v.images : selectedGheeItem.image ? [selectedGheeItem.image] : [],
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

  const total = displayItems.length;
  const current = displayItems[currentIndex] ?? displayItems[0];
  const singleItem = total <= 1;
  const gallery = current ? (current.gallery.length > 0 ? current.gallery : current.image ? [current.image] : []) : [];
  const cartVariant = isGhee ? current?.variant : undefined;

  // ── Category / ghee-tab switching ──────────────────────────
  const changeCategory = (key: string) => {
    if (key === activeCategoryKey) return;
    setActiveCategoryKey(key);
    setActiveGheeItemId(null);
    setCurrentIndex(0);
    setSheetExpanded(false);
  };

  const changeGheeItem = (id: number) => {
    if (id === selectedGheeItem?.id) return;
    setActiveGheeItemId(id);
    setCurrentIndex(0);
    setSheetExpanded(false);
  };

  useEffect(() => {
    setJustAdded(false);
  }, [currentIndex, activeCategoryKey]);

  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 3200);
    return () => clearTimeout(t);
  }, []);

  const goTo = useCallback((idx: number) => {
    if (total === 0) return;
    setCurrentIndex(((idx % total) + total) % total);
    setHintVisible(false);
  }, [total]);

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  // ── Card deck drag handlers ─────────────────────────────────
  const onCardPointerDown = (e: React.PointerEvent) => {
    if (singleItem) return;
    dragRef.current = { active: true, startX: e.clientX, dx: 0 };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onCardPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.dx = dx;
    setDragX(dx);
  };

  const endCardDrag = () => {
    if (!dragRef.current.active) return;
    const dx = dragRef.current.dx;
    dragRef.current.active = false;
    setDragging(false);
    setDragX(0);
    if (dx <= -SWIPE_THRESHOLD) next();
    else if (dx >= SWIPE_THRESHOLD) prev();
  };

  // ── Tiffin sheet drag handlers ──────────────────────────────
  const onSheetPointerDown = (e: React.PointerEvent) => {
    sheetDragRef.current = { active: true, startY: e.clientY };
    setSheetDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onSheetPointerMove = (e: React.PointerEvent) => {
    if (!sheetDragRef.current.active) return;
    setSheetDragY(e.clientY - sheetDragRef.current.startY);
  };

  const endSheetDrag = () => {
    if (!sheetDragRef.current.active) return;
    sheetDragRef.current.active = false;
    setSheetDragging(false);
    if (sheetDragY <= -40) setSheetExpanded(true);
    else if (sheetDragY >= 40) setSheetExpanded(false);
    setSheetDragY(0);
  };

  // ── Lightbox drag (swipe through this product's gallery) ───
  const showRelativeThumb = useCallback((delta: number) => {
    setLightbox((prevLb) => {
      if (!prevLb || gallery.length === 0) return prevLb;
      return { index: (prevLb.index + delta + gallery.length) % gallery.length };
    });
  }, [gallery]);

  const onLbPointerDown = (e: React.PointerEvent) => {
    lbDragRef.current = { active: true, startX: e.clientX, dx: 0 };
    setLbDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onLbPointerMove = (e: React.PointerEvent) => {
    if (!lbDragRef.current.active) return;
    const dx = e.clientX - lbDragRef.current.startX;
    lbDragRef.current.dx = dx;
    setLbDragX(dx);
  };

  const endLbDrag = () => {
    if (!lbDragRef.current.active) return;
    const dx = lbDragRef.current.dx;
    lbDragRef.current.active = false;
    setLbDragging(false);
    setLbDragX(0);
    if (gallery.length > 1) {
      if (dx <= -50) showRelativeThumb(1);
      else if (dx >= 50) showRelativeThumb(-1);
    }
  };

  const handleAddToCart = () => {
    if (!cartVariant || !current) return;
    addToCart(current.sourceItem, cartVariant, 1);
    setJustAdded(true);
  };

  if (!current) return null;

  // ── Torn-pouch top edge (signature shape) ───────────────────
  const TORN_EDGE = "polygon(0% 7%,4% 3%,8% 8%,12% 2%,16% 7%,20% 3%,24% 8%,28% 2%,32% 7%,36% 3%,40% 8%,44% 2%,48% 7%,52% 3%,56% 8%,60% 2%,64% 7%,68% 3%,72% 8%,76% 2%,80% 7%,84% 3%,88% 8%,92% 2%,96% 7%,100% 3%,100% 100%,0% 100%)";

  return (
    <div className="relative w-full h-[100dvh] bg-[#0b1220] overflow-hidden select-none touch-none">
      {/* backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{ background: `radial-gradient(circle at 50% 0%, ${accent}26, transparent 60%)` }}
      />

      {/* ── Clothesline category rail ── */}
      <div className="relative z-40 pt-5 px-4">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/50">Vyshnavi Dairy</span>
        </div>
        <div className="relative">
          <div className="absolute left-0 right-0 top-[18px] h-px bg-white/15" />
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const isActive = cat.key === activeCategoryKey;
              return (
                <button
                  key={cat.key}
                  onClick={() => changeCategory(cat.key)}
                  className="relative flex-shrink-0 flex flex-col items-center gap-1.5 pt-1"
                >
                  <Pin
                    className="w-3.5 h-3.5 transition-transform duration-300"
                    strokeWidth={2.5}
                    style={{
                      color: isActive ? cat.accentHex : "rgba(255,255,255,0.25)",
                      transform: isActive ? "rotate(0deg) scale(1.15)" : "rotate(-25deg)",
                    }}
                  />
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider whitespace-nowrap px-2 py-1 rounded-full transition-all duration-300 ${
                      isActive ? "text-white" : "text-white/40"
                    }`}
                    style={isActive ? { backgroundColor: `${cat.accentHex}33`, border: `1px solid ${cat.accentHex}66` } : undefined}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ghee sub-tabs */}
        {isGhee && activeCategory.items.length > 1 && (
          <div className="flex gap-2 mt-1 mb-1">
            {activeCategory.items.map((item) => {
              const isActive = item.id === selectedGheeItem?.id;
              return (
                <button
                  key={item.id}
                  onClick={() => changeGheeItem(item.id)}
                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all"
                  style={
                    isActive
                      ? { backgroundColor: accent, borderColor: accent, color: "#fff" }
                      : { borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }
                  }
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Pouch card deck ── */}
      <div className="relative z-10 flex items-center justify-center" style={{ height: `calc(100dvh - 210px)` }}>
        {displayItems.map((item, i) => {
          const rel = (() => {
            const raw = i - currentIndex;
            if (raw > total / 2) return raw - total;
            if (raw < -total / 2) return raw + total;
            return raw;
          })();
          if (Math.abs(rel) > 1) return null; // only render current ± 1

          const isTop = rel === 0;
          const baseX = rel * 26; // peeking offset for neighbours, in px
          const translateX = isTop ? dragX : baseX;
          const rotate = isTop ? dragX / 18 : rel * 4;
          const scale = isTop ? 1 : 0.9;
          const opacity = isTop ? 1 : 0.45;

          return (
            <div
              key={item.id}
              className="absolute w-[72vw] max-w-[300px] flex flex-col items-center"
              style={{
                zIndex: isTop ? 30 : 10 - Math.abs(rel),
                transform: `translateX(${translateX}px) rotate(${rotate}deg) scale(${scale})`,
                opacity,
                transition: isTop && dragging ? "none" : "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.35s",
                pointerEvents: isTop ? "auto" : "none",
              }}
              onPointerDown={isTop ? onCardPointerDown : undefined}
              onPointerMove={isTop ? onCardPointerMove : undefined}
              onPointerUp={isTop ? endCardDrag : undefined}
              onPointerCancel={isTop ? endCardDrag : undefined}
            >
              {item.tag && (
                <span
                  className="absolute -top-3 z-10 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white shadow-lg"
                  style={{ backgroundColor: item.tag === "Best Seller" ? accent : "#16a34a" }}
                >
                  {item.tag === "Best Seller" ? "★ Best Seller" : "New Launch"}
                </span>
              )}
              <div
                className="w-full aspect-[4/5] flex items-center justify-center overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]"
                style={{
                  clipPath: TORN_EDGE,
                  background: `linear-gradient(160deg, ${accent}29, rgba(255,255,255,0.04))`,
                  border: "1px dashed rgba(255,255,255,0.18)",
                }}
                onClick={() => isTop && setLightbox({ index: 0 })}
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-[68%] h-[68%] object-contain drop-shadow-2xl pointer-events-none" />
                ) : (
                  <span className="text-xs font-semibold text-white/50 text-center px-4">{item.name}</span>
                )}
              </div>
            </div>
          );
        })}

        {/* swipe hint */}
        {hintVisible && !singleItem && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/40 text-[11px] font-semibold animate-pulse pointer-events-none">
            <ChevronLeft className="w-3.5 h-3.5" />
            swipe the pouch
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* progress dots */}
      {!singleItem && (
        <div className="relative z-20 flex justify-center gap-1.5 mb-3">
          {displayItems.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="h-1.5 rounded-full transition-all duration-400"
              style={{
                width: i === currentIndex ? "1.6rem" : "0.4rem",
                backgroundColor: i === currentIndex ? accent : "rgba(255,255,255,0.2)",
              }}
              aria-label={`Go to product ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Tiffin-lid detail sheet ── */}
      <div
        className="fixed left-0 right-0 bottom-0 z-40 rounded-t-[28px] bg-[#141b2e]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
        style={{
          height: "72dvh",
          transform: sheetExpanded
            ? `translateY(${sheetDragging ? sheetDragY : 0}px)`
            : `translateY(calc(100% - ${SHEET_PEEK}px + ${sheetDragging ? sheetDragY : 0}px))`,
          transition: sheetDragging ? "none" : "transform 0.32s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        <div
          className="pt-2.5 pb-1 flex flex-col items-center cursor-grab active:cursor-grabbing"
          onClick={() => setSheetExpanded((s) => !s)}
          onPointerDown={onSheetPointerDown}
          onPointerMove={onSheetPointerMove}
          onPointerUp={endSheetDrag}
          onPointerCancel={endSheetDrag}
        >
          <div className="w-10 h-1 rounded-full bg-white/25" />
        </div>

        <div className="px-6 pb-8 overflow-y-auto" style={{ height: "calc(72dvh - 28px)" }}>
          <div className="flex items-start justify-between gap-3 pt-1">
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {current.sourceItem.name}
                {current.variant && (
                  <span className="ml-2 text-sm font-semibold" style={{ color: accent }}>
                    {current.variant.size}
                  </span>
                )}
              </h3>
              <p className="text-[11px] font-bold uppercase tracking-wide mt-1" style={{ color: accent }}>
                {current.description}
              </p>
            </div>
            {isGhee && cartVariant?.price != null && (
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-bold text-white">₹{cartVariant.price}</p>
                {cartVariant.perUnit && <p className="text-white/40 text-[10px]">/ {cartVariant.perUnit}</p>}
              </div>
            )}
          </div>

          <p className="text-white/60 text-sm leading-relaxed mt-3">{current.content}</p>

          {current.sourceItem.variants.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Available sizes</p>
              <div className="flex flex-wrap gap-1.5">
                {current.sourceItem.variants.map((v, vi) => {
                  const isSelected = current.variant?.size === v.size;
                  return (
                    <span
                      key={vi}
                      className="text-[11px] font-semibold border rounded-md px-2.5 py-1"
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

          {gallery.length > 1 && (
            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">More photos</p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {gallery.map((src, gi) => (
                  <button
                    key={gi}
                    onClick={() => setLightbox({ index: gi })}
                    className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-white/10"
                  >
                    <img src={src} alt={`${current.name} ${gi + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {isGhee && cartVariant && (
            <button
              onClick={handleAddToCart}
              className="mt-6 w-full flex items-center justify-center gap-2 text-white font-bold text-sm py-3.5 rounded-2xl transition-all duration-300"
              style={{
                backgroundColor: justAdded ? "#16a34a" : accent,
                boxShadow: `0 15px 30px -14px ${justAdded ? "#16a34a" : accent}aa`,
              }}
            >
              <ShoppingCart size={16} />
              {justAdded ? "Added to cart" : "Add to cart"}
            </button>
          )}
        </div>
      </div>

      {/* collapsed-state peek row (name + price, visible under the handle when closed) */}
      {!sheetExpanded && (
        <div
          className="fixed left-0 right-0 z-30 px-6 flex items-center justify-between pointer-events-none"
          style={{ bottom: `${SHEET_PEEK - 68}px` }}
        >
          <div className="pointer-events-auto">
            <p className="text-white font-bold text-sm">{current.sourceItem.name}{current.variant ? ` · ${current.variant.size}` : ""}</p>
            <p className="text-white/40 text-[11px]">tap to peel back for details</p>
          </div>
          {isGhee && cartVariant?.price != null && (
            <p className="text-white font-bold text-base pointer-events-auto">₹{cartVariant.price}</p>
          )}
        </div>
      )}

      {/* ── Fullscreen gallery lightbox ── */}
      {lightbox && gallery.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-white/95 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={onLbPointerDown}
            onPointerMove={onLbPointerMove}
            onPointerUp={endLbDrag}
            onPointerCancel={endLbDrag}
          >
            <div
              className="rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                backgroundColor: activeCategoryKey === "milk" ? "#036AAD" : "transparent",
                transform: `translateX(${lbDragX}px)`,
                transition: lbDragging ? "none" : "transform 0.25s ease-out",
              }}
            >
              <img
                src={gallery[lightbox.index]}
                alt={`${current.name} ${lightbox.index + 1}`}
                className="w-full max-h-[65dvh] object-contain pointer-events-none"
              />
            </div>

            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-2 right-0 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center shadow-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>

            {gallery.length > 1 && (
              <>
                <div className="flex items-center justify-center gap-2 mt-4">
                  {gallery.map((_, gi) => (
                    <button
                      key={gi}
                      onClick={() => setLightbox({ index: gi })}
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: gi === lightbox.index ? "1.4rem" : "0.4rem",
                        backgroundColor: gi === lightbox.index ? accent : "rgba(0,0,0,0.15)",
                      }}
                    />
                  ))}
                </div>
                <p className="text-center text-black/50 text-xs font-semibold mt-2">
                  swipe to see more · {lightbox.index + 1}/{gallery.length}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </div>
  );
};

export default VerticalScrollAnimation;