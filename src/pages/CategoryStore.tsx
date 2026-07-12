/**
 * CategoryStore.tsx — Vyshnavi Dairy
 *
 * Generic product listing page for any category (Milk, Curd, Beverages,
 * Paneer, Butter, Sweets — Ghee keeps its own bespoke page at /ghee).
 * Reads the category key from the route (/category/:key) and renders
 * every item in that category, driven entirely by vyshnaviData.ts.
 *
 * Cart wiring uses the shared CartContext, same as GheeStore and
 * ProductDetails, so items added here show up in the same cart everywhere.
 */

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star, ShoppingCart, Sparkles, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import { useCart } from "@/context/cartContext";
import {
  getCategoryByKey,
  CATEGORIES,
  type ProductItem,
} from "../data/vyshnaviData";

const FALLBACK_GRADIENT: Record<string, string> = {
  milk:      "linear-gradient(135deg,#bfdbfe,#dbeafe)",
  curd:      "linear-gradient(135deg,#bbf7d0,#dcfce7)",
  beverages: "linear-gradient(135deg,#e9d5ff,#f3e8ff)",
  paneer:    "linear-gradient(135deg,#fed7aa,#ffedd5)",
  butter:    "linear-gradient(135deg,#fef08a,#fefce8)",
  ghee:      "linear-gradient(135deg,#fde68a,#fffbeb)",
  sweets:    "linear-gradient(135deg,#fbcfe8,#fdf2f8)",
};

const CategoryStore: React.FC = () => {
  const navigate = useNavigate();
  const { key } = useParams<{ key: string }>();
  const { addToCart } = useCart();

  const category = getCategoryByKey(key ?? "") ?? CATEGORIES[0];
  const products: ProductItem[] = category.items;
  const accent = category.accentHex;
  const fallbackBg = FALLBACK_GRADIENT[category.key] ?? "#f3f4f6";

  const [selectedVariants, setSelectedVariants] = useState<Record<number, string>>(
    () => Object.fromEntries(products.map((p) => [p.id, p.variants[0]?.size ?? ""]))
  );
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleAddToCart = (product: ProductItem) => {
    const size = selectedVariants[product.id] ?? product.variants[0]?.size ?? "";
    const variant = product.variants.find((v) => v.size === size) ?? product.variants[0];
    if (!variant) return;
    addToCart(product, variant, 1);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50/40 via-white to-white overflow-hidden">
      <Header />

      {/* Page hero band */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-36 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border mb-5"
            style={{ borderColor: `${accent}33` }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: accent }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: accent }}>
              {category.tagline}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 text-gray-900">
            {category.name}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            {category.subtitle} · {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 px-6 sm:px-8 pb-20 max-w-7xl mx-auto">
        {products.map((product) => {
          const imgs = {
            primary: product.image,
            hover: product.gallery?.[1] ?? product.image,
          };
          const isHovered = hoveredId === product.id;
          const activeSize = selectedVariants[product.id] ?? product.variants[0]?.size ?? "";
          const activeVariant = product.variants.find((v) => v.size === activeSize) ?? product.variants[0];

          return (
            <div
              key={product.id}
              className="group bg-white rounded-[26px] border shadow-[0_15px_40px_-25px_rgba(15,23,42,0.25)] hover:-translate-y-1.5 transition-all duration-500 ease-out overflow-hidden flex flex-col relative"
              style={{ borderColor: `${accent}22` }}
            >
              {/* Image */}
              <div
                className="relative h-72 sm:h-80 flex items-center justify-center overflow-hidden cursor-pointer"
                style={{ background: fallbackBg }}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate("/details", { state: { productId: product.id } })}
              >
                <div className="absolute w-2/3 h-2/3 rounded-full bg-white/40 blur-2xl" />
                {imgs.primary ? (
                  <img
                    src={isHovered ? imgs.hover : imgs.primary}
                    alt={product.name}
                    className="relative w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="relative text-sm font-semibold text-gray-500 px-6 text-center">
                    {product.name}
                  </span>
                )}

                {product.tag && (
                  <span
                    className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-white px-2.5 py-1 rounded-full shadow-sm"
                    style={{ backgroundColor: product.tag === "Best Seller" ? "#2563eb" : "#16a34a" }}
                  >
                    {product.tag}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                <h3
                  className="text-base sm:text-lg font-bold text-gray-900 mb-1 leading-snug cursor-pointer tracking-tight transition-colors"
                  onClick={() => navigate("/details", { state: { productId: product.id } })}
                >
                  {product.name}
                </h3>

                <p className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: accent }}>
                  {product.description}
                </p>

                {product.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex" style={{ color: accent }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5" fill="currentColor" strokeWidth={0} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      {product.rating} ({product.reviews ?? 0} reviews)
                    </span>
                  </div>
                )}

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
                        <span className="text-xs font-bold text-green-600">{activeVariant.discount}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Price on request</span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 mt-auto pt-4 border-t border-gray-50">
                  <select
                    className="flex-1 border rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none bg-gray-50 text-gray-700"
                    style={{ borderColor: `${accent}33` }}
                    value={activeSize}
                    onChange={(e) =>
                      setSelectedVariants((prev) => ({ ...prev, [product.id]: e.target.value }))
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
                    className="flex items-center gap-1.5 text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-200 text-sm whitespace-nowrap hover:-translate-y-0.5"
                    style={{ backgroundColor: accent }}
                  >
                    <ShoppingCart size={15} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {products.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="text-slate-400 font-medium">No products in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryStore;