/**
 * CartSlide.tsx — Vyshnavi Dairy
 *
 * Slide-in cart panel. Uses `string` ids throughout so it works with
 * both simple numeric product ids (pass them as String(id)) and composite
 * line-item ids like "601__500 ml" produced by GheeStore / CategoryStore.
 *
 * Coupon logic here is a client-side demo only (single working code,
 * "NEW10" for 10% off) — there's no payment/coupon backend in this app yet,
 * so nothing here is wired to a real discount system. The "Cart Upsell"
 * rail and its "+ Add" buttons ARE fully functional — they pull real
 * products from vyshnaviData.ts and add them via the shared cart context.
 */

import React, { useMemo, useState } from "react";
import { X, Minus, Plus, Trash2, Tag, ChevronDown, ShieldCheck, CreditCard, Wallet, Smartphone, ArrowRight } from "lucide-react";
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

// The only working demo coupon — client-side only, see file header note.
const COUPON_CODE = "NEW10";
const COUPON_PERCENT = 10;

const FREE_SHIPPING_THRESHOLD = 500;

const CartSlide: React.FC<CartSlideProps> = ({
  cart,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
}) => {
  const { addToCart } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discount = appliedCoupon ? Math.round(subtotal * (COUPON_PERCENT / 100)) : 0;
  const shipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 49;
  const estimatedTotal = subtotal - discount + shipping;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (code === COUPON_CODE) {
      setAppliedCoupon(code);
      setCouponError(false);
    } else {
      setCouponError(true);
    }
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
      <div className="absolute top-0 right-0 w-full max-w-md h-full bg-slate-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 bg-white border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-black text-gray-900">
            Your Cart <span className="font-bold text-gray-400">({totalItems} items)</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
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
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Cart items */}
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
              {cart.map((item) => {
                const lineOriginal = item.originalPrice ?? (appliedCoupon ? item.price : undefined);
                const lineDiscounted = appliedCoupon ? Math.round(item.price * (1 - COUPON_PERCENT / 100)) : item.price;

                return (
                  <div key={item.id} className="flex items-start gap-3 p-4">
                    {/* Product Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded-xl border border-gray-200 bg-white flex-shrink-0"
                    />

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                        {item.name}
                      </p>

                      {item.size && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">
                          {item.size}
                          <ChevronDown size={12} className="text-gray-400" />
                        </span>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 bg-white border border-gray-300 hover:bg-gray-100 rounded-md flex items-center justify-center transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 bg-white border border-gray-300 hover:bg-gray-100 rounded-md flex items-center justify-center transition"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-md transition ml-1"
                          aria-label="Remove item"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Price column */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      {lineOriginal && lineOriginal > lineDiscounted ? (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{lineOriginal.toLocaleString("en-IN")}
                        </span>
                      ) : null}
                      <span className="font-black text-gray-900 text-sm">
                        ₹{lineDiscounted.toLocaleString("en-IN")}
                      </span>
                      {appliedCoupon && (
                        <>
                          <span className="text-[11px] font-bold text-green-600">
                            ({COUPON_PERCENT}% OFF)
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                            <Tag size={9} /> {appliedCoupon}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-3 bg-green-50 border border-green-100 rounded-xl px-3.5 py-2.5">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-green-700">
                    <Tag size={14} /> {appliedCoupon} applied
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-700 bg-white border border-green-200 rounded-full px-2.5 py-1">
                      Saved ₹{discount.toLocaleString("en-IN")}
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
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-blue-300 transition-colors">
                    <Tag size={14} className="text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value); setCouponError(false); }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="Enter Coupon Code"
                      className="flex-1 text-sm outline-none placeholder:text-gray-400 min-w-0"
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
                    <p className="text-xs text-red-500 mt-1.5 px-1">That code isn't valid — try NEW10.</p>
                  )}
                </>
              )}

              <button className="w-full text-center text-sm font-bold text-blue-600 hover:text-blue-700 mt-3.5 flex items-center justify-center gap-1">
                View All Offers <ArrowRight size={14} />
              </button>
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
                        className="flex-shrink-0 w-32 bg-white rounded-2xl border border-gray-100 p-3"
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
            {discount > 0 && (
              <div className="relative bg-green-600 text-white text-center text-sm font-bold py-2.5 rounded-xl">
                ₹{discount.toLocaleString("en-IN")} Saved so far!
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
                {discount > 0 && (
                  <span className="text-xs text-gray-400 line-through mr-2">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                )}
                <span className="text-lg font-black text-gray-900">
                  ₹{estimatedTotal.toLocaleString("en-IN")}
                </span>
                {discount > 0 && (
                  <span className="block text-xs font-bold text-green-600">
                    ({COUPON_PERCENT}% OFF)
                  </span>
                )}
              </div>
            </div>

            {subtotal - discount < FREE_SHIPPING_THRESHOLD && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3 text-center">
                Add ₹{(FREE_SHIPPING_THRESHOLD - (subtotal - discount)).toLocaleString("en-IN")} more for free shipping
              </p>
            )}

            <button className="relative w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-[0_15px_35px_-12px_rgba(37,99,235,0.6)] text-white py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between px-5">
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