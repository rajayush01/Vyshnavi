import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  weight: string;
  rating: number;
  reviews: number;
  images: string[];
  features: string[];
  prices: {
    size: string;
    price: number;
    originalPrice?: number;
    badge?: string;
  }[];
  delivery: string;
  badge?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Sammvaad Kadak Chai",
    weight: "2Kg",
    rating: 5,
    reviews: 17262,
    images: [
      "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop"
    ],
    features: [
      "Handcrafted using 8 best CTC",
      "Made by Master Blenders",
      "From Assam & Dooars gardens",
      "No added flavors & Colouring"
    ],
    prices: [
      { size: "250g", price: 169 },
      { size: "1kg", price: 599, badge: "Most Popular • Free Shipping" },
      { size: "2 kg", price: 999, originalPrice: 1199, badge: "Best value • Free Shipping" }
    ],
    delivery: "Delivers in 2-4 Biz Days"
  },
  {
    id: 2,
    name: "Premium Masala Chai",
    weight: "1Kg",
    rating: 4.8,
    reviews: 9845,
    images: [
      "https://images.unsplash.com/photo-1597318281699-17eeb6dd6bd4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1563822249366-7b22f98c392c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop"
    ],
    features: [
      "Rich aromatic spice blend",
      "100% Natural ingredients",
      "Strong & refreshing taste",
      "Perfect morning energizer"
    ],
    prices: [
      { size: "250g", price: 199 },
      { size: "500g", price: 349, badge: "Most Popular" },
      { size: "1 kg", price: 649, originalPrice: 799 }
    ],
    delivery: "Delivers in 2-4 Biz Days",
    badge: "Bestseller"
  },
  {
    id: 3,
    name: "Organic Green Tea",
    weight: "500g",
    rating: 4.9,
    reviews: 15432,
    images: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop"
    ],
    features: [
      "100% Organic certified",
      "Rich in antioxidants",
      "Himalayan tea leaves",
      "No pesticides or chemicals"
    ],
    prices: [
      { size: "100g", price: 149 },
      { size: "250g", price: 329, badge: "Free Shipping" },
      { size: "500g", price: 599, originalPrice: 749, badge: "Best value • Free Shipping" }
    ],
    delivery: "Delivers in 2-4 Biz Days",
    badge: "New"
  },
  {
    id: 4,
    name: "Classic Earl Grey",
    weight: "750g",
    rating: 4.7,
    reviews: 8234,
    images: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1563822249366-7b22f98c392c?w=400&h=400&fit=crop"
    ],
    features: [
      "Classic bergamot flavor",
      "Premium black tea base",
      "British style blend",
      "Perfect for afternoon tea"
    ],
    prices: [
      { size: "250g", price: 249 },
      { size: "500g", price: 449, badge: "Most Popular" },
      { size: "750g", price: 649, originalPrice: 799 }
    ],
    delivery: "Delivers in 2-4 Biz Days"
  }
];

const ProductCard = ({ product }: { product: Product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState(1);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [product.images.length]);
  
  return (
    <div className="w-full bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* Left side - Images */}
        <div className="relative">
          <div className="relative bg-gray-50 rounded-lg p-4 shadow-inner border border-gray-100">
            {product.badge && (
              <div className="absolute top-2 left-2 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                {product.badge}
              </div>
            )}
            <div className="absolute top-2 right-2 bg-slate-700 text-white text-sm font-bold px-3 py-2 rounded-md z-10">
              {product.weight}
            </div>
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            {/* Navigation arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-800 text-white p-2 rounded-full shadow-lg hover:bg-slate-700 transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % product.images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800 text-white p-2 rounded-full shadow-lg hover:bg-slate-700 transition"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail images */}
          <div className="flex gap-2 mt-4 justify-center">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                  currentImageIndex === idx ? 'border-blue-500 shadow-md' : 'border-gray-200'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right side - Details */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {product.name}
            <span className="text-lg font-normal text-gray-600"> ({product.weight})</span>
          </h2>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-blue-500 text-blue-500" />
              ))}
            </div>
            <span className="text-sm text-gray-600">{product.reviews.toLocaleString()} 5-Star Reviews</span>
          </div>

          <div className="space-y-2 mb-4">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-4">
            {product.prices.map((priceOption, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPrice(idx)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition ${
                  selectedPrice === idx
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPrice === idx ? 'border-blue-500' : 'border-gray-300'
                  }`}>
                    {selectedPrice === idx && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-800">Buy {priceOption.size}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">Rs. {priceOption.price.toFixed(2)}</div>
                  {priceOption.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      Rs. {priceOption.originalPrice.toFixed(2)}
                    </div>
                  )}
                </div>
              </button>
            ))}
            {product.prices[selectedPrice].badge && (
              <div className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded text-center border border-blue-200">
                {product.prices[selectedPrice].badge}
              </div>
            )}
          </div>

          <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition shadow-lg">
            ADD TO CART - RS. {product.prices[selectedPrice].price}
          </button>
          
          <p className="text-xs text-center text-gray-600 mt-2 italic">
            *Limited Time, No Middlemen, Just Fresh Chai.
          </p>
          
          <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded text-center mt-2">
            Cash On Delivery Available
          </div>
          
          <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
            <span className="text-blue-500">🚚</span> {product.delivery}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Product() {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const nextProduct = () => {
    setCurrentProductIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentProductIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToProduct = (index: number) => {
    setCurrentProductIndex(index);
  };

  return (
    <div className="bg-[#e0f2fe] p-8">
      <div className="max-w-7xl mx-auto ">

        <div className="relative">
          <button
            onClick={prevProduct}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-full shadow-xl transition -translate-x-6 border border-gray-200 disabled:opacity-50"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="transition-opacity duration-300">
            <ProductCard product={products[currentProductIndex]} />
          </div>

          <button
            onClick={nextProduct}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-full shadow-xl transition translate-x-6 border border-gray-200 disabled:opacity-50"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        <div className="flex justify-center gap-3 mt-8">
          {products.map((product, idx) => (
            <button
              key={idx}
              className={`transition-all duration-300 rounded-full ${
                currentProductIndex === idx 
                  ? 'w-10 h-3 bg-blue-500' 
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => goToProduct(idx)}
              aria-label={`Go to ${product.name}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}