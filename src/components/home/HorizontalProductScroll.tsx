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
import { ShoppingCart, Zap, ChevronLeft, ChevronRight, Star } from "lucide-react";

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
    <svg className="spot-deco spot-float-slow" style={{ position: "absolute", top: 24, left: "3%", width: 68, height: 68, opacity: 0.35, pointerEvents: "none", zIndex: 0 }} viewBox="0 0 64 64" fill="none">
      <path d="M16 20 L38 20 L36 44 Q36 50 27 50 Q18 50 18 44 Z" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
      <path d="M38 24 Q50 26 48 34 Q46 40 38 38" fill="none" stroke="#3b82f6" strokeWidth="2" />
      <path d="M48 34 Q52 40 50 48" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <rect x="14" y="14" width="26" height="6" rx="2" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
    </svg>
    <svg className="spot-deco spot-float" style={{ position: "absolute", top: 30, right: "4%", width: 52, height: 52, opacity: 0.35, pointerEvents: "none", zIndex: 0 }} viewBox="0 0 64 64" fill="none">
      <path d="M32 50 C20 50 14 42 16 34 C10 32 10 22 18 20 C18 12 28 8 34 14 C42 10 50 18 46 26 C54 28 52 40 44 42 C44 48 38 50 32 50 Z" fill="#ffffff" stroke="#a5b4fc" strokeWidth="1.8" />
    </svg>
    <svg className="spot-deco spot-float-slow" style={{ position: "absolute", bottom: 22, right: "5%", width: 42, height: 50, opacity: 0.3, pointerEvents: "none", zIndex: 0 }} viewBox="0 0 64 64" fill="none">
      <rect x="26" y="6" width="12" height="8" rx="2" fill="#d97706" />
      <path d="M18 16 L46 16 L50 44 Q50 52 32 52 Q14 52 14 44 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
    </svg>
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
  const [justAdded, setJustAdded] = useState(false);
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

  // Reset the "added" confirmation and photo index whenever the featured product changes
  useEffect(() => {
    setJustAdded(false);
    setActivePhoto(0);
  }, [current]);

  const resolvedHeading = heading ?? "Our Ghee Collection";

  if (!active) return null;

  const { item, category } = active;
  const gallery = getGallery(item);
  const img = gallery[Math.min(activePhoto, gallery.length - 1)] ?? null;
  const priceVariant = item.variants.find((v) => v.price != null);
  const cartVariant = priceVariant ?? item.variants[0];

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
              <img src={img} alt={item.name} draggable={false} style={{ maxWidth: "72%", maxHeight: "72%", objectFit: "contain", position: "relative", zIndex: 1, filter: "drop-shadow(0 30px 30px rgba(15,23,42,0.18))" }} />
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
              <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 2 }}>
                {gallery.map((src, gi) => (
                  <button
                    key={gi}
                    onClick={() => setActivePhoto(gi)}
                    aria-label={`View photo ${gi + 1} of ${item.name}`}
                    style={{
                      width: 40,
                      height: 40,
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

            {/* Variant chips */}
            {item.variants.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 22 }}>
                {item.variants.slice(0, 5).map((v, i) => (
                  <span key={i} style={{ fontSize: 12, fontWeight: 600, border: "1px solid #dbeafe", background: "#eff6ff", borderRadius: 8, padding: "5px 12px", color: "#1d4ed8" }}>
                    {v.size}
                  </span>
                ))}
                {item.variants.length > 5 && (
                  <span style={{ fontSize: 12, color: "#2563eb", fontWeight: 700, alignSelf: "center" }}>
                    +{item.variants.length - 5} more
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid rgba(37,99,235,0.1)" }}>
              {priceVariant ? (
                <>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                      ₹{priceVariant.price!.toLocaleString("en-IN")}
                    </span>
                    {priceVariant.originalPrice && (
                      <span style={{ fontSize: 16, color: "#94a3b8", textDecoration: "line-through" }}>
                        ₹{priceVariant.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  {priceVariant.discount && (
                    <p style={{ fontSize: 12.5, color: "#16a34a", fontWeight: 700, margin: "6px 0 0" }}>
                      {priceVariant.discount}
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
    </section>
  );
};

export default HorizontalProductScroll;