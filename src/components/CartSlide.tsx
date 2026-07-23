/**
 * CartSlide.tsx — Vyshnavi Dairy
 *
 * Slide-in cart panel. Uses `string` ids throughout so it works with
 * both simple numeric product ids (pass them as String(id)) and composite
 * line-item ids like "601__500 ml" produced by GheeStore / CategoryStore.
 *
 * VISUAL DESIGN NOTE: header, item rows, coupon card, upsell rail,
 * savings ribbon, and footer/checkout are styled to match a reference
 * design (flatter item rows, outlined coupon-tag pills, orange checkout,
 * teal savings ribbon, "Something you must-try!!" heading). The Order
 * Summary block below the coupon card is intentionally left as-is.
 *
 * Coupon logic here is a client-side demo only — there's no payment/coupon
 * backend in this app yet. A set of demo codes is supported (see COUPONS
 * below); any of them can be typed into the input and applied. The
 * "Cart Upsell" rail and its "+ Add" buttons ARE fully functional — they
 * pull real products from vyshnaviData.ts and add them via the shared
 * cart context.
 */

import React, { useMemo, useState } from "react";
import {
  X,
  Minus,
  Plus,
  Trash2,
  Tag,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Wallet,
  Smartphone,
  Receipt,
  Percent,
} from "lucide-react";
import { useCart } from "../context/cartContext";
import {
  getCategoryByKey,
  type ProductItem,
  type ProductVariant,
} from "../data/vyshnaviData";

export interface CartItem {
  /** String id — numeric ids should be stringified: String(product.id) */
  id: string;
  name: string;
  price: number;
  /** Real strikethrough price, when the variant actually has one */
  originalPrice?: number;
  image: string;
  quantity: number;
  /** Optional: shown as a small pill below the product name */
  size?: string;
}

