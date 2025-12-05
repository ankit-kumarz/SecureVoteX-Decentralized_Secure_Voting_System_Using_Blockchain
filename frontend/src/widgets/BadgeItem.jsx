import React from 'react';

/**
 * Badge Item Component
 * Used for displaying earned badges
 */
const BadgeItem = ({ badge, size = 'md' }) => {
  const sizes = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-20 h-20 text-3xl',
    lg: 'w-24 h-24 text-4xl'
  };
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  return (
    <div className="group relative">
      {/* Badge Circle */}
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${badge.color} p-1 shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer`}>
        <div className="w-full h-full rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center">
          <span className="filter drop-shadow-lg">{badge.icon}</span>
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        <div className="backdrop-blur-xl bg-navy-900/95 border border-white/20 rounded-lg p-3 shadow-2xl min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{badge.icon}</span>
            <h4 className={`font-bold text-white ${textSizes[size]}`}>{badge.name}</h4>
          </div>
          <p className="text-xs text-gray-400">{badge.description}</p>
          
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-navy-900/95"></div>
          </div>
        </div>
      </div>
      
      {/* Glow effect */}
      {badge.earned && (
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${badge.color} opacity-30 blur-lg -z-10 animate-pulse`}></div>
      )}
    </div>
  );
};

export default BadgeItem;
