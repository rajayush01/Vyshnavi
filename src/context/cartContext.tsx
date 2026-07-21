/**
 * CartContext.tsx — Vyshnavi Dairy
 *
 * Single source of truth for the shopping cart. Wrap the app once with
 * <CartProvider> (see App.tsx) and any component can call useCart() to
 * read the cart, add/remove/update items, and open the slide-out drawer.
 *
 * PERSISTENCE: the cart is mirrored to localStorage so it survives page
 * refreshes and new tabs. We only persist { productId, variantSize, quantity }
 * — not the full ProductItem/ProductVariant objects — and re-resolve the
 * actual product/variant from vyshnaviData.ts on load. That way if a price,
 * image, or description ever changes in vyshnaviData.ts, a returning
 * shopper's cart reflects the current data instead of a stale snapshot.
 * If a stored productId/size no longer exists (e.g. removed product), that
 * line is silently dropped instead of crashing.
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
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import CartSlide from "@/components/CartSlide";
import {
  getProductById,
  type ProductItem,
  type ProductVariant,
} from "../data/vyshnaviData";

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
  originalPrice?: number;
  image: string;
  quantity: number;
  size: string;
}

interface CartContextValue {
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

// ── Persistence helpers ──────────────────────────────────────────────────
const STORAGE_KEY = "vyshnavi_cart_v1";

// What we actually write to localStorage — deliberately minimal.
interface StoredLine {
  productId: number;
  variantSize: string;
  quantity: number;
}

function readStoredCart(): StoredLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is StoredLine =>
        l &&
        typeof l.productId === "number" &&
        typeof l.variantSize === "string" &&
        typeof l.quantity === "number"
    );
  } catch {
    // Corrupt/old data — ignore rather than crash the app
    return [];
  }
}

// Re-resolve stored { productId, variantSize } pairs against the live
// data source, dropping anything that no longer exists.
function hydrateCart(stored: StoredLine[]): CartLineItem[] {
  const result: CartLineItem[] = [];
  for (const line of stored) {
    const product = getProductById(line.productId);
    if (!product) continue;
    const variant = product.variants.find((v) => v.size === line.variantSize);
    if (!variant) continue;
    result.push({
      lineId: makeLineId(product.id, variant.size),
      product,
      variant,
      quantity: line.quantity,
    });
  }
  return result;
}

function persistCart(cart: CartLineItem[]) {
  if (typeof window === "undefined") return;
  try {
    const toStore: StoredLine[] = cart.map((li) => ({
      productId: li.product.id,
      variantSize: li.variant.size,
      quantity: li.quantity,
    }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // Storage full / disabled (e.g. private browsing) — fail silently,
    // the cart still works for the current session via React state.
  }
}

// ── Helpers ────────────────────────────────────────────────────────────
function makeLineId(productId: number, size: string): string {
  return `${productId}__${size}`;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────────────────
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Lazy init so the very first render already has whatever was saved —
  // no flash of an empty cart before a useEffect kicks in.
  const [cart, setCart] = useState<CartLineItem[]>(() => hydrateCart(readStoredCart()));
  const [showCart, setShowCart] = useState(false);
  const isFirstRender = useRef(true);

  // Keep localStorage in sync any time the cart changes.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    persistCart(cart);
  }, [cart]);

  // Keep multiple tabs/windows in sync with each other.
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setCart(hydrateCart(readStoredCart()));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

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

  // CartSlide expects { id, name, price, originalPrice?, image, quantity, size }
  const cartSlideItems: CartSlideItem[] = useMemo(
    () =>
      cart.map((li) => ({
        id: li.lineId,
        name: li.product.name,
        price: li.variant.price ?? 0,
        originalPrice: li.variant.originalPrice,
        image: li.product.image,
        quantity: li.quantity,
        size: li.variant.size,
      })),
    [cart]
  );

  const value: CartContextValue = {
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
    <CartContext.Provider value={value}>
      {children}
      {showCart && (
        <CartSlide
          cart={cartSlideItems}
          onClose={() => setShowCart(false)}
          onRemoveItem={removeItem}
          onUpdateQuantity={updateQuantity}
        />
      )}
    </CartContext.Provider>
  );
};

// ── Hook ───────────────────────────────────────────────────────────────
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return ctx;
}