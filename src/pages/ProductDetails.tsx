import React, { useState } from "react";
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
} from "lucide-react";
import img1 from "../assets/bestseller1.png";
import img2 from "../assets/bestseller2.png";
import img3 from "../assets/bestseller3.png";

interface Variant {
  size: string;
  price: number;
  perLiter: number;
  discount: string | null;
  originalPrice?: number;
}

interface Feature {
  icon: JSX.Element;
  title: string;
  subtitle: string;
}

const A2GheeProduct: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<string>("2.5L");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const variants: Variant[] = [
    { size: "500ml jar", price: 1045, perLiter: 2090, discount: null },
    { size: "1L jar", price: 2025, perLiter: 2025, discount: null },
    {
      size: "2.5L Dolchi",
      price: 4949,
      perLiter: 1979.6,
      discount: "2% off",
    },
    {
      size: "5L Dolchi",
      price: 9797,
      perLiter: 1959.4,
      discount: "3% off",
    },
  ];

  const images: string[] = [img1, img2, img3, img1];

  const features: Feature[] = [
    {
      icon: <Truck className="w-12 h-12" />,
      title: "Free Shipping on",
      subtitle: "Orders Above ₹499",
    },
    {
      icon: <Headphones className="w-12 h-12" />,
      title: "360° Customer",
      subtitle: "Support",
    },
    {
      icon: <Package className="w-12 h-12" />,
      title: "Up to 30 Days",
      subtitle: "Return",
    },
    {
      icon: <FileCheck className="w-12 h-12" />,
      title: "70+ Quality",
      subtitle: "Checks",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 mt-16 sm:mt-20 lg:mt-28">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Sticky Product Images */}
          <div className="lg:sticky lg:top-8 h-fit space-y-3 sm:space-y-4">
            <div className="relative rounded-lg overflow-hidden aspect-square flex items-center justify-center bg-gray-50">
              <img
                src={images[selectedImage]}
                alt="A2 Desi Cow Ghee"
                className="object-contain w-full h-full p-4 sm:p-6 lg:p-8"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto px-2 sm:px-4 lg:px-8 pb-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`min-w-16 h-16 sm:min-w-20 sm:h-20 bg-gray-100 rounded border-2 cursor-pointer flex-shrink-0 ${
                    selectedImage === idx
                      ? "border-blue-700"
                      : "border-transparent hover:border-blue-700"
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Scrollable Product Details */}
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                A2 Desi Cow Ghee
              </h1>
              <button className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Product Description */}
            <p className="text-xs sm:text-xs text-gray-600 uppercase tracking-wide leading-relaxed">
              FRESH FROM FARMS IN TAMIL NADU | BILONA CHURNED | A2-VERIFIED MILK
              FROM DESI COWS | 70+ QUALITY CHECKS
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-gray-600">1188 reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 sm:gap-3">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold">₹4949</span>
              <span className="text-xl sm:text-2xl text-gray-400 line-through">₹5050</span>
            </div>
            <p className="text-xs text-gray-500">MRP (Incl. of all taxes)</p>

            {/* Best Price Badge */}
            <div className="relative inline-block text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold overflow-hidden bg-blue-700 hover:scale-105 transition-all duration-300">
              <span className="relative z-10">
                Best Price ₹4,123 with coupon
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] animate-[shine_2s_linear_infinite]" />
              <style>{`
                    @keyframes shine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                    }
                `}</style>
            </div>

            {/* Top Pick Combo */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 sm:p-4 border border-amber-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <span className="bg-blue-700 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded flex-shrink-0">
                    TOP PICK
                  </span>
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <img
                      src={img3}
                      alt="Cast Iron Pan"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold line-clamp-2">
                        The Indus Valley CASTrong Cast Iron Fry Pan
                      </p>
                      <p className="text-base sm:text-lg font-bold">₹590</p>
                    </div>
                  </div>
                </div>
                <button className="bg-white border-2 border-blue-700 text-blue-700 px-4 sm:px-6 py-2 rounded-full font-semibold hover:bg-blue-50 flex items-center justify-center gap-2 w-full sm:w-auto">
                  <ShoppingCart className="w-4 h-4"/>
                </button>
              </div>
            </div>

            {/* Variant Selection */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3">Select Variant</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {variants.map((variant: Variant) => (
                  <button
                    key={variant.size}
                    onClick={() => setSelectedVariant(variant.size)}
                    className={`p-2 rounded-lg border-2 text-left transition-all ${
                      selectedVariant === variant.size
                        ? "border-blue-700 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold mb-1 text-sm sm:text-base">
                      {variant.size}
                    </div>
                    <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold">
                        ₹{variant.price.toLocaleString()}
                      </span>
                      {variant.originalPrice && (
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                          ₹{variant.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div>
                      {variant.discount && (
                        <span className="text-xs text-red-600 font-semibold">
                          {variant.discount}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ₹{variant.perLiter}/L
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector and Action Buttons */}
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 sm:p-3 hover:bg-gray-200 rounded-l-lg"
                >
                  <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <span className="px-4 sm:px-6 font-semibold text-sm sm:text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 sm:p-3 hover:bg-gray-200 rounded-r-lg"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                <button className="flex-1 bg-blue-700 text-white py-3 px-6 rounded-full text-sm sm:text-base font-semibold hover:bg-blue-800">
                  Add to cart
                </button>
                <button className="flex-1 bg-yellow-400 text-gray-900 py-3 px-6 rounded-full text-sm sm:text-base font-semibold hover:bg-yellow-500">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Product Description Section */}
            <div className="border-t pt-4 sm:pt-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 uppercase">
                Product Description
              </h2>
              <div className="space-y-2 sm:space-y-3 text-gray-700 text-sm leading-relaxed">
                <p>
                  Made in the farms of Tamil Nadu, our A2 Desi Cow Ghee is just
                  what your kitchen needs. Our desi cows are the happiest beings
                  you'll meet. They graze freely and are never injected.
                </p>
                <p>
                  Their nutritious milk is set into cultured curd and
                  bilona-churned in small batches, the traditional way. Every
                  batch is lab-tested, so what reaches you is nothing but pure,
                  wholesome ghee. It's heart-healthy, easy to digest, and helps
                  boost your immunity.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4 sm:pt-6 pb-6 sm:pb-8">
              {features.map((feature: Feature, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center"
                >
                  <div className="text-blue-700 mb-2 sm:mb-3 [&>svg]:w-10 [&>svg]:h-10 sm:[&>svg]:w-12 sm:[&>svg]:h-12">{feature.icon}</div>
                  <h3 className="font-semibold text-xs sm:text-sm mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600">{feature.subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default A2GheeProduct;
