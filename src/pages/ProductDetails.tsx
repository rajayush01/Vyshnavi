/**
 * ProductDetails.tsx — Vyshnavi Dairy
 * (formerly A2GheeProduct.tsx — generalized to serve every category)
 *
 * Product detail page. Fully wired to vyshnaviData.ts:
 *  - Resolves the product via a route param (/details/:id), router state
 *    (navigate("/details", { state: { productId } })), or falls back to
 *    the flagship Cow Ghee (id 601) so the page always has something to show.
 *  - CATEGORY IS NOW RESOLVED FROM THE PRODUCT ITSELF, not hardcoded to
 *    "ghee" — CategoryStore now routes every category (Milk, Curd,
 *    Beverages, Paneer, Butter, Sweets, Ghee) through this same /details
 *    page, so we look up whichever category actually contains the
 *    resolved product and theme everything (accent color, tagline,
 *    cross-sell) off that.
 *  - Variant sizes, per-variant image galleries, rating/reviews, tag,
 *    description and content all come straight from the data item —
 *    nothing is hardcoded product data anymore.
 *  - IMAGE VISIBILITY IS DATA-DRIVEN: if the selected variant carries its
 *    own `images` array (true for Ghee's per-size pack photos, and for
 *    any other category whose data models per-variant shots), the
 *    thumbnail rail shows those and switches per size. If a category's
 *    variants DON'T carry `images` (e.g. Milk/Curd/Beverages where every
 *    pack size looks the same), we fall back to the product's shared
 *    `gallery`, and finally to the single `image`. This means the
 *    thumbnail row naturally appears for some categories and not others,
 *    based on what the data actually has — no hardcoded per-category
 *    if/else needed, and it stays correct as new categories/products are
 *    added to vyshnaviData.ts.
 *  - Variants in the current data set don't carry price yet, so price UI
 *    gracefully degrades to a "Price on Request" state instead of showing
 *    fabricated numbers.
 *  - Product Description is now a tabbed section (Description, Ingredients,
 *    Nutrition Info, How to Use & Store) sitting full-width below the
 *    two-column layout. Only the Description tab is backed by real data
 *    (product.content) right now — the other three are placeholder copy
 *    until vyshnaviData.ts grows matching fields.
 *  - Reviews section added at the end: summary + rating breakdown, a
 *    "write a review" form (name, star rating, text, photo upload), and
 *    a review list. Review photos open in the same full-screen lightbox
 *    used for the product gallery.
 */

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
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
  Camera,
} from "lucide-react";
import {
  getProductById,
  CATEGORIES,
  type ProductItem,
  type ProductVariant,
  type ProductCategory,
} from "../data/vyshnaviData";
import { useCart } from "../context/cartContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Feature {
  icon: JSX.Element;
  title: string;
  subtitle: string;
}

interface ProductReview {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
  photos: string[];
}

type DescTab = "description" | "ingredients" | "nutrition" | "usage";

const DEFAULT_PRODUCT_ID = 601; // Cow Ghee — flagship item, used when no id is passed in

const FALLBACK_GRADIENT: Record<string, string> = {
  milk:      "linear-gradient(135deg,#dbeafe,#eff6ff)",
  curd:      "linear-gradient(135deg,#dcfce7,#f0fdf4)",
  beverages: "linear-gradient(135deg,#f3e8ff,#faf5ff)",
  paneer:    "linear-gradient(135deg,#ffedd5,#fff7ed)",
  butter:    "linear-gradient(135deg,#fefce8,#fffef0)",
  ghee:      "linear-gradient(135deg,#fef3c7,#fffbeb)",
  sweets:    "linear-gradient(135deg,#fdf2f8,#fff5fa)",
};

const features: Feature[] = [
  { icon: <Truck className="w-8 h-8" />, title: "Free Shipping on", subtitle: "Orders Above ₹499" },
  { icon: <Headphones className="w-8 h-8" />, title: "360° Customer", subtitle: "Support" },
  { icon: <Package className="w-8 h-8" />, title: "Up to 30 Days", subtitle: "Return" },
  { icon: <FileCheck className="w-8 h-8" />, title: "70+ Quality", subtitle: "Checks" },
];

