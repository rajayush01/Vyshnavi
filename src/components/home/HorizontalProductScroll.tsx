import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Zap } from "lucide-react";
import img1 from "../../assets/buffalo-ghee1l-1.png";
import img2 from "../../assets/cow-ghee5l-1.png";
import img3 from "../../assets/buffalo-ghee5l-1.png";
import img4 from "../../assets/cow-ghee1l-1.png";

interface Product {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  oldPrice?: number;
  bestPrice?: number;
  image: string;
  tag?: string; // "New Launch" | "Best Seller"
  discount?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "A2 Gir Cow Ghee",
    subtitle: "Premium ghee, premium packaging! Golden, daanedaar...",
    price: 10913,
    oldPrice: 11250,
    bestPrice: 9090,
    image: img1,
    tag: "New Launch",
    discount: "3% Off",
  },
  {
    id: 2,
    name: "A2 Desi Cow Ghee",
    subtitle: "Fresh From Farms in Tamil Nadu | Bilona Churned",
    price: 4949,
    oldPrice: 5050,
    bestPrice: 4123,
    image: img2,
    tag: "New Launch",
    discount: "2% Off",
  },
  {
    id: 3,
    name: "A2 Gir Cow Ghee 1L Jar",
    subtitle: "Same premium Gir Cow Ghee in 1L packing.",
    price: 2400,
    bestPrice: 1999,
    image: img3,
    tag: "Best Seller",
  },
  {
    id: 4,
    name: "A2 Desi Cow Ghee 1L",
    subtitle: "Straight from Tamil Nadu, made from A2 milk.",
    price: 2025,
    bestPrice: 1687,
    image: img4,
    tag: "Best Seller",
  },
  {
    id: 5,
    name: "A2 Desi Cow Ghee 5L Dolchi",
    subtitle: "Never skip on ghee! Keep your pantry full.",
    price: 9797,
    oldPrice: 10100,
    bestPrice: 8161,
    image: img1,
    tag: "New Launch",
  },
];

const HorizontalProductScroll: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="relative px-16 py-10 bg-[#e0f2fe]">

      {/* Scroll Buttons */}
      <button
        onClick={() => scroll(-300)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-yellow-100 transition z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => scroll(300)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-yellow-100 transition z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="max-w-[250px] sm:max-w-[350px] bg-white rounded-2xl border border-gray-100 shadow hover:shadow-lg transition flex-shrink-0 flex flex-col"
          >
            {/* Image Section */}
            <div className="relative">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-52 object-cover rounded-t-2xl"
              />
              {p.tag && (
                <span
                  className={`absolute top-3 left-3 text-xs font-semibold text-white px-2 py-1 rounded ${
                    p.tag === "Best Seller" ? "bg-blue-600" : "bg-green-600"
                  }`}
                >
                  {p.tag}
                </span>
              )}
              {p.discount && (
                <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                  {p.discount}
                </span>
              )}
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <p className="text-sm text-gray-500">5L Dolchi</p>
                <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {p.subtitle}
                </p>

                <div className="mt-2">
                  <p className="text-lg font-bold text-gray-900">
                    ₹{p.price.toLocaleString()}
                    {p.oldPrice && (
                      <span className="text-gray-400 line-through ml-2 text-sm">
                        ₹{p.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </p>
                  {p.bestPrice && (
                    <p className="text-green-600 text-sm font-medium">
                      Best Price ₹{p.bestPrice.toLocaleString()} with coupon
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons Section */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-gray-100 w-full">
              <button className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded-lg py-3 sm:py-2 flex items-center justify-center gap-2 text-sm sm:text-base transition w-full">
                <ShoppingCart size={18} className="sm:w-4 sm:h-4" />
                Add to Cart
              </button>

              <button className="flex-1 border border-green-700 text-green-700 hover:bg-green-50 rounded-lg py-3 sm:py-2 flex items-center justify-center gap-2 text-sm sm:text-base font-medium transition w-full">
                <Zap size={18} className="sm:w-4 sm:h-4" />
                Buy Now
              </button>
            </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HorizontalProductScroll;
