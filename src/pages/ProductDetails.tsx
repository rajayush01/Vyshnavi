/**
 * A2GheeProduct.tsx — Vyshnavi Dairy
 *
 * Product detail page. Fully wired to vyshnaviData.ts:
 *  - Resolves the product via a route param (/details/:id), router state
 *    (navigate("/details", { state: { productId } })), or falls back to
 *    the flagship Cow Ghee (id 601) so the page always has something to show.
 *  - Variant sizes, per-variant image galleries, rating/reviews, tag,
 *    description and content all come straight from the data item —
 *    nothing is hardcoded product data anymore.
 *  - Variants in the current data set don't carry price yet, so price UI
 *    gracefully degrades to a "Price on Request" state instead of showing
 *    fabricated numbers.
 */

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Share2,
  Star,
  Minus,
  Plus,
  Truck,
  Headphones,
  Package,
  FileCheck,
  ShoppingCart,
  Zap,
  Sparkles,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Expand,
} from "lucide-react";
import {
  getProductById,
  getCategoryByKey,
  type ProductItem,
  type ProductVariant,
} from "../data/vyshnaviData";
import { useCart } from "../context/CartContext";

interface Feature {
  icon: JSX.Element;
  title: string;
  subtitle: string;
}

const DEFAULT_PRODUCT_ID = 601; // Cow Ghee — flagship item, used when no id is passed in

const FALLBACK_GRADIENT = "linear-gradient(135deg,#fef3c7,#fffbeb)";

const features: Feature[] = [
  { icon: <Truck className="w-8 h-8" />, title: "Free Shipping on", subtitle: "Orders Above ₹499" },
  { icon: <Headphones className="w-8 h-8" />, title: "360° Customer", subtitle: "Support" },
  { icon: <Package className="w-8 h-8" />, title: "Up to 30 Days", subtitle: "Return" },
  { icon: <FileCheck className="w-8 h-8" />, title: "70+ Quality", subtitle: "Checks" },
];

