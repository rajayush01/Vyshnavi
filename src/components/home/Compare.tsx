import React, { useState } from 'react';
import { Check, Minus } from 'lucide-react';

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

  const active = categories[activeCategory];

  return (
    <section className="py-20 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-100">
            <svg width="9" height="11" viewBox="0 0 32 40" fill="none">
              <path d="M16 2 C22 14 28 20 28 28 C28 34.6 22.6 40 16 40 C9.4 40 4 34.6 4 28 C4 20 10 14 16 2 Z" fill="#0891b2" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-700">
              No Contest
            </span>
          </div>
        </div>
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-blue-900 tracking-tight">
            Vyshnavi <span className="text-cyan-500">vs.</span> The Rest
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {(Object.keys(categories) as CategoryKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 capitalize text-sm tracking-wide border ${
                activeCategory === key
                  ? 'bg-blue-600 text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.5)] scale-105 border-blue-600'
                  : 'bg-white text-blue-600 border-blue-100 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {categories[key].title}
            </button>
          ))}
        </div>

        {/* Three-panel split comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-0 items-stretch">
          {/* Ghar Ka Khaana */}
          <div className="bg-white rounded-3xl md:rounded-r-none border border-blue-50 p-6 sm:p-7 flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">
              Ghar Ka Khaana
            </h3>
            <div className="space-y-4 flex-1">
              {active.features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Minus className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{f.name}</p>
                    <p className="text-sm text-slate-600 font-medium">{f.ghar}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vyshnavi — elevated center panel */}
          <div className="relative bg-gradient-to-b from-blue-600 to-blue-700 rounded-3xl p-6 sm:p-8 flex flex-col text-white shadow-[0_40px_80px_-25px_rgba(37,99,235,0.55)] md:-my-4 md:z-10">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest bg-cyan-400 text-blue-900 px-3 py-1 rounded-full shadow">
              Best Choice
            </span>
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 text-center pt-2">
              Vyshnavi
            </h3>
            <div className="space-y-4 flex-1">
              {active.features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-2.5 h-2.5 text-blue-900" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-100">{f.name}</p>
                    <p className="text-sm font-bold">{f.vyshnavi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Junk Food */}
          <div className="bg-white rounded-3xl md:rounded-l-none border border-blue-50 p-6 sm:p-7 flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">
              Junk Food
            </h3>
            <div className="space-y-4 flex-1">
              {active.features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Minus className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{f.name}</p>
                    <p className="text-sm text-slate-600 font-medium">{f.others}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-10 text-center">
          <p className="text-blue-700 font-semibold italic">
            Why compromise when you can have the best of both worlds? 🏠 + 🏪 = 💚
          </p>
        </div>
      </div>
    </section>
  );
}