import React from 'react';

/**
 * Reusable Stats Card Component
 * Used for displaying statistics with icons
 */
const StatsCard = ({ 
  title, 
  value, 
  icon, 
  gradient = 'from-neon-blue to-neon-purple',
  iconBg = 'bg-neon-blue/20',
  loading = false,
  subtitle = null,
  onClick = null
}) => {
  return (
    <div 
      className={`backdrop-blur-xl bg-white/5 p-6 rounded-xl border border-white/10 shadow-glow hover:shadow-neon-blue transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-white/10 rounded animate-pulse"></div>
          ) : (
            <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {value}
            </p>
          )}
          {subtitle && (
            <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        
        {icon && (
          <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
