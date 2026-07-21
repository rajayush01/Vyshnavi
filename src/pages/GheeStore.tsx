/**
 * GheeStore.tsx — Vyshnavi Dairy
 *
 * Product listing page for the Ghee category.
 * Data is sourced entirely from vyshnaviData.ts (key: "ghee").
 *
 * CARD MODEL: each variant is rendered as its own standalone card
 * (no size-chip selector inside a card). If a product has 3 variants,
 * that's 3 cards in the grid — each with its own image, price, and
 * "Add to Cart" button. Cart still tracks { productId, variantSize }
 * pairs, so different sizes remain distinct line items.
 *
 * IMAGE NOTE: each card shows variant.images[0] (falling back to the
 * product's default image) and swaps to variant.images[1] / the
 * product gallery on hover, same as before.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import { useCart } from "@/context/cartContext";

// ── Data source ──────────────────────────────────────────────────────────
import {
  getCategoryByKey,
  type ProductItem,
  type ProductVariant,
} from "../data/vyshnaviData";

// ── Flattened card model ─────────────────────────────────────────────────
// One entry per (product, variant) pair — this is what actually renders.
interface VariantCard {
  cardKey: string;
  product: ProductItem;
  variant: ProductVariant;
}

const flattenToVariantCards = (products: ProductItem[]): VariantCard[] =>
  products.flatMap((product) =>
    (product.variants.length > 0 ? product.variants : [undefined]).map(
      (variant) => ({
        cardKey: `${product.id}-${variant?.size ?? "default"}`,
        product,
        variant: variant as ProductVariant,
      })
    )
  );

// ── Main component ───────────────────────────────────────────────────────
const GheeStore: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Pull the ghee category from the central data store
  const gheeCategory = getCategoryByKey("ghee");
  const products: ProductItem[] = gheeCategory?.items ?? [];

  // Flatten once — each variant becomes its own card
  const variantCards = flattenToVariantCards(products);

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  // ── Cart helper ───────────────────────────────────────────────────────
  const handleAddToCart = (product: ProductItem, variant: ProductVariant) => {
    addToCart(product, variant, 1);
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50/60 via-blue-50/40 to-blue-50 overflow-hidden">
      {/* Decorative dairy/ghee illustrations */}
      <svg className="hidden md:block absolute top-1/4 right-[3%] w-14 h-14 opacity-40 animate-float pointer-events-none z-0" viewBox="0 0 64 64" fill="none">
        <path d="M32 6 C40 22 50 30 50 42 C50 52 42 58 32 58 C22 58 14 52 14 42 C14 30 24 22 32 6 Z" fill="#ffffff" stroke="#60a5fa" strokeWidth="2" />
        <ellipse cx="27" cy="40" rx="4" ry="6" fill="#bfdbfe" opacity="0.7" />
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

      {/* Product Grid — one card per variant */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 px-6 sm:px-8 pb-16 max-w-7xl mx-auto">
        {variantCards.map(({ cardKey, product, variant }) => {
          const isHovered = hoveredKey === cardKey;

          // Each card shows its own variant's image, falling back to
          // the product default when the variant has no photo of its own.
          const imgs = {
            primary: variant?.images?.[0] ?? product.image,
            hover: variant?.images?.[1] ?? product.gallery?.[1] ?? product.image,
          };

          return (
            <div
              key={cardKey}
              className="group bg-white rounded-[26px] border border-amber-50 shadow-[0_15px_40px_-25px_rgba(217,119,6,0.35)] hover:shadow-[0_30px_60px_-25px_rgba(217,119,6,0.4)] hover:-translate-y-1.5 transition-all duration-500 ease-out overflow-hidden flex flex-col relative"
            >
              {/* Subtle corner watermark */}
              <svg className="absolute top-3 right-3 w-6 h-6 opacity-15 pointer-events-none z-10" viewBox="0 0 64 64" fill="none">
                <path d="M18 26 Q18 20 32 20 Q46 20 46 26 L44 50 Q44 56 32 56 Q20 56 20 50 Z" fill="#d97706" />
              </svg>

              {/* Image */}
              <div
                className="relative h-72 sm:h-80 flex items-center justify-center overflow-hidden cursor-pointer bg-gradient-to-br from-amber-50/70 to-white"
                onMouseEnter={() => setHoveredKey(cardKey)}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() =>
                  navigate("/details", {
                    state: { productId: product.id, variantSize: variant?.size },
                  })
                }
              >
                <div className="absolute w-2/3 h-2/3 rounded-full bg-gradient-to-br from-amber-100/60 to-transparent blur-2xl" />
                <img
                  key={imgs.primary}
                  src={isHovered ? imgs.hover : imgs.primary}
                  alt={`${product.name} ${variant?.size ?? ""}`.trim()}
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

                {/* Size badge — replaces the old chip selector */}
                {variant?.size && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-amber-100">
                    {variant.size}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                {/* Name */}
                <h3
                  className="text-base sm:text-lg font-bold text-gray-900 mb-1 leading-snug cursor-pointer hover:text-amber-700 transition-colors tracking-tight"
                  onClick={() =>
                    navigate("/details", {
                      state: { productId: product.id, variantSize: variant?.size },
                    })
                  }
                >
                  {product.name}
                  {variant?.size && (
                    <span className="text-amber-600 font-semibold"> · {variant.size}</span>
                  )}
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
                <div className="mb-3">
                  {variant?.price ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-gray-900 tracking-tight">
                        ₹{variant.price.toLocaleString("en-IN")}
                      </span>
                      {variant.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{variant.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                      {variant.discount && (
                        <span className="text-xs font-bold text-green-600">
                          {variant.discount}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Price on selection</span>
                  )}
                  {variant?.perUnit && (
                    <p className="text-xs text-gray-400 mt-0.5">{variant.perUnit}</p>
                  )}
                </div>

                {/* Add to Cart — no chip selector needed, this card IS the variant */}
                <div className="mt-auto pt-4 border-t border-amber-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product, variant);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-[0_12px_25px_-8px_rgba(217,119,6,0.6)] text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-200 text-sm hover:-translate-y-0.5"
                  >
                    <ShoppingCart size={15} />
                    Add to Cart
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