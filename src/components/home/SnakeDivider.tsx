import React from 'react';

const SnakeDivider = ({ color = "#e5e7eb", className = "" }) => {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="w-full h-14 sm:h-16 block"
        aria-hidden="true"
      >
        <path
          d="M0,64 Q180,24 360,64 T720,64 T1080,64 T1440,64 L1440,120 L0,120 Z"
          fill={color}
          opacity="0.6"
        />
        <path
          d="M0,60 Q180,20 360,60 T720,60 T1080,60 T1440,60 L1440,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default SnakeDivider;