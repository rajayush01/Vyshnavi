import CartSlide from "@/components/CartSlide";
import Header from "@/components/layout/Header";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/buffalo-ghee1l-1.png";
import img2 from "../assets/buffalo-ghee1l-2.png";
import img3 from "../assets/buffalo-ghee5l-1.png";
import img4 from "../assets/buffalo-ghee5l-2.png";
import img5 from "../assets/cow-ghee1l-1.png";
import img6 from "../assets/cow-ghee1l-2.png";
import img7 from "../assets/cow-ghee5l-1.png";
import img8 from "../assets/cow-ghee5l-2.png";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  hoverImage: string;
  rating: number;
  reviews: number;
  size: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { 
    id: 1, 
    name: "Gir Cow A2 ghee - Made From Curd (500 ML)", 
    price: 1265, 
    image: img1,
    hoverImage: img2,
    rating: 4.91,
    reviews: 5,
    size: "500 ML"
  },
  { 
    id: 2, 
    name: "Gir Cow A2 ghee - Made From Curd (1 Ltr)", 
    price: 2230, 
    image: img5,
    hoverImage: img6,
    rating: 4.91,
    reviews: 5,
    size: "1 Ltr"
  },
  { 
    id: 3, 
    name: "Gir Cow A2 ghee - Made From Curd (2 Ltr - Steel Dolchi)", 
    price: 4780, 
    image: img3,
    hoverImage: img4,
    rating: 4.91,
    reviews: 5,
    size: "2 Ltr (Steel Dolchi)"
  },
  { 
    id: 4, 
    name: "Gir Cow A2 ghee - Made From Curd (500 ML)", 
    price: 1265, 
    image: img7,
    hoverImage: img8,
    rating: 4.91,
    reviews: 5,
    size: "500 ML"
  },
  { 
    id: 5, 
    name: "Gir Cow A2 ghee - Made From Curd (1 Ltr)", 
    price: 2230, 
    image: img1,
    hoverImage: img2,
    rating: 4.91,
    reviews: 5,
    size: "1 Ltr"
  },
  { 
    id: 6, 
    name: "Gir Cow A2 ghee - Made From Curd (2 Ltr - Steel Dolchi)", 
    price: 4780, 
    image: img5,
    hoverImage: img6,
    rating: 4.91,
    reviews: 5,
    size: "2 Ltr (Steel Dolchi)"
  },
];

const GheeStore: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});

  const toggleCart = (): void => setShowCart(!showCart);

  const addToCart = (product: Product): void => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (id: number): void => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: number, quantity: number): void => {
    setCart(cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleSizeChange = (productId: number, size: string): void => {
    setSelectedSizes({ ...selectedSizes, [productId]: size });
  };

  const handleProductClick = (productId: number): void => {
    navigate(`/details`);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Header onCartToggle={toggleCart} cartCount={cart.length} />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8 mt-28 max-w-7xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
          >
            {/* Product Image */}
            <div 
              className="relative h-96 flex items-center justify-center overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => handleProductClick(product.id)}
            >
              <img
                src={hoveredProduct === product.id ? product.hoverImage : product.image}
                alt={product.name}
                className="w-full h-full object-contain transition-opacity duration-300"
              />
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-grow">
              <h3 
                className="text-base font-semibold text-gray-800 mb-2 leading-tight cursor-pointer hover:text-green-700 transition-colors"
                onClick={() => handleProductClick(product.id)}
              >
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.rating}/{product.reviews} Star)
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-xl font-bold text-gray-900">₹ {product.price.toLocaleString('en-IN')}</span>
              </div>

              {/* Size Selector and Add to Cart */}
              <div className="flex items-center gap-3 mt-auto">
                <select 
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  value={selectedSizes[product.id] || product.size}
                  onChange={(e) => handleSizeChange(product.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option>{product.size}</option>
                </select>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 text-sm whitespace-nowrap"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Cart */}
      {showCart && (
        <CartSlide 
          cart={cart} 
          onClose={toggleCart}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
        />
      )}
    </div>
  );
};

export default GheeStore;
