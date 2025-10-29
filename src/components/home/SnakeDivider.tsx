import React from 'react';

const SnakeDivider = ({ color = "#e5e7eb", className = "" }) => {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="w-full h-16 block"
        aria-hidden="true"
      >
        <path
          d="M0,60 Q180,20 360,60 T720,60 T1080,60 T1440,60 L1440,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default SnakeDivider;