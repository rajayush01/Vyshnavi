import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  text: string;
  name: string;
  rating: number;
  image: string;
}

const TestimonialCarousel = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      text: "A variety of ways to use my favourite coconut oil and honey. My skin feels nourished, my cuticles are soft, my lips are smooth, and many other benefits come from using them!",
      name: "Minerva Thakur",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
      id: 2,
      text: "Their ghee helped solve my acid reflux problem. While cooking with wood pressed oils imparts a unique taste and I feel lighter",
      name: "Lakshmi Dev",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    },
    {
      id: 3,
      text: "This ghee is the most healthy option out there for children. I use it regularly for my daughter and she loves the taste",
      name: "Dr Shagun Walia",
      rating: 5,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop"
    },
    {
      id: 4,
      text: "Works very well for holistic healing! Typical honey. It is very sweet and ca like nobody's business :)",
      name: "Pankaj Tiwari",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const active = testimonials[currentIndex];

  const handlePrevious = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);

  return (
    <div className="w-full py-20 sm:py-24 px-4 -mb-14">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100">
            <svg width="9" height="11" viewBox="0 0 32 40" fill="none">
              <path d="M16 2 C22 14 28 20 28 28 C28 34.6 22.6 40 16 40 C9.4 40 4 34.6 4 28 C4 20 10 14 16 2 Z" fill="#2563eb" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-700">
              Trusted By Families
            </span>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-12 sm:mb-14 tracking-tight">
          What Do Our Customers Say
        </h2>

        {/* Spotlight quote card */}
        <div className="relative bg-white rounded-[32px] shadow-[0_40px_80px_-30px_rgba(37,99,235,0.35)] border border-blue-50 px-6 sm:px-14 py-10 sm:py-14 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-[0_15px_35px_-10px_rgba(37,99,235,0.6)]">
            <Quote className="w-7 h-7 text-white" fill="white" />
          </div>

          <div key={active.id} className="animate-[testimonialFade_0.5s_ease-out]">
            <div className="flex justify-center gap-1 mb-6 mt-4">
              {[...Array(active.rating)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>

            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium mb-8 max-w-2xl mx-auto">
              "{active.text}"
            </p>

            <div className="flex flex-col items-center gap-2">
              <img
                src={active.image}
                alt={active.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-50"
              />
              <h4 className="font-bold text-gray-800 text-base">{active.name}</h4>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Verified Customer</span>
            </div>
          </div>
        </div>

        {/* Thumbnail rail + arrows */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={handlePrevious}
            className="w-11 h-11 rounded-full border border-blue-100 bg-white flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm flex-shrink-0"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-blue-600" />
          </button>

          <div className="flex gap-3">
            {testimonials.map((t, index) => (
              <button
                key={t.id}
                onClick={() => setCurrentIndex(index)}
                aria-label={`View testimonial from ${t.name}`}
                className={`relative rounded-full overflow-hidden transition-all duration-300 ${
                  index === currentIndex ? 'w-12 h-12 ring-3 ring-blue-500 ring-offset-2' : 'w-10 h-10 opacity-50 hover:opacity-80'
                }`}
              >
                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-full border border-blue-100 bg-white flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm flex-shrink-0"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes testimonialFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TestimonialCarousel;