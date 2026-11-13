/**
 * HorizontalProductScroll.tsx — Vyshnavi Dairy (redesign)
 *
 * Ghee spotlight: an arched "window" holding the jar on a warm glow, a
 * vertical photo rail beside it, and an editorial detail column with a
 * proper size selector. Product switching lives in one tab row with
 * prev/next + count; no arrows or counters on top of the photo.
 *
 * Data, cart and routing logic are unchanged (vyshnaviData.ts, useCart,
 * navigate("/ghee", { state })). Props unchanged: heading?
 *
 * Type: Fraunces (display) + Inter (UI). Fraunces is loaded via the @import
 * inside the <style> block below; move it to index.html if you prefer.
 * Motion: one moment only — the jar settles in when product/size/photo
 * changes. Everything else is state feedback. Respects reduced motion.
 */

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  Expand,
  Minus,
  Plus,
  Check,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  CATEGORIES,
  type ProductItem,
  type ProductCategory,
  type ProductVariant,
} from "../../data/vyshnaviData";
import { useCart } from "../../context/cartContext";

interface Entry {
  item: ProductItem;
  category: ProductCategory;
}

interface HorizontalProductScrollProps {
  heading?: string;
}

// Photos for the selected size; falls back to merged photos if the size has none.
function getGallery(item: ProductItem, variant?: ProductVariant): string[] {
  if (variant?.images && variant.images.length > 0) {
    const unique: string[] = [];
    variant.images.forEach((src) => {
      if (src && !unique.includes(src)) unique.push(src);
    });
    if (unique.length > 0) return unique.slice(0, 5);
  }
  const all: string[] = [];
  if (item.image) all.push(item.image);
  item.variants.forEach((v) => {
    (v.images ?? []).forEach((src) => {
      if (!all.includes(src)) all.push(src);
    });
  });
  return all.slice(0, 4);
}

const HorizontalProductScroll: React.FC<HorizontalProductScrollProps> = ({
  heading,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [current, setCurrent] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState<number>(1);
  const tabsRef = useRef<HTMLDivElement>(null);

  // ── Ghee only ───────────────────────────────────────────────────────────
  const gheeCategory = useMemo(
    () => CATEGORIES.find((c) => c.key === "ghee"),
    [],
  );
  const entries = useMemo<Entry[]>(
    () =>
      gheeCategory
        ? gheeCategory.items.map((item) => ({ item, category: gheeCategory }))
        : [],
    [gheeCategory],
  );

  const active = entries[current] ?? entries[0];
  const activeSelectedVariant = active
    ? (active.item.variants[selectedVariantIndex] ?? active.item.variants[0])
    : undefined;
  const gallery = active ? getGallery(active.item, activeSelectedVariant) : [];

  const goPrev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const goNext = useCallback(
    () => setCurrent((c) => Math.min(entries.length - 1, c + 1)),
    [entries.length],
  );

  // ── Keyboard (ignored while typing in a field) ──────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (t?.isContentEditable) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goPrev, goNext]);

  // ── Swipe on the stage ──────────────────────────────────────────────────
  const dragStart = useRef(0);
  const isDragging = useRef(false);
  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx = e.clientX - dragStart.current;
    if (dx < -50) goNext();
    if (dx > 50) goPrev();
  };

  // ── Keep the active tab in view (horizontal only — never scrolls the page)
  useEffect(() => {
    const rail = tabsRef.current;
    const tab = rail?.children[current] as HTMLElement | undefined;
    if (!rail || !tab) return;
    rail.scrollTo({
      left: tab.offsetLeft - rail.clientWidth / 2 + tab.clientWidth / 2,
      behavior: "smooth",
    });
  }, [current]);

  // Reset per-product state
  useEffect(() => {
    setJustAdded(false);
    setActivePhoto(0);
    setIsLightboxOpen(false);
    setSelectedVariantIndex(0);
    setQuantity(1);
  }, [current]);

  // Reset per-size state
  useEffect(() => {
    setActivePhoto(0);
    setIsLightboxOpen(false);
    setQuantity(1);
    setJustAdded(false);
  }, [selectedVariantIndex]);

  // Lightbox: Esc, arrows, scroll lock
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") setActivePhoto((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight")
        setActivePhoto((i) => Math.min(gallery.length - 1, i + 1));
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!active) return null;

  const { item, category } = active;
  const img = gallery[Math.min(activePhoto, gallery.length - 1)] ?? null;
  const selectedVariant = activeSelectedVariant ?? item.variants[0];

  const title = heading ?? "Our Ghee Collection";

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(item, selectedVariant, quantity);
    setJustAdded(true);
  };

  const openDetails = () =>
    navigate("/ghee", {
      state: { productId: item.id, variantSize: selectedVariant?.size },
    });

  return (
    <section className="gh-section" aria-labelledby="gh-title">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap');

        .gh-section {
          --gh-sky: #E0F2FE;
          --gh-sky-deep: #D3E8F6;
          --gh-ink: #12263A;
          --gh-ink-soft: #4A5E72;
          --gh-gold: #E3A82B;
          --gh-gold-deep: #9A6410;
          --gh-butter: #FFF4D6;
          --gh-blue: #1E5FA8;
          --gh-green: #1F7A45;
          position: relative; overflow: hidden; width: 100%;
          background: var(--gh-sky);
          font-family: 'Inter', system-ui, sans-serif;
          color: var(--gh-ink);
          padding: clamp(3rem, 7vw, 5.5rem) 0;
        }
        /* One soft organic blob echoing the homepage language */
        .gh-section::before {
          content: ""; position: absolute; pointer-events: none;
          width: 620px; height: 620px; right: -180px; top: 120px;
          background: radial-gradient(closest-side, rgba(255,255,255,.85), rgba(255,255,255,0));
          border-radius: 46% 54% 58% 42% / 52% 44% 56% 48%;
        }
        .gh-wrap { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 0 1.25rem; }

        .gh-section button { font-family: inherit; }
        .gh-section :focus-visible { outline: 3px solid var(--gh-blue); outline-offset: 3px; }

        /* ── Header ── */
        .gh-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 2rem; }
        .gh-title { font-family: 'Fraunces', Georgia, serif; font-weight: 600; letter-spacing: -0.02em; line-height: 1.02; font-size: clamp(2.2rem, 6vw, 3.9rem); margin: 0; }
        .gh-sub { margin: .75rem 0 0; font-size: clamp(.95rem, 2vw, 1.1rem); color: var(--gh-ink-soft); max-width: 34ch; line-height: 1.5; }
        .gh-promise { display: inline-flex; align-items: center; gap: .5rem; padding: .55rem 1rem; border-radius: 999px; background: #fff; font-size: .85rem; font-weight: 600; color: var(--gh-ink); box-shadow: 0 1px 0 rgba(18,38,58,.06); }
        .gh-promise svg { color: var(--gh-green); flex-shrink: 0; }

        /* ── Product switcher ── */
        .gh-switch { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .gh-tabs { display: flex; gap: .5rem; overflow-x: auto; flex: 1; padding: 4px; scrollbar-width: none; -ms-overflow-style: none; }
        .gh-tabs::-webkit-scrollbar { display: none; }
        .gh-tab { flex-shrink: 0; padding: .6rem 1.15rem; border-radius: 999px; border: 1.5px solid transparent; background: rgba(255,255,255,.6); color: var(--gh-ink-soft); font-size: .88rem; font-weight: 600; cursor: pointer; transition: background .2s, color .2s, border-color .2s; }
        .gh-tab:hover { background: #fff; color: var(--gh-ink); }
        .gh-tab[aria-selected="true"] { background: var(--gh-ink); color: #fff; }
        .gh-nav { display: flex; align-items: center; gap: .5rem; flex-shrink: 0; font-size: .85rem; font-weight: 600; color: var(--gh-ink-soft); font-variant-numeric: tabular-nums; }
        .gh-nav button { width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid var(--gh-ink); background: transparent; color: var(--gh-ink); display: grid; place-items: center; cursor: pointer; transition: background .2s, color .2s; }
        .gh-nav button:hover:not(:disabled) { background: var(--gh-ink); color: #fff; }
        .gh-nav button:disabled { opacity: .3; cursor: default; border-color: var(--gh-ink-soft); }

        /* ── Stage ── */
        .gh-stage { display: grid; grid-template-columns: 1fr; gap: 2rem; align-items: center; }
        @media (min-width: 960px) { .gh-stage { grid-template-columns: 1.05fr 1fr; gap: 4rem; } }

        .gh-visual { display: flex; gap: 1rem; align-items: stretch; justify-content: center; flex-direction: column-reverse; touch-action: pan-y; user-select: none; }
        @media (min-width: 640px) { .gh-visual { flex-direction: row; } }

        .gh-thumbs { display: flex; gap: .6rem; justify-content: center; overflow-x: auto; padding: 4px; scrollbar-width: none; }
        .gh-thumbs::-webkit-scrollbar { display: none; }
        @media (min-width: 640px) { .gh-thumbs { flex-direction: column; justify-content: center; overflow: visible; } }
        .gh-thumb { flex-shrink: 0; width: 56px; height: 56px; padding: 0; border-radius: 14px; overflow: hidden; background: #fff; border: 2px solid transparent; cursor: pointer; opacity: .65; transition: opacity .2s, border-color .2s; }
        .gh-thumb:hover { opacity: 1; }
        .gh-thumb[aria-current="true"] { opacity: 1; border-color: var(--gh-ink); }
        .gh-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .gh-arch {
          position: relative; flex: 1; max-width: 480px; margin: 0 auto; width: 100%;
          height: clamp(340px, 54vw, 540px);
          border-radius: 220px 220px 28px 28px;
          display: grid; place-items: center; overflow: hidden; cursor: grab;
        }
        @media (max-width: 480px) { .gh-arch { border-radius: 150px 150px 24px 24px; } }
        .gh-jar { position: relative; z-index: 1; background: none; border: 0; padding: 0; cursor: zoom-in; max-width: 70%; max-height: 80%; margin-top: 2rem; }
        .gh-jar img { display: block; max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 28px 24px rgba(120,72,10,.28)); animation: gh-settle .5s cubic-bezier(.2,.8,.2,1) both; }
        .gh-zoom { position: absolute; right: -10px; bottom: -4px; width: 34px; height: 34px; border-radius: 50%; background: #fff; color: var(--gh-ink); display: grid; place-items: center; box-shadow: 0 6px 16px -6px rgba(18,38,58,.4); }
        .gh-fallback { font-family: 'Fraunces', serif; font-size: 1.3rem; color: var(--gh-gold-deep); padding: 2rem; text-align: center; }
        @keyframes gh-settle { from { opacity: 0; transform: translateY(14px) scale(.97); } to { opacity: 1; transform: none; } }

        /* ── Detail column ── */
        .gh-meta { display: flex; align-items: center; gap: .6rem; margin-bottom: .9rem; flex-wrap: wrap; font-size: .85rem; color: var(--gh-ink-soft); font-weight: 500; }
        .gh-chip { padding: .25rem .7rem; border-radius: 999px; font-size: .78rem; font-weight: 700; color: #fff; background: var(--gh-green); }
        .gh-chip.is-best { background: var(--gh-blue); }
        .gh-rating { display: inline-flex; align-items: center; gap: .3rem; color: var(--gh-ink); font-weight: 700; }
        .gh-name { font-family: 'Fraunces', Georgia, serif; font-weight: 600; letter-spacing: -0.015em; line-height: 1.08; font-size: clamp(1.9rem, 4.6vw, 3rem); margin: 0 0 1rem; }
        .gh-name button { all: unset; cursor: pointer; }
        .gh-name button:hover { color: var(--gh-blue); }
        .gh-name button:focus-visible { outline: 3px solid var(--gh-blue); outline-offset: 4px; border-radius: 6px; }
        .gh-desc { margin: 0 0 1.75rem; font-size: 1rem; line-height: 1.7; color: var(--gh-ink-soft); max-width: 46ch; }

        .gh-label { font-size: .85rem; font-weight: 600; margin: 0 0 .6rem; }
        .gh-sizes { display: flex; flex-wrap: wrap; gap: .6rem; margin-bottom: 1.5rem; }
        .gh-size { min-width: 104px; text-align: left; padding: .7rem 1rem; border-radius: 14px; background: rgba(255,255,255,.75); border: 1.5px solid rgba(18,38,58,.18); color: var(--gh-ink); cursor: pointer; transition: border-color .2s, background .2s, transform .2s; }
        .gh-size:hover { border-color: var(--gh-ink); }
        .gh-size[aria-checked="true"] { background: #fff; border-color: var(--gh-ink); box-shadow: inset 0 0 0 1.5px var(--gh-ink); }
        .gh-size-n { display: block; font-size: .95rem; font-weight: 700; line-height: 1.2; }
        .gh-size-p { display: block; margin-top: .2rem; font-size: .88rem; color: var(--gh-ink-soft); font-variant-numeric: tabular-nums; }

        .gh-price { display: flex; align-items: baseline; gap: .75rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .gh-price-now { font-family: 'Fraunces', serif; font-weight: 600; font-size: clamp(2rem, 5vw, 2.6rem); letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
        .gh-price-old { font-size: 1.05rem; color: #7C8DA0; text-decoration: line-through; }
        .gh-save { padding: .25rem .65rem; border-radius: 8px; background: #DDF3E4; color: var(--gh-green); font-size: .82rem; font-weight: 700; }
        .gh-price-ask { font-size: 1rem; color: var(--gh-ink-soft); font-style: italic; margin: 0 0 1.5rem; }

        .gh-cta { display: flex; gap: .75rem; flex-wrap: wrap; align-items: stretch; }
        .gh-qty { display: inline-flex; align-items: center; border-radius: 14px; background: #fff; border: 1.5px solid rgba(18,38,58,.18); }
        .gh-qty button { width: 44px; height: 52px; border: 0; background: none; color: var(--gh-ink); display: grid; place-items: center; cursor: pointer; border-radius: 12px; }
        .gh-qty button:hover:not(:disabled) { background: var(--gh-sky); }
        .gh-qty button:disabled { opacity: .35; cursor: default; }
        .gh-qty output { min-width: 28px; text-align: center; font-weight: 700; font-variant-numeric: tabular-nums; }
        .gh-add { flex: 1 1 200px; min-height: 52px; display: inline-flex; align-items: center; justify-content: center; gap: .55rem; padding: 0 1.5rem; border: 0; border-radius: 14px; background: var(--gh-ink); color: #fff; font-size: .95rem; font-weight: 700; cursor: pointer; transition: background .2s, transform .15s; }
        .gh-add:hover:not(:disabled) { background: #1B3A58; }
        .gh-add:active:not(:disabled) { transform: scale(.98); }
        .gh-add.is-added { background: var(--gh-green); }
        .gh-add:disabled { opacity: .5; cursor: not-allowed; }
        .gh-more { margin-top: 1.1rem; display: inline-flex; align-items: center; gap: .4rem; background: none; border: 0; padding: 0; color: var(--gh-blue); font-weight: 600; font-size: .92rem; cursor: pointer; }
        .gh-more:hover { text-decoration: underline; text-underline-offset: 4px; }

        /* ── Lightbox ── */
        .gh-lb { position: fixed; inset: 0; z-index: 100; background: rgba(8,20,34,.92); display: grid; place-items: center; padding: 1rem; animation: gh-fade .25s ease-out; }
        .gh-lb-inner { position: relative; width: 100%; height: 100%; max-width: 900px; max-height: 85vh; display: grid; place-items: center; }
        .gh-lb-inner img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .gh-lb-btn { position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.25); color: #fff; display: grid; place-items: center; cursor: pointer; }
        .gh-lb-btn:disabled { opacity: .3; cursor: default; }
        .gh-lb-dots { position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; }
        .gh-lb-dot { height: 6px; width: 6px; border-radius: 6px; border: 0; padding: 0; background: rgba(255,255,255,.35); cursor: pointer; transition: width .25s, background .25s; }
        .gh-lb-dot[aria-current="true"] { width: 24px; background: #fff; }
        @keyframes gh-fade { from { opacity: 0; } to { opacity: 1; } }

        /* ── Small screens ── */
        @media (max-width: 560px) {
          .gh-wrap { padding: 0 1rem; }
          .gh-switch { gap: .5rem; }
          .gh-nav .gh-count { display: none; }
          .gh-qty { width: 100%; justify-content: space-between; }
          .gh-qty button { flex: 0 0 56px; }
          .gh-size { min-width: calc(50% - .3rem); flex: 1 1 calc(50% - .3rem); }
        }

        @media (prefers-reduced-motion: reduce) {
          .gh-jar img, .gh-lb { animation: none; }
          .gh-section * { transition: none !important; }
        }
      `}</style>

      <div className="gh-wrap">
        {/* Header */}
        <header className="gh-head">
          <div>
            <h2 id="gh-title" className="gh-title">
              {title}
            </h2>
            <p className="gh-sub">
              Authentic granular taste at family-friendly prices.
            </p>
          </div>
          <span className="gh-promise">
            <Check size={16} strokeWidth={3} aria-hidden="true" />
            No palm oil. No vegetable oil.
          </span>
        </header>

        {/* Product switcher */}
        <div className="gh-switch">
          <div className="gh-tabs" ref={tabsRef} role="tablist" aria-label="Ghee products">
            {entries.map((entry, idx) => (
              <button
                key={entry.item.id}
                role="tab"
                aria-selected={idx === current}
                className="gh-tab"
                onClick={() => setCurrent(idx)}
              >
                {entry.item.name}
              </button>
            ))}
          </div>
          <div className="gh-nav">
            <button onClick={goPrev} disabled={current === 0} aria-label="Previous product">
              <ChevronLeft size={18} />
            </button>
            <span className="gh-count" aria-live="polite">
              {current + 1} of {entries.length}
            </span>
            <button onClick={goNext} disabled={current === entries.length - 1} aria-label="Next product">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Stage */}
        <div className="gh-stage">
          {/* Visual */}
          <div
            className="gh-visual"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {gallery.length > 1 && (
              <div className="gh-thumbs" aria-label={`Photos of ${item.name}`}>
                {gallery.map((src, gi) => (
                  <button
                    key={src}
                    className="gh-thumb"
                    aria-current={gi === activePhoto}
                    aria-label={`View photo ${gi + 1} of ${item.name}`}
                    onClick={() => setActivePhoto(gi)}
                  >
                    <img src={src} alt="" draggable={false} />
                  </button>
                ))}
              </div>
            )}

            <div className="gh-arch">
              {img ? (
                <button
                  type="button"
                  className="gh-jar"
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label={`View ${item.name} full screen`}
                >
                  <img key={img} src={img} alt={item.name} draggable={false} />
                  <span className="gh-zoom" aria-hidden="true">
                    <Expand size={14} />
                  </span>
                </button>
              ) : (
                <span className="gh-fallback">{item.name}</span>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="gh-meta">
              <span>{category.name}</span>
              {item.tag && (
                <span className={`gh-chip${item.tag === "Best Seller" ? " is-best" : ""}`}>
                  {item.tag}
                </span>
              )}
              {item.rating && (
                <span className="gh-rating">
                  <Star size={14} fill="#E3A82B" color="#E3A82B" aria-hidden="true" />
                  {item.rating}
                </span>
              )}
            </div>

            <h3 className="gh-name">
              <button type="button" onClick={openDetails}>
                {item.name}
              </button>
            </h3>
            <p className="gh-desc">{item.description}</p>

            {item.variants.length > 0 && (
              <>
                <p className="gh-label" id="gh-size-label">
                  Pack size
                </p>
                <div className="gh-sizes" role="radiogroup" aria-labelledby="gh-size-label">
                  {item.variants.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={i === selectedVariantIndex}
                      className="gh-size"
                      onClick={() => setSelectedVariantIndex(i)}
                    >
                      <span className="gh-size-n">
                        {v.size}
                        {v.packType ? ` (${v.packType})` : ""}
                      </span>
                      <span className="gh-size-p">
                        {v.price != null ? `₹${v.price.toLocaleString("en-IN")}` : "On request"}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {selectedVariant?.price != null ? (
              <div className="gh-price">
                <span className="gh-price-now">
                  ₹{selectedVariant.price.toLocaleString("en-IN")}
                </span>
                {selectedVariant.originalPrice && (
                  <span className="gh-price-old">
                    ₹{selectedVariant.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
                {selectedVariant.discount && (
                  <span className="gh-save">{selectedVariant.discount}</span>
                )}
              </div>
            ) : (
              <p className="gh-price-ask">Price on request</p>
            )}

            <div className="gh-cta">
              <div className="gh-qty" role="group" aria-label="Quantity">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <output aria-live="polite">{quantity}</output>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                type="button"
                className={`gh-add${justAdded ? " is-added" : ""}`}
                onClick={handleAddToCart}
                disabled={!selectedVariant}
              >
                {justAdded ? <Check size={18} strokeWidth={3} /> : <ShoppingCart size={18} />}
                {justAdded ? "Added to cart" : "Add to cart"}
              </button>
            </div>

            <button type="button" className="gh-more" onClick={openDetails}>
              See full details <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && gallery.length > 0 && (
        <div className="gh-lb" role="dialog" aria-modal="true" aria-label={item.name} onClick={() => setIsLightboxOpen(false)}>
          <div className="gh-lb-inner" onClick={(e) => e.stopPropagation()}>
            <img
              key={activePhoto}
              src={gallery[Math.min(activePhoto, gallery.length - 1)]}
              alt={item.name}
            />
            <button
              className="gh-lb-btn"
              style={{ top: -4, right: -4 }}
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close full-screen image"
            >
              <X size={20} />
            </button>
            {gallery.length > 1 && (
              <>
                <button
                  className="gh-lb-btn"
                  style={{ left: 4, top: "50%", transform: "translateY(-50%)" }}
                  onClick={() => setActivePhoto((i) => Math.max(0, i - 1))}
                  disabled={activePhoto === 0}
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="gh-lb-btn"
                  style={{ right: 4, top: "50%", transform: "translateY(-50%)" }}
                  onClick={() => setActivePhoto((i) => Math.min(gallery.length - 1, i + 1))}
                  disabled={activePhoto === gallery.length - 1}
                  aria-label="Next photo"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="gh-lb-dots">
                  {gallery.map((_, gi) => (
                    <button
                      key={gi}
                      className="gh-lb-dot"
                      aria-current={gi === activePhoto}
                      aria-label={`View photo ${gi + 1}`}
                      onClick={() => setActivePhoto(gi)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default HorizontalProductScroll;