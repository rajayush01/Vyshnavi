/**
 * Portfolio.tsx — Vyshnavi Dairy product listing page
 *
 * A standard shop-style grid replacing the old cinematic carousel.
 * Nothing is lost from the previous version:
 *
 *  - Category filter (All + every category in CATEGORIES)
 *  - Ghee sub-filter (All ghee / Cow Ghee / Buffalo Ghee). Inside the ghee
 *    category every pack size is its own card with price + Add to cart,
 *    exactly like the old flattened ghee carousel.
 *  - Tag badges (Best Seller / New Launch), "Available sizes" chips
 *  - Fullscreen lightbox that pages through every sub-image of the product
 *    (buttons, filmstrip, ←/→, Esc), with page scroll locked while open
 *
 *  - Every card links to its product page (/details/:id). Ghee pack-size
 *    cards also pass the size so the detail page opens on that size.
 *  - The active filters live in the URL (?category=ghee&ghee=601) so the
 *    Back button on the detail page returns to the same filtered view.
 *
 * All data still comes from ../data/vyshnaviData (item.image / item.gallery /
 * variant.images). No gsap needed any more — the only motion is one soft
 * fade when the filters change, and it is disabled for reduced-motion users.
 *
 * Fonts: expects Fraunces (headings) + Inter (body) — the same pair used on
 * the homepage. Falls back to Georgia / system sans if they are not loaded.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Expand, Images, ShoppingCart, X, Check } from "lucide-react";
import {
  CATEGORIES,
  type ProductItem,
  type ProductVariant,
} from "../data/vyshnaviData";
import { useCart } from "../context/cartContext";

// ── Design tokens ─────────────────────────────────────────────────────────

const NAVY = "#0F2A4A";
const PAGE_BG = "#F5F9FE";
const SERIF = "Fraunces, Georgia, 'Times New Roman', serif";
const SANS = "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";

// Offset of the sticky filter bar. Set this to your site header height so the
// bar parks directly underneath it (header is ~64px tall).
const STICKY_TOP = "top-16";

const ALL_KEY = "all";

// ── Types ─────────────────────────────────────────────────────────────────

/** One card in the grid: either a whole item, or (ghee only) one pack size. */
interface DisplayItem {
  id: string;
  name: string;
  image: string;
  gallery: string[];
  description: string;
  content: string;
  tag?: ProductItem["tag"];
  variant?: ProductVariant;
  sourceItem: ProductItem;
  categoryKey: string;
  accent: string;
}

