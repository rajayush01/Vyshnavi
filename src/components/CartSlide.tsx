import React from "react";
import { X } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartSlideProps {
  cart: CartItem[];
  onClose: () => void;
}

const CartSlide: React.FC<CartSlideProps> = ({ cart, onClose }) => {
  const totalPrice = cart.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="absolute top-0 right-0 w-80 sm:w-96 h-full bg-white shadow-2xl p-6 flex flex-col transform transition-transform duration-300 translate-x-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-800">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            Your cart is empty 🛒
          </p>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4">
              {cart.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border-b pb-3 hover:bg-gray-50 rounded-md transition"
                >
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md border"
                  />

                  {/* Product Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>

                  {/* Total per item */}
                  <span className="font-semibold text-gray-800">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 mt-4 rounded-lg font-semibold transition">
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartSlide;