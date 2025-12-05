/**
 * Badge Calculator
 * Determines which badges the voter has earned
 */

export const calculateBadges = (voteCount, securityScore, votes = []) => {
  const badges = [];
  
  // 🎖 Verified Voter
  if (securityScore >= 70) {
    badges.push({
      id: 'verified_voter',
      name: 'Verified Voter',
      icon: '🎖',
      description: 'Face verification completed',
      color: 'from-neon-blue to-neon-purple',
      earned: true
    });
  }
  
  // 🏅 Regular Participant
  if (voteCount >= 3) {
    badges.push({
      id: 'regular_participant',
      name: 'Regular Participant',
      icon: '🏅',
      description: 'Participated in 3+ elections',
      color: 'from-neon-purple to-neon-pink',
      earned: true
    });
  }
  
  // 🌟 Early Voter
  const hasEarlyVote = votes.some(vote => {
    if (!vote.election?.start_date || !vote.vote_timestamp) return false;
    const electionStart = new Date(vote.election.start_date);
    const voteTime = new Date(vote.vote_timestamp);
    const hoursDiff = (voteTime - electionStart) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  });
  
  if (hasEarlyVote) {
    badges.push({
      id: 'early_voter',
      name: 'Early Voter',
      icon: '🌟',
      description: 'Voted within 24 hours of election start',
      color: 'from-yellow-400 to-orange-500',
      earned: true
    });
  }
  
  // 🛡 High Security Level
  if (securityScore >= 80) {
    badges.push({
      id: 'high_security',
      name: 'High Security Level',
      icon: '🛡',
      description: 'Security score above 80',
      color: 'from-green-400 to-emerald-500',
      earned: true
    });
  }
  
  // 🔥 Active Voter (voted in last 30 days)
  const recentVote = votes.some(vote => {
    if (!vote.vote_timestamp) return false;
    const voteDate = new Date(vote.vote_timestamp);
    const daysSince = (new Date() - voteDate) / (1000 * 60 * 60 * 24);
    return daysSince <= 30;
  });
  
  if (recentVote) {
    badges.push({
      id: 'active_voter',
      name: 'Active Voter',
      icon: '🔥',
      description: 'Voted in the last 30 days',
      color: 'from-red-400 to-pink-500',
      earned: true
    });
  }
  
  return badges;
};

export const getNextBadge = (voteCount, securityScore) => {
  if (securityScore < 70) {
    return {
      name: 'Verified Voter',
      requirement: 'Complete face verification and increase security score to 70+',
      progress: (securityScore / 70) * 100
    };
  }
  
  if (voteCount < 3) {
    return {
      name: 'Regular Participant',
      requirement: `Vote in ${3 - voteCount} more election${3 - voteCount > 1 ? 's' : ''}`,
      progress: (voteCount / 3) * 100
    };
  }
  
  if (securityScore < 80) {
    return {
      name: 'High Security Level',
      requirement: 'Increase security score to 80+',
      progress: (securityScore / 80) * 100
    };
  }
  
  return null;
};
