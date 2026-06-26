/**
 * CartSlide.tsx — Vyshnavi Dairy
 *
 * Slide-in cart panel. Uses `string` ids throughout so it works with
 * both simple numeric product ids (pass them as String(id)) and composite
 * line-item ids like "601__500 ml" produced by GheeStore.
 */

import React from "react";
import { X, Minus, Plus, Trash2 } from "lucide-react";

export interface CartItem {
  /** String id — numeric ids should be stringified: String(product.id) */
  id: string;
  name: string;
  price: number;
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

const CartSlide: React.FC<CartSlideProps> = ({
  cart,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
}) => {
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="absolute top-0 right-0 w-80 sm:w-96 h-full bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-blue-800">Your Cart</h2>
            {totalItems > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <span className="text-5xl mb-4">🛒</span>
            <p className="text-gray-500 font-medium">Your cart is empty</p>
            <p className="text-gray-400 text-sm mt-1">
              Add some products to get started
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition p-3"
                >
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-lg border border-gray-200 bg-white flex-shrink-0"
                  />

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
                      {item.name}
                    </p>
                    {item.size && (
                      <span className="inline-block mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600 bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5">
                        {item.size}
                      </span>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      ₹{item.price.toLocaleString("en-IN")} each
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="w-7 h-7 bg-white border border-gray-300 hover:bg-gray-100 rounded-md flex items-center justify-center transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-7 h-7 bg-white border border-gray-300 hover:bg-gray-100 rounded-md flex items-center justify-center transition"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Line total & Remove */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="font-bold text-gray-900 text-sm">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-md transition"
                      aria-label="Remove item"
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-100 bg-white">
              {/* Subtotal */}
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-sm font-semibold text-gray-700">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Shipping</span>
                <span className="text-sm font-semibold text-green-600">
                  {totalPrice >= 499 ? "Free" : "₹49"}
                </span>
              </div>
              <div className="flex justify-between items-center text-base font-bold border-t border-gray-100 pt-3 mb-4">
                <span>Total</span>
                <span>
                  ₹
                  {(
                    totalPrice + (totalPrice >= 499 ? 0 : 49)
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              {totalPrice < 499 && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-4 text-center">
                  Add ₹{(499 - totalPrice).toLocaleString("en-IN")} more for free
                  shipping
                </p>
              )}

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition text-sm tracking-wide">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartSlide;