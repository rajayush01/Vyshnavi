/**
 * VerticalScrollAnimation.tsx — Vyshnavi Dairy, Mobile / Phone View
 *
 * This is the phone counterpart to Portfolio.tsx. It now mirrors Portfolio's
 * data model exactly instead of running its own independent one:
 *
 *  - Same CATEGORIES tab bar, same accentHex-driven theming (no more
 *    hardcoded Tailwind gradient map).
 *  - Same ghee special case: Cow Ghee / Buffalo Ghee sub-tabs, with each
 *    ghee item's `variants` flattened into individual cards.
 *  - Same variant pill row + "Available sizes" chips.
 *  - Same cart integration (Add to Cart only appears for ghee variants,
 *    exactly like Portfolio).
 *  - Same dark cinematic panel language (glass cards, accent glows).
 *
 * Interaction differs on purpose: instead of Portfolio's carousel, this is a
 * vertical stacked-scroll (GSAP ScrollTrigger) through the items of whichever
 * category/ghee-item is active — built for one-handed phone scrolling.
 *
 * Responsiveness fixes applied:
 *  - 100dvh instead of 100vh (avoids mobile browser chrome jump).
 *  - No more fixed px image boxes (w-64/w-80/h-[440px]) — images now size
 *    off the viewport with clamp()-style Tailwind arbitrary values so they
 *    never overflow a 320–360px wide screen.
 *  - Watermark type uses clamp() instead of a fixed 6rem/10rem block that
 *    overflowed on narrow phones.
 *  - Tab rows are horizontally scrollable with hidden scrollbars instead of
 *    wrapping and eating vertical space.
 *  - Safe-area padding for notches (env(safe-area-inset-*)).
 *  - Info panel content is scrollable/clamped so it never gets clipped by
 *    the fixed-height stacked section on short screens.
 *  - Outer wrapper is overflow-x-hidden to kill any stray horizontal scroll.
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, X, Sparkles, ShoppingCart, Star } from 'lucide-react';
import { CATEGORIES, type ProductCategory, type ProductItem, type ProductVariant } from '../data/vyshnaviData';
import { useCart } from '../context/cartContext';

gsap.registerPlugin(ScrollTrigger);

// ── Flat, category-scoped display entity ──────────────────────────────────
// Same shape/idea as Portfolio's DisplayItem: for "ghee" this represents one
// variant of the selected ghee item; for every other category it's 1:1 with
// a ProductItem.
interface DisplayItem {
  id: string | number;
  name: string;
  image: string;
  gallery: string[];
  description: string;
  content: string;
  tag?: 'Best Seller' | 'New Launch';
  rating?: number;
  reviews?: number;
  variant?: ProductVariant;
  sourceItem: ProductItem;
}

const VerticalScrollAnimation: React.FC = () => {
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>(CATEGORIES[0].key);
  const [activeGheeItemId, setActiveGheeItemId] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedGallery, setSelectedGallery] = useState<{ item: DisplayItem; imageIndex: number } | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | number | null>(null);

  const { addToCart } = useCart();

  const stackRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const categoryPillsRef = useRef<HTMLDivElement>(null);

  const activeCategory: ProductCategory = CATEGORIES.find(c => c.key === activeCategoryKey) ?? CATEGORIES[0];
  const isGhee = activeCategoryKey === 'ghee';
  const accent = activeCategory.accentHex;
  const categoryIndex = CATEGORIES.findIndex(c => c.key === activeCategoryKey);

  const selectedGheeItem: ProductItem | undefined = isGhee
    ? activeCategory.items.find(it => it.id === activeGheeItemId) ?? activeCategory.items[0]
    : undefined;

  // ── Build the scoped list for the current category/ghee-item ───────────
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
    return activeCategory.items.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image,
      gallery: item.gallery,
      description: item.description,
      content: item.content,
      tag: item.tag,
      rating: (item as any).rating,
      reviews: (item as any).reviews,
      variant: undefined,
      sourceItem: item,
    }));
  }, [activeCategory, isGhee, selectedGheeItem]);

  // ── Stacked-scroll setup — rebuilt whenever the item list changes ──────
  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, displayItems.length);
    const sections = sectionRefs.current.filter((s): s is HTMLDivElement => s !== null);
    if (sections.length === 0) return;

    gsap.set(sections, { yPercent: 0, opacity: 1 });
    if (sections.length > 1) {
      gsap.set(sections.slice(1), { yPercent: 100, opacity: 0 });
    }

    const triggers: ScrollTrigger[] = [];
    sections.forEach((section, index) => {
      if (index === 0) return;
      const tween = gsap.to(section, {
        yPercent: 0,
        opacity: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: sections[index - 1],
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, [displayItems]);

  // ── Category / ghee-item switching ──────────────────────────────────────
  const changeCategory = (key: string) => {
    if (key === activeCategoryKey) return;
    setActiveCategoryKey(key);
    setActiveGheeItemId(null);
    setActiveIndex(0);
    stackRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  // Prev/next category, with wraparound — used by the arrow buttons flanking
  // the category tab row.
  const goToAdjacentCategory = (direction: 1 | -1) => {
    const nextIndex = (categoryIndex + direction + CATEGORIES.length) % CATEGORIES.length;
    changeCategory(CATEGORIES[nextIndex].key);
  };

  // Keep the active category pill scrolled into view whenever it changes
  // (e.g. after using the arrow buttons).
  useEffect(() => {
    const rail = categoryPillsRef.current;
    if (!rail) return;
    const activePill = rail.children[categoryIndex] as HTMLElement | undefined;
    activePill?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [categoryIndex]);

  const changeGheeItem = (id: number) => {
    if (id === selectedGheeItem?.id) return;
    setActiveGheeItemId(id);
    setActiveIndex(0);
    stackRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  const scrollToIndex = (idx: number) => {
    setActiveIndex(idx);
    sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCart = useCallback((item: DisplayItem) => {
    if (!item.variant) return;
    addToCart(item.sourceItem, item.variant, 1);
    setJustAddedId(item.id);
    window.setTimeout(() => setJustAddedId(prev => (prev === item.id ? null : prev)), 1800);
  }, [addToCart]);

  if (displayItems.length === 0) return null;

  return (
    <div className="relative w-full overflow-x-hidden bg-[#0b1220]">
      {/* ── Fixed top nav: category tabs (+ ghee sub-tabs) ── */}
      <div
        className="fixed top-0 inset-x-0 z-50 bg-[#0b1220]/85 backdrop-blur-xl border-b border-white/10"
        style={{ paddingTop: 'max(0.6rem, env(safe-area-inset-top))' }}
      >
        <div className="flex items-center justify-center gap-1.5 px-1.5 pb-1">
          <Sparkles className="w-3 h-3 flex-shrink-0" style={{ color: accent }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
            The Collection
          </span>
        </div>

        <div className="flex items-center gap-1 px-2 pb-2">
          <button
            onClick={() => goToAdjacentCategory(-1)}
            aria-label="Previous category"
            className="flex-shrink-0 w-7 h-7 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-white/70" />
          </button>

          <div
            ref={categoryPillsRef}
            className="flex gap-1.5 overflow-x-auto scrollbar-hide px-1 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CATEGORIES.map(cat => {
              const isActive = cat.key === activeCategoryKey;
              return (
                <button
                  key={cat.key}
                  onClick={() => changeCategory(cat.key)}
                  className="flex-shrink-0 snap-start px-3.5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all duration-300"
                  style={
                    isActive
                      ? { backgroundColor: cat.accentHex, color: '#fff', boxShadow: `0 6px 18px -6px ${cat.accentHex}99` }
                      : { backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }
                  }
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => goToAdjacentCategory(1)}
            aria-label="Next category"
            className="flex-shrink-0 w-7 h-7 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ChevronRight className="w-3.5 h-3.5 text-white/70" />
          </button>
        </div>

        {isGhee && activeCategory.items.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide px-3 pb-2.5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {activeCategory.items.map(item => {
              const isActive = item.id === selectedGheeItem?.id;
              return (
                <button
                  key={item.id}
                  onClick={() => changeGheeItem(item.id)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all duration-300"
                  style={
                    isActive
                      ? { backgroundColor: accent, borderColor: accent, color: '#fff' }
                      : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)' }
                  }
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Stacked scroll sections for the active category/ghee-item ── */}
      <div
        key={`${activeCategoryKey}-${selectedGheeItem?.id ?? ''}`}
        ref={stackRef}
        className="relative"
        style={{ paddingTop: isGhee && activeCategory.items.length > 1 ? '7rem' : '4.5rem' }}
      >
        {displayItems.map((item, index) => {
          const gallery = item.gallery.filter(Boolean);
          const cartVariant = isGhee ? item.variant : undefined;
          const justAdded = justAddedId === item.id;

          return (
            <div
              key={item.id}
              ref={el => { sectionRefs.current[index] = el; }}
              className="w-full flex flex-col sticky top-0 overflow-hidden"
              style={{ minHeight: '100dvh' }}
            >
              {/* Cinematic dark base + accent glow, same language as Portfolio */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
              <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at 30% 20%, ${accent}2a, transparent 55%), radial-gradient(circle at 75% 80%, ${accent}1f, transparent 50%)` }}
              />

              {/* Watermark — clamp()'d so it never overflows narrow phones */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07] px-2">
                <h1
                  className="font-black text-white text-center leading-none tracking-tighter"
                  style={{ fontSize: 'clamp(2.25rem, 13vw, 4.5rem)' }}
                >
                  {item.sourceItem.name.toUpperCase()}
                </h1>
              </div>

              {/* Content column */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-4 px-4 pt-4 pb-6">
                {/* Category chip */}
                <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-sm text-white/70 border border-white/10">
                  {activeCategory.name}
                </div>

                {/* Product image */}
                <div className="relative w-[min(62vw,260px)] aspect-[3/4] flex items-center justify-center">
                  <div
                    className="absolute w-40 h-40 rounded-full blur-3xl"
                    style={{ background: `${accent}33` }}
                  />
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="relative w-full h-full object-cover rounded-3xl shadow-2xl"
                    />
                  ) : (
                    <div
                      className="relative w-full h-full flex flex-col items-center justify-center rounded-3xl border-2 border-white/15 bg-white/5 backdrop-blur-sm"
                    >
                      <span className="text-5xl mb-2 opacity-60">🥛</span>
                      <p className="text-white/50 text-xs font-medium text-center px-4">{item.name}</p>
                    </div>
                  )}

                  {item.tag && (
                    <span
                      className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full text-white shadow-md"
                      style={{ backgroundColor: item.tag === 'Best Seller' ? accent : '#16a34a' }}
                    >
                      {item.tag}
                    </span>
                  )}

                  {item.rating && (
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/45 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {item.rating}
                      {item.reviews && <span className="opacity-70 ml-0.5">({item.reviews})</span>}
                    </div>
                  )}
                </div>

                {/* Gallery thumbnail row */}
                {gallery.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-full px-1" style={{ scrollbarWidth: 'none' }}>
                    {gallery.slice(0, 6).map((src, gi) => (
                      <button
                        key={gi}
                        onClick={() => setSelectedGallery({ item, imageIndex: gi })}
                        className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden shadow-md ring-1 ring-white/15 hover:ring-white/40 transition-all"
                      >
                        <img src={src} alt={`${item.name} view ${gi + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Info panel */}
                <div className="relative w-full max-w-sm bg-white/[0.06] backdrop-blur-2xl rounded-[24px] p-5 shadow-2xl border border-white/10 max-h-[38dvh] overflow-y-auto">
                  <h2 className="text-xl font-bold text-white leading-tight">
                    {item.sourceItem.name}
                    {item.variant && (
                      <span className="ml-2 text-sm font-semibold" style={{ color: accent }}>
                        {item.variant.size}
                      </span>
                    )}
                  </h2>
                  <p className="text-[11px] font-bold uppercase tracking-wide mt-1 mb-2" style={{ color: accent }}>
                    {item.description}
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-4">{item.content}</p>

                  {item.sourceItem.variants.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1.5">
                        Available sizes
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.sourceItem.variants.map((v, vi) => {
                          const isSelected = item.variant?.size === v.size;
                          return (
                            <span
                              key={vi}
                              className="text-[10px] font-semibold border rounded-md px-2 py-1"
                              style={
                                isSelected
                                  ? { borderColor: accent, color: '#fff', backgroundColor: accent }
                                  : { borderColor: `${accent}40`, color: accent, backgroundColor: `${accent}14` }
                              }
                            >
                              {v.size}{v.packType ? ` (${v.packType})` : ''}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {isGhee && cartVariant && (
                    <>
                      {cartVariant.price != null && (
                        <p className="mt-3 text-lg font-bold text-white">
                          ₹{cartVariant.price}
                          {cartVariant.perUnit && <span className="text-white/40 text-xs font-medium"> / {cartVariant.perUnit}</span>}
                        </p>
                      )}
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="mt-2.5 w-full flex items-center justify-center gap-2 text-white font-bold text-sm py-3 rounded-2xl transition-all duration-300"
                        style={{
                          backgroundColor: justAdded ? '#16a34a' : accent,
                          boxShadow: `0 12px 24px -12px ${justAdded ? '#16a34a' : accent}aa`,
                        }}
                      >
                        <ShoppingCart size={16} />
                        {justAdded ? 'Added to cart' : 'Add to cart'}
                      </button>
                    </>
                  )}

                  {!isGhee && (
                    <button
                      className="mt-3 w-full bg-white text-gray-900 py-3 rounded-2xl font-bold text-xs uppercase tracking-wide"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>

              {/* Progress dots for items within this category */}
              {displayItems.length > 1 && (
                <div className="relative z-10 flex justify-center gap-1.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                  {displayItems.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToIndex(i)}
                      aria-label={`Go to item ${i + 1}`}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: i === activeIndex ? '1.5rem' : '0.4rem',
                        backgroundColor: i === activeIndex ? accent : 'rgba(255,255,255,0.2)',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Scroll indicator on first section only */}
              {index === 0 && displayItems.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Gallery lightbox ── */}
      {selectedGallery && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedGallery(null)}
        >
          <div className="relative w-full max-w-md" onClick={e => e.stopPropagation()}>
            <img
              src={selectedGallery.item.gallery.filter(Boolean)[selectedGallery.imageIndex]}
              alt={selectedGallery.item.name}
              className="w-full h-auto max-h-[70dvh] object-contain rounded-2xl shadow-2xl"
            />

            <button
              onClick={() => setSelectedGallery(null)}
              className="absolute top-3 right-3 w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors shadow-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 max-w-[85%]">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full shadow">
                <p className="text-white text-xs font-semibold text-center truncate">{selectedGallery.item.name}</p>
              </div>
            </div>

            {(() => {
              const total = selectedGallery.item.gallery.filter(Boolean).length;
              if (total <= 1) return null;
              return (
                <>
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {selectedGallery.item.gallery.filter(Boolean).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedGallery(prev => (prev ? { ...prev, imageIndex: idx } : prev));
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === selectedGallery.imageIndex ? 'bg-white w-6' : 'bg-white/40 w-1.5'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedGallery(prev => prev ? { ...prev, imageIndex: (prev.imageIndex - 1 + total) % total } : prev);
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedGallery(prev => prev ? { ...prev, imageIndex: (prev.imageIndex + 1) % total } : prev);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default VerticalScrollAnimation;