import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

gsap.registerPlugin(ScrollTrigger);

// // Placeholder images for local imports
// const buttermilk = 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&h=1000&fit=crop';
// const butter200 = 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=800&h=1000&fit=crop';
// const butter500 = 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&h=1000&fit=crop';

const products = {
  buttermilk: {
    name: 'Buttermilk',
    gradient: 'from-blue-500 to-cyan-600',
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
      // { 
      //   id: 2, 
      //   name: 'Skim Milk', 
      //   image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&h=1000&fit=crop',
      //   description: 'Light and healthy',
      //   content: 'All the protein and calcium you need with zero fat. Perfect for those watching their calorie intake without compromising on nutrition.',
      //   gallery: [
      //     'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=500&fit=crop',
      //     'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=500&fit=crop',
      //     'https://images.unsplash.com/photo-1600788907416-456578634209?w=400&h=500&fit=crop',
      //     'https://images.unsplash.com/photo-1523473827533-2a64d0d36748?w=400&h=500&fit=crop'
      //   ]
      // },
      // { 
      //   id: 3, 
      //   name: 'Organic Milk', 
      //   image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=1000&fit=crop',
      //   description: 'Pure and natural',
      //   content: 'Sourced from organic farms with grass-fed cows, free from antibiotics and synthetic hormones. Taste the difference of authentic organic farming.',
      //   gallery: [
      //     'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=500&fit=crop',
      //     'https://images.unsplash.com/photo-1523473827533-2a64d0d36748?w=400&h=500&fit=crop',
      //     'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=500&fit=crop',
      //     'https://images.unsplash.com/photo-1600788907416-456578634209?w=400&h=500&fit=crop'
      //   ]
      // },
      // { 
      //   id: 4, 
      //   name: 'Flavored Milk', 
      //   image: 'https://images.unsplash.com/photo-1481671703460-040cb8a2d909?w=800&h=1000&fit=crop',
      //   description: 'Delicious varieties',
      //   content: 'From chocolate to strawberry, enjoy your favorite flavors with the goodness of real milk. Perfect for kids and adults alike.',
      //   gallery: [
      //     'https://images.unsplash.com/photo-1481671703460-040cb8a2d909?w=400&h=500&fit=crop',
      //     'https://images.unsplash.com/photo-1628773822990-202d14ca5ca9?w=400&h=500&fit=crop',
      //     'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=500&fit=crop',
      //     'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=500&fit=crop'
      //   ]
      // }
    ]
  },
  curd: {
    name: 'Curd',
    gradient: 'from-amber-500 to-orange-600',
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
    gradient: 'from-pink-500 to-rose-600',
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
    gradient: 'from-yellow-400 to-amber-500',
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

const VerticalScrollAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('buttermilk');
  const [selectedGallery, setSelectedGallery] = useState<{item: any, imageIndex: number} | null>(null);

  // Get the index of first item of selected category
  const getCategoryScrollIndex = (categoryKey: string) => {
    let index = 0;
    for (const [key, category] of Object.entries(products)) {
      if (key === categoryKey) return index;
      index += category.items.length;
    }
    return 0;
  };

  // Flatten all products into sections
  const allSections = Object.entries(products).flatMap(([key, category]) => 
    category.items.map(item => ({
      categoryKey: key,
      category: category.name,
      gradient: category.gradient,
      ...item
    }))
  );

useEffect(() => {
    const sections = sectionRefs.current.filter(s => s !== null);
    if (sections.length === 0) return;

    gsap.set(sections.slice(1), {
      yPercent: 100,
      opacity: 0,
    });

    sections.forEach((section, index) => {
      if (index === 0) return;

      gsap.to(section, {
        yPercent: 0,
        opacity: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: sections[index - 1],
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onEnter: () => {
            setSelectedCategory(allSections[index].categoryKey);
          },
          onEnterBack: () => {
            setSelectedCategory(allSections[index].categoryKey);
          }
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // const scrollToCategory = (categoryKey: string) => {
  //   const index = getCategoryScrollIndex(categoryKey);
  //   setSelectedCategory(categoryKey);
  //   sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  // };

  return (
    <>
      {/* Fixed Category Navigation */}
      {/* <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-3 flex-wrap justify-center px-4">
        {Object.keys(products).map((productKey) => (
          <button
            key={productKey}
            onClick={() => scrollToCategory(productKey)}
            className={`px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wide transition-all duration-300 ${
              selectedCategory === productKey
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-blue-50 shadow-md'
            }`}
          >
            {products[productKey].name}
          </button>
        ))}
      </div> */}

      <div ref={containerRef} className="relative mt-28">
        {allSections.map((item, index) => (
          <div
            key={item.id}
            ref={el => sectionRefs.current[index] = el}
            className={`h-screen w-full flex items-center justify-center bg-gradient-to-br ${item.gradient} sticky top-0 overflow-hidden`}
          >
            {/* Large Background Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <h1 className="text-[8rem] md:text-[12rem] font-black text-white whitespace-nowrap select-none">
                {item.name.toUpperCase()}
              </h1>
            </div>

            <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8 items-center relative z-10">
              {/* Product Image with Gallery Thumbnails */}
              <div className="order-1 md:order-2 flex flex-col items-center gap-6">
                <div className="relative w-72 h-96 md:w-96 md:h-[500px]">
                  <div className="absolute inset-0 rounded-3xl transform rotate-3"></div>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="relative w-full h-full object-cover rounded-3xl mt-20"
                  />
                </div>

                {/* Gallery Thumbnails */}
                <div className="flex gap-3">
                  {item.gallery.slice(0, 4).map((galleryImg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedGallery({ item, imageIndex: idx })}
                      className="w-16 h-16 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-110 border-2 border-white/50"
                    >
                      <img src={galleryImg} alt={`${item.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Content */}
              <div className="text-white space-y-6 order-2 md:order-1">
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-2">
                  {item.category}
                </div>
                <div className="space-y-3">
                  <p className="text-xl md:text-2xl font-medium opacity-90">{item.description}</p>
                  <h1 className="text-5xl md:text-7xl font-bold leading-tight">{item.name}</h1>
                </div>
                <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-xl">
                  {item.content}
                </p>

                <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-xl">
                  View Details
                </button>
              </div>
            </div>

            {/* Scroll Indicator (only on first section) */}
            {index === 0 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white opacity-70 animate-bounce">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gallery Modal */}
      {selectedGallery && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedGallery(null)}
        >
          <div className="relative max-w-5xl w-full">
            <img 
              src={selectedGallery.item.gallery[selectedGallery.imageIndex]} 
              alt={selectedGallery.item.name}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedGallery(null)}
              className="absolute top-4 right-4 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-xl"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-full">
              <p className="text-sm md:text-base text-gray-800 font-semibold">{selectedGallery.item.name}</p>
            </div>

            {/* Gallery Navigation Dots */}
            <div className="absolute bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
              {selectedGallery.item.gallery.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGallery({ ...selectedGallery, imageIndex: idx });
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === selectedGallery.imageIndex ? 'bg-white w-8' : 'bg-white/50 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerticalScrollAnimation;