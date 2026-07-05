import React from 'react';

export default function FlagGarland() {
  const flags = [
    { color: 'bg-turquoise', tilt: '-rotate-3 translate-y-[1px]' },
    { color: 'bg-orange', tilt: 'rotate-2 -translate-y-[1px]' },
    { color: 'bg-sand', tilt: '-rotate-1 translate-y-[2px]' },
    { color: 'bg-olive', tilt: 'rotate-3 translate-y-[0px]' },
    { color: 'bg-cream', tilt: '-rotate-2 -translate-y-[2px]' },
    { color: 'bg-orange', tilt: 'rotate-1 translate-y-[1px]' },
    { color: 'bg-turquoise', tilt: '-rotate-4 translate-y-[2px]' },
    { color: 'bg-sand', tilt: 'rotate-2 -translate-y-[1px]' },
    { color: 'bg-olive', tilt: '-rotate-1 translate-y-[3px]' },
    { color: 'bg-cream', tilt: 'rotate-3 translate-y-[0px]' },
    { color: 'bg-orange', tilt: '-rotate-2 translate-y-[1px]' },
    { color: 'bg-turquoise', tilt: 'rotate-1 -translate-y-[2px]' },
    { color: 'bg-sand', tilt: '-rotate-3 translate-y-[2px]' },
    { color: 'bg-olive', tilt: 'rotate-4 translate-y-[0px]' },
    { color: 'bg-cream', tilt: '-rotate-1 -translate-y-[1px]' },
    { color: 'bg-orange', tilt: 'rotate-2 translate-y-[1px]' },
  ];

  return (
    <div className="relative w-full h-10 overflow-hidden select-none pointer-events-none z-10 flex justify-between px-2">
      {/* Curved string background */}
      <svg className="absolute top-0 left-0 w-full h-10" preserveAspectRatio="none" viewBox="0 0 100 10">
        <path 
          d="M 0,1 Q 25,6 50,2 Q 75,6 100,1" 
          fill="none" 
          stroke="#3A2418" 
          strokeWidth="0.5"
          strokeDasharray="1,1"
        />
      </svg>

      <div className="w-full flex justify-between gap-1 md:gap-2">
        {flags.map((flag, idx) => (
          <div
            key={idx}
            className={`w-full aspect-[2/3] max-w-[40px] ${flag.color} ${flag.tilt} retro-border transition-transform`}
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              borderTop: 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