interface CartSlideProps {
  cart: CartItem[];
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

// Demo coupon set — client-side only, see file header note. Any code here
// can be typed into the coupon input and applied.
interface Coupon {
  code: string;
  percent: number;
}

const COUPONS: Coupon[] = [
  { code: "NEW10", percent: 10 },
  { code: "SAVE15", percent: 15 },
  { code: "FLAT20", percent: 20 },
  { code: "WELCOME5", percent: 5 },
  { code: "GHEE25", percent: 25 },
  { code: "DAIRY12", percent: 12 },
  { code: "FESTIVE30", percent: 30 },
];

const FREE_SHIPPING_THRESHOLD = 500;

// One flattened, independently-addable upsell card: a ghee product + one
// of its pack sizes, keyed the same way the cart's lineId is built
// (`${productId}__${size}`) so an item already in the cart can be
// filtered out precisely, not just at the product level.
interface UpsellCard {
  key: string;
  product: ProductItem;
  variant: ProductVariant;
}

const CartSlide: React.FC<CartSlideProps> = ({
  cart,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
}) => {
  const { addToCart } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [showAllOffers, setShowAllOffers] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Real per-item "was" savings (from actual originalPrice fields, before any coupon)
  const itemSavings = cart.reduce(
    (sum, item) =>
      sum +
      (item.originalPrice
        ? (item.originalPrice - item.price) * item.quantity
        : 0),
    0,
  );

  const couponPercent = appliedCoupon?.percent ?? 0;
  const couponDiscount = appliedCoupon
    ? Math.round(subtotal * (couponPercent / 100))
    : 0;
  const totalSavings = itemSavings + couponDiscount;

  const shipping =
    subtotal - couponDiscount >= FREE_SHIPPING_THRESHOLD || subtotal === 0
      ? 0
      : 49;
  const estimatedTotal = subtotal - couponDiscount + shipping;

  const findCoupon = (code: string): Coupon | undefined =>
    COUPONS.find((c) => c.code === code.trim().toUpperCase());

  const handleApplyCoupon = () => {
    const match = findCoupon(couponInput);
    if (!couponInput.trim()) return;
    if (match) {
      setAppliedCoupon(match);
      setCouponError(false);
    } else {
      setCouponError(true);
    }
  };

  const applyCouponDirectly = (coupon: Coupon) => {
    setAppliedCoupon(coupon);
    setCouponInput(coupon.code);
    setCouponError(false);
    setShowAllOffers(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(false);
  };

  // Ghee-only upsell rail — one card per pack size, matching the
  // "variant as product" treatment used across GheeStore / CategoryStore.
  const upsellProducts: UpsellCard[] = useMemo(() => {
    const gheeCategory = getCategoryByKey("ghee");
    if (!gheeCategory) return [];

    const cartLineIds = new Set(cart.map((item) => item.id));

    return gheeCategory.items
      .flatMap((product) =>
        product.variants.map((variant) => ({
          key: `${product.id}__${variant.size}`,
          product,
          variant,
        })),
      )
      .filter((card) => !cartLineIds.has(card.key))
      .slice(0, 6);
  }, [cart]);

  const handleUpsellAdd = (card: UpsellCard) => {
    addToCart(card.product, card.variant, 1);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="absolute top-0 right-0 w-full max-w-md h-full bg-slate-50 shadow-2xl flex flex-col rounded-l-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 bg-white border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-black text-gray-900">
            Your Cart{" "}
            <span className="font-black text-gray-900">
              ({totalItems} items)
            </span>
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <span className="text-5xl mb-4">🛒</span>
            <p className="text-gray-500 font-medium">Your cart is empty</p>
            <p className="text-gray-400 text-sm mt-1">
              Add some products to get started
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
            {/* Cart items — flat list, thin dividers, no per-item card shadow */}
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
              {cart.map((item) => {
                const preCouponPrice = item.price;
                const postCouponPrice = appliedCoupon
                  ? Math.round(preCouponPrice * (1 - couponPercent / 100))
                  : preCouponPrice;

                // Show a strike-through if there's a real "was" price OR a coupon is active
                const showStrike = item.originalPrice || appliedCoupon;
                const strikeValue = item.originalPrice ?? preCouponPrice;

                const lineDiscountPercent = appliedCoupon
                  ? couponPercent
                  : item.originalPrice
                    ? Math.round(
                        ((item.originalPrice - item.price) /
                          item.originalPrice) *
                          100,
                      )
                    : 0;

                return (
                  <div key={item.id} className="flex items-start gap-3 p-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Middle column: name, size pill, quantity row */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                        {item.name}
                      </p>

                      {item.size && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-md px-2.5 py-1">
                          {item.size}
                          <ChevronDown size={12} className="text-gray-400" />
                        </span>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2.5">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            className="w-7 h-7 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-semibold w-7 text-center border-x border-gray-300 h-7 flex items-center justify-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-7 h-7 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:text-red-600 hover:border-red-300 transition-colors"
                          aria-label="Remove item"
                          title="Remove"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Price column */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {showStrike && strikeValue > postCouponPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{strikeValue.toLocaleString("en-IN")}
                        </span>
                      )}
                      <span className="font-black text-gray-900 text-sm">
                        ₹{postCouponPrice.toLocaleString("en-IN")}
                      </span>
                      {lineDiscountPercent > 0 && (
                        <span className="text-[11px] font-bold text-green-600">
                          ({lineDiscountPercent}% OFF)
                        </span>
                      )}
                      {appliedCoupon && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-white border border-green-500 rounded-full px-2 py-0.5">
                          <Tag size={9} /> {appliedCoupon.code}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon card */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-3 bg-green-50 rounded-lg px-4 py-3">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                    <Percent size={14} className="text-green-600" />{" "}
                    {appliedCoupon.code} applied
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-700 bg-white border border-green-200 rounded-full px-2.5 py-1">
                      Saved ₹{couponDiscount.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-gray-400 hover:text-gray-600 text-xs font-semibold underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 focus-within:border-gray-400 transition-colors">
                    <Percent
                      size={14}
                      className="text-gray-400 flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError(false);
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleApplyCoupon()
                      }
                      placeholder="Enter Coupon Code"
                      className="flex-1 text-sm outline-none placeholder:text-gray-400 min-w-0 bg-transparent"
                    />
                    {couponInput && (
                      <button
                        onClick={handleApplyCoupon}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex-shrink-0"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-500 mt-1.5 px-1">
                      That code isn't valid — try NEW10, SAVE15, FLAT20,
                      WELCOME5, GHEE25, DAIRY12 or FESTIVE30.
                    </p>
                  )}
                </>
              )}

              <button
                onClick={() => setShowAllOffers((v) => !v)}
                className="w-full text-center text-sm font-bold text-blue-600 hover:text-blue-700 mt-3.5 flex items-center justify-center gap-1"
              >
                View All Offers
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${showAllOffers ? "rotate-90" : "-rotate-90"}`}
                />
              </button>

              {/* All offers panel — every demo coupon, applied in one tap */}
              {showAllOffers && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  {COUPONS.map((coupon) => {
                    const isActive = appliedCoupon?.code === coupon.code;
                    return (
                      <div
                        key={coupon.code}
                        className={`flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 ${
                          isActive
                            ? "border-green-300 bg-green-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
                            <Percent size={13} className="text-gray-500" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-gray-900 tracking-wide">
                              {coupon.code}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              {coupon.percent}% off on your order
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => applyCouponDirectly(coupon)}
                          disabled={isActive}
                          className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                            isActive
                              ? "bg-green-100 text-green-700 cursor-default"
                              : "border border-blue-200 text-blue-600 hover:bg-blue-50"
                          }`}
                        >
                          {isActive ? "Applied" : "Apply"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Summary — unchanged from previous version */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setIsSummaryOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3.5"
              >
                <span className="flex items-center gap-2 text-sm font-black text-gray-900">
                  <Receipt size={16} className="text-blue-600" />
                  Order Summary
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition-transform duration-300 ${
                    isSummaryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isSummaryOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 pt-1 space-y-2.5 border-t border-gray-50">
                    <div className="flex items-center justify-between text-sm pt-2">
                      <span className="text-gray-500">
                        Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""}
                        )
                      </span>
                      <span className="font-semibold text-gray-800">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {itemSavings > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Product discount</span>
                        <span className="font-semibold text-green-600">
                          − ₹{Math.round(itemSavings).toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    {appliedCoupon && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Coupon ({appliedCoupon.code})
                        </span>
                        <span className="font-semibold text-green-600">
                          − ₹{couponDiscount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span
                        className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-gray-800"}`}
                      >
                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2.5 border-t border-dashed border-gray-200">
                      <span className="font-black text-gray-900">Total</span>
                      <span className="font-black text-gray-900">
                        ₹{estimatedTotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {totalSavings > 0 && (
                      <p className="text-xs font-bold text-green-600 text-right">
                        You're saving ₹
                        {Math.round(totalSavings).toLocaleString("en-IN")} in
                        total 🎉
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Upsell — Ghee only, flat cards */}
            {upsellProducts.length > 0 && (
              <div>
                <p className="font-black text-gray-900 text-base mb-3 px-1">
                  Something you must-try!!
                </p>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                  {upsellProducts.map((card) => {
                    const { product, variant } = card;
                    const img = variant.images?.[0] ?? product.image;
                    return (
                      <div
                        key={card.key}
                        className="flex-shrink-0 w-32 bg-white rounded-xl border border-gray-100 p-3"
                      >
                        {img && (
                          <img
                            src={img}
                            alt={`${product.name} — ${variant.size}`}
                            className="w-full h-16 object-contain mb-2"
                          />
                        )}
                        <p className="text-xs font-bold text-gray-800 leading-snug line-clamp-2 mb-1.5 h-8">
                          {product.name}
                        </p>
                        <p className="text-sm font-black text-gray-900 mb-2">
                          {variant.price
                            ? `₹${variant.price.toLocaleString("en-IN")}`
                            : "—"}
                        </p>
                        <button
                          onClick={() => handleUpsellAdd(card)}
                          className="w-full border border-gray-300 text-gray-800 hover:bg-gray-50 text-xs font-bold py-1.5 rounded-full transition-colors"
                        >
                          + Add
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Savings ribbon — teal, overlapping into the footer */}
            {totalSavings > 0 && (
              <div className="relative bg-teal-500 text-white text-center text-sm font-bold py-3 rounded-full -mb-6 z-10">
                ₹{Math.round(totalSavings).toLocaleString("en-IN")} Saved so
                far!
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {cart.length > 0 && (
          <div className="relative px-5 pt-8 pb-4 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <Receipt size={16} className="text-gray-500" />
                Estimated Total
              </span>
              <div className="text-right">
                {couponDiscount > 0 && (
                  <span className="text-xs text-gray-400 line-through mr-2">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                )}
                <span className="text-lg font-black text-gray-900">
                  ₹{estimatedTotal.toLocaleString("en-IN")}
                </span>
                {couponDiscount > 0 && (
                  <span className="block text-xs font-bold text-green-600">
                    ({couponPercent}% OFF)
                  </span>
                )}
              </div>
            </div>

            {subtotal - couponDiscount < FREE_SHIPPING_THRESHOLD && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-full px-3 py-2 mb-3 text-center">
                Add ₹
                {(
                  FREE_SHIPPING_THRESHOLD -
                  (subtotal - couponDiscount)
                ).toLocaleString("en-IN")}{" "}
                more for free shipping
              </p>
            )}

            <button className="relative w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl transition-colors duration-200 flex items-center justify-between px-6">
              <span className="text-left">
                <span className="block text-sm font-black">Checkout</span>
                <span className="block text-[11px] text-white/80 font-medium">
                  Free shipping on orders above ₹{FREE_SHIPPING_THRESHOLD}
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-white/85">
                <CreditCard size={16} />
                <Wallet size={16} />
                <Smartphone size={16} />
              </span>
            </button>

            <p className="text-center text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1.5">
              <ShieldCheck size={12} /> Secure checkout
            </p>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </div>
  );
};

export default CartSlide;
