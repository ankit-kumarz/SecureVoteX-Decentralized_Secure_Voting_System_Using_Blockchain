import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api';
import StatsCard from '../../widgets/StatsCard';

/**
 * Voting Insights Panel Component
 * Displays personalized voting statistics and overview
 */
const VotingInsightsPanel = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeElections, setActiveElections] = useState(null);
  const [biometricStatus, setBiometricStatus] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch vote statistics
      const voteRes = await API.get('/vote/my-count');
      setStats(voteRes.data);
      
      // Fetch active elections count
      const electionsRes = await API.get('/election/active-count');
      setActiveElections(electionsRes.data);
      
      // Fetch biometric status
      const bioRes = await API.get('/biometric/status');
      setBiometricStatus(bioRes.data);
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch voting insights:', err);
      setLoading(false);
    }
  };
  
  const calculateProfileCompletion = () => {
    let completion = 0;
    
    // Account info complete (25%)
    if (user?.email && user?.voter_id) completion += 25;
    
    // Wallet connected (25%)
    if (user?.wallet_address) completion += 25;
    
    // Face verified (25%)
    if (biometricStatus?.registered) completion += 25;
    
    // Voted at least once (25%)
    if (stats?.totalVotes > 0) completion += 25;
    
    return completion;
  };
  
  const formatLastVoteTime = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };
  
  return (
    <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow mb-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
            ⭐ Your Voting Overview
          </h2>
          <p className="text-gray-400 text-sm">Personalized insights and statistics</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Elections Participated */}
        <StatsCard
          title="Total Elections Participated"
          value={loading ? '...' : stats?.totalElections || 0}
          loading={loading}
          gradient="from-neon-blue to-neon-purple"
          icon={
            <svg className="w-7 h-7 text-neon-blue" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
            </svg>
          }
        />
        
        {/* Elections Pending */}
        <StatsCard
          title="Elections Pending"
          value={loading ? '...' : activeElections?.activeCount || 0}
          loading={loading}
          gradient="from-neon-purple to-neon-pink"
          subtitle={`${activeElections?.upcomingCount || 0} upcoming`}
          icon={
            <svg className="w-7 h-7 text-neon-purple" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
          }
        />
        
        {/* Face Verification Status */}
        <StatsCard
          title="Face Verification Status"
          value={loading ? '...' : (biometricStatus?.registered ? 'Verified ✓' : 'Pending')}
          loading={loading}
          gradient={biometricStatus?.registered ? 'from-green-400 to-emerald-500' : 'from-yellow-400 to-orange-500'}
          icon={
            <svg className="w-7 h-7 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          }
        />
        
        {/* Blockchain Wallet Linked */}
        <StatsCard
          title="Blockchain Wallet Linked"
          value={loading ? '...' : (user?.wallet_address ? 'Connected' : 'Not Connected')}
          loading={loading}
          gradient={user?.wallet_address ? 'from-neon-aqua to-blue-500' : 'from-gray-400 to-gray-600'}
          subtitle={user?.wallet_address ? `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}` : null}
          icon={
            <svg className="w-7 h-7 text-neon-aqua" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
            </svg>
          }
        />
        
        {/* Last Vote Time */}
        <StatsCard
          title="Last Vote Time"
          value={loading ? '...' : formatLastVoteTime(stats?.lastVoteTime)}
          loading={loading}
          gradient="from-neon-pink to-red-500"
          icon={
            <svg className="w-7 h-7 text-neon-pink" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
          }
        />
        
        {/* Profile Completion */}
        <StatsCard
          title="Profile Completion"
          value={loading ? '...' : `${calculateProfileCompletion()}%`}
          loading={loading}
          gradient="from-purple-400 to-pink-500"
          icon={
            <svg className="w-7 h-7 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
            </svg>
          }
        />
      </div>
    </div>
  );
};

export default VotingInsightsPanel;
