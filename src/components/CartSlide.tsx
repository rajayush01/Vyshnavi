/**
 * CartSlide.tsx — Vyshnavi Dairy
 *
 * Slide-in cart panel. Uses `string` ids throughout so it works with
 * both simple numeric product ids (pass them as String(id)) and composite
 * line-item ids like "601__500 ml" produced by GheeStore / CategoryStore.
 *
 * Coupon logic here is a client-side demo only — there's no payment/coupon
 * backend in this app yet. A small set of demo codes is supported
 * (NEW10, SAVE15, FLAT20, WELCOME5), plus a "Surprise Me" button that
 * randomly applies one of them so users can see the discount flow without
 * knowing a code. The "Cart Upsell" rail and its "+ Add" buttons ARE fully
 * functional — they pull real products from vyshnaviData.ts and add them
 * via the shared cart context.
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
  ArrowRight,
  Sparkles,
  Receipt,
} from "lucide-react";
import { useCart } from "../context/cartContext";
import { getAllProducts } from "../data/vyshnaviData";

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

// Demo coupon set — client-side only, see file header note.
interface Coupon {
  code: string;
  percent: number;
}

const COUPONS: Coupon[] = [
  { code: "NEW10", percent: 10 },
  { code: "SAVE15", percent: 15 },
  { code: "FLAT20", percent: 20 },
  { code: "WELCOME5", percent: 5 },
];

const FREE_SHIPPING_THRESHOLD = 500;

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

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Real per-item "was" savings (from actual originalPrice fields, before any coupon)
  const itemSavings = cart.reduce(
    (sum, item) =>
      sum + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0),
    0
  );

  const couponPercent = appliedCoupon?.percent ?? 0;
  const couponDiscount = appliedCoupon ? Math.round(subtotal * (couponPercent / 100)) : 0;
  const totalSavings = itemSavings + couponDiscount;

  const shipping =
    subtotal - couponDiscount >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 49;
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

  const handleSurpriseCoupon = () => {
    const random = COUPONS[Math.floor(Math.random() * COUPONS.length)];
    setAppliedCoupon(random);
    setCouponInput(random.code);
    setCouponError(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError(false);
  };

  // Suggest a few real products not already in the cart
  const upsellProducts = useMemo(() => {
    const cartProductIds = new Set(cart.map((item) => item.id.split("__")[0]));
    return getAllProducts()
      .filter((p) => p.image && !cartProductIds.has(String(p.id)))
      .slice(0, 6);
  }, [cart]);

  const handleUpsellAdd = (productId: number) => {
    const product = getAllProducts().find((p) => p.id === productId);
    const variant = product?.variants[0];
    if (product && variant) addToCart(product, variant, 1);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="absolute top-0 right-0 w-full max-w-md h-full bg-slate-50 shadow-2xl flex flex-col rounded-l-[32px] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 bg-white border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-black text-gray-900">
            Your Cart <span className="font-bold text-gray-400">({totalItems} items)</span>
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
            {/* Cart items */}
            <div className="bg-white rounded-3xl border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
              {cart.map((item) => {
                const preCouponPrice = item.price;
                const postCouponPrice = appliedCoupon
                  ? Math.round(preCouponPrice * (1 - couponPercent / 100))
                  : preCouponPrice;

                // Show a strike-through if there's a real "was" price OR a coupon is active
                const showStrike = item.originalPrice || appliedCoupon;
                const strikeValue = item.originalPrice ?? preCouponPrice;

                const lineSavings =
                  (item.originalPrice ? item.originalPrice - item.price : 0) * item.quantity +
                  (appliedCoupon ? (preCouponPrice - postCouponPrice) * item.quantity : 0);

                return (
                  <div key={item.id} className="flex items-start gap-3 p-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-2xl border border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                        {item.name}
                      </p>

                      {item.size && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1">
                          {item.size}
                          <ChevronDown size={12} className="text-gray-400" />
                        </span>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 bg-white border border-gray-300 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 bg-white border border-gray-300 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-full transition-colors ml-1"
                          aria-label="Remove item"
                          title="Remove"
                        >
                          <Trash2 size={14} />
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
                      {lineSavings > 0 && (
                        <span className="text-[11px] font-bold text-green-600">
                          Save ₹{Math.round(lineSavings).toLocaleString("en-IN")}
                        </span>
                      )}
                      {appliedCoupon && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                          <Tag size={9} /> {appliedCoupon.code}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-100 rounded-2xl px-4 py-3">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-green-700">
                    <Tag size={14} /> {appliedCoupon.code} applied
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-700 bg-white border border-green-200 rounded-full px-2.5 py-1">
                      Saved ₹{couponDiscount.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-green-700/60 hover:text-green-800 text-xs font-semibold underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-blue-300 transition-colors">
                    <Tag size={14} className="text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value); setCouponError(false); }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
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
                      That code isn't valid — try NEW10, SAVE15, FLAT20 or WELCOME5.
                    </p>
                  )}

                  <button
                    onClick={handleSurpriseCoupon}
                    className="w-full mt-3 flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 text-xs font-bold py-2.5 rounded-full hover:shadow-[0_8px_20px_-10px_rgba(217,119,6,0.5)] hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Sparkles size={13} />
                    Surprise Me With a Coupon
                  </button>
                </>
              )}

              <button className="w-full text-center text-sm font-bold text-blue-600 hover:text-blue-700 mt-3.5 flex items-center justify-center gap-1">
                View All Offers <ArrowRight size={14} />
              </button>
            </div>

            {/* Order Summary — collapsible */}
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
                  isSummaryOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 pt-1 space-y-2.5 border-t border-gray-50">
                    <div className="flex items-center justify-between text-sm pt-2">
                      <span className="text-gray-500">
                        Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
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
                      <span className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-gray-800"}`}>
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
                        You're saving ₹{Math.round(totalSavings).toLocaleString("en-IN")} in total 🎉
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Upsell */}
            {upsellProducts.length > 0 && (
              <div>
                <p className="font-black text-gray-900 text-sm mb-3 px-1">Cart Upsell</p>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                  {upsellProducts.map((product) => {
                    const variant = product.variants[0];
                    return (
                      <div
                        key={product.id}
                        className="flex-shrink-0 w-32 bg-white rounded-3xl border border-gray-100 p-3 shadow-sm"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-16 object-contain mb-2"
                        />
                        <p className="text-xs font-bold text-gray-800 leading-snug line-clamp-2 mb-1.5 h-8">
                          {product.name}
                        </p>
                        <p className="text-sm font-black text-gray-900 mb-2">
                          {variant?.price ? `₹${variant.price.toLocaleString("en-IN")}` : "—"}
                        </p>
                        <button
                          onClick={() => handleUpsellAdd(product.id)}
                          className="w-full border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-bold py-1.5 rounded-full transition-colors"
                        >
                          + Add
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Savings ribbon */}
            {totalSavings > 0 && (
              <div className="relative bg-gradient-to-r from-green-600 to-emerald-500 text-white text-center text-sm font-bold py-3 rounded-2xl shadow-[0_10px_25px_-12px_rgba(22,163,74,0.6)]">
                ₹{Math.round(totalSavings).toLocaleString("en-IN")} Saved so far!
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <ShieldCheck size={16} className="text-blue-600" />
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
                Add ₹{(FREE_SHIPPING_THRESHOLD - (subtotal - couponDiscount)).toLocaleString("en-IN")} more for free shipping
              </p>
            )}

            <button className="relative w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-[0_15px_35px_-12px_rgba(37,99,235,0.6)] text-white py-4 rounded-full transition-all duration-200 flex items-center justify-between px-6">
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