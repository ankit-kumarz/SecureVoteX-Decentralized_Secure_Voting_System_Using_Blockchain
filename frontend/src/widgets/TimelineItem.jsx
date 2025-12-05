import React from 'react';
import { formatDistanceToNow } from 'date-fns';

/**
 * Timeline Item Component
 * Used for displaying activity timeline events
 */
const TimelineItem = ({ activity, isLast = false }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'account_created':
        return (
          <svg className="w-5 h-5 text-neon-blue" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
          </svg>
        );
      case 'face_verified':
        return (
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        );
      case 'vote_cast':
        return (
          <svg className="w-5 h-5 text-neon-purple" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        );
      case 'wallet_connected':
        return (
          <svg className="w-5 h-5 text-neon-aqua" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
        );
    }
  };
  
  const getBgColor = (type) => {
    switch (type) {
      case 'account_created': return 'bg-neon-blue/20 border-neon-blue/30';
      case 'face_verified': return 'bg-green-500/20 border-green-500/30';
      case 'vote_cast': return 'bg-neon-purple/20 border-neon-purple/30';
      case 'wallet_connected': return 'bg-neon-aqua/20 border-neon-aqua/30';
      default: return 'bg-white/10 border-white/20';
    }
  };
  
  return (
    <div className="relative pl-8 pb-8">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[15px] top-[32px] w-0.5 h-full bg-gradient-to-b from-white/20 to-transparent"></div>
      )}
      
      {/* Icon */}
      <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-2 ${getBgColor(activity.type)} flex items-center justify-center`}>
        {getIcon(activity.type)}
      </div>
      
      {/* Content */}
      <div className="backdrop-blur-xl bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-white">{activity.description}</h4>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
          </span>
        </div>
        
        {activity.electionId && (
          <p className="text-sm text-gray-400">Election ID: #{activity.electionId}</p>
        )}
        
        <p className="text-xs text-gray-500 mt-2">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TimelineItem;
