/**
 * HorizontalProductScroll.tsx — Vyshnavi Dairy
 *
 * "Spotlight" showcase dedicated to the Ghee category: one large featured
 * product panel (image + full detail) paired with a horizontally
 * scrollable thumbnail rail beneath it. Swipe / arrow-key / click-thumbnail
 * navigation between the ghee items.
 *
 * Props: heading? (optional override; defaults to "Our Ghee Collection")
 * Same data source: vyshnaviData.ts — nothing about data fetching changed.
 */

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { ShoppingCart, Zap, ChevronLeft, ChevronRight, Star, X, Expand } from "lucide-react";

// ── Data source ──────────────────────────────────────────────────────────
import {
  CATEGORIES,
  type ProductItem,
  type ProductCategory,
} from "../../data/vyshnaviData";
import { useCart } from "../../context/cartContext";

// ── Fallback gradients when no image exists ──────────────────────────────
const FALLBACK_GRADIENT: Record<string, string> = {
  milk:      "linear-gradient(135deg,#dbeafe,#eff6ff)",
  curd:      "linear-gradient(135deg,#dcfce7,#f0fdf4)",
  beverages: "linear-gradient(135deg,#ede9fe,#f5f3ff)",
  paneer:    "linear-gradient(135deg,#ffedd5,#fff7ed)",
  butter:    "linear-gradient(135deg,#fefce8,#fffbeb)",
  ghee:      "linear-gradient(135deg,#fef3c7,#fffbeb)",
  sweets:    "linear-gradient(135deg,#fce7f3,#fdf2f8)",
};

interface Entry {
  item: ProductItem;
  category: ProductCategory;
}

interface HorizontalProductScrollProps {
  heading?: string;
}

// Collect up to 4 unique photos for a product across all its variants, so
// the spotlight can offer a small gallery instead of a single static shot.
function getGallery(item: ProductItem): string[] {
  const all: string[] = [];
  if (item.image) all.push(item.image);
  item.variants.forEach((v) => {
    (v.images ?? []).forEach((src) => {
      if (!all.includes(src)) all.push(src);
    });
  });
  return all.slice(0, 4);
}

// ── Decorative dairy illustrations (background ambience) ─────────────────
const StageDecorations: React.FC = () => (
  <>
    <style>{`
      @keyframes spotFloat { 0%,100% { transform: translateY(0px);} 50% { transform: translateY(-10px);} }
      @keyframes spotFloatSlow { 0%,100% { transform: translateY(0px);} 50% { transform: translateY(-14px);} }
      .spot-float { animation: spotFloat 5s ease-in-out infinite; }
      .spot-float-slow { animation: spotFloatSlow 7.5s ease-in-out infinite; }
    `}</style>
  </>
);

