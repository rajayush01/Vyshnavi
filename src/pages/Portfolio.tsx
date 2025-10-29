import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import butter200 from "../assets/butter-200-bg.png";
import butter200_1 from "../assets/butter-200_1.png";
import butter200_2 from "../assets/butter-200_2.png";
import butter200_3 from "../assets/butter-200_3.png";
import butter500 from "../assets/butter-500-bg.png";
import butter500_1 from "../assets/butter-500_1.png";
import butter500_2 from "../assets/butter-500_2.png";
import butter500_3 from "../assets/butter-500_3.png";
import buttermilk from "../assets/buttermilk.png";
import buttermilk_1 from "../assets/buttermilk_1.png";
import buttermilk_2 from "../assets/buttermilk_2.png";
import buttermilk_3 from "../assets/buttermilk_3.png";
import buttermilk_4 from "../assets/buttermilk_4.png";
import curd1 from "../assets/curd-pouch.png";
import curd2 from "../assets/curd-pouch1.png";
import curd3 from "../assets/curd-pouch2.png";
import curd4 from "../assets/curd-pouch3.png";
import curd_pouch from "../assets/curd.png";
import curd_pouch_1 from "../assets/curd1.png";
import curd_pouch_2 from "../assets/curd2.png";
import curd_pouch_3 from "../assets/curd3.png";
import curd_box from "../assets/curd-box.png";
import curd_box_1 from "../assets/curd-box1.png";
import curd_box_2 from "../assets/curd-box2.png";
import curd_box_3 from "../assets/curd-box3.png";
import healthy_curd_pouch from "../assets/healthy_curd_pouch.png";
import healthy_curd_pouch_1 from "../assets/healthy_curd_pouch1.png";
import healthy_curd_pouch_2 from "../assets/healthy_curd_pouch2.png";
import healthy_curd_pouch_3 from "../assets/healthy_curd_pouch3.png";
import badam_milk from "../assets/badam-milk.png";
import badam_milk_1 from "../assets/badam-milk1.png";
import badam_milk_2 from "../assets/badam-milk2.png";
import badam_milk_3 from "../assets/badam-milk3.png";
import chocolate_milk from "../assets/chocolate-milk.png";
import chocolate_milk_1 from "../assets/chocolate-milk1.jpeg";
import chocolate_milk_2 from "../assets/chocolate-milk2.jpeg";
import chocolate_milk_3 from "../assets/chocolate-milk3.png";
import spl_badam_milk from "../assets/spl-badam-milk.png";
import spl_badam_milk_1 from "../assets/spl-badam-milk1.jpeg";
import spl_badam_milk_2 from "../assets/spl-badam-milk2.jpeg";
import spl_badam_milk_3 from "../assets/spl-badam-milk3.png";

interface ProductItem {
  id: number;
  name: string;
  image: string;
  description: string;
  content: string;
  gallery: string[];
}

interface ProductCategory {
  name: string;
  items: ProductItem[];
}

interface Products {
  [key: string]: ProductCategory;
}

interface ItemPosition {
  x: string;
  translateX: string;
  scale: number;
  y: string;
  translateY: string;
  zIndex: number;
  opacity: number;
  rotation: number;
}

interface SelectedThumbnail extends ProductItem {
  image: string;
}

