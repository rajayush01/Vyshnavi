/**
 * StageProductShowcase.tsx — Vyshnavi Dairy
 *
 * Cinematic "stage" layout: one hero card center-stage, side cards
 * peek at reduced scale/opacity. Smooth cubic-bezier transitions,
 * drag/swipe, keyboard navigation, and category filtering.
 *
 * Drop-in replacement for HorizontalProductScroll.tsx.
 * Same props API: categoryKey? + heading?
 *
 * IMAGE NOTE: Extend IMAGE_MAP below as you add real assets.
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ShoppingCart, Zap, ChevronLeft, ChevronRight } from "lucide-react";

// ── Existing assets ──────────────────────────────────────────────────────
import butter200      from "../../assets/butter-200-bg.png";
import butter500      from "../../assets/butter-500-bg.png";
import buttermilk     from "../../assets/buttermilk.png";
import curd1          from "../../assets/curd-pouch.png";
import curd_pouch     from "../../assets/curd.png";
import curd_box       from "../../assets/curd-box.png";
import badam_milk     from "../../assets/badam-milk.png";
import chocolate_milk from "../../assets/chocolate-milk.png";
import spl_badam_milk from "../../assets/spl-badam-milk.png";
import img_ghee1      from "../../assets/cow-ghee1l-1.png";
import img_ghee2      from "../../assets/cow-ghee5l-1.png";
import img_ghee3      from "../../assets/buffalo-ghee1l-1.png";

// ── Data source ──────────────────────────────────────────────────────────
import {
  CATEGORIES,
  type ProductItem,
  type ProductCategory,
} from "../../data/vyshnaviData";

// ── Image map ────────────────────────────────────────────────────────────
const IMAGE_MAP: Record<number, string> = {
  301: buttermilk,
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

// ── Fallback gradients when no image exists ──────────────────────────────
const FALLBACK_GRADIENT: Record<string, string> = {
  milk:      "linear-gradient(135deg,#d1fae5,#a7f3d0)",
  curd:      "linear-gradient(135deg,#dcfce7,#bbf7d0)",
  beverages: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
  paneer:    "linear-gradient(135deg,#ffedd5,#fed7aa)",
  butter:    "linear-gradient(135deg,#fefce8,#fef08a)",
  ghee:      "linear-gradient(135deg,#fffbeb,#fde68a)",
  sweets:    "linear-gradient(135deg,#fdf4ff,#f5d0fe)",
};

// ── Card dimensions ──────────────────────────────────────────────────────
const CARD_ACTIVE_W  = 340;
const CARD_SIDE_W    = 260;
const CARD_ACTIVE_H  = 420;
const CARD_SIDE_H    = 370;
const GAP            = 20;

// ── Types ────────────────────────────────────────────────────────────────
interface Entry {
  item: ProductItem;
  category: ProductCategory;
}

interface StageProductShowcaseProps {
  categoryKey?: string;
  heading?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────
function getImage(item: ProductItem): string | null {
  return IMAGE_MAP[item.id] ?? null;
}

function getDistance(idx: number, current: number): number {
  return Math.abs(idx - current);
}

// ── Individual card ───────────────────────────────────────────────────────
interface CardProps {
  entry: Entry;
  distance: number; // 0 = active, 1 = side, 2+ = far
  onClick: () => void;
}

const StageCard: React.FC<CardProps> = ({ entry, distance, onClick }) => {
  const { item, category } = entry;
  const img = getImage(item);
  const priceVariant = item.variants.find((v) => v.price != null);

  const isActive = distance === 0;
  const isSide   = distance === 1;

  const width  = isActive ? CARD_ACTIVE_W : CARD_SIDE_W;
  const height = isActive ? CARD_ACTIVE_H : CARD_SIDE_H;
  const opacity = isActive ? 1 : isSide ? 0.6 : 0.25;
  const scale   = isActive ? 1 : isSide ? 0.93 : 0.85;
  const imgH    = isActive ? 200 : 160;

  return (
    <div
      onClick={!isActive ? onClick : undefined}
      style={{
        position: "relative",
        flexShrink: 0,
        width,
        height,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        transition: "all 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        cursor: isActive ? "default" : "pointer",
        borderRadius: 20,
        background: "#fff",
        border: isActive
          ? "1px solid rgba(0,0,0,0.08)"
          : "1px solid rgba(0,0,0,0.05)",
        boxShadow: isActive
          ? "0 4px 40px rgba(0,0,0,0.10)"
          : "none",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* Tag badge */}
      {item.tag && (
        <span
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 2,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "3px 10px",
            borderRadius: 20,
            background: item.tag === "Best Seller" ? "#dbeafe" : "#dcfce7",
            color: item.tag === "Best Seller" ? "#1e40af" : "#166534",
          }}
        >
          {item.tag}
        </span>
      )}

      {/* Rating badge */}
      {item.rating && isActive && (
        <span
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.95)",
            color: "#78350f",
            border: "0.5px solid rgba(0,0,0,0.07)",
          }}
        >
          ★ {item.rating}
        </span>
      )}

      {/* Product image */}
      <div
        style={{
          width: "100%",
          height: imgH,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: img
            ? "#f8f8f6"
            : FALLBACK_GRADIENT[category.key] ?? "#f3f4f6",
          overflow: "hidden",
          transition: "height 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {img ? (
          <img
            src={img}
            alt={item.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: 12,
              transition: "transform 0.3s ease",
            }}
            draggable={false}
          />
        ) : (
          <span style={{ fontSize: 12, color: "#6b7280", textAlign: "center", padding: "0 12px" }}>
            {item.name}
          </span>
        )}
      </div>

      {/* Card body */}
      <div
        style={{
          padding: isActive ? "18px 20px" : "14px 16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          transition: "padding 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {/* Category eyebrow */}
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#6b7280",
            margin: 0,
          }}
        >
          {category.name}
        </p>

        <h3
          style={{
            fontSize: isActive ? 16 : 13,
            fontWeight: 700,
            color: "#111827",
            margin: 0,
            lineHeight: 1.3,
            transition: "font-size 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {item.name}
        </h3>

        {isActive && (
          <p
            style={{
              fontSize: 12,
              color: "#6b7280",
              margin: 0,
              lineHeight: 1.65,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.description}
          </p>
        )}

        {/* Variant chips */}
        {isActive && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 2 }}>
            {item.variants.slice(0, 4).map((v, i) => (
              <span
                key={i}
                style={{
                  fontSize: 10,
                  border: "0.5px solid #e5e7eb",
                  borderRadius: 6,
                  padding: "2px 8px",
                  color: "#6b7280",
                }}
              >
                {v.size}
              </span>
            ))}
            {item.variants.length > 4 && (
              <span style={{ fontSize: 10, color: "#15803d", fontWeight: 600 }}>
                +{item.variants.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div style={{ marginTop: "auto", paddingTop: 8 }}>
          {priceVariant ? (
            <>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontSize: isActive ? 20 : 15,
                    fontWeight: 700,
                    color: "#111827",
                    transition: "font-size 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                >
                  ₹{priceVariant.price!.toLocaleString("en-IN")}
                </span>
                {priceVariant.originalPrice && isActive && (
                  <span
                    style={{
                      fontSize: 12,
                      color: "#9ca3af",
                      textDecoration: "line-through",
                    }}
                  >
                    ₹{priceVariant.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              {priceVariant.discount && isActive && (
                <p
                  style={{
                    fontSize: 11,
                    color: "#15803d",
                    fontWeight: 600,
                    margin: "3px 0 0",
                  }}
                >
                  {priceVariant.discount}
                </p>
              )}
            </>
          ) : (
            <p style={{ fontSize: 11, color: "#9ca3af", fontStyle: "italic", margin: 0 }}>
              Price on request
            </p>
          )}
        </div>

        {/* CTA — only on active card */}
        {isActive && (
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 10,
              paddingTop: 12,
              borderTop: "0.5px solid #f3f4f6",
            }}
          >
            <button
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "9px 0",
                borderRadius: 10,
                border: "none",
                background: "#15803d",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#166534")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#15803d")}
            >
              <ShoppingCart size={13} />
              Add to cart
            </button>
            <button
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "9px 0",
                borderRadius: 10,
                border: "0.5px solid #e5e7eb",
                background: "#fff",
                color: "#111827",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#f9fafb")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#fff")}
            >
              <Zap size={13} />
              Buy now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────
const StageProductShowcase: React.FC<StageProductShowcaseProps> = ({
  categoryKey,
  heading,
}) => {
  const wrapRef        = useRef<HTMLDivElement>(null);
  const [current,    setCurrent]    = useState(0);
  const [activeCat,  setActiveCat]  = useState<string>(categoryKey ?? "all");
  const [wrapWidth,  setWrapWidth]  = useState(0);

  // ── Build flat entry list ────────────────────────────────────────────
  const allEntries = React.useMemo<Entry[]>(() => {
    const out: Entry[] = [];
    CATEGORIES.forEach((cat) =>
      cat.items.forEach((item) => out.push({ item, category: cat }))
    );
    return out;
  }, []);

  const catKeys = ["all", ...Array.from(new Set(allEntries.map((e) => e.category.key)))];
  const catLabel: Record<string, string> = { all: "All" };
  allEntries.forEach((e) => { catLabel[e.category.key] = e.category.name; });

  const entries = activeCat === "all"
    ? allEntries
    : allEntries.filter((e) => e.category.key === activeCat);

  // reset index when filter changes
  const handleCatChange = (key: string) => {
    setActiveCat(key);
    setCurrent(0);
  };

  // ── Measure container ────────────────────────────────────────────────
  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      setWrapWidth(entry.contentRect.width);
    });
    if (wrapRef.current) {
      ro.observe(wrapRef.current);
      setWrapWidth(wrapRef.current.clientWidth);
    }
    return () => ro.disconnect();
  }, []);

  // ── Keyboard navigation ──────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  setCurrent((c) => Math.max(0, c - 1));
      if (e.key === "ArrowRight") setCurrent((c) => Math.min(entries.length - 1, c + 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [entries.length]);

  // ── Drag / swipe ─────────────────────────────────────────────────────
  const dragStart = useRef(0);
  const isDragging = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStart.current  = e.clientX;
  };
  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx = e.clientX - dragStart.current;
    if (dx < -50) setCurrent((c) => Math.min(entries.length - 1, c + 1));
    if (dx >  50) setCurrent((c) => Math.max(0, c - 1));
  }, [entries.length]);

  // ── Track translateX ─────────────────────────────────────────────────
  const trackX = React.useMemo(() => {
    if (wrapWidth === 0) return 0;
    // sum widths of all cards before current
    let offset = 0;
    for (let i = 0; i < current; i++) {
      const dist = getDistance(i, current);
      offset += (dist <= 1 ? CARD_SIDE_W : CARD_SIDE_W) + GAP;
    }
    return wrapWidth / 2 - CARD_ACTIVE_W / 2 - offset;
  }, [current, wrapWidth]);

  // ── Resolved heading ─────────────────────────────────────────────────
  const resolvedHeading =
    heading ??
    (categoryKey
      ? CATEGORIES.find((c) => c.key === categoryKey)?.name ?? "Products"
      : "Our Products");

  // ── Only show category pills when not locked to one category ─────────
  const showCatFilter = !categoryKey;

  return (
    <section
      style={{
        width: "100%",
        padding: "4rem 0 3rem",
        background: "#E0F2FE",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
    

      {/* Category pills */}
      {showCatFilter && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: "2rem",
            padding: "0 1rem",
          }}
        >
          {catKeys.map((key) => (
            <button
              key={key}
              onClick={() => handleCatChange(key)}
              style={{
                padding: "6px 18px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                border: "0.5px solid",
                borderColor: activeCat === key ? "#15803d" : "#d1d5db",
                background: activeCat === key ? "#15803d" : "#fff",
                color: activeCat === key ? "#fff" : "#4b5563",
                transition: "all 0.2s ease",
              }}
            >
              {catLabel[key]}
            </button>
          ))}
        </div>
      )}

      {/* Stage track */}
      <div
        ref={wrapRef}
        style={{
          position: "relative",
          width: "100%",
          height: CARD_ACTIVE_H + 20,
          cursor: "grab",
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 0,
            display: "flex",
            alignItems: "center",
            gap: GAP,
            transform: `translateX(${trackX}px)`,
            transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            willChange: "transform",
          }}
        >
          {entries.map(({ item, category }, idx) => (
            <StageCard
              key={item.id}
              entry={{ item, category }}
              distance={getDistance(idx, current)}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      </div>

      {/* Navigation row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          marginTop: "1.5rem",
        }}
      >
        {/* Prev button */}
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          aria-label="Previous product"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "0.5px solid #d1d5db",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: current === 0 ? "default" : "pointer",
            opacity: current === 0 ? 0.3 : 1,
            transition: "all 0.2s",
          }}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dot indicators */}
        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
          {entries.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to product ${idx + 1}`}
              style={{
                width: idx === current ? 22 : 6,
                height: 6,
                borderRadius: 3,
                border: "none",
                background: idx === current ? "#15803d" : "#d1d5db",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.35s ease",
              }}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => setCurrent((c) => Math.min(entries.length - 1, c + 1))}
          disabled={current === entries.length - 1}
          aria-label="Next product"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "0.5px solid #d1d5db",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: current === entries.length - 1 ? "default" : "pointer",
            opacity: current === entries.length - 1 ? 0.3 : 1,
            transition: "all 0.2s",
          }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 120,
          height: 2,
          background: "#e5e7eb",
          borderRadius: 2,
          margin: "0.75rem auto 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "#15803d",
            borderRadius: 2,
            width: `${((current + 1) / entries.length) * 100}%`,
            transition: "width 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />
      </div>

      {/* Product counter */}
      <p
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "#9ca3af",
          marginTop: "0.5rem",
        }}
      >
        {current + 1} / {entries.length}
      </p>
    </section>
  );
};

export default StageProductShowcase;