const HorizontalProductScroll: React.FC<HorizontalProductScrollProps> = ({
  heading,
}) => {
  const [current, setCurrent] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  // ── This showcase is dedicated to Ghee only ─────────────────────────────
  const gheeCategory = useMemo(
    () => CATEGORIES.find((c) => c.key === "ghee"),
    []
  );

  const entries = useMemo<Entry[]>(
    () => (gheeCategory ? gheeCategory.items.map((item) => ({ item, category: gheeCategory })) : []),
    [gheeCategory]
  );

  const active = entries[current] ?? entries[0];
  const gallery = active ? getGallery(active.item) : [];

  // ── Keyboard navigation ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(0, c - 1));
      if (e.key === "ArrowRight") setCurrent((c) => Math.min(entries.length - 1, c + 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [entries.length]);

  // ── Drag / swipe on the spotlight image ────────────────────────────────
  const dragStart = useRef(0);
  const isDragging = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStart.current = e.clientX;
  };
  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx = e.clientX - dragStart.current;
    if (dx < -50) setCurrent((c) => Math.min(entries.length - 1, c + 1));
    if (dx > 50) setCurrent((c) => Math.max(0, c - 1));
  }, [entries.length]);

  // ── Keep active thumbnail in view ──────────────────────────────────────
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const thumb = rail.children[current] as HTMLElement | undefined;
    if (thumb) {
      thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [current]);

  // Reset the "added" confirmation, photo index, and selected size whenever
  // the featured product changes
  useEffect(() => {
    setJustAdded(false);
    setActivePhoto(0);
    setIsLightboxOpen(false);
    setSelectedVariantIndex(0);
  }, [current]);

  // Lightbox: Escape to close, arrow keys to browse this product's own photos, lock scroll while open
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") setActivePhoto((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setActivePhoto((i) => Math.min(gallery.length - 1, i + 1));
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const resolvedHeading = heading ?? "Our Ghee Collection";

  if (!active) return null;

  const { item, category } = active;
  const img = gallery[Math.min(activePhoto, gallery.length - 1)] ?? null;

  // The variant the shopper has picked via the size boxes below drives both
  // the price panel and what gets added to the cart.
  const selectedVariant =
    item.variants[selectedVariantIndex] ?? item.variants[0];
  const cartVariant = selectedVariant;

  const handleAddToCart = () => {
    if (!cartVariant) return;
    addToCart(item, cartVariant, 1);
    setJustAdded(true);
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        padding: "4.5rem 0 4rem",
        background: "#E0F2FE",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      <StageDecorations />

      <style>{`
        .spot-wrap { max-width: 1180px; margin: 0 auto; padding: 0 1.25rem; position: relative; z-index: 1; }
        .spot-grid { display: grid; grid-template-columns: 1fr; gap: 2.5rem; align-items: center; }
        @media (min-width: 960px) {
          .spot-grid { grid-template-columns: 1.05fr 1fr; gap: 3.5rem; }
        }
        .spot-thumb-rail::-webkit-scrollbar { display: none; }
        .spot-thumb-rail { scrollbar-width: none; -ms-overflow-style: none; }
        .spot-thumb {
          transition: all 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .spot-thumb:hover { transform: translateY(-3px); }
        .spot-cta-primary { transition: all 0.25s ease; }
        .spot-cta-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 35px -12px rgba(37,99,235,0.55); }
        .spot-cta-secondary:hover { background: #f8fafc !important; border-color: #93c5fd !important; }
        .spot-arrow:hover { background: #2563eb !important; color: #fff !important; }
        .spot-thumb-arrow:hover { background: #2563eb !important; color: #fff !important; }
        .spot-variant-box { transition: all 0.2s ease; cursor: pointer; }
        .spot-variant-box:hover { transform: translateY(-2px); border-color: #fbbf24 !important; }
        @keyframes lightboxFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lightboxZoomIn { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
        @keyframes lightboxImageFade { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      <div className="spot-wrap">
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(37,99,235,0.14)",
              marginBottom: 14,
            }}
          >
            <svg width="9" height="11" viewBox="0 0 32 40" fill="none">
              <path d="M16 2 C22 14 28 20 28 28 C28 34.6 22.6 40 16 40 C9.4 40 4 34.6 4 28 C4 20 10 14 16 2 Z" fill="#2563eb" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#1d4ed8" }}>
              Bilona Churned
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: 0 }}>
            {resolvedHeading}
          </h2>
        </div>

        {/* Product tabs — same pill style the category tabs used to have */}
        <div
          ref={railRef}
          className="spot-thumb-rail"
          style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", overflowX: "auto", marginBottom: "2.5rem", padding: "6px 4px 4px" }}
        >
          {entries.map((entry, idx) => {
            const isActive = idx === current;
            return (
              <button
                key={entry.item.id}
                onClick={() => setCurrent(idx)}
                className="spot-thumb"
                style={{
                  flexShrink: 0,
                  padding: "8px 20px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: isActive ? "#2563eb" : "#e5e7eb",
                  background: isActive ? "#2563eb" : "#fff",
                  color: isActive ? "#fff" : "#4b5563",
                  boxShadow: isActive ? "0 10px 25px -10px rgba(37,99,235,0.5)" : "none",
                  transition: "all 0.25s ease",
                }}
              >
                {entry.item.name}
              </button>
            );
          })}
        </div>

        {/* Spotlight grid */}
        <div className="spot-grid">
          {/* Image panel */}
          <div
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            style={{
              position: "relative",
              borderRadius: 32,
              background: img ? "#f8fafc" : (FALLBACK_GRADIENT[category.key] ?? "#f3f4f6"),
              border: "1px solid rgba(37,99,235,0.08)",
              boxShadow: "0 40px 80px -35px rgba(37,99,235,0.35)",
              height: "clamp(320px, 42vw, 460px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              cursor: "grab",
              userSelect: "none",
            }}
          >
            {/* Ambient backdrop circle */}
            <div style={{ position: "absolute", width: "70%", height: "70%", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.6), transparent 70%)", pointerEvents: "none" }} />

            {item.tag && (
              <span style={{ position: "absolute", top: 20, left: 20, zIndex: 2, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, background: item.tag === "Best Seller" ? "#2563eb" : "#16a34a", color: "#fff", boxShadow: "0 8px 20px -8px rgba(0,0,0,0.35)" }}>
                {item.tag}
              </span>
            )}

            {item.rating && (
              <span style={{ position: "absolute", top: 20, right: 20, zIndex: 2, display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20, background: "rgba(255,255,255,0.95)", color: "#78350f", boxShadow: "0 8px 20px -10px rgba(0,0,0,0.25)" }}>
                <Star size={12} fill="#f59e0b" color="#f59e0b" /> {item.rating}
              </span>
            )}

            {img ? (
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                aria-label="View full-screen image"
                style={{ position: "relative", zIndex: 1, background: "none", border: "none", padding: 0, cursor: "zoom-in", maxWidth: "72%", maxHeight: "72%" }}
              >
                <img src={img} alt={item.name} draggable={false} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block", filter: "drop-shadow(0 30px 30px rgba(15,23,42,0.18))" }} />
                <span style={{ position: "absolute", bottom: -6, right: -6, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 18px -8px rgba(0,0,0,0.35)", color: "#2563eb" }}>
                  <Expand size={14} />
                </span>
              </button>
            ) : (
              <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 600, position: "relative", zIndex: 1 }}>{item.name}</span>
            )}

            {/* Prev / Next arrows */}
            <button
              className="spot-arrow"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              aria-label="Previous product"
              style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: current === 0 ? "default" : "pointer", opacity: current === 0 ? 0.25 : 1, boxShadow: "0 8px 20px -8px rgba(0,0,0,0.25)", zIndex: 2, transition: "all 0.2s" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="spot-arrow"
              onClick={() => setCurrent((c) => Math.min(entries.length - 1, c + 1))}
              disabled={current === entries.length - 1}
              aria-label="Next product"
              style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: current === entries.length - 1 ? "default" : "pointer", opacity: current === entries.length - 1 ? 0.25 : 1, boxShadow: "0 8px 20px -8px rgba(0,0,0,0.25)", zIndex: 2, transition: "all 0.2s" }}
            >
              <ChevronRight size={18} />
            </button>

            {/* This product's own photo strip — 3–4 shots pulled from its variants */}
            {gallery.length > 1 && (
              <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 8, zIndex: 2 }}>
                <button
                  className="spot-thumb-arrow"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhoto((i) => (i - 1 + gallery.length) % gallery.length);
                  }}
                  aria-label={`Previous photo of ${item.name}`}
                  style={{
                    width: 26,
                    height: 26,
                    flexShrink: 0,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(255,255,255,0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 10px -4px rgba(15,23,42,0.35)",
                  }}
                >
                  <ChevronLeft size={14} />
                </button>

                {gallery.map((src, gi) => (
                  <button
                    key={gi}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhoto(gi);
                    }}
                    aria-label={`View photo ${gi + 1} of ${item.name}`}
                    style={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      borderRadius: 10,
                      overflow: "hidden",
                      padding: 0,
                      cursor: "pointer",
                      background: "#fff",
                      border: gi === activePhoto ? "2px solid #2563eb" : "2px solid rgba(255,255,255,0.8)",
                      boxShadow: gi === activePhoto ? "0 8px 18px -8px rgba(37,99,235,0.6)" : "0 4px 10px -6px rgba(15,23,42,0.25)",
                      opacity: gi === activePhoto ? 1 : 0.75,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <img src={src} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}

                <button
                  className="spot-thumb-arrow"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhoto((i) => (i + 1) % gallery.length);
                  }}
                  aria-label={`Next photo of ${item.name}`}
                  style={{
                    width: 26,
                    height: 26,
                    flexShrink: 0,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(255,255,255,0.9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 10px -4px rgba(15,23,42,0.35)",
                  }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#2563eb", margin: "0 0 8px" }}>
              {category.name}
            </p>
            <h3 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 800, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
              {item.name}
            </h3>
            <p style={{ fontSize: 14.5, color: "#64748b", lineHeight: 1.7, margin: "0 0 20px", maxWidth: 440 }}>
              {item.description}
            </p>

            {/* Size / price boxes — pick a size to update the price & cart */}
            {item.variants.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 22 }}>
                {item.variants.map((v, i) => {
                  const isSelected = i === selectedVariantIndex;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedVariantIndex(i)}
                      className="spot-variant-box"
                      aria-pressed={isSelected}
                      style={{
                        minWidth: 108,
                        textAlign: "left",
                        padding: "12px 16px",
                        borderRadius: 16,
                        border: isSelected ? "2px solid #f59e0b" : "1.5px solid #e5e7eb",
                        background: isSelected ? "#fffbeb" : "#fff",
                        boxShadow: isSelected
                          ? "0 10px 25px -12px rgba(245,158,11,0.45)"
                          : "0 2px 6px -2px rgba(15,23,42,0.06)",
                      }}
                    >
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
                        {v.size}
                      </div>
                      {v.packType && (
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", margin: "3px 0 6px" }}>
                          {v.packType}
                        </div>
                      )}
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a", marginTop: v.packType ? 0 : 6 }}>
                        {v.price != null ? `₹${v.price.toLocaleString("en-IN")}` : "On request"}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Price */}
            <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid rgba(37,99,235,0.1)" }}>
              {selectedVariant?.price != null ? (
                <>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                      ₹{selectedVariant.price.toLocaleString("en-IN")}
                    </span>
                    {selectedVariant.originalPrice && (
                      <span style={{ fontSize: 16, color: "#94a3b8", textDecoration: "line-through" }}>
                        ₹{selectedVariant.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  {selectedVariant.discount && (
                    <p style={{ fontSize: 12.5, color: "#16a34a", fontWeight: 700, margin: "6px 0 0" }}>
                      {selectedVariant.discount}
                    </p>
                  )}
                </>
              ) : (
                <p style={{ fontSize: 13, color: "#94a3b8", fontStyle: "italic", margin: 0 }}>Price on request</p>
              )}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="spot-cta-primary"
                onClick={handleAddToCart}
                disabled={!cartVariant}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 0", borderRadius: 14, border: "none", background: justAdded ? "#16a34a" : "linear-gradient(135deg,#2563eb,#0891b2)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: cartVariant ? "pointer" : "not-allowed", opacity: cartVariant ? 1 : 0.5, boxShadow: "0 15px 30px -12px rgba(37,99,235,0.5)" }}
              >
                <ShoppingCart size={16} />
                {justAdded ? "Added to cart" : "Add to cart"}
              </button>
              <button
                className="spot-cta-secondary"
                onClick={handleAddToCart}
                disabled={!cartVariant}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 0", borderRadius: 14, border: "1px solid #dbeafe", background: "#fff", color: "#0f172a", fontSize: 14, fontWeight: 700, cursor: cartVariant ? "pointer" : "not-allowed", opacity: cartVariant ? 1 : 0.5, transition: "all 0.2s ease" }}
              >
                <Zap size={16} />
                Buy now
              </button>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ width: 140, height: 3, background: "#dbeafe", borderRadius: 3, margin: "0.75rem auto 0", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg,#2563eb,#0891b2)", borderRadius: 3, width: `${((current + 1) / entries.length) * 100}%`, transition: "width 0.5s cubic-bezier(0.25,0.46,0.45,0.94)" }} />
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: "0.5rem" }}>
          {current + 1} / {entries.length}
        </p>
      </div>

      {/* Full-screen image lightbox */}
      {isLightboxOpen && gallery.length > 0 && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(2,6,23,0.9)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", animation: "lightboxFadeIn 0.25s ease-out" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", width: "100%", height: "100%", maxWidth: 900, maxHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", animation: "lightboxZoomIn 0.3s cubic-bezier(0.25,0.46,0.45,0.94)" }}
          >
            <img
              key={activePhoto}
              src={gallery[Math.min(activePhoto, gallery.length - 1)]}
              alt={item.name}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))", animation: "lightboxImageFade 0.35s ease-out" }}
            />

            <button
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close full-screen image"
              style={{ position: "absolute", top: -4, right: -4, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <X size={20} color="#fff" />
            </button>

            {gallery.length > 1 && (
              <>
                <button
                  onClick={() => setActivePhoto((i) => Math.max(0, i - 1))}
                  disabled={activePhoto === 0}
                  aria-label="Previous photo"
                  style={{ position: "absolute", left: 4, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: activePhoto === 0 ? "default" : "pointer", opacity: activePhoto === 0 ? 0.3 : 1 }}
                >
                  <ChevronLeft size={20} color="#fff" />
                </button>
                <button
                  onClick={() => setActivePhoto((i) => Math.min(gallery.length - 1, i + 1))}
                  disabled={activePhoto === gallery.length - 1}
                  aria-label="Next photo"
                  style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: activePhoto === gallery.length - 1 ? "default" : "pointer", opacity: activePhoto === gallery.length - 1 ? 0.3 : 1 }}
                >
                  <ChevronRight size={20} color="#fff" />
                </button>

                <div style={{ position: "absolute", bottom: -32, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
                  {gallery.map((_, gi) => (
                    <button
                      key={gi}
                      onClick={() => setActivePhoto(gi)}
                      aria-label={`View photo ${gi + 1}`}
                      style={{ height: 6, borderRadius: 6, width: gi === activePhoto ? 24 : 6, background: gi === activePhoto ? "#2563eb" : "rgba(255,255,255,0.35)", border: "none", cursor: "pointer", transition: "all 0.25s ease" }}
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