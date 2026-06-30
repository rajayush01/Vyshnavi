import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CATEGORIES, type ProductCategory, type ProductItem } from '../data/vyshnaviData';

gsap.registerPlugin(ScrollTrigger);

// ── Category → gradient mapping ──────────────────────────────────────────────
// Tailwind classes can't be dynamic, so we map each category key to a fixed
// gradient. Add more keys here if new categories are added to vyshnaviData.ts.
const CATEGORY_GRADIENTS: Record<string, string> = {
  milk:       'from-blue-500 to-cyan-600',
  curd:       'from-green-500 to-emerald-600',
  beverages:  'from-purple-500 to-violet-600',
  paneer:     'from-orange-400 to-amber-500',
  butter:     'from-yellow-400 to-amber-500',
  ghee:       'from-amber-500 to-orange-600',
  sweets:     'from-pink-500 to-rose-600',
};

// Fallback gradient for any future categories not yet mapped
const FALLBACK_GRADIENT = 'from-slate-500 to-gray-600';

// ── Flat section shape consumed by the scroll animation ──────────────────────
interface FlatSection extends ProductItem {
  categoryKey: string;
  categoryName: string;
  gradient: string;
}

// ── Build flat list from CATEGORIES ─────────────────────────────────────────
const buildSections = (): FlatSection[] =>
  CATEGORIES.flatMap((cat: ProductCategory) =>
    cat.items.map((item: ProductItem) => ({
      ...item,
      categoryKey:  cat.key,
      categoryName: cat.name,
      gradient:     CATEGORY_GRADIENTS[cat.key] ?? FALLBACK_GRADIENT,
    }))
  );

// ── Placeholder image component ──────────────────────────────────────────────
// Renders a branded placeholder when image is an empty string (PH).
const ProductImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => {
  if (src) {
    return <img src={src} alt={alt} className={className} />;
  }
  return (
    <div className={`${className} flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-3xl`}>
      <span className="text-6xl mb-3 opacity-60">🥛</span>
      <p className="text-white/60 text-sm font-medium text-center px-4">{alt}</p>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
const VerticalScrollAnimation: React.FC = () => {
  const containerRef    = useRef<HTMLDivElement>(null);
  const sectionRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]?.key ?? '');
  const [selectedGallery, setSelectedGallery] = useState<{
    item: FlatSection;
    imageIndex: number;
  } | null>(null);

  const allSections = buildSections();

  // ── GSAP stacked scroll setup ─────────────────────────────────────────────
  useEffect(() => {
    const sections = sectionRefs.current.filter((s): s is HTMLDivElement => s !== null);
    if (sections.length === 0) return;

    // Stack all sections below the first off-screen
    gsap.set(sections.slice(1), { yPercent: 100, opacity: 0 });

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
          onEnter:     () => setActiveCategory(allSections[index].categoryKey),
          onEnterBack: () => setActiveCategory(allSections[index].categoryKey),
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // ── Category pill navigation ──────────────────────────────────────────────
  const scrollToCategory = (categoryKey: string) => {
    const firstIndex = allSections.findIndex(s => s.categoryKey === categoryKey);
    if (firstIndex === -1) return;
    setActiveCategory(categoryKey);
    sectionRefs.current[firstIndex]?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Fixed category navigation pills ── */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex gap-2 flex-wrap justify-center px-4 max-w-[90vw]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => scrollToCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-all duration-300 shadow-md ${
              activeCategory === cat.key
                ? 'bg-white text-gray-900 scale-105 shadow-lg'
                : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Scroll sections ── */}
      <div ref={containerRef} className="relative mt-28">
        {allSections.map((item, index) => (
          <div
            key={item.id}
            ref={el => { sectionRefs.current[index] = el; }}
            className={`h-screen w-full flex items-center justify-center bg-gradient-to-br ${item.gradient} sticky top-0 overflow-hidden`}
          >
            {/* Watermark text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]">
              <h1 className="text-[6rem] md:text-[10rem] font-black text-white whitespace-nowrap select-none tracking-tighter">
                {item.name.toUpperCase()}
              </h1>
            </div>

            <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8 items-center relative z-10">

              {/* ── Right: image + gallery ── */}
              <div className="order-1 md:order-2 flex flex-col items-center gap-5">
                <div className="relative w-64 h-80 md:w-80 md:h-[440px]">
                  <div className="absolute inset-0 rounded-3xl bg-white/10 transform rotate-3 blur-sm" />
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    className="relative w-full h-full object-cover rounded-3xl mt-8 shadow-2xl"
                  />

                  {/* Tag badge */}
                  {item.tag && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {item.tag}
                    </span>
                  )}

                  {/* Rating */}
                  {item.rating && (
                    <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      {item.rating}
                      {item.reviews && (
                        <span className="opacity-70 ml-1">({item.reviews})</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Gallery thumbnails — only shown if gallery images exist */}
                {item.gallery.filter(Boolean).length > 0 && (
                  <div className="flex gap-3">
                    {item.gallery.filter(Boolean).slice(0, 4).map((galleryImg, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedGallery({ item, imageIndex: idx })}
                        className="w-14 h-14 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-110 border-2 border-white/40 hover:border-white"
                      >
                        <img
                          src={galleryImg}
                          alt={`${item.name} view ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Left: text content ── */}
              <div className="text-white space-y-5 order-2 md:order-1">
                {/* Category badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest">
                  {item.categoryName}
                </div>

                <div className="space-y-2">
                  <p className="text-lg md:text-xl font-medium opacity-80 leading-snug">
                    {item.description}
                  </p>
                  <h2 className="text-4xl md:text-6xl font-black leading-tight">
                    {item.name}
                  </h2>
                </div>

                <p className="text-base md:text-lg opacity-85 leading-relaxed max-w-lg">
                  {item.content}
                </p>

                {/* Variants */}
                {item.variants.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.variants.map((v, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-xs font-semibold border border-white/25"
                      >
                        {v.size}
                        {v.packType ? ` · ${v.packType}` : ''}
                        {v.price ? ` · ₹${v.price}` : ''}
                      </span>
                    ))}
                  </div>
                )}

                <button className="mt-2 bg-white text-gray-900 px-7 py-3.5 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-xl">
                  View Details
                </button>
              </div>
            </div>

            {/* Scroll indicator on first section */}
            {index === 0 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white opacity-60 animate-bounce">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Gallery lightbox modal ── */}
      {selectedGallery && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedGallery(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={selectedGallery.item.gallery[selectedGallery.imageIndex]}
              alt={selectedGallery.item.name}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />

            {/* Close button */}
            <button
              onClick={() => setSelectedGallery(null)}
              className="absolute top-4 right-4 w-11 h-11 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-xl"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Product name label */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
              <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg">
                <p className="text-sm text-gray-800 font-semibold whitespace-nowrap">
                  {selectedGallery.item.name}
                </p>
              </div>
            </div>

            {/* Navigation dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {selectedGallery.item.gallery.filter(Boolean).map((_: string, idx: number) => (
                <button
                  key={idx}
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedGallery({ ...selectedGallery, imageIndex: idx });
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === selectedGallery.imageIndex
                      ? 'bg-white w-7'
                      : 'bg-white/40 w-2 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            {/* Arrow navigation */}
            {selectedGallery.item.gallery.filter(Boolean).length > 1 && (
              <>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    const total = selectedGallery.item.gallery.filter(Boolean).length;
                    setSelectedGallery({
                      ...selectedGallery,
                      imageIndex: (selectedGallery.imageIndex - 1 + total) % total,
                    });
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    const total = selectedGallery.item.gallery.filter(Boolean).length;
                    setSelectedGallery({
                      ...selectedGallery,
                      imageIndex: (selectedGallery.imageIndex + 1) % total,
                    });
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VerticalScrollAnimation;