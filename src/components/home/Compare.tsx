import React, { useState } from 'react';

interface Feature {
  name: string;
  ghar: string;
  vyshnavi: string;
  others: string;
}

interface Category {
  title: string;
  features: Feature[];
}

interface Categories {
  milk: Category;
  ghee: Category;
  curd: Category;
  paneer: Category;
}

type CategoryKey = keyof Categories;

export default function Compare() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('milk');

  const categories: Categories = {
    milk: {
      title: 'Milk',
      features: [
        { name: 'Farm to Home', ghar: '24 Hours', vyshnavi: '6 Hours', others: 'Who Knows?' },
        { name: 'Purity', ghar: 'Pure (We Hope)', vyshnavi: 'Lab Tested Pure', others: 'Questionable' },
        { name: 'A2 Milk', ghar: 'Not Available', vyshnavi: 'Available', others: 'Fake Claims' },
        { name: 'Freshness', ghar: 'Day Old', vyshnavi: 'Same Day', others: 'Week Old?' },
        { name: 'Price', ghar: 'Expensive Setup', vyshnavi: 'Moderate', others: 'Too High' },
        { name: 'Convenience', ghar: 'Hard Work', vyshnavi: 'Doorstep Delivery', others: 'Store Visit' }
      ]
    },
    ghee: {
      title: 'Ghee',
      features: [
        { name: 'Method', ghar: 'Traditional (If You Can)', vyshnavi: 'Bilona Method', others: 'Factory Made' },
        { name: 'Time', ghar: '3-4 Hours', vyshnavi: 'Traditional Process', others: 'Mass Produced' },
        { name: 'Taste', ghar: 'Delicious', vyshnavi: 'Aromatic & Rich', others: 'Honestly Good, But...' },
        { name: 'Purity', ghar: '100% (Your Effort)', vyshnavi: '100% Pure A2', others: 'Adulterants Added' },
        { name: 'Nutrition', ghar: 'High', vyshnavi: 'Very High', others: 'Very Low' },
        { name: 'Cost', ghar: "Mom's Sanity", vyshnavi: 'Moderate', others: 'Too High A Price' }
      ]
    },
    curd: {
      title: 'Curd',
      features: [
        { name: 'Setting Time', ghar: '6-8 Hours', vyshnavi: 'Fresh Daily', others: 'Industrial Process' },
        { name: 'Culture', ghar: 'Home Culture', vyshnavi: 'Natural Culture', others: 'Commercial' },
        { name: 'Texture', ghar: 'Sometimes Watery', vyshnavi: 'Thick & Creamy', others: 'Watery' },
        { name: 'Taste', ghar: 'Delicious', vyshnavi: 'Creamy', others: 'Sour & Artificial' },
        { name: 'Probiotics', ghar: 'Natural', vyshnavi: 'Probiotic Rich', others: 'Limited' },
        { name: 'Effort', ghar: 'Daily Hassle', vyshnavi: 'Zero Effort', others: 'Store Trip' }
      ]
    },
    paneer: {
      title: 'Paneer',
      features: [
        { name: 'Freshness', ghar: 'Fresh (Rare)', vyshnavi: 'Made Same Day', others: 'Days Old' },
        { name: 'Time', ghar: '45 Minutes', vyshnavi: 'Hand Pressed', others: 'Mass Produced' },
        { name: 'Texture', ghar: 'Soft (If Lucky)', vyshnavi: 'Soft & Fresh', others: 'Hard & Rubbery' },
        { name: 'Ingredients', ghar: '100% Natural', vyshnavi: '100% Pure Milk', others: 'Starch Added' },
        { name: 'Taste', ghar: 'Best', vyshnavi: 'Delicious', others: 'Bland' },
        { name: 'Protein', ghar: 'Hard To Track', vyshnavi: 'Very High', others: 'Low' }
      ]
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block bg-cyan-400 px-6 py-2 rounded-lg shadow-md transform -rotate-1">
            <h2 className="text-3xl md:text-4xl font-black text-blue-900 uppercase tracking-tight">
              Vyshnavi vs. The Rest
            </h2>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 mb-10">
          {(Object.keys(categories) as CategoryKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-6 py-2 rounded-lg font-bold transition-all capitalize text-base ${
                activeCategory === key
                  ? 'bg-[#ADD2FE] text-blue-600 shadow-lg scale-105'
                  : 'bg-white text-blue-600 hover:bg-teal-50'
              }`}
            >
              {categories[key].title}
            </button>
          ))}
        </div>

        {/* Comparison Table - Desktop */}
        <div className="hidden md:block bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-4 border-b-4 border-blue-200">
            <div className="p-4 font-black text-blue-900 text-lg bg-blue-50">
              {/* Empty corner */}
            </div>
            <div className="p-4 font-black text-blue-800 text-center text-lg bg-blue-50 border-l-2 border-blue-200">
              Ghar Ka Khaana
            </div>
            <div className="p-4 font-black text-white text-center text-lg bg-[#ADD2FE] border-l-2 border-[#ADD2FE]">
              <div className="flex items-center justify-center gap-2">
                <span className="text-blue-600 text-2xl">Vyshnavi</span>
              </div>
            </div>
            <div className="p-4 font-black text-blue-800 text-center text-lg bg-teal-50 border-l-2 border-teal-200">
              Junk Food
            </div>
          </div>

          {/* Table Body */}
          {categories[activeCategory].features.map((feature: Feature, index: number) => (
            <div
              key={index}
              className={`grid grid-cols-4 border-b border-blue-100 ${
                index % 2 === 0 ? 'bg-white' : 'bg-teal-25'
              }`}
            >
              <div className="p-4 font-bold text-blue-900 flex items-center bg-blue-50">
                {feature.name}
              </div>
              <div className="p-4 text-center text-blue-800 font-semibold flex items-center justify-center border-l-2 border-blue-100">
                {feature.ghar}
              </div>
              <div className="p-4 text-center text-blue-600 font-bold flex items-center justify-center bg-[#ADD2FE] border-l-2 border-[#ADD2FE]">
                {feature.vyshnavi}
              </div>
              <div className="p-4 text-center text-blue-800 font-semibold flex items-center justify-center border-l-2 border-blue-100">
                {feature.others}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {categories[activeCategory].features.map((feature: Feature, index: number) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-blue-50 p-3 border-b-2 border-blue-200">
                <h3 className="font-bold text-blue-900 text-lg">{feature.name}</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold text-blue-800 text-sm">Ghar Ka Khaana</span>
                  <span className="text-blue-800 font-semibold text-sm">{feature.ghar}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#ADD2FE] rounded-lg">
                  <span className="font-bold text-blue-600 text-sm">Vyshnavi</span>
                  <span className="text-blue-600 font-bold text-sm">{feature.vyshnavi}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                  <span className="font-semibold text-blue-800 text-sm">Junk Food</span>
                  <span className="text-blue-800 font-semibold text-sm">{feature.others}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-8 text-center">
          <p className="text-blue-700 font-semibold italic">
            Why compromise when you can have the best of both worlds? 🏠 + 🏪 = 💚
          </p>
        </div>
      </div>
    </section>
  );
}