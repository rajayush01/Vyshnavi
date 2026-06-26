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
import CartSlide from "@/components/CartSlide";
import Header from "@/components/layout/Header";

// ── Real asset imports ───────────────────────────────────────────────────
import cowGhee1l_1    from "../assets/cow-ghee1l-1.png";
import cowGhee1l_2    from "../assets/cow-ghee1l-2.png";
import cowGhee5l_1    from "../assets/cow-ghee5l-1.png";
import cowGhee5l_2    from "../assets/cow-ghee5l-2.png";
import buffaloGhee1l_1 from "../assets/buffalo-ghee1l-1.png";
import buffaloGhee1l_2 from "../assets/buffalo-ghee1l-2.png";
import buffaloGhee5l_1 from "../assets/buffalo-ghee5l-1.png";
import buffaloGhee5l_2 from "../assets/buffalo-ghee5l-2.png";

// ── Data source ──────────────────────────────────────────────────────────
import {
  getCategoryByKey,
  type ProductItem,
  type ProductVariant,
} from "../data/vyshnaviData";

// ── Image map: product id → { primary, hover } ───────────────────────────
// Keys are the ids defined in vyshnaviData.ts (601 = Cow Ghee, 602 = Buffalo, 603 = Special)
const GHEE_IMAGE_MAP: Record<number, { primary: string; hover: string }> = {
  601: { primary: cowGhee1l_1,    hover: cowGhee1l_2    }, // Cow Ghee
  602: { primary: buffaloGhee1l_1, hover: buffaloGhee1l_2 }, // Buffalo Ghee
  603: { primary: cowGhee5l_1,    hover: cowGhee5l_2    }, // Special Ghee
};

// Fallback for any ghee product not yet in the map
const FALLBACK = { primary: cowGhee1l_1, hover: cowGhee5l_1 };

// ── Cart line-item type ──────────────────────────────────────────────────
interface CartLineItem {
  /** Unique per product+size combination */
  lineId: string;
  product: ProductItem;
  variant: ProductVariant;
  quantity: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────
function makeLineId(productId: number, size: string): string {
  return `${productId}__${size}`;
}

// ── Main component ───────────────────────────────────────────────────────
const GheeStore: React.FC = () => {
  const navigate = useNavigate();

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

  const [cart, setCart]             = useState<CartLineItem[]>([]);
  const [showCart, setShowCart]     = useState(false);
  const [hoveredId, setHoveredId]   = useState<number | null>(null);

  // ── Cart helpers ─────────────────────────────────────────────────────
  const addToCart = (product: ProductItem) => {
    const size    = selectedVariants[product.id] ?? product.variants[0]?.size ?? "";
    const variant = product.variants.find((v) => v.size === size) ?? product.variants[0];
    const lineId  = makeLineId(product.id, size);

    setCart((prev) => {
      const existing = prev.find((li) => li.lineId === lineId);
      if (existing) {
        return prev.map((li) =>
          li.lineId === lineId ? { ...li, quantity: li.quantity + 1 } : li
        );
      }
      return [...prev, { lineId, product, variant, quantity: 1 }];
    });
  };

  const handleRemoveItem = (lineId: string) =>
    setCart((prev) => prev.filter((li) => li.lineId !== lineId));

  const handleUpdateQuantity = (lineId: string, quantity: number) =>
    setCart((prev) =>
      prev.map((li) => (li.lineId === lineId ? { ...li, quantity } : li))
    );

  // ── CartSlide adapter ─────────────────────────────────────────────────
  // CartSlide expects { id, name, price, image, quantity }
  const cartSlideItems = cart.map((li) => ({
    id:       li.lineId,
    name:     `${li.product.name} — ${li.variant.size}`,
    price:    li.variant.price ?? 0,
    image:    GHEE_IMAGE_MAP[li.product.id]?.primary ?? FALLBACK.primary,
    quantity: li.quantity,
    size:     li.variant.size,
  }));

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-blue-50">
      <Header onCartToggle={() => setShowCart(!showCart)} cartCount={cart.length} />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8 mt-28 max-w-7xl mx-auto">
        {products.map((product) => {
          const imgs        = GHEE_IMAGE_MAP[product.id] ?? FALLBACK;
          const isHovered   = hoveredId === product.id;
          const activeSize  = selectedVariants[product.id] ?? product.variants[0]?.size ?? "";
          const activeVariant = product.variants.find((v) => v.size === activeSize) ?? product.variants[0];

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div
                className="relative h-80 flex items-center justify-center overflow-hidden cursor-pointer bg-gray-50"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate("/details")}
              >
                <img
                  src={isHovered ? imgs.hover : imgs.primary}
                  alt={product.name}
                  className="w-full h-full object-contain p-6 transition-opacity duration-300"
                />

                {/* Tag badge */}
                {product.tag && (
                  <span
                    className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-white px-2.5 py-1 rounded-full ${
                      product.tag === "Best Seller" ? "bg-blue-600" : "bg-green-600"
                    }`}
                  >
                    {product.tag}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-grow">
                {/* Name */}
                <h3
                  className="text-base font-bold text-gray-800 mb-1 leading-snug cursor-pointer hover:text-green-700 transition-colors"
                  onClick={() => navigate("/details")}
                >
                  {product.name}
                </h3>

                {/* Tagline */}
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">
                  {product.description}
                </p>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-1">
                  {activeVariant?.price ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{activeVariant.price.toLocaleString("en-IN")}
                      </span>
                      {activeVariant.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{activeVariant.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                      {activeVariant.discount && (
                        <span className="text-xs font-semibold text-green-600">
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
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                  <select
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
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
                      addToCart(product);
                    }}
                    className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-200 text-sm whitespace-nowrap"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Cart */}
      {showCart && (
        <CartSlide
          cart={cartSlideItems}
          onClose={() => setShowCart(false)}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
        />
      )}
    </div>
  );
};

export default GheeStore;