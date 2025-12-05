import React, { useState, useEffect } from 'react';
import API from '../../api';
import TimelineItem from '../../widgets/TimelineItem';

/**
 * Activity Timeline Component
 * Displays user's activity history in a timeline format
 */
const ActivityTimeline = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchActivityTimeline();
  }, []);
  
  const fetchActivityTimeline = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/vote/activity-timeline');
      setActivities(res.data.activities || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch activity timeline:', err);
      setError('Failed to load activity history');
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow mb-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-aqua rounded-xl flex items-center justify-center mr-4 animate-pulse">
            <div className="w-6 h-6 bg-white/20 rounded"></div>
          </div>
          <div>
            <div className="h-6 w-48 bg-white/10 rounded mb-2"></div>
            <div className="h-4 w-64 bg-white/10 rounded"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white/5 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow mb-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-aqua rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-pink via-neon-aqua to-neon-blue bg-clip-text text-transparent">
              📅 Your Activity Timeline
            </h2>
            <p className="text-gray-400 text-sm">Complete history of your account activities</p>
          </div>
        </div>
        
        <span className="px-3 py-1 bg-neon-blue/20 border border-neon-blue/30 rounded-full text-sm font-medium text-neon-blue">
          {activities.length} {activities.length === 1 ? 'Activity' : 'Activities'}
        </span>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-neon-pink/20 to-neon-aqua/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p className="text-gray-400 text-lg">No activities yet</p>
          <p className="text-gray-500 text-sm mt-2">Your activity history will appear here</p>
        </div>
      ) : (
        <div className="mt-6">
          {activities.map((activity, index) => (
            <TimelineItem 
              key={index} 
              activity={activity} 
              isLast={index === activities.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