interface LightboxState {
  gallery: string[];
  index: number;
  name: string;
  accent: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────

const withGalleryFallback = (gallery: string[] | undefined, image?: string) =>
  gallery && gallery.length > 0 ? gallery : image ? [image] : [];

// ── Product card ──────────────────────────────────────────────────────────

interface ProductCardProps {
  item: DisplayItem;
  justAdded: boolean;
  onOpenGallery: (item: DisplayItem) => void;
  onAddToCart: (item: DisplayItem) => void;
  onViewSizes: (item: DisplayItem) => void;
  showViewSizes: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  justAdded,
  onOpenGallery,
  onAddToCart,
  onViewSizes,
  showViewSizes,
}) => {
  const { accent, variant, sourceItem } = item;
  const hasGallery = item.gallery.length > 0;
  const sizes = sourceItem.variants;
  const detailsPath = `/details/${sourceItem.id}`;
  const detailsState = { productId: sourceItem.id, variantSize: variant?.size };

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-[#0F2A4A]/10 bg-white">
      {/* Image panel — the image opens the product page; the small button in
          the corner opens the photo lightbox instead */}
      <div
        className="group relative m-2 aspect-[4/5] overflow-hidden rounded-2xl"
        style={{ backgroundColor: `${accent}1F` }}
      >
        <Link
          to={detailsPath}
          state={detailsState}
          aria-label={`View details for ${item.name}`}
          className="absolute inset-0 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2"
          style={{ outlineColor: NAVY }}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="h-[82%] w-[82%] object-contain transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <span
              className="px-4 text-center text-sm font-semibold"
              style={{ color: NAVY, opacity: 0.5 }}
            >
              {item.name}
            </span>
          )}
        </Link>

        {item.tag && (
          <span
            className="pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
            style={{ backgroundColor: item.tag === "Best Seller" ? accent : "#16a34a" }}
          >
            {item.tag}
          </span>
        )}

        {hasGallery && (
          <button
            type="button"
            onClick={() => onOpenGallery(item)}
            aria-label={`View photos of ${item.name}`}
            className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold text-[#0F2A4A] shadow-sm transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: NAVY }}
          >
            {item.gallery.length > 1 ? (
              <>
                <Images className="h-3 w-3" aria-hidden />
                {item.gallery.length}
              </>
            ) : (
              <Expand className="h-3 w-3" aria-hidden />
            )}
          </button>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-2 sm:px-5 sm:pb-5">
        <h3
          className="text-lg leading-snug text-[#0F2A4A] sm:text-xl"
          style={{ fontFamily: SERIF, fontWeight: 600 }}
        >
          <Link
            to={detailsPath}
            state={detailsState}
            className="hover:underline decoration-[#0F2A4A]/30 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: NAVY }}
          >
            {sourceItem.name}
            {variant && (
              <span className="ml-2 text-base font-medium" style={{ color: accent }}>
                {variant.size}
              </span>
            )}
          </Link>
        </h3>

        <p className="mt-1 text-sm font-medium text-[#0F2A4A]/80">{item.description}</p>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#0F2A4A]/60">
          {item.content}
        </p>

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="mt-4">
            <p className="mb-1.5 text-xs font-semibold text-[#0F2A4A]/50">Available sizes</p>
            <div className="flex flex-wrap gap-1.5">
              {sizes.map((v, vi) => {
                const selected = variant?.size === v.size;
                return (
                  <span
                    key={vi}
                    className="rounded-md border px-2 py-1 text-[11px] font-semibold"
                    style={
                      selected
                        ? { backgroundColor: accent, borderColor: accent, color: "#fff" }
                        : {
                            backgroundColor: `${accent}14`,
                            borderColor: `${accent}40`,
                            color: NAVY,
                          }
                    }
                  >
                    {v.size}
                    {v.packType ? ` (${v.packType})` : ""}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer: price + cart for ghee packs, "View sizes" for ghee in All */}
        <div className="mt-auto pt-4">
          {variant && (
            <>
              {variant.price != null && (
                <p className="mb-3 text-xl font-bold text-[#0F2A4A]">
                  ₹{variant.price}
                  {variant.perUnit && (
                    <span className="ml-1 text-xs font-medium text-[#0F2A4A]/50">
                      / {variant.perUnit}
                    </span>
                  )}
                </p>
              )}
              <button
                type="button"
                onClick={() => onAddToCart(item)}
                className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  backgroundColor: justAdded ? "#16a34a" : NAVY,
                  outlineColor: NAVY,
                }}
              >
                {justAdded ? (
                  <Check size={16} aria-hidden />
                ) : (
                  <ShoppingCart size={16} aria-hidden />
                )}
                {justAdded ? "Added to cart" : "Add to cart"}
              </button>
              <Link
                to={detailsPath}
                state={detailsState}
                className="mt-3 block text-center text-sm font-semibold text-[#0F2A4A]/70 underline-offset-4 hover:text-[#0F2A4A] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: NAVY }}
              >
                View details
              </Link>
            </>
          )}

          {!variant && showViewSizes && (
            <button
              type="button"
              onClick={() => onViewSizes(item)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#0F2A4A]/20 py-3 text-sm font-semibold text-[#0F2A4A] transition-colors hover:bg-[#0F2A4A] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: NAVY }}
            >
              View sizes and prices
            </button>
          )}

          {!variant && !showViewSizes && (
            <Link
              to={detailsPath}
              state={detailsState}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#0F2A4A]/20 py-3 text-sm font-semibold text-[#0F2A4A] transition-colors hover:bg-[#0F2A4A] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: NAVY }}
            >
              View details
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

// ── Lightbox ──────────────────────────────────────────────────────────────

interface LightboxProps {
  state: LightboxState;
  onChange: (next: LightboxState | null) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ state, onChange }) => {
  const { gallery, index, name, accent } = state;
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const go = useCallback(
    (delta: number) => {
      onChange({ ...state, index: (index + delta + gallery.length) % gallery.length });
    },
    [state, index, gallery.length, onChange],
  );

  // Esc / arrow keys
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      else if (e.key === "ArrowRight" && gallery.length > 1) go(1);
      else if (e.key === "ArrowLeft" && gallery.length > 1) go(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, onChange, gallery.length]);

  // Lock page scroll while open, move focus to Close
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const chrome =
    "flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/50 text-white shadow-lg backdrop-blur-xl transition-colors hover:bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} photos`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 p-4 backdrop-blur-sm sm:p-8 lb-fade"
      onClick={() => onChange(null)}
    >
      <div
        className="flex max-h-full w-full max-w-3xl flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl shadow-2xl"
          style={{ backgroundColor: "#99BFEB" }}
        >
          <img
            src={gallery[index]}
            alt={`${name} ${index + 1}`}
            className="max-h-[68vh] w-full object-contain"
          />

          <button
            ref={closeRef}
            type="button"
            onClick={() => onChange(null)}
            aria-label="Close"
            className={`${chrome} absolute right-3 top-3`}
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className={`${chrome} absolute left-3 top-1/2 -translate-y-1/2`}
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className={`${chrome} absolute right-3 top-1/2 -translate-y-1/2`}
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </>
          )}
        </div>

        {gallery.length > 1 && (
          <div className="flex max-w-full gap-2 overflow-x-auto px-1 py-1 scrollbar-hide">
            {gallery.map((src, gi) => (
              <button
                key={gi}
                type="button"
                onClick={() => onChange({ ...state, index: gi })}
                aria-label={`Show image ${gi + 1}`}
                className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl shadow-md transition-opacity"
                style={{
                  outline: gi === index ? `2px solid ${accent}` : "2px solid transparent",
                  outlineOffset: 2,
                  opacity: gi === index ? 1 : 0.55,
                }}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <p className="rounded-full border border-black/10 bg-black/5 px-5 py-2 text-sm font-semibold text-black">
          {name}
          {gallery.length > 1 && (
            <span className="font-normal text-black/40">
              {" "}
              · {index + 1}/{gallery.length}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────

const ProductPage: React.FC = () => {
  // Filters live in the URL so Back from a product page restores them.
  const [searchParams, setSearchParams] = useSearchParams();
  const rawCategory = searchParams.get("category");
  const activeKey =
    rawCategory && CATEGORIES.some((c) => c.key === rawCategory) ? rawCategory : ALL_KEY;
  // null = every ghee item; otherwise the id of Cow Ghee / Buffalo Ghee
  const rawGhee = Number(searchParams.get("ghee"));
  const gheeItemId: number | null =
    activeKey === "ghee" && Number.isFinite(rawGhee) && rawGhee > 0 ? rawGhee : null;

  const updateFilters = (category: string, ghee: number | null) => {
    const next = new URLSearchParams();
    if (category !== ALL_KEY) next.set("category", category);
    if (category === "ghee" && ghee != null) next.set("ghee", String(ghee));
    setSearchParams(next, { replace: true });
  };
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const { addToCart } = useCart();
  const gridTopRef = useRef<HTMLDivElement | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    },
    [],
  );

  const gheeCategory = CATEGORIES.find((c) => c.key === "ghee");
  const isGhee = activeKey === "ghee";
  const activeCategory = CATEGORIES.find((c) => c.key === activeKey);
  // "All" has no category accent of its own, so it borrows the navy.
  const activeAccent = activeCategory?.accentHex ?? NAVY;

  // Build the grid. Ghee (when selected) shows one card per pack size;
  // everything else shows one card per item.
  const displayItems: DisplayItem[] = useMemo(() => {
    const cats = activeKey === ALL_KEY ? CATEGORIES : CATEGORIES.filter((c) => c.key === activeKey);

    return cats.flatMap((cat) => {
      const asItem = (item: ProductItem): DisplayItem => ({
        id: `${cat.key}-${item.id}`,
        name: item.name,
        image: item.image,
        gallery: withGalleryFallback(item.gallery, item.image),
        description: item.description,
        content: item.content,
        tag: item.tag,
        variant: undefined,
        sourceItem: item,
        categoryKey: cat.key,
        accent: cat.accentHex,
      });

      if (cat.key === "ghee" && activeKey === "ghee") {
        const items =
          gheeItemId == null ? cat.items : cat.items.filter((it) => it.id === gheeItemId);
        return items.flatMap((item) =>
          item.variants.length === 0
            ? [asItem(item)]
            : item.variants.map((v, vi): DisplayItem => ({
                id: `${cat.key}-${item.id}-${vi}`,
                name: `${item.name} — ${v.size}`,
                image: v.images?.[0] ?? item.image,
                gallery: withGalleryFallback(v.images, item.image),
                description: item.description,
                content: item.content,
                tag: item.tag,
                variant: v,
                sourceItem: item,
                categoryKey: cat.key,
                accent: cat.accentHex,
              })),
        );
      }

      return cat.items.map(asItem);
    });
  }, [activeKey, gheeItemId]);

  // ── Handlers ──

  const selectCategory = (key: string) => updateFilters(key, null);

  const handleAddToCart = (item: DisplayItem) => {
    if (!item.variant) return;
    addToCart(item.sourceItem, item.variant, 1);
    setAddedId(item.id);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAddedId(null), 1800);
  };

  const handleViewSizes = (item: DisplayItem) => {
    updateFilters("ghee", item.sourceItem.id);
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openGallery = (item: DisplayItem) => {
    if (item.gallery.length === 0) return;
    setLightbox({ gallery: item.gallery, index: 0, name: item.name, accent: item.accent });
  };

  // ── Render ──

  return (
    <div
      className="min-h-screen pb-20 pt-24 sm:pt-28"
      style={{ backgroundColor: PAGE_BG, fontFamily: SANS }}
    >
      {/* Page heading */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1
          className="text-4xl leading-tight text-[#0F2A4A] sm:text-5xl"
          style={{ fontFamily: SERIF, fontWeight: 600, letterSpacing: "-0.02em" }}
        >
          Our products
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-[#0F2A4A]/65">
          Milk, curd, paneer, ghee and sweets from our dairy. Pick a category to narrow the list.
        </p>
      </header>

      {/* Filters */}
      <div
        className={`sticky ${STICKY_TOP} z-30 mt-8 border-y border-[#0F2A4A]/10 bg-[#F5F9FE]/90 backdrop-blur-md`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            role="group"
            aria-label="Filter by category"
            className="flex gap-2 overflow-x-auto py-3 scrollbar-hide"
          >
            {[{ key: ALL_KEY, name: "All products", accentHex: NAVY }, ...CATEGORIES].map(
              (cat) => {
                const active = activeKey === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => selectCategory(cat.key)}
                    aria-pressed={active}
                    className="flex-shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={
                      active
                        ? {
                            backgroundColor: cat.accentHex,
                            borderColor: cat.accentHex,
                            color: "#fff",
                            outlineColor: NAVY,
                          }
                        : {
                            backgroundColor: "#fff",
                            borderColor: "rgba(15,42,74,0.12)",
                            color: "rgba(15,42,74,0.7)",
                            outlineColor: NAVY,
                          }
                    }
                  >
                    {cat.name}
                  </button>
                );
              },
            )}
          </div>

          {/* Ghee type filter */}
          {isGhee && gheeCategory && gheeCategory.items.length > 1 && (
            <div
              role="group"
              aria-label="Filter ghee by type"
              className="flex gap-2 overflow-x-auto border-t border-[#0F2A4A]/10 py-3 scrollbar-hide"
            >
              {[{ id: null as number | null, name: "All ghee" }, ...gheeCategory.items].map(
                (it) => {
                  const active = gheeItemId === it.id;
                  return (
                    <button
                      key={it.id ?? "all"}
                      type="button"
                      onClick={() => updateFilters("ghee", it.id)}
                      aria-pressed={active}
                      className="flex-shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={
                        active
                          ? {
                              backgroundColor: NAVY,
                              borderColor: NAVY,
                              color: "#fff",
                              outlineColor: NAVY,
                            }
                          : {
                              backgroundColor: "transparent",
                              borderColor: "rgba(15,42,74,0.2)",
                              color: "rgba(15,42,74,0.7)",
                              outlineColor: NAVY,
                            }
                      }
                    >
                      {it.name}
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div ref={gridTopRef} className="scroll-mt-40" />

        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2
            className="text-xl text-[#0F2A4A] sm:text-2xl"
            style={{ fontFamily: SERIF, fontWeight: 600 }}
          >
            {activeCategory ? activeCategory.name : "All products"}
          </h2>
          <p className="text-sm text-[#0F2A4A]/55" aria-live="polite">
            {displayItems.length} {displayItems.length === 1 ? "product" : "products"}
          </p>
        </div>

        {displayItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#0F2A4A]/20 px-6 py-16 text-center">
            <p className="text-lg font-semibold text-[#0F2A4A]">Nothing in this category yet</p>
            <button
              type="button"
              onClick={() => selectCategory(ALL_KEY)}
              className="mt-4 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: activeAccent }}
            >
              Show all products
            </button>
          </div>
        ) : (
          <div
            key={`${activeKey}-${gheeItemId ?? "all"}`}
            className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 grid-fade"
          >
            {displayItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                justAdded={addedId === item.id}
                onOpenGallery={openGallery}
                onAddToCart={handleAddToCart}
                onViewSizes={handleViewSizes}
                showViewSizes={
                  activeKey === ALL_KEY &&
                  item.categoryKey === "ghee" &&
                  item.sourceItem.variants.length > 0
                }
              />
            ))}
          </div>
        )}
      </main>

      {lightbox && <Lightbox state={lightbox} onChange={setLightbox} />}

      <style>{`
        .grid-fade { animation: gridFade 0.35s ease-out both; }
        .lb-fade { animation: lbFade 0.2s ease-out both; }
        @keyframes gridFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lbFade { from { opacity: 0; } to { opacity: 1; } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        @media (prefers-reduced-motion: reduce) {
          .grid-fade, .lb-fade { animation: none; }
          * { scroll-behavior: auto !important; }
        }
      `}</style>
    </div>
  );
};

export default ProductPage;