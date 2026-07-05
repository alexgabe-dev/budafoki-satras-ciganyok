import React from 'react';

export default function StringLights() {
  // Array of bulbs with different warm colors
  const colors = [
    '#FFF1D0', // Cream
    '#F2C98B', // Sand/Yellow
    '#D9793D', // Orange
    '#2F9EAA', // Turquoise
    '#FFF1D0', 
    '#F2C98B', 
    '#D9793D',
    '#FFF1D0',
    '#F2C98B',
    '#2F9EAA',
    '#D9793D',
    '#FFF1D0',
  ];

  return (
    <div className="relative w-full h-8 overflow-visible select-none pointer-events-none z-20">
      {/* Wire curve */}
      <svg className="absolute top-0 left-0 w-full h-8" preserveAspectRatio="none" viewBox="0 0 100 10">
        <path 
          d="M 0,0 Q 12.5,8 25,2 Q 37.5,8 50,2 Q 62.5,8 75,2 Q 87.5,8 100,0" 
          fill="none" 
          stroke="#3A2418" 
          strokeWidth="0.4"
        />
      </svg>
      
      {/* Little light bulbs hanging at intervals */}
      <div className="absolute top-0 left-0 w-full h-full flex justify-between px-[4%]">
        {colors.map((color, i) => {
          // Add some horizontal and vertical offsets to match the wave curve of the wire
          const offsets = [
            'translate-y-[2px]',  // 0%
            'translate-y-[4px]',  // 8%
            'translate-y-[5px]',  // 16%
            'translate-y-[4px]',  // 25%
            'translate-y-[2px]',  // 33%
            'translate-y-[4px]',  // 41%
            'translate-y-[5px]',  // 50%
            'translate-y-[4px]',  // 58%
            'translate-y-[2px]',  // 66%
            'translate-y-[4px]',  // 75%
            'translate-y-[5px]',  // 83%
            'translate-y-[4px]',  // 91%
            'translate-y-[2px]',  // 100%
          ];
          const offsetClass = offsets[i % offsets.length];

          return (
            <div 
              key={i} 
              className={`flex flex-col items-center ${offsetClass}`}
            >
              {/* Socket */}
              <div className="w-[6px] h-[4px] bg-[#3A2418] rounded-t-sm"></div>
              {/* Bulb */}
              <div 
                className="bulb w-[10px] h-[12px] rounded-full" 
                style={{ 
                  backgroundColor: color,
                  boxShadow: `0 0 8px 1px ${color}`
                }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
