// AlsoAvailableSection.tsx
import React from "react";

export default function AlsoAvailableSection() {
  return (
    <div className="relative w-full overflow-hidden bg-[#e0f2fe] py-20 sm:py-24 px-4">
      {/* Decorative dairy illustrations */}
      {/* <svg className="hidden md:block absolute top-8 left-[6%] w-16 h-16 opacity-60 animate-float-slow" viewBox="0 0 64 64" fill="none">
        <path d="M32 6 C40 22 50 30 50 42 C50 52 42 58 32 58 C22 58 14 52 14 42 C14 30 24 22 32 6 Z" fill="#ffffff" stroke="#60a5fa" strokeWidth="2" />
        <ellipse cx="27" cy="40" rx="4" ry="6" fill="#bfdbfe" opacity="0.7" />
      </svg>
      <svg className="hidden md:block absolute bottom-10 right-[8%] w-20 h-20 opacity-60 animate-float" viewBox="0 0 64 64" fill="none">
        <path d="M20 24 L44 24 L41 56 L23 56 Z" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
        <path d="M24 24 L20 14 L44 14 L40 24 Z" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
        <rect x="27" y="8" width="10" height="6" rx="2" fill="#3b82f6" />
      </svg> */}

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-blue-100">
            <svg width="9" height="11" viewBox="0 0 32 40" fill="none">
              <path
                d="M16 2 C22 14 28 20 28 28 C28 34.6 22.6 40 16 40 C9.4 40 4 34.6 4 28 C4 20 10 14 16 2 Z"
                fill="#2563eb"
              />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-700">
              EASY TO BUY EVERY DAY
            </span>
          </div>
        </div>
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 tracking-tight">
  Also Available on Your
  <br />
  Favourite Platforms & Local Stores
</h2>
        {/* Split panel with divider */}
      <div className="bg-white/80 backdrop-blur-sm rounded-[28px] border border-white shadow-[0_25px_60px_-25px_rgba(37,99,235,0.35)] overflow-hidden">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-blue-100/70">

    {/* Amazon */}
    <a
      href="https://www.amazon.in"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center gap-4 px-6 py-8 hover:bg-blue-50/50 transition-colors duration-300"
    >
      <svg className="w-36 h-16" viewBox="0 0 200 80" fill="none">
        <text x="10" y="50" fontFamily="Arial, sans-serif" fontSize="42" fontWeight="bold" fill="#000">
          amazon
        </text>
        <path d="M60 62 Q100 72 140 62" stroke="#FF9900" strokeWidth="4" strokeLinecap="round" />
        <path d="M135 58 L140 62 L136 66" stroke="#FF9900" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
    </a>

    {/* Swiggy */}
    <a
      href="https://www.swiggy.com"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center gap-4 px-6 py-8 hover:bg-orange-50/50 transition-colors duration-300"
    >
      <svg className="w-36 h-16" viewBox="0 0 200 80" fill="none">
        <g transform="translate(5, 15)">
          <path d="M20 0 C9 0 0 9 0 20 C0 35 20 50 20 50 C20 50 40 35 40 20 C40 9 31 0 20 0 Z" fill="#FC8019" />
          <circle cx="20" cy="18" r="8" fill="white" />
        </g>
        <text x="50" y="48" fontFamily="Arial, sans-serif" fontSize="29" fontWeight="bold" fill="#FC8019">
          SWIGGY
        </text>
      </svg>
      <span className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
    </a>

    {/* Instamart */}
    <a
      href="https://www.swiggy.com/instamart"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center gap-3 px-6 py-8 hover:bg-purple-50/50 transition-colors duration-300"
    >
      <svg className="w-36 h-16" viewBox="0 0 200 80" fill="none">
        <rect x="8" y="12" width="48" height="48" rx="14" fill="#7B2FF7" />
        <path d="M34 20 L20 40 H31 L27 53 L45 32 H34 L39 20 Z" fill="#FFFFFF" />
        <text x="62" y="38" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#7B2FF7">
          instamart
        </text>
        <text x="63" y="54" fontFamily="Arial, sans-serif" fontSize="10" fill="#666">
          BY SWIGGY
        </text>
      </svg>
      <span className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
    </a>

    {/* Blinkit */}
    <a
      href="https://blinkit.com"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center gap-3 px-6 py-8 hover:bg-yellow-50/60 transition-colors duration-300"
    >
      <svg className="w-36 h-16" viewBox="0 0 200 80" fill="none">
        <rect x="8" y="12" width="48" height="48" rx="12" fill="#F8CB46" />
        <path d="M34 19 L21 39 H32 L27 53 L44 31 H33 L38 19 Z" fill="#173B32" />
        <text x="62" y="47" fontFamily="Arial, sans-serif" fontSize="31" fontWeight="bold" fill="#173B32">
          blinkit
        </text>
      </svg>
      <span className="text-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
    </a>

    {/* Nearby Retail & Kirana Stores */}
    <div className="sm:col-span-2 lg:col-span-2 flex items-center justify-center gap-5 px-6 py-8 bg-gradient-to-r from-green-50/50 to-white">
      <svg className="w-16 h-16 shrink-0" viewBox="0 0 64 64" fill="none">
        <rect x="9" y="24" width="46" height="33" rx="4" fill="#DCFCE7" stroke="#15803D" strokeWidth="2" />
        <path d="M6 24 L13 8 H51 L58 24 Z" fill="#16A34A" />
        <path d="M6 24 Q6 33 15 30 Q23 35 32 30 Q41 35 49 30 Q58 33 58 24" fill="#86EFAC" stroke="#15803D" strokeWidth="1.5" />
        <rect x="27" y="39" width="12" height="18" rx="1" fill="#FFFFFF" stroke="#15803D" strokeWidth="1.5" />
        <rect x="14" y="38" width="9" height="9" rx="1" fill="#FFFFFF" stroke="#15803D" strokeWidth="1.5" />
        <circle cx="45" cy="42" r="2" fill="#15803D" />
      </svg>

      <div className="text-left">
        <h3 className="text-lg md:text-xl font-extrabold text-green-800">
          Nearby Retail & Kirana Stores
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Find Vyshnavi at your trusted local stores.
        </p>
      </div>
    </div>

  </div>
</div>
      </div>

      {/* Ambient keyframes */}
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
}
