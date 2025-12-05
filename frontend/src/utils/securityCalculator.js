/**
 * Security Score Calculator
 * Calculates user security score based on various factors
 */

export const calculateSecurityScore = (user, biometricStatus, hasVoted) => {
  let score = 0;
  
  // Face verification completed (30%)
  if (biometricStatus?.registered === true) {
    score += 30;
  }
  
  // Wallet connected (20%)
  if (user?.wallet_address && user.wallet_address.length > 0) {
    score += 20;
  }
  
  // Email verified / OTP enabled (20%)
  // Assuming if user has email, they verified it during registration
  if (user?.email && user.email.length > 0) {
    score += 20;
  }
  
  // No suspicious activity (30%)
  // For now, default to true - can be enhanced with actual monitoring
  score += 30;
  
  return Math.min(score, 100);
};

export const getSecurityLevel = (score) => {
  if (score >= 90) return { level: 'Excellent', color: 'text-green-400', bgColor: 'bg-green-500/20' };
  if (score >= 70) return { level: 'Good', color: 'text-neon-blue', bgColor: 'bg-neon-blue/20' };
  if (score >= 50) return { level: 'Fair', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
  return { level: 'Needs Improvement', color: 'text-red-400', bgColor: 'bg-red-500/20' };
};

export const getSecurityRecommendations = (user, biometricStatus) => {
  const recommendations = [];
  
  if (!biometricStatus?.registered) {
    recommendations.push({
      title: 'Complete Face Verification',
      description: 'Verify your identity to secure your votes',
      action: 'Verify Now',
      priority: 'high'
    });
  }
  
  if (!user?.wallet_address) {
    recommendations.push({
      title: 'Connect Blockchain Wallet',
      description: 'Link your MetaMask wallet for blockchain voting',
      action: 'Connect Wallet',
      priority: 'medium'
    });
  }
  
  return recommendations;
};