const DESC_TABS: { key: DescTab; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "ingredients", label: "Ingredients" },
  { key: "nutrition", label: "Nutrition Info" },
  { key: "usage", label: "How to Use & Store" },
];

// Seed reviews so the section shows something meaningful out of the box.
// These are placeholder / demo entries — swap for real review data whenever
// a reviews API/backend is wired up.
const SEED_REVIEWS: ProductReview[] = [
  {
    id: "r1",
    name: "Anita Sharma",
    rating: 5,
    date: "2 weeks ago",
    text: "The aroma is incredible — reminds me of what my grandmother used to make. A little goes a long way and it's clearly not adulterated.",
    photos: [
      "https://picsum.photos/seed/ghee-review-1/400/400",
      "https://picsum.photos/seed/ghee-review-2/400/400",
    ],
  },
  {
    id: "r2",
    name: "Rohit Verma",
    rating: 4,
    date: "1 month ago",
    text: "Great texture and taste. Packaging could be sturdier for shipping, but the product itself is excellent.",
    photos: ["https://picsum.photos/seed/ghee-review-3/400/400"],
  },
  {
    id: "r3",
    name: "Priya Nair",
    rating: 5,
    date: "1 month ago",
    text: "Ordered this for a family function and it made all the difference. Will be my go-to from now on.",
    photos: [],
  },
  {
    id: "r4",
    name: "Karthik Iyer",
    rating: 3,
    date: "2 months ago",
    text: "Good quality overall, though I expected a bit more at this price point. Still better than most store-bought options.",
    photos: ["https://picsum.photos/seed/ghee-review-4/400/400"],
  },
  {
    id: "r5",
    name: "Meera Joshi",
    rating: 5,
    date: "3 months ago",
    text: "Been buying this for six months now. Consistent quality every single time and my kids love it.",
    photos: [
      "https://picsum.photos/seed/ghee-review-5/400/400",
      "https://picsum.photos/seed/ghee-review-6/400/400",
      "https://picsum.photos/seed/ghee-review-7/400/400",
    ],
  },
];

