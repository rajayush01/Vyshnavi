import React from 'react';

export default function AlsoAvailableSection() {
  return (
    <div className="w-full bg-[#e0f2fe] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">
          Also <span className="font-extrabold">Available</span> on:
        </h2>

        {/* Logos Container */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
          {/* Amazon Logo */}
          <a
            href="https://www.amazon.in"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <svg
              className="w-48 h-24 md:w-56 md:h-28"
              viewBox="0 0 200 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Amazon text */}
              <text
                x="10"
                y="50"
                fontFamily="Arial, sans-serif"
                fontSize="42"
                fontWeight="bold"
                fill="#000000"
              >
                amazon
              </text>
              {/* Smile arrow */}
              <path
                d="M60 62 Q100 72 140 62"
                stroke="#FF9900"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              {/* Arrow head */}
              <path
                d="M135 58 L140 62 L136 66"
                stroke="#FF9900"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          {/* Swiggy Logo */}
          <a
            href="https://www.swiggy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <svg
              className="w-48 h-24 md:w-56 md:h-28"
              viewBox="0 0 200 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Location pin icon */}
              <g transform="translate(10, 15)">
                <path
                  d="M20 0 C9 0 0 9 0 20 C0 35 20 50 20 50 C20 50 40 35 40 20 C40 9 31 0 20 0 Z"
                  fill="#FC8019"
                />
                <circle cx="20" cy="18" r="8" fill="white" />
              </g>
              {/* SWIGGY text */}
              <text
                x="65"
                y="48"
                fontFamily="Arial, sans-serif"
                fontSize="32"
                fontWeight="bold"
                fill="#FC8019"
                letterSpacing="2"
              >
                SWIGGY
              </text>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}