const A2GheeProduct: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const location = useLocation();
  const { addToCart } = useCart();

  // ── Resolve which product to show ──────────────────────────────────────
  const resolvedId = useMemo(() => {
    const fromParams = params.id ? Number(params.id) : undefined;
    const fromState = (location.state as { productId?: number } | null)?.productId;
    return fromParams ?? fromState ?? DEFAULT_PRODUCT_ID;
  }, [params.id, location.state]);

  const product: ProductItem =
    getProductById(resolvedId) ?? getProductById(DEFAULT_PRODUCT_ID)!;

  const category = getCategoryByKey("ghee");
  const accent = category?.accentHex ?? "#b45309";

  const [selectedVariantSize, setSelectedVariantSize] = useState<string>(
    product.variants[0]?.size ?? ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Reset variant + image selection whenever the product itself changes
  useEffect(() => {
    setSelectedVariantSize(product.variants[0]?.size ?? "");
    setSelectedImage(0);
    setQuantity(1);
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedVariant: ProductVariant =
    product.variants.find((v) => v.size === selectedVariantSize) ?? product.variants[0];

  // Reset image index whenever the variant's own gallery changes
  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariantSize]);

  const images: string[] =
    selectedVariant?.images && selectedVariant.images.length > 0
      ? selectedVariant.images
      : product.image
      ? [product.image]
      : [];

  // Lightbox: Escape to close, arrow keys to browse, lock body scroll while open
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") setSelectedImage((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setSelectedImage((i) => Math.min(images.length - 1, i + 1));
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen, images.length]);

  const hasPrice = !!selectedVariant?.price;

  // Cross-sell: another item from the same category, data-driven
  const crossSell = category?.items.find((p) => p.id !== product.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 mt-16 sm:mt-20 lg:mt-28">
        {/* Eyebrow / breadcrumb */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-[11px] font-bold uppercase tracking-widest text-amber-700">
            <Sparkles className="w-3 h-3" />
            {category?.tagline ?? "Liquid Gold"}
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-medium text-slate-400">{category?.name ?? "Ghee"}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Sticky Product Images */}
          <div className="lg:sticky lg:top-8 h-fit space-y-4">
            <div className="relative rounded-[28px] overflow-hidden aspect-square flex items-center justify-center bg-gradient-to-br from-amber-50 to-white border border-amber-100 shadow-[0_30px_70px_-30px_rgba(180,83,9,0.35)]">
              <div className="absolute w-2/3 h-2/3 rounded-full bg-gradient-to-br from-amber-100/70 to-transparent blur-3xl" />
              {images.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="group relative w-full h-full cursor-zoom-in"
                  aria-label="View full-screen image"
                >
                  <img
                    src={images[Math.min(selectedImage, images.length - 1)]}
                    alt={product.name}
                    className="relative object-contain w-full h-full p-8 sm:p-10 lg:p-12 drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-amber-100 flex items-center justify-center text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                    <Expand className="w-4 h-4" />
                  </span>
                </button>
              ) : (
                <div
                  className="relative w-56 h-56 rounded-3xl flex items-center justify-center text-amber-700/60 font-semibold text-sm"
                  style={{ background: FALLBACK_GRADIENT }}
                >
                  {product.name}
                </div>
              )}

              {product.tag && (
                <span
                  className="absolute top-5 left-5 text-[10px] font-bold uppercase tracking-widest text-white px-3 py-1.5 rounded-full shadow-lg"
                  style={{ backgroundColor: product.tag === "Best Seller" ? "#2563eb" : "#16a34a" }}
                >
                  {product.tag}
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto px-1 pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`min-w-16 h-16 sm:min-w-20 sm:h-20 bg-amber-50/50 rounded-xl border-2 flex-shrink-0 overflow-hidden transition-all duration-200 ${
                      selectedImage === idx
                        ? "border-amber-500 shadow-[0_8px_20px_-10px_rgba(180,83,9,0.5)]"
                        : "border-transparent hover:border-amber-200"
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Scrollable Product Details */}
          <div className="space-y-5 sm:space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                {product.name}
              </h1>
              <button className="p-2.5 hover:bg-amber-50 rounded-full flex-shrink-0 border border-transparent hover:border-amber-100 transition-colors">
                <Share2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Product tagline */}
            <p className="text-xs text-amber-700/80 font-bold uppercase tracking-widest leading-relaxed">
              {product.description}
            </p>

            {/* Rating */}
            {/* {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  {product.rating} · {product.reviews ?? 0} reviews
                </span>
              </div>
            )} */}

            {/* Price */}
            {hasPrice ? (
              <>
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                    ₹{selectedVariant.price!.toLocaleString("en-IN")}
                  </span>
                  {selectedVariant.originalPrice && (
                    <span className="text-xl sm:text-2xl text-gray-400 line-through">
                      ₹{selectedVariant.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">MRP (Incl. of all taxes)</p>

                {selectedVariant.discount && (
                  <div className="relative inline-block text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 shadow-[0_10px_25px_-8px_rgba(217,119,6,0.5)]">
                    <span className="relative z-10">{selectedVariant.discount} on this size</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shine_2s_linear_infinite]" />
                  </div>
                )}
              </>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                Price on request — our team will confirm availability for this size
              </div>
            )}

            {/* Variant Selection */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 tracking-tight">Select Size</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {product.variants.map((variant) => {
                  const isActive = selectedVariantSize === variant.size;
                  return (
                    <button
                      key={variant.size}
                      onClick={() => setSelectedVariantSize(variant.size)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all duration-200 ${
                        isActive
                          ? "border-amber-500 bg-amber-50 shadow-[0_10px_25px_-12px_rgba(217,119,6,0.5)]"
                          : "border-gray-100 hover:border-amber-200 bg-white"
                      }`}
                    >
                      <div className="font-bold text-sm text-gray-900">{variant.size}</div>
                      {variant.packType && (
                        <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{variant.packType}</div>
                      )}
                      {variant.price ? (
                        <div className="flex items-baseline gap-1.5 flex-wrap mt-1">
                          <span className="text-xs font-bold text-gray-900">
                            ₹{variant.price.toLocaleString("en-IN")}
                          </span>
                          {variant.originalPrice && (
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹{variant.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="text-[10px] text-amber-600 font-semibold mt-1">Ask price</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector and Action Buttons */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center bg-amber-50 rounded-2xl border border-amber-100">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-amber-100 rounded-l-2xl transition-colors"
                >
                  <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
                </button>
                <span className="px-5 sm:px-6 font-bold text-sm sm:text-base text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-amber-100 rounded-r-2xl transition-colors"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={() => addToCart(product, selectedVariant, quantity)}
                  disabled={!selectedVariant}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3.5 px-6 rounded-full text-sm sm:text-base font-bold shadow-[0_15px_35px_-12px_rgba(217,119,6,0.55)] hover:shadow-[0_20px_45px_-10px_rgba(217,119,6,0.7)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => addToCart(product, selectedVariant, quantity)}
                  disabled={!selectedVariant}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 px-6 rounded-full text-sm sm:text-base font-bold shadow-[0_15px_35px_-12px_rgba(37,99,235,0.5)] hover:shadow-[0_20px_45px_-10px_rgba(37,99,235,0.65)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Zap className="w-4 h-4" />
                  Buy Now
                </button>
              </div>
            </div>

            {/* Cross-sell suggestion, sourced from the same category */}
            {crossSell && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 uppercase tracking-wide">
                      Pairs Well
                    </span>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {crossSell.image ? (
                        <img
                          src={crossSell.image}
                          alt={crossSell.name}
                          className="w-11 h-11 rounded-xl object-cover flex-shrink-0 bg-white border border-amber-100"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-amber-100 flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{crossSell.name}</p>
                        <p className="text-[11px] text-amber-700 font-semibold uppercase tracking-wide">{crossSell.description}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/details", { state: { productId: crossSell.id } })}
                    className="flex items-center gap-1.5 bg-white border border-amber-300 text-amber-700 px-4 py-2 rounded-full font-bold text-xs hover:bg-amber-50 transition-colors flex-shrink-0"
                  >
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Product Description Section */}
            <div className="border-t border-amber-100 pt-5 sm:pt-6">
              <h2 className="text-lg sm:text-xl font-black mb-3 sm:mb-4 tracking-tight text-gray-900">
                Product Description
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">{product.content}</p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4 sm:pt-6 pb-6 sm:pb-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm mb-0.5 text-gray-900">{feature.title}</h3>
                  <p className="text-xs text-gray-500">{feature.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen image lightbox */}
      {isLightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-[70] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-10 animate-[lightboxFadeIn_0.25s_ease-out]"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center animate-[lightboxZoomIn_0.3s_cubic-bezier(0.25,0.46,0.45,0.94)]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={selectedImage}
              src={images[Math.min(selectedImage, images.length - 1)]}
              alt={product.name}
              className="max-w-full max-h-full object-contain drop-shadow-2xl animate-[lightboxImageFade_0.35s_ease-out]"
            />

            {/* Close */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-2 right-2 sm:-top-2 sm:-right-2 w-11 h-11 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors shadow-lg"
              aria-label="Close full-screen image"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Prev / Next, only when the variant has more than one shot */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((i) => Math.max(0, i - 1))}
                  disabled={selectedImage === 0}
                  className="absolute left-1 sm:-left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setSelectedImage((i) => Math.min(images.length - 1, i + 1))}
                  disabled={selectedImage === images.length - 1}
                  className="absolute right-1 sm:-right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>

                {/* Thumbnail dots */}
                <div className="absolute -bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: idx === selectedImage ? 24 : 6,
                        backgroundColor: idx === selectedImage ? "#f59e0b" : "rgba(255,255,255,0.35)",
                      }}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes lightboxFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lightboxZoomIn {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes lightboxImageFade {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default A2GheeProduct;