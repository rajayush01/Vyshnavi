import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, VolumeX, Volume2 } from 'lucide-react';

const SAMPLE_VIDEOS = [
  {
    id: 1,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=600&fit=crop',
    username: 'fitness_store',
    caption: 'Transform your workout! 💪',
    likes: '24.5K',
    comments: '1.2K',
    avatar: 'https://i.pravatar.cc/150?img=1',
    products: [
      { id: 1, name: 'Premium Protein Powder', price: '₹2,099', originalPrice: '₹2,599', image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=200&h=200&fit=crop' },
      { id: 2, name: 'Organic Energy Bars', price: '₹769', originalPrice: '₹899', image: 'https://images.unsplash.com/photo-1628963406763-1755cfcde0b5?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: 2,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop',
    username: 'nutrition_expert',
    caption: 'Fuel your body right! 🥤',
    likes: '18.3K',
    comments: '892',
    avatar: 'https://i.pravatar.cc/150?img=2',
    products: [
      { id: 3, name: 'High Protein Oats', price: '₹439', originalPrice: '₹519', image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=200&h=200&fit=crop' },
      { id: 4, name: 'Vitamin Pack', price: '₹899', originalPrice: '₹1,199', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: 3,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=600&fit=crop',
    username: 'health_lifestyle',
    caption: 'Best wellness deals 🌟',
    likes: '31.7K',
    comments: '2.1K',
    avatar: 'https://i.pravatar.cc/150?img=3',
    products: [
      { id: 6, name: 'Peanut Butter Crunch', price: '₹769', originalPrice: '₹899', image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: 4,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=600&fit=crop',
    username: 'gym_essentials',
    caption: 'Power up your gains 💯',
    likes: '42.1K',
    comments: '3.4K',
    avatar: 'https://i.pravatar.cc/150?img=4',
    products: [
      { id: 7, name: 'Mass Gainer Pro', price: '₹3,299', originalPrice: '₹3,999', image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=200&h=200&fit=crop' },
      { id: 8, name: 'Creatine Blend', price: '₹1,499', originalPrice: '₹1,899', image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: 5,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop',
    username: 'nutrition_expert',
    caption: 'Fuel your body right! 🥤',
    likes: '18.3K',
    comments: '892',
    avatar: 'https://i.pravatar.cc/150?img=2',
    products: [
      { id: 3, name: 'High Protein Oats', price: '₹439', originalPrice: '₹519', image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=200&h=200&fit=crop' },
      { id: 4, name: 'Vitamin Pack', price: '₹899', originalPrice: '₹1,199', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: 6,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=600&fit=crop',
    username: 'health_lifestyle',
    caption: 'Best wellness deals 🌟',
    likes: '31.7K',
    comments: '2.1K',
    avatar: 'https://i.pravatar.cc/150?img=3',
    products: [
      { id: 6, name: 'Peanut Butter Crunch', price: '₹769', originalPrice: '₹899', image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=200&h=200&fit=crop' }
    ]
  },
];

export default function InstaReelsGrid() {
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  useEffect(() => {
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.play().catch(err => {
          console.log('Autoplay prevented:', err);
        });
      }
    });
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMuted(!muted);
  };

  return (
    <div className="p-6 pt-14 -mb-48 bg-[#e0f2fe]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-3 px-1">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-blue-100 mb-4">
              <svg width="9" height="11" viewBox="0 0 32 40" fill="none">
                <path d="M16 2 C22 14 28 20 28 28 C28 34.6 22.6 40 16 40 C9.4 40 4 34.6 4 28 C4 20 10 14 16 2 Z" fill="#2563eb" />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-700">
                As Seen On Reels
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
              Fresh, In Motion
            </h2>
          </div>
          <p className="text-sm text-slate-500 hidden sm:block">Swipe to explore →</p>
        </div>

        {/* Horizontal scroll-snap rail */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
          {SAMPLE_VIDEOS.map((video) => (
            <div
              key={video.id}
              className="snap-start flex-shrink-0 w-[220px] sm:w-[240px] bg-white rounded-2xl overflow-hidden shadow-[0_15px_35px_-18px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_50px_-15px_rgba(37,99,235,0.5)] hover:-translate-y-1.5 transition-all duration-500 ease-out border border-white"
            >
              <div className="relative aspect-[9/16] bg-gray-900">
                <video
                  ref={el => videoRefs.current[video.id] = el}
                  src={video.url}
                  className="w-full h-full object-cover"
                  loop
                  muted={muted}
                  playsInline
                  autoPlay
                />

                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent z-10" />

                <button
                  onClick={toggleMute}
                  className="absolute top-3 right-3 z-20 bg-black/50 backdrop-blur-sm p-1.5 rounded-full text-white"
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-white text-xs font-semibold bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Heart size={12} />
                    <span>{video.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white text-xs font-semibold bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <MessageCircle size={12} />
                    <span>{video.comments}</span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 z-20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white">
                      <img src={video.avatar} alt={video.username} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-white text-xs font-semibold truncate">{video.username}</span>
                  </div>
                  <p className="text-white text-xs line-clamp-2">{video.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </div>
  );
}