import React from 'react';
import { Calendar, Clock, ArrowRight, ArrowUpRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

const Blogs: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Getting Started with Modern Web Development",
      excerpt: "Learn the fundamentals of modern web development and discover the tools that will make you a better developer.",
      date: "Oct 20, 2025",
      readTime: "5 min read",
      category: "Development",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "The Future of Artificial Intelligence",
      excerpt: "Exploring how AI is transforming industries and what it means for the future of technology and humanity.",
      date: "Oct 18, 2025",
      readTime: "7 min read",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Design Principles for Better UX",
      excerpt: "Discover essential design principles that will help you create more intuitive and user-friendly interfaces.",
      date: "Oct 15, 2025",
      readTime: "6 min read",
      category: "Design",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop"
    }
  ];

  const [featured, ...rest] = blogPosts;

  return (
    <section className="py-20 sm:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-5">
              <svg width="9" height="11" viewBox="0 0 32 40" fill="none">
                <path d="M16 2 C22 14 28 20 28 28 C28 34.6 22.6 40 16 40 C9.4 40 4 34.6 4 28 C4 20 10 14 16 2 Z" fill="#2563eb" />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-700">
                The Journal
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Latest from the Blog</h2>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all">
            View All Posts <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Editorial layout: large featured post + list */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Featured post */}
          <article className="lg:col-span-3 group relative rounded-[28px] overflow-hidden shadow-[0_30px_70px_-30px_rgba(15,23,42,0.35)] cursor-pointer">
            <div className="relative h-[320px] sm:h-[440px]">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
              <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide mb-4">
                {featured.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug max-w-lg">
                {featured.title}
              </h3>
              <p className="text-slate-200/90 text-sm mb-5 max-w-md leading-relaxed hidden sm:block">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{featured.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
              </div>
            </div>
            <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-white transition-colors">
              <ArrowUpRight className="w-4 h-4 text-slate-900" />
            </div>
          </article>

          {/* List of remaining posts */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {rest.map((post) => (
              <article
                key={post.id}
                className="group flex gap-4 bg-white rounded-2xl p-3 pr-5 border border-gray-100 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_-20px_rgba(37,99,235,0.3)] hover:-translate-y-1 transition-all duration-500 cursor-pointer"
              >
                <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="flex flex-col justify-center py-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600 mb-1.5">
                    {post.category}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}

            {/* Fill remaining space with a subtle CTA card */}
            <div className="flex-1 min-h-[120px] rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex flex-col items-center justify-center text-center p-6">
              <p className="text-sm text-blue-800 font-semibold mb-3">More stories, fresh every week</p>
              <button className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all">
                Browse the Journal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile view-all button */}
        <div className="sm:hidden text-center mt-10">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold shadow-[0_15px_35px_-12px_rgba(37,99,235,0.6)]">
            View All Posts
          </button>
        </div>
      </div>
    </section>
  );
};

export default Blogs;