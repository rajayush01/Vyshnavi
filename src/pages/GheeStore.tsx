/**
 * GheeStore.tsx — Vyshnavi Dairy
 *
 * Product listing page for the Ghee category.
 * Data is sourced entirely from vyshnaviData.ts (key: "ghee").
 * Each ProductItem's variants are used to populate the size selector;
 * cart tracks { productId, variantSize } pairs so different sizes are
 * treated as distinct line items.
 *
 * IMAGE NOTE: Extend GHEE_IMAGE_MAP below as you add real product images.
 * hoverImage falls back to the same primary image if no hover asset exists.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import { useCart } from "@/context/CartContext";

// ── Data source ──────────────────────────────────────────────────────────
import {
  getCategoryByKey,
  type ProductItem,
} from "../data/vyshnaviData";

// ── Main component ───────────────────────────────────────────────────────
const GheeStore: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Pull the ghee category from the central data store
  const gheeCategory = getCategoryByKey("ghee");
  const products: ProductItem[] = gheeCategory?.items ?? [];

  // Per-card selected variant size (default to first variant)
  const [selectedVariants, setSelectedVariants] = useState<Record<number, string>>(
    () =>
      Object.fromEntries(
        products.map((p) => [p.id, p.variants[0]?.size ?? ""])
      )
  );

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // ── Cart helper ───────────────────────────────────────────────────────
  const handleAddToCart = (product: ProductItem) => {
    const size    = selectedVariants[product.id] ?? product.variants[0]?.size ?? "";
    const variant = product.variants.find((v) => v.size === size) ?? product.variants[0];
    addToCart(product, variant, 1);
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50/60 via-blue-50/40 to-blue-50 overflow-hidden">
      {/* Decorative dairy/ghee illustrations */}
      <svg className="hidden md:block absolute top-32 left-[3%] w-16 h-16 opacity-40 animate-float-slow pointer-events-none z-0" viewBox="0 0 64 64" fill="none">
        <path d="M18 26 Q18 20 32 20 Q46 20 46 26 L44 50 Q44 56 32 56 Q20 56 20 50 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
        <ellipse cx="32" cy="26" rx="14" ry="5" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
        <path d="M24 20 Q24 12 32 12 Q40 12 40 20" stroke="#d97706" strokeWidth="2" fill="none" />
      </svg>
      <svg className="hidden md:block absolute top-1/4 right-[3%] w-14 h-14 opacity-40 animate-float pointer-events-none z-0" viewBox="0 0 64 64" fill="none">
        <path d="M32 6 C40 22 50 30 50 42 C50 52 42 58 32 58 C22 58 14 52 14 42 C14 30 24 22 32 6 Z" fill="#ffffff" stroke="#60a5fa" strokeWidth="2" />
        <ellipse cx="27" cy="40" rx="4" ry="6" fill="#bfdbfe" opacity="0.7" />
      </svg>
      <svg className="hidden md:block absolute bottom-40 left-[4%] w-12 h-12 opacity-40 animate-float pointer-events-none z-0" viewBox="0 0 64 64" fill="none">
        <path d="M10 40 Q32 52 54 40 Q50 48 32 48 Q14 48 10 40 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
        <ellipse cx="32" cy="38" rx="22" ry="6" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
        <path d="M32 30 C34 24 30 20 32 14 C34 20 38 24 32 30 Z" fill="#f97316" />
      </svg>
      <svg className="hidden md:block absolute bottom-16 right-[5%] w-14 h-14 opacity-40 animate-float-slow pointer-events-none z-0" viewBox="0 0 64 64" fill="none">
        <path d="M12 52 C12 30 30 12 52 12 C52 34 34 52 12 52 Z" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2" />
        <path d="M14 50 C24 40 34 30 50 14" stroke="#16a34a" strokeWidth="1.5" />
      </svg>
      <svg className="hidden lg:block absolute top-1/2 left-[45%] -translate-x-1/2 w-10 h-10 opacity-25 animate-float pointer-events-none z-0" viewBox="0 0 64 64" fill="none">
        <path d="M32 10 C38 22 46 28 46 38 C46 46 40 51 32 51 C24 51 18 46 18 38 C18 28 26 22 32 10 Z" fill="#93c5fd" opacity="0.6" />
      </svg>

      <Header />

      {/* Page hero band */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-36 pb-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-amber-200 mb-5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-700">
            Bilona Method
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600">
            Pure. Traditional. Ghee.
          </span>
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Slow-churned the traditional way, from A2 milk — nothing rushed, nothing added.
        </p>
      </div>

      {/* Product Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 px-6 sm:px-8 pb-16 max-w-7xl mx-auto">
        {products.map((product) => {
          const imgs = {
            primary: product.image,
            hover: product.gallery?.[1] ?? product.image,
          };
          const isHovered   = hoveredId === product.id;
          const activeSize  = selectedVariants[product.id] ?? product.variants[0]?.size ?? "";
          const activeVariant = product.variants.find((v) => v.size === activeSize) ?? product.variants[0];

          return (
            <div
              key={product.id}
              className="group bg-white rounded-[26px] border border-amber-50 shadow-[0_15px_40px_-25px_rgba(217,119,6,0.35)] hover:shadow-[0_30px_60px_-25px_rgba(217,119,6,0.4)] hover:-translate-y-1.5 transition-all duration-500 ease-out overflow-hidden flex flex-col relative"
            >
              {/* Subtle corner watermark */}
              <svg className="absolute top-3 right-3 w-6 h-6 opacity-15 pointer-events-none z-10" viewBox="0 0 64 64" fill="none">
                <path d="M18 26 Q18 20 32 20 Q46 20 46 26 L44 50 Q44 56 32 56 Q20 56 20 50 Z" fill="#d97706" />
              </svg>

              {/* Image */}
              <div
                className="relative h-72 sm:h-80 flex items-center justify-center overflow-hidden cursor-pointer bg-gradient-to-br from-amber-50/70 to-white"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate("/details", { state: { productId: product.id } })}
              >
                <div className="absolute w-2/3 h-2/3 rounded-full bg-gradient-to-br from-amber-100/60 to-transparent blur-2xl" />
                <img
                  src={isHovered ? imgs.hover : imgs.primary}
                  alt={product.name}
                  className="relative w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                />

                {/* Tag badge */}
                {product.tag && (
                  <span
                    className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-white px-2.5 py-1 rounded-full shadow-sm ${
                      product.tag === "Best Seller" ? "bg-blue-600" : "bg-amber-600"
                    }`}
                  >
                    {product.tag}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                {/* Name */}
                <h3
                  className="text-base sm:text-lg font-bold text-gray-900 mb-1 leading-snug cursor-pointer hover:text-amber-700 transition-colors tracking-tight"
                  onClick={() => navigate("/details", { state: { productId: product.id } })}
                >
                  {product.name}
                </h3>

                {/* Tagline */}
                <p className="text-xs text-amber-700/80 font-semibold mb-3 uppercase tracking-wide">
                  {product.description}
                </p>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5" fill="currentColor" strokeWidth={0} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-2">
                  {activeVariant?.price ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-gray-900 tracking-tight">
                        ₹{activeVariant.price.toLocaleString("en-IN")}
                      </span>
                      {activeVariant.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{activeVariant.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                      {activeVariant.discount && (
                        <span className="text-xs font-bold text-green-600">
                          {activeVariant.discount}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Price on selection</span>
                  )}
                  {activeVariant?.perUnit && (
                    <p className="text-xs text-gray-400 mt-0.5">{activeVariant.perUnit}</p>
                  )}
                </div>

                {/* Size selector + Add to Cart */}
                <div className="flex items-center gap-2.5 mt-auto pt-4 border-t border-amber-50">
                  <select
                    className="flex-1 border border-amber-100 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50/40 text-gray-700"
                    value={activeSize}
                    onChange={(e) =>
                      setSelectedVariants((prev) => ({
                        ...prev,
                        [product.id]: e.target.value,
                      }))
                    }
                    onClick={(e) => e.stopPropagation()}
                  >
                    {product.variants.map((v) => (
                      <option key={v.size} value={v.size}>
                        {v.size}
                        {v.price ? ` — ₹${v.price.toLocaleString("en-IN")}` : ""}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-[0_12px_25px_-8px_rgba(217,119,6,0.6)] text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-200 text-sm whitespace-nowrap hover:-translate-y-0.5"
                  >
                    <ShoppingCart size={15} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ambient keyframes */}
      <style>{`
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: floatUpDown 5s ease-in-out infinite; }
        .animate-float-slow { animation: floatUpDown 7s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default GheeStore;