const products: Products = {
  buttermilk: {
    name: 'Buttermilk',
    items: [
      { 
        id: 1, 
        name: 'Buttermilk', 
        image: buttermilk,
        description: 'Full-bodied classic',
        content: 'Rich in calcium and vitamins, our whole milk offers creamy goodness with all the natural fat content for maximum flavor and nutrition.',
        gallery: [
          buttermilk_1,
          buttermilk_2,
          buttermilk_3,
          buttermilk_4
        ]
      },
    ]
  },
  curd: {
    name: 'Curd',
    items: [
      { 
        id: 5, 
        name: '2 Mini Curd Pouch', 
        image: curd1,
        description: 'Sharp and savory',
        content: 'Aged to perfection, our cheddar delivers a bold, tangy flavor that elevates any dish from sandwiches to gourmet platters.',
        gallery: [
          curd2,
          curd3,
          curd4,
        ]
      },
      { 
        id: 6, 
        name: 'Curd Pouch', 
        image: curd_pouch,
        description: 'Soft and stretchy',
        content: 'Fresh mozzarella with a delicate texture perfect for pizzas, caprese salads, and melting over your favorite Italian dishes.',
        gallery: [
          curd_pouch_1,
          curd_pouch_2,
          curd_pouch_3,
        ]
      },
      { 
        id: 7, 
        name: 'Healthy Curd Box', 
        image: curd_box,
        description: 'Aged excellence',
        content: 'Authentic aged parmesan with a nutty, complex flavor profile. Grate it over pasta or enjoy it in chunks with wine.',
        gallery: [
          curd_box_1,
          curd_box_2,
          curd_box_3,
        ]
      },
      { 
        id: 8, 
        name: 'Healthy Curd Pouch', 
        image: healthy_curd_pouch,
        description: 'Bold and distinctive',
        content: 'For the adventurous palate. Rich, creamy texture with sharp blue veins that create an unforgettable taste experience.',
        gallery: [
          healthy_curd_pouch_1,
          healthy_curd_pouch_2,
          healthy_curd_pouch_3,
        ]
      }
    ]
  },
  flavoured_milk: {
    name: 'Flavoured Milk',
    items: [
      { 
        id: 9, 
        name: 'Badam Milk', 
        image: badam_milk,
        description: 'Thick and protein-rich',
        content: 'Strained to creamy perfection, our Greek yogurt packs double the protein with a luxuriously thick texture. Perfect for breakfast or snacks.',
        gallery: [
          badam_milk_1,
          badam_milk_2,
          badam_milk_3,
        ]
      },
      { 
        id: 10, 
        name: 'Chocolate Milk', 
        image: chocolate_milk,
        description: 'Simple and versatile',
        content: 'Classic unflavored yogurt with live cultures. Use it in smoothies, cooking, or enjoy with your favorite toppings and sweeteners.',
        gallery: [
          chocolate_milk_1,
          chocolate_milk_2,
          chocolate_milk_3,
        ]
      },
      { 
        id: 11, 
        name: 'Special Badam Milk', 
        image: spl_badam_milk,
        description: 'Naturally sweet',
        content: 'Blended with real fruit pieces for a burst of natural sweetness. A delicious and nutritious treat that the whole family will love.',
        gallery: [
          spl_badam_milk_1,
          spl_badam_milk_2,
          spl_badam_milk_3,
        ]
      },
    ]
  },
  butter: {
    name: 'Butter',
    items: [
      { 
        id: 13, 
        name: 'Butter 200g', 
        image: butter200,
        description: 'Classic everyday butter',
        content: 'Perfect balance of creamy butter and salt. Ideal for spreading on toast, cooking, and adding rich flavor to any recipe.',
        gallery: [
          butter200_1,
          butter200_2,
          butter200_3,
        ]
      },
      { 
        id: 14, 
        name: 'Butter 500g', 
        image: butter500,
        description: 'Pure churned cream',
        content: 'The baker\'s choice. Control your seasoning with pure, unsalted butter that lets you taste the true flavor of cream.',
        gallery: [
          butter500_1,
          butter500_2,
          butter500_3,
        ]
      },
    ]
  }
}; 