const ProductDetails: React.FC = () => {
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

  // ── Resolve category from the product itself ────────────────────────
  // CategoryStore now sends every category (Milk, Curd, Beverages, Paneer,
  // Butter, Sweets, Ghee) through this same /details page — so instead of
  // assuming "ghee", find whichever category actually contains this
  // product. Falls back to the first category only if something is
  // badly out of sync with the data.
  const category: ProductCategory =
    CATEGORIES.find((c) => c.items.some((it) => it.id === product.id)) ?? CATEGORIES[0];
  const accent = category.accentHex;
  const fallbackGradient = FALLBACK_GRADIENT[category.key] ?? "linear-gradient(135deg,#f3f4f6,#fafafa)";

  const [selectedVariantSize, setSelectedVariantSize] = useState<string>(
    product.variants[0]?.size ?? ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  // Generalized lightbox — can display the product gallery OR a review's
  // photos, whichever was clicked. `lightboxImages` holds whichever array
  // is currently active; `lightboxIndex` is the position within it.
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Which tab is active in the Product Description section
  const [activeDescTab, setActiveDescTab] = useState<DescTab>("description");

  const openLightbox = (imgs: string[], index: number) => {
    if (imgs.length === 0) return;
    setLightboxImages(imgs);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Reset variant + image selection whenever the product itself changes
  useEffect(() => {
    setSelectedVariantSize(product.variants[0]?.size ?? "");
    setSelectedImage(0);
    setQuantity(1);
    setActiveDescTab("description");
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedVariant: ProductVariant =
    product.variants.find((v) => v.size === selectedVariantSize) ?? product.variants[0];

  // Reset image index whenever the variant's own gallery changes
  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariantSize]);

  // ── Data-driven image resolution ─────────────────────────────────────
  // 1. If THIS variant carries its own images (per-size pack photos —
  //    common for Ghee, and for any other category whose data models
  //    per-variant shots), use those. Switching size updates the gallery.
  // 2. Otherwise fall back to the product's shared gallery (several shots
  //    of the same pack — common for Milk/Curd/Beverages/Paneer/Butter/
  //    Sweets where every size looks identical).
  // 3. Otherwise fall back to the single product image.
  // The thumbnail rail below only renders when there's more than one
  // image, so it naturally disappears for single-image products/categories
  // without any hardcoded category check.
  const images: string[] =
    selectedVariant?.images && selectedVariant.images.length > 0
      ? selectedVariant.images
      : product.gallery && product.gallery.length > 0
      ? product.gallery
      : product.image
      ? [product.image]
      : [];

  // Whether this product's images are per-variant (true) or shared across
  // all sizes (false) — used only to decide if picking a different size
  // should also reset which thumbnail is active.
  const hasPerVariantImages = !!(selectedVariant?.images && selectedVariant.images.length > 0);

  // Lightbox: Escape to close, arrow keys to browse, lock body scroll while open
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") setLightboxIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => Math.min(lightboxImages.length - 1, i + 1));
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen, lightboxImages.length]);

  const hasPrice = !!selectedVariant?.price;

  // Cross-sell: another item from the SAME resolved category, data-driven
  const crossSell = category.items.find((p) => p.id !== product.id);

  // ── Reviews state ────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<ProductReview[]>(SEED_REVIEWS);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewPhotoFiles, setReviewPhotoFiles] = useState<{ file: File; url: string }[]>([]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const ratingBreakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // index 0 = 1★ ... index 4 = 5★
    reviews.forEach((r) => {
      counts[r.rating - 1] += 1;
    });
    return counts;
  }, [reviews]);

  const handleReviewPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const withUrls = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setReviewPhotoFiles((prev) => [...prev, ...withUrls]);
    e.target.value = "";
  };

  const removeReviewPhoto = (url: string) => {
    setReviewPhotoFiles((prev) => prev.filter((p) => p.url !== url));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;

    const newReview: ProductReview = {
      id: `r-${Date.now()}`,
      name: reviewName.trim(),
      rating: reviewRating,
      date: "Just now",
      text: reviewText.trim(),
      photos: reviewPhotoFiles.map((p) => p.url),
    };

    setReviews((prev) => [newReview, ...prev]);
    setReviewName("");
    setReviewText("");
    setReviewRating(5);
    setReviewPhotoFiles([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-white" style={{ backgroundImage: `linear-gradient(to bottom, ${accent}0d, #ffffff, #ffffff)` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 mt-16 sm:mt-20 lg:mt-28">
        {/* Eyebrow / breadcrumb */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:shadow-md"
            style={{ ["--hover-color" as any]: accent }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${accent}66`;
              (e.currentTarget as HTMLElement).style.backgroundColor = `${accent}0d`;
              (e.currentTarget as HTMLElement).style.color = accent;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "";
              (e.currentTarget as HTMLElement).style.backgroundColor = "";
              (e.currentTarget as HTMLElement).style.color = "";
            }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back
          </button>

          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest"
              style={{ backgroundColor: `${accent}14`, borderColor: `${accent}33`, color: accent, borderWidth: 1 }}
            >
              <Sparkles className="w-3 h-3" />
              {category.tagline}
            </span>

            <span className="text-slate-300">/</span>

            <span className="text-xs font-medium text-slate-400">
              {category.name}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Sticky Product Images */}
          <div className="lg:sticky lg:top-8 h-fit space-y-4">
            <div
              className="relative rounded-[28px] overflow-hidden aspect-square flex items-center justify-center border shadow-[0_30px_70px_-30px_rgba(15,23,42,0.25)]"
              style={{ background: fallbackGradient, borderColor: `${accent}22` }}
            >
              <div
                className="absolute w-2/3 h-2/3 rounded-full blur-3xl"
                style={{ background: `${accent}22` }}
              />
              {images.length > 0 ? (
                <button
                  type="button"
                  onClick={() => openLightbox(images, selectedImage)}
                  className="group relative w-full h-full cursor-zoom-in"
                  aria-label="View full-screen image"
                >
                  <img
                    src={images[Math.min(selectedImage, images.length - 1)]}
                    alt={product.name}
                    className="relative object-contain w-full h-full p-8 sm:p-10 lg:p-12 drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                    style={{ borderColor: `${accent}33`, color: accent }}
                  >
                    <Expand className="w-4 h-4" />
                  </span>
                </button>
              ) : (
                <div
                  className="relative w-56 h-56 rounded-3xl flex items-center justify-center font-semibold text-sm"
                  style={{ background: fallbackGradient, color: accent }}
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

            {/* Thumbnail rail — only renders when there's more than one
                image to show. Appears for categories/products whose data
                has per-variant images or a multi-shot gallery; stays
                hidden for single-image products, with no category
                special-casing required. */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto px-1 pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`min-w-16 h-16 sm:min-w-20 sm:h-20 rounded-xl border-2 flex-shrink-0 overflow-hidden transition-all duration-200`}
                    style={{
                      backgroundColor: `${accent}0d`,
                      borderColor: selectedImage === idx ? accent : "transparent",
                      boxShadow: selectedImage === idx ? `0 8px 20px -10px ${accent}80` : "none",
                    }}
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
              <button className="p-2.5 hover:bg-gray-50 rounded-full flex-shrink-0 border border-transparent hover:border-gray-100 transition-colors">
                <Share2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Product tagline */}
            <p className="text-xs font-bold uppercase tracking-widest leading-relaxed" style={{ color: `${accent}cc` }}>
              {product.description}
            </p>

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
                  <div
                    className="relative inline-block text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold overflow-hidden shadow-[0_10px_25px_-8px_rgba(0,0,0,0.35)]"
                    style={{ background: `linear-gradient(90deg, ${accent}, ${accent}cc)` }}
                  >
                    <span className="relative z-10">{selectedVariant.discount} on this size</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shine_2s_linear_infinite]" />
                  </div>
                )}
              </>
            ) : (
              <div
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold"
                style={{ backgroundColor: `${accent}0d`, borderColor: `${accent}33`, color: accent }}
              >
                <Sparkles className="w-4 h-4" />
                Price on request — our team will confirm availability for this size
              </div>
            )}

            {/* Variant Selection */}
            {product.variants.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 tracking-tight">Select Size</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {product.variants.map((variant) => {
                    const isActive = selectedVariantSize === variant.size;
                    return (
                      <button
                        key={variant.size}
                        onClick={() => setSelectedVariantSize(variant.size)}
                        className="p-3 rounded-2xl border-2 text-left transition-all duration-200 bg-white"
                        style={{
                          borderColor: isActive ? accent : "#f1f5f9",
                          backgroundColor: isActive ? `${accent}0d` : "#ffffff",
                          boxShadow: isActive ? `0 10px 25px -12px ${accent}80` : "none",
                        }}
                      >
                        <div className="font-bold text-sm text-gray-900">{variant.size}</div>
                        {variant.price ? (
                          <div className="flex items-baseline gap-1.5 flex-wrap mt-1">
                            <span className="text-3xl font-bold text-gray-900">
                              ₹{variant.price.toLocaleString("en-IN")}
                            </span>
                            {variant.originalPrice && (
                              <span className="text-[10px] text-gray-400 line-through">
                                ₹{variant.originalPrice.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="text-[10px] font-semibold mt-1" style={{ color: accent }}>Ask price</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector and Action Buttons */}
            <div className="flex flex-row items-center gap-4">
              <div className="flex items-center rounded-2xl border" style={{ backgroundColor: `${accent}0d`, borderColor: `${accent}22` }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 rounded-l-2xl transition-colors hover:opacity-80"
                >
                  <Minus className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accent }} />
                </button>
                <span className="px-5 sm:px-6 font-bold text-sm sm:text-base text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 rounded-r-2xl transition-colors hover:opacity-80"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accent }} />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={() => addToCart(product, selectedVariant, quantity)}
                  disabled={!selectedVariant}
                  className="flex-1 flex items-center justify-center gap-2 text-white py-3.5 px-6 rounded-full text-sm sm:text-base font-bold shadow-[0_15px_35px_-12px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
                  style={{ background: `linear-gradient(90deg, ${accent}, ${accent}dd)` }}
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

            {/* Cross-sell suggestion, sourced from the same resolved category */}
            {crossSell && (
              <div className="rounded-2xl p-4 border" style={{ background: `linear-gradient(90deg, ${accent}0d, ${accent}08)`, borderColor: `${accent}22` }}>
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
                          className="w-11 h-11 rounded-xl object-cover flex-shrink-0 bg-white border"
                          style={{ borderColor: `${accent}22` }}
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl flex-shrink-0" style={{ backgroundColor: `${accent}22` }} />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{crossSell.name}</p>
                        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: accent }}>{crossSell.description}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/details", { state: { productId: crossSell.id } })}
                    className="flex items-center gap-1.5 bg-white border px-4 py-2 rounded-full font-bold text-xs hover:opacity-80 transition-colors flex-shrink-0"
                    style={{ borderColor: `${accent}66`, color: accent }}
                  >
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Features Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4 sm:pt-6 pb-2">
              {features.map((feature, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div
                    className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${accent}0d`, borderColor: `${accent}22`, color: accent }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm mb-0.5 text-gray-900">{feature.title}</h3>
                  <p className="text-xs text-gray-500">{feature.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Description — full width, tabbed, below the two-column layout */}
        <div className="border-t pt-8 mt-8" style={{ borderColor: `${accent}22` }}>
          {/* Tab bar */}
          <div className="flex gap-1 sm:gap-2 mb-6 overflow-x-auto border-b" style={{ borderColor: `${accent}22` }}>
            {DESC_TABS.map((tab) => {
              const isActive = activeDescTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveDescTab(tab.key)}
                  className="relative px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors"
                  style={{ color: isActive ? accent : "#9ca3af" }}
                >
                  {tab.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: `linear-gradient(90deg, ${accent}, ${accent}cc)` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="max-w-3xl">
            {activeDescTab === "description" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-black mb-4 tracking-tight text-gray-900">
                  Product Description
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {product.content}
                </p>
              </div>
            )}

            {activeDescTab === "ingredients" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-black mb-4 tracking-tight text-gray-900">
                  Ingredients
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                  100% pure, farm-sourced {product.name}. No additives, preservatives, or
                  artificial colors — made the traditional way.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5">
                  <li>Fresh cow/buffalo milk (as applicable)</li>
                  <li>No hydrogenated fats or vanaspati</li>
                  <li>No added preservatives</li>
                </ul>
              </div>
            )}

            {activeDescTab === "nutrition" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-black mb-4 tracking-tight text-gray-900">
                  Nutrition Info
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5">
                  Approximate values per 100g serving. Actual values may vary slightly by batch.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Energy", value: "898 kcal" },
                    { label: "Total Fat", value: "99.8 g" },
                    { label: "Saturated Fat", value: "62 g" },
                    { label: "Cholesterol", value: "256 mg" },
                  ].map((n) => (
                    <div
                      key={n.label}
                      className="p-3.5 rounded-xl border text-center"
                      style={{ backgroundColor: `${accent}0d`, borderColor: `${accent}22` }}
                    >
                      <div className="text-sm font-black text-gray-900">{n.value}</div>
                      <div className="text-[11px] font-semibold uppercase tracking-wide mt-1" style={{ color: accent }}>
                        {n.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeDescTab === "usage" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-black mb-4 tracking-tight text-gray-900">
                  How to Use &amp; Store
                </h2>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 leading-relaxed">
                  <li>Use as part of your everyday cooking, or serve as suggested on the pack.</li>
                  <li>Store as indicated on the packaging, away from direct sunlight.</li>
                  <li>Always use a clean, dry utensil to scoop — moisture can affect shelf life.</li>
                  <li>Check the pack for any product-specific storage notes.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Reviews — full width, at the very end of the page */}
        <div className="border-t pt-8 mt-8" style={{ borderColor: `${accent}22` }}>
          <h2 className="text-xl sm:text-2xl font-black mb-6 tracking-tight text-gray-900">
            Customer Reviews
          </h2>

          {/* Summary */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 mb-8 pb-8 border-b" style={{ borderColor: `${accent}22` }}>
            <div className="flex flex-col items-center sm:items-start flex-shrink-0">
              <span className="text-5xl font-black text-gray-900">{averageRating.toFixed(1)}</span>
              <div className="flex my-1.5" style={{ color: accent }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                    strokeWidth={i < Math.round(averageRating) ? 0 : 1.5}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">{reviews.length} reviews</span>
            </div>

            <div className="flex-1 max-w-sm space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingBreakdown[star - 1];
                const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2.5 text-xs">
                    <span className="w-3 text-gray-500 font-medium">{star}</span>
                    <Star className="w-3 h-3 flex-shrink-0" style={{ color: accent }} fill="currentColor" strokeWidth={0} />
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${accent}14` }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: accent }} />
                    </div>
                    <span className="w-6 text-right text-gray-400">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Write a review */}
          <form
            onSubmit={handleSubmitReview}
            className="mb-10 p-5 sm:p-6 rounded-2xl border"
            style={{ backgroundColor: `${accent}08`, borderColor: `${accent}22` }}
          >
            <h3 className="text-base font-bold text-gray-900 mb-4">Write a Review</h3>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    onMouseEnter={() => setReviewHoverRating(star)}
                    onMouseLeave={() => setReviewHoverRating(0)}
                    className="p-0.5"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className="w-6 h-6 transition-transform hover:scale-110"
                      style={{ color: accent }}
                      fill={star <= (reviewHoverRating || reviewRating) ? "currentColor" : "none"}
                      strokeWidth={star <= (reviewHoverRating || reviewRating) ? 0 : 1.5}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name</label>
              <input
                type="text"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="Your name"
                className="w-full sm:max-w-sm px-3.5 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: `${accent}22`, ["--tw-ring-color" as any]: `${accent}55` }}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm resize-none focus:outline-none focus:ring-2"
                style={{ borderColor: `${accent}22`, ["--tw-ring-color" as any]: `${accent}55` }}
                required
              />
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Add Photos</label>
              <div className="flex flex-wrap gap-2.5">
                {reviewPhotoFiles.map((p) => (
                  <div
                    key={p.url}
                    className="relative w-16 h-16 rounded-xl overflow-hidden border group"
                    style={{ borderColor: `${accent}22` }}
                  >
                    <img src={p.url} alt="Upload preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeReviewPhoto(p.url)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      aria-label="Remove photo"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
                <label
                  className="w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors"
                  style={{ borderColor: `${accent}44` }}
                >
                  <Camera className="w-5 h-5" style={{ color: accent }} />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleReviewPhotoSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_10px_25px_-10px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-all duration-200"
              style={{ background: `linear-gradient(90deg, ${accent}, ${accent}dd)` }}
            >
              Post Review
            </button>
          </form>

          {/* Review list */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="pb-6 border-b last:border-b-0" style={{ borderColor: `${accent}14` }}>
                <div className="flex items-start gap-3 mb-2.5">
                  <div
                    className="w-10 h-10 rounded-full font-bold flex items-center justify-center flex-shrink-0 text-sm"
                    style={{ backgroundColor: `${accent}22`, color: accent }}
                  >
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{review.name}</span>
                      <span className="text-xs text-gray-400">· {review.date}</span>
                    </div>
                    <div className="flex mt-1" style={{ color: accent }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5"
                          fill={i < review.rating ? "currentColor" : "none"}
                          strokeWidth={i < review.rating ? 0 : 1.5}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.text}</p>

                {review.photos.length > 0 && (
                  <div className="flex flex-wrap gap-2.5">
                    {review.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => openLightbox(review.photos, idx)}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-colors"
                        style={{ borderColor: `${accent}22` }}
                      >
                        <img
                          src={photo}
                          alt={`${review.name} review photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-screen image lightbox — shared by the product gallery and review photos */}
      {isLightboxOpen && lightboxImages.length > 0 && (
        <div
          className="fixed inset-0 z-[70] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-10 animate-[lightboxFadeIn_0.25s_ease-out]"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center animate-[lightboxZoomIn_0.3s_cubic-bezier(0.25,0.46,0.45,0.94)]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={lightboxIndex}
              src={lightboxImages[Math.min(lightboxIndex, lightboxImages.length - 1)]}
              alt="Full screen view"
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

            {/* Prev / Next, only when there's more than one shot */}
            {lightboxImages.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex((i) => Math.max(0, i - 1))}
                  disabled={lightboxIndex === 0}
                  className="absolute left-1 sm:-left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setLightboxIndex((i) => Math.min(lightboxImages.length - 1, i + 1))}
                  disabled={lightboxIndex === lightboxImages.length - 1}
                  className="absolute right-1 sm:-right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>

                {/* Thumbnail dots */}
                <div className="absolute -bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {lightboxImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: idx === lightboxIndex ? 24 : 6,
                        backgroundColor: idx === lightboxIndex ? accent : "rgba(255,255,255,0.35)",
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

export default ProductDetails;