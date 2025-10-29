import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

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

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest from the Blog</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Insights, stories, and ideas to help you grow and succeed
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                </div>

                {/* Read More Link */}
                <button className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-white border-2 border-black text-black px-8 py-3 rounded-lg font-medium hover:bg-black hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            View All Posts
          </button>
        </div>
      </div>
    </section>
  );
};

export default Blogs;