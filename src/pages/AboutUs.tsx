import React, { useEffect, useRef, useState } from 'react';
import { Milk, Award, Heart, Leaf, Users, TrendingUp } from 'lucide-react';

const AboutUs = () => {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      if (statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8 && !statsVisible) {
          setStatsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [statsVisible]);

  const stats = [
    { value: '50+', label: 'Years of Excellence', icon: Award },
    { value: '10K+', label: 'Happy Families', icon: Users },
    { value: '100%', label: 'Pure & Natural', icon: Leaf },
    { value: '24/7', label: 'Fresh Delivery', icon: TrendingUp },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Quality First',
      description: 'We never compromise on the quality of our dairy products. Every drop is tested for purity and freshness.',
    },
    {
      icon: Leaf,
      title: 'Sustainable Farming',
      description: 'Our farms follow eco-friendly practices, ensuring the well-being of our cattle and the environment.',
    },
    {
      icon: Milk,
      title: 'Farm Fresh',
      description: 'From our farms to your table within hours, maintaining the natural goodness and taste.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 overflow-hidden mt-28">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div 
          className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
        <div 
          className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center z-10">
          <div 
            className="inline-block mb-6 transform transition-all duration-1000 ease-out"
            style={{ 
              opacity: Math.min(1, 1 - scrollY / 500),
              transform: `translateY(${scrollY * 0.3}px) scale(${Math.max(0.8, 1 - scrollY / 1000)})`
            }}
          >
            <Milk className="w-20 h-20 text-blue-600 mx-auto mb-4 animate-bounce" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Our <span className="text-blue-600">Story</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Delivering pure happiness and nutrition to families since 1970
            </p>
          </div>

          {/* Hero Image */}
          <div 
            className="mt-12 relative"
            style={{ 
              opacity: Math.min(1, 1 - scrollY / 600),
              transform: `translateY(${scrollY * 0.2}px)`
            }}
          >
            <div className="relative mx-auto max-w-4xl rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=1200&h=600&fit=crop"
                alt="Dairy Farm"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transform transition-all duration-700 delay-${index * 100}`}
                style={{
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${index * 150}ms`
                }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                A Legacy of <span className="text-blue-600">Purity</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Founded in 1970 by the Johnson family, our dairy began with a simple mission: to provide the freshest, most nutritious milk to our local community. What started as a small family farm has grown into a trusted name, serving thousands of families across the region.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Today, we maintain the same values that our founders held dear—quality, integrity, and care for both our cattle and our customers. Every bottle of milk, every product we create carries forward our commitment to excellence.
              </p>
              <div className="flex gap-4 pt-4">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                  Our Products
                </button>
                <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-amber-50 transform hover:scale-105 transition-all duration-300">
                  Visit Farm
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=600&fit=crop"
                  alt="Dairy Cows"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-600 rounded-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-blue-600">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <value.icon className="w-14 h-14 text-blue-600 group-hover:text-white transition-colors duration-300 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 group-hover:text-white transition-colors duration-300 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Meet Our <span className="text-blue-600">Team</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Dedicated people working every day to bring you the best
          </p>
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=500&fit=crop"
              alt="Our Team"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="text-2xl font-semibold">Passionate. Dedicated. Family.</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;