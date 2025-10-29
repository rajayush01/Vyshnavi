import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play } from 'lucide-react';

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
      {
        id: 1,
        name: 'Premium Protein Powder',
        price: '₹2,099',
        originalPrice: '₹2,599',
        image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=200&h=200&fit=crop'
      },
      {
        id: 2,
        name: 'Organic Energy Bars',
        price: '₹769',
        originalPrice: '₹899',
        image: 'https://images.unsplash.com/photo-1628963406763-1755cfcde0b5?w=200&h=200&fit=crop'
      }
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
      {
        id: 3,
        name: 'High Protein Oats',
        price: '₹439',
        originalPrice: '₹519',
        image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=200&h=200&fit=crop'
      },
      {
        id: 4,
        name: 'Vitamin Pack',
        price: '₹899',
        originalPrice: '₹1,199',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop'
      }
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
      {
        id: 6,
        name: 'Peanut Butter Crunch',
        price: '₹769',
        originalPrice: '₹899',
        image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=200&h=200&fit=crop'
      }
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
      {
        id: 7,
        name: 'Mass Gainer Pro',
        price: '₹3,299',
        originalPrice: '₹3,999',
        image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=200&h=200&fit=crop'
      },
      {
        id: 8,
        name: 'Creatine Blend',
        price: '₹1,499',
        originalPrice: '₹1,899',
        image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=200&h=200&fit=crop'
      }
    ]
  },
  {
    id: 5,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=600&fit=crop',
    username: 'active_living',
    caption: 'Stay energized all day ⚡',
    likes: '27.8K',
    comments: '1.8K',
    avatar: 'https://i.pravatar.cc/150?img=5',
    products: [
      {
        id: 9,
        name: 'Pre-Workout Mix',
        price: '₹1,799',
        originalPrice: '₹2,299',
        image: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=200&h=200&fit=crop'
      }
    ]
  }
];

export default function InstaReelsGrid() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  useEffect(() => {
    // Autoplay all videos when component mounts
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
    <div className=" p-6 -mb-48 bg-[#e0f2fe]">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {SAMPLE_VIDEOS.map((video) => (
            <div 
              key={video.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
              onMouseEnter={() => setHoveredId(video.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Video Section */}
              <div 
                className="relative aspect-[9/16] bg-gray-900"
              >
                <video
                  ref={el => videoRefs.current[video.id] = el}
                  src={video.url}
                  className="w-full h-full object-cover"
                  loop
                  muted={muted}
                  playsInline
                  autoPlay
                />

                {/* Top Gradient */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent z-10" />

                {/* Mute Button */}
                <button 
                  onClick={toggleMute}
                  className="absolute top-3 right-3 z-20 bg-black/50 backdrop-blur-sm p-1.5 rounded-full text-white"
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                {/* Stats Overlay */}
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

                {/* User Info */}
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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}