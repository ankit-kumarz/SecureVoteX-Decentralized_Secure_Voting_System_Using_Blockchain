import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api';
import CircularProgress from '../../widgets/CircularProgress';
import { calculateSecurityScore, getSecurityLevel, getSecurityRecommendations } from '../../utils/securityCalculator';

/**
 * Security Health Score Component
 * Displays user's security score with recommendations
 */
const SecurityHealthScore = () => {
  const { user } = useContext(AuthContext);
  const [biometricStatus, setBiometricStatus] = useState(null);
  const [voteCount, setVoteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    fetchSecurityData();
  }, []);
  
  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      
      // Fetch biometric status
      const bioRes = await API.get('/biometric/status');
      setBiometricStatus(bioRes.data);
      
      // Fetch vote count
      const voteRes = await API.get('/vote/my-count');
      setVoteCount(voteRes.data.totalVotes || 0);
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch security data:', err);
      setLoading(false);
    }
  };
  
  const securityScore = calculateSecurityScore(user, biometricStatus, voteCount > 0);
  const securityLevel = getSecurityLevel(securityScore);
  const recommendations = getSecurityRecommendations(user, biometricStatus);
  
  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/10 p-6 rounded-2xl border border-white/10 shadow-glow mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Security Health Score</h2>
            <p className="text-gray-400 text-sm">Your account security rating</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all text-sm"
        >
          {showDetails ? 'Hide' : 'View'} Details →
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Circular Progress */}
        <div className="flex-shrink-0">
          {loading ? (
            <div className="w-32 h-32 rounded-full bg-white/10 animate-pulse"></div>
          ) : (
            <CircularProgress 
              percentage={securityScore} 
              size={140}
              strokeWidth={10}
              color="auto"
              label="Score"
            />
          )}
        </div>
        
        {/* Score Details */}
        <div className="flex-1 text-center md:text-left">
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${securityLevel.bgColor} border border-white/20 mb-4`}>
            <span className={`${securityLevel.color} font-bold text-lg`}>
              {securityLevel.level}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            Your security is {securityLevel.level.toLowerCase()}
          </h3>
          <p className="text-gray-400">
            {securityScore >= 90 && "Excellent! Your account has maximum security protection."}
            {securityScore >= 70 && securityScore < 90 && "Good security setup. Consider completing remaining security steps."}
            {securityScore >= 50 && securityScore < 70 && "Your account has fair security. We recommend improving it."}
            {securityScore < 50 && "Your account security needs improvement. Please complete the steps below."}
          </p>
        </div>
      </div>
      
      {/* Security Breakdown */}
      {showDetails && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-lg font-bold text-white mb-4">Security Breakdown</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Face Verification */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${biometricStatus?.registered ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center`}>
                  {biometricStatus?.registered ? (
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-white font-semibold">Face Verification</p>
                  <p className="text-xs text-gray-400">30% of security score</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${biometricStatus?.registered ? 'text-green-400' : 'text-red-400'}`}>
                {biometricStatus?.registered ? '✓ Complete' : '✗ Pending'}
              </span>
            </div>
            
            {/* Wallet Connected */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${user?.wallet_address ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center`}>
                  {user?.wallet_address ? (
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-white font-semibold">Wallet Connected</p>
                  <p className="text-xs text-gray-400">20% of security score</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${user?.wallet_address ? 'text-green-400' : 'text-red-400'}`}>
                {user?.wallet_address ? '✓ Connected' : '✗ Not Connected'}
              </span>
            </div>
            
            {/* Email Verified */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${user?.email ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center`}>
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Email Verified</p>
                  <p className="text-xs text-gray-400">20% of security score</p>
                </div>
              </div>
              <span className="text-sm font-bold text-green-400">✓ Verified</span>
            </div>
            
            {/* No Suspicious Activity */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold">Account Activity</p>
                  <p className="text-xs text-gray-400">30% of security score</p>
                </div>
              </div>
              <span className="text-sm font-bold text-green-400">✓ Normal</span>
            </div>
          </div>
          
          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Recommendations</h4>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${
                      rec.priority === 'high' ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-bold text-white mb-1">{rec.title}</h5>
                        <p className="text-sm text-gray-400">{rec.description}</p>
                      </div>
                      <button className="ml-4 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-sm transition-all whitespace-nowrap">
                        {rec.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecurityHealthScore;
