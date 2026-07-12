import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import { MessageCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#e0f2fe] via-white to-white flex items-center justify-center px-4 py-20 sm:py-24 overflow-hidden">
      {/* Decorative dairy illustrations, consistent with the rest of the site */}
      <svg className="hidden md:block absolute top-24 left-[8%] w-16 h-16 opacity-50 animate-float-slow" viewBox="0 0 64 64" fill="none">
        <path
          d="M32 6 C40 22 50 30 50 42 C50 52 42 58 32 58 C22 58 14 52 14 42 C14 30 24 22 32 6 Z"
          fill="#ffffff"
          stroke="#60a5fa"
          strokeWidth="2"
        />
        <ellipse cx="27" cy="40" rx="4" ry="6" fill="#bfdbfe" opacity="0.7" />
      </svg>

      <svg className="hidden md:block absolute bottom-24 right-[10%] w-20 h-20 opacity-50 animate-float" viewBox="0 0 64 64" fill="none">
        <path d="M20 24 L44 24 L41 56 L23 56 Z" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
        <path d="M24 24 L20 14 L44 14 L40 24 Z" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
        <rect x="27" y="8" width="10" height="6" rx="2" fill="#3b82f6" />
        <line x1="20" y1="34" x2="44" y2="34" stroke="#93c5fd" strokeWidth="1.5" />
      </svg>

      <svg className="hidden lg:block absolute top-1/3 right-[16%] w-10 h-10 opacity-40 animate-float" viewBox="0 0 64 64" fill="none">
        <path
          d="M32 10 C38 22 46 28 46 38 C46 46 40 51 32 51 C24 51 18 46 18 38 C18 28 26 22 32 10 Z"
          fill="#93c5fd"
          opacity="0.6"
        />
      </svg>

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-100/50 via-blue-50/30 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-lg w-full text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-blue-100 shadow-[0_2px_20px_-4px_rgba(37,99,235,0.15)] mb-8">
          <svg width="10" height="12" viewBox="0 0 32 40" fill="none">
            <path d="M16 2 C22 14 28 20 28 28 C28 34.6 22.6 40 16 40 C9.4 40 4 34.6 4 28 C4 20 10 14 16 2 Z" fill="#2563eb" />
          </svg>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-700">
            Lost in the dairy
          </span>
        </div>

        {/* 404 */}
        <p className="text-7xl sm:text-8xl font-black leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 mb-4">
          404
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">
          This page has gone off the farm
        </h1>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-sm mx-auto mb-10">
          The page you're looking for doesn't exist, moved, or maybe never made it past the milking parlor. Let's get you back to something fresh.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-7 py-3 rounded-full text-sm font-semibold shadow-[0_15px_35px_-12px_rgba(37,99,235,0.6)] hover:shadow-[0_20px_45px_-10px_rgba(37,99,235,0.75)] hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <HomeIcon className="h-4 w-4" aria-hidden="true" />
            Go back home
          </Link>

          <a
            href="/contact-us"
            className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-700 px-7 py-3 rounded-full text-sm font-semibold hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Contact support
          </a>
        </div>

        {/* Divider accent, matching the rest of the site */}
        <div className="flex items-center justify-center gap-3 mt-14">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-blue-200" />
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-blue-200" />
        </div>
      </div>

      <style>{`
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: floatUpDown 5s ease-in-out infinite; }
        .animate-float-slow { animation: floatUpDown 7s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default NotFound;