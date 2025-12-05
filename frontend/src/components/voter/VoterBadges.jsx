import React, { useState, useEffect } from 'react';
import API from '../../api';
import BadgeItem from '../../widgets/BadgeItem';
import { calculateBadges, getNextBadge } from '../../utils/badgeCalculator';

/**
 * Voter Badges Component
 * Displays earned badges and gamification elements
 */
const VoterBadges = () => {
  const [voteCount, setVoteCount] = useState(0);
  const [securityScore, setSecurityScore] = useState(0);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchBadgeData();
  }, []);
  
  const fetchBadgeData = async () => {
    try {
      setLoading(true);
      
      // Fetch vote count
      const voteRes = await API.get('/vote/my-count');
      setVoteCount(voteRes.data.totalVotes || 0);
      
      // Fetch detailed votes for early voter badge
      const votesRes = await API.get('/vote/my-votes');
      setVotes(votesRes.data.votes || []);
      
      // Calculate security score (simplified - can use actual calculation)
      const bioRes = await API.get('/biometric/status');
      const bio = bioRes.data;
      let score = 0;
      if (bio?.registered) score += 30;
      score += 50; // Assume email + wallet + activity = 70
      setSecurityScore(score);
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch badge data:', err);
      setLoading(false);
    }
  };
  
  const badges = calculateBadges(voteCount, securityScore, votes);
  const nextBadge = getNextBadge(voteCount, securityScore);
  
  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 rounded-2xl border border-purple-500/30 shadow-glow mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <span className="text-2xl">🏆</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Your Badges
            </h2>
            <p className="text-gray-400 text-sm">Achievements and milestones</p>
          </div>
        </div>
        
        <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-sm font-medium text-yellow-400">
          {badges.length} Earned
        </span>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      ) : (
        <>
          {/* Earned Badges */}
          {badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6">
              {badges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center">
                  <BadgeItem badge={badge} size="md" />
                  <p className="text-white text-sm font-semibold mt-2 text-center">{badge.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎖</span>
              </div>
              <p className="text-gray-400 text-lg">No badges earned yet</p>
              <p className="text-gray-500 text-sm mt-2">Complete activities to earn your first badge!</p>
            </div>
          )}
          
          {/* Next Badge Progress */}
          {nextBadge && (
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-3">Next Badge to Earn</h3>
              <div className="backdrop-blur-xl bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white">{nextBadge.name}</h4>
                    <p className="text-sm text-gray-400">{nextBadge.requirement}</p>
                  </div>
                  <span className="text-lg font-bold text-yellow-400">{Math.round(nextBadge.progress)}%</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                    style={{ width: `${nextBadge.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          
          {/* All Available Badges */}
          <div className="pt-6 border-t border-white/10 mt-6">
            <h3 className="text-lg font-bold text-white mb-3">All Available Badges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: '🎖', name: 'Verified Voter', desc: 'Complete face verification', req: 'Security score 70+' },
                { icon: '🏅', name: 'Regular Participant', desc: 'Vote in multiple elections', req: '3+ elections' },
                { icon: '🌟', name: 'Early Voter', desc: 'Vote within 24 hours', req: 'Vote early once' },
                { icon: '🛡', name: 'High Security', desc: 'Maintain high security', req: 'Security score 80+' },
                { icon: '🔥', name: 'Active Voter', desc: 'Stay engaged', req: 'Vote in last 30 days' }
              ].map((badge, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-3xl">{badge.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm">{badge.name}</h4>
                    <p className="text-xs text-gray-400">{badge.desc}</p>
                    <p className="text-xs text-gray-500 mt-1">Requirement: {badge.req}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VoterBadges;
