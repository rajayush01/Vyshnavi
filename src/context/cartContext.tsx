/**
 * cartContext.tsx — Vyshnavi Dairy
 *
 * Single source of truth for the shopping cart. Wrap the app once with
 * <CartProvider> (see App.tsx) and any component can call useCart() to
 * read the cart, add/remove/update items, and open the slide-out drawer.
 *
 * The <CartSlide> drawer itself is rendered once, here, so it's always
 * available app-wide — pages no longer need to import or mount it
 * individually.
 */

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import CartSlide from "@/components/CartSlide";
import type { ProductItem, ProductVariant } from "../data/vyshnaviData";

// ── Types ──────────────────────────────────────────────────────────────
export interface CartLineItem {
  /** Unique per product + size combination */
  lineId: string;
  product: ProductItem;
  variant: ProductVariant;
  quantity: number;
}

interface CartSlideItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
}

interface cartContextValue {
  cart: CartLineItem[];
  cartCount: number;
  cartTotal: number;
  showCart: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: ProductItem, variant: ProductVariant, quantity?: number) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────
function makeLineId(productId: number, size: string): string {
  return `${productId}__${size}`;
}

const cartContext = createContext<cartContextValue | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────────────────
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartLineItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (product: ProductItem, variant: ProductVariant, quantity: number = 1) => {
    if (!variant) return;
    const lineId = makeLineId(product.id, variant.size);

    setCart((prev) => {
      const existing = prev.find((li) => li.lineId === lineId);
      if (existing) {
        return prev.map((li) =>
          li.lineId === lineId ? { ...li, quantity: li.quantity + quantity } : li
        );
      }
      return [...prev, { lineId, product, variant, quantity }];
    });

    // Open the drawer so adding an item feels immediate and confirms it worked
    setShowCart(true);
  };

  const removeItem = (lineId: string) =>
    setCart((prev) => prev.filter((li) => li.lineId !== lineId));

  const updateQuantity = (lineId: string, quantity: number) =>
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((li) => li.lineId !== lineId)
        : prev.map((li) => (li.lineId === lineId ? { ...li, quantity } : li))
    );

  const clearCart = () => setCart([]);

  const cartCount = useMemo(
    () => cart.reduce((sum, li) => sum + li.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, li) => sum + (li.variant.price ?? 0) * li.quantity, 0),
    [cart]
  );

  // CartSlide expects { id, name, price, image, quantity }
  const cartSlideItems: CartSlideItem[] = useMemo(
    () =>
      cart.map((li) => ({
        id: li.lineId,
        name: `${li.product.name} — ${li.variant.size}`,
        price: li.variant.price ?? 0,
        image: li.product.image,
        quantity: li.quantity,
        size: li.variant.size,
      })),
    [cart]
  );

  const value: cartContextValue = {
    cart,
    cartCount,
    cartTotal,
    showCart,
    toggleCart: () => setShowCart((s) => !s),
    openCart: () => setShowCart(true),
    closeCart: () => setShowCart(false),
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <cartContext.Provider value={value}>
      {children}
      {showCart && (
        <CartSlide
          cart={cartSlideItems}
          onClose={() => setShowCart(false)}
          onRemoveItem={removeItem}
          onUpdateQuantity={updateQuantity}
        />
      )}
    </cartContext.Provider>
  );
};

// ── Hook ───────────────────────────────────────────────────────────────
export function useCart(): cartContextValue {
  const ctx = useContext(cartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return ctx;
}