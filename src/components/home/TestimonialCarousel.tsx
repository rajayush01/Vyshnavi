import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  
  // Responsive items per page
  const getItemsPerPage = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1; // Mobile
      if (window.innerWidth < 1024) return 2; // Tablet
      return 3; // Desktop
    }
    return 3;
  };

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());
  const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

  // Handle window resize
  useState(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        const newItemsPerPage = getItemsPerPage();
        setItemsPerPage(newItemsPerPage);
        setCurrentIndex(prev => Math.min(prev, Math.max(0, testimonials.length - newItemsPerPage)));
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  });

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full py-8 sm:py-12 lg:py-16 px-4 -mb-14">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-10 lg:mb-12">
          What Do Our Customers Say
        </h2>

        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 px-2 sm:px-3"
                style={{ width: `${100 / itemsPerPage}%` }}
              >
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 flex-grow">
                    {testimonial.text}
                  </p>
                  
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base truncate">
                        {testimonial.name}
                      </h4>
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 lg:mt-12">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>

          <div className="flex gap-1.5 sm:gap-2">
            {[...Array(maxIndex + 1)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-gray-800 w-4 sm:w-6' : 'bg-gray-300 w-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;