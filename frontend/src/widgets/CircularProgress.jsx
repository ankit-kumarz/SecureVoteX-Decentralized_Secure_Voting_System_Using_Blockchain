import React from 'react';

/**
 * Circular Progress Component
 * Used for displaying security score and other percentages
 */
const CircularProgress = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8,
  color = '#3b82f6',
  label = '',
  sublabel = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const getColor = () => {
    if (percentage >= 90) return '#10b981'; // green
    if (percentage >= 70) return '#3b82f6'; // blue
    if (percentage >= 50) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };
  
  const finalColor = color === 'auto' ? getColor() : color;
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={finalColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${finalColor})`
          }}
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{Math.round(percentage)}</span>
        {label && (
          <span className="text-xs text-gray-400 mt-1">{label}</span>
        )}
        {sublabel && (
          <span className="text-xs text-gray-500">{sublabel}</span>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;