const Portfolio: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('buttermilk');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedThumbnail, setSelectedThumbnail] = useState<SelectedThumbnail | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const backgroundTextRef = useRef<HTMLDivElement | null>(null);

  const currentItems = products[selectedProduct].items;

  const getItemPosition = (index: number, currentIdx: number, totalItems: number): ItemPosition => {
    const diff = (index - currentIdx + totalItems) % totalItems;
    
    if (diff === 0) {
      return {
        x: '50%',
        translateX: '-50%',
        scale: 1.3,
        y: '50%',
        translateY: '-50%',
        zIndex: 30,
        opacity: 1,
        rotation: 0
      };
    } else {
      return {
        x: '50%',
        translateX: '-50%',
        scale: 0.3,
        y: '70%',
        translateY: '-50%',
        zIndex: 0,
        opacity: 0,
        rotation: 0
      };
    }
  };
  
  const animateToPositions = (newIndex: number): void => {
    currentItems.forEach((_, index) => {
      const pos = getItemPosition(index, newIndex, currentItems.length);
      if (itemsRef.current[index]) {
        gsap.to(itemsRef.current[index], {
          left: pos.x,
          x: pos.translateX,
          top: pos.y,
          y: pos.translateY,
          scale: pos.scale,
          zIndex: pos.zIndex,
          opacity: pos.opacity,
          rotation: pos.rotation,
          duration: 0.8,
          ease: 'power2.inOut'
        });
      }
    });

    // Animate background text
    if (backgroundTextRef.current) {
      gsap.to(backgroundTextRef.current, {
        x: -50,
        opacity: 0.15,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          if (backgroundTextRef.current) {
            gsap.to(backgroundTextRef.current, {
              x: 0,
              opacity: 0.08,
              duration: 0.4,
              ease: 'power2.inOut'
            });
          }
        }
      });
    }

    setCurrentIndex(newIndex);
  };

  const nextItem = (): void => {
    const nextIndex = (currentIndex + 1) % currentItems.length;
    animateToPositions(nextIndex);
    resetAutoPlay();
  };

  const prevItem = (): void => {
    const prevIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    animateToPositions(prevIndex);
    resetAutoPlay();
  };

  const resetAutoPlay = (): void => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % currentItems.length;
        animateToPositions(next);
        return next;
      });
    }, 5000);
  };

  const changeProduct = (productKey: string): void => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setSelectedProduct(productKey);
          setCurrentIndex(0);
          if (containerRef.current) {
            gsap.to(containerRef.current, {
              opacity: 1,
              duration: 0.3
            });
          }
        }
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      currentItems.forEach((_, index) => {
        const pos = getItemPosition(index, 0, currentItems.length);
        if (itemsRef.current[index]) {
          gsap.set(itemsRef.current[index], {
            left: pos.x,
            x: pos.translateX,
            top: pos.y,
            y: pos.translateY,
            scale: pos.scale,
            zIndex: pos.zIndex,
            opacity: pos.opacity,
            rotation: pos.rotation
          });
        }
      });

      if (itemsRef.current[0]) {
        gsap.from(itemsRef.current[0], {
          scale: 0,
          rotation: -180,
          duration: 1,
          ease: 'elastic.out(1, 0.5)'
        });
      }

      resetAutoPlay();
    }, 0);

    return () => {
      clearTimeout(timer);
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [selectedProduct]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
      {/* Product Category Buttons */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-50 flex gap-3 flex-wrap justify-center px-4">
        {Object.keys(products).map((productKey) => (
          <button
            key={productKey}
            onClick={() => changeProduct(productKey)}
            className={`px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
              selectedProduct === productKey
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-amber-50 shadow-md'
            }`}
          >
            {products[productKey].name}
          </button>
        ))}
      </div>

      {/* Large Background Text - Current Item Name */}
      <div 
        ref={backgroundTextRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"
        style={{ opacity: 0.08 }}
      >
        <h1 className="text-[10rem] font-black text-gray-800 whitespace-nowrap select-none">
          {currentItems[currentIndex].name.toUpperCase()}
        </h1>
      </div>

      {/* Product Items Container */}
      <div ref={containerRef} className="relative w-full h-full">
        {/* Product Items */}
        {currentItems.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (itemsRef.current[index] = el)}
            className="absolute opacity-0"
            style={{ willChange: 'transform, opacity' }}
          >
            <img 
              src={item.image} 
              alt={item.name}
              className="w-64 h-80 object-cover "
            />
          </div>
        ))}
      </div>

      {/* Left Bottom Content Section - Current Item Description */}
      <div className="absolute left-8 bottom-32 z-40 max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {currentItems[currentIndex].description}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {currentItems[currentIndex].content}
          </p>
        </div>
      </div>

      {/* Navigation Buttons - Bottom Left */}
      <div className="absolute left-8 bottom-8 z-40 flex gap-4">
        <button
          onClick={prevItem}
          className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center hover:bg-amber-50 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextItem}
          className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center hover:bg-amber-50 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Right Bottom Thumbnail Gallery */}
      <div className="absolute right-8 bottom-8 z-40 flex flex-col gap-3">
        {currentItems[currentIndex].gallery.map((galleryImage, index) => (
          <button
            key={index}
            onClick={() => setSelectedThumbnail({ ...currentItems[currentIndex], image: galleryImage })}
            className="w-16 h-16 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-110"
          >
            <img src={galleryImage} alt={`${currentItems[currentIndex].name} ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Thumbnail Modal */}
      {selectedThumbnail && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8"
          onClick={() => setSelectedThumbnail(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={selectedThumbnail.image} 
              alt={selectedThumbnail.name}
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setSelectedThumbnail(null)}
              className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full">
              <p className="text-gray-800 font-semibold">{selectedThumbnail.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {currentItems.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-400 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Portfolio;