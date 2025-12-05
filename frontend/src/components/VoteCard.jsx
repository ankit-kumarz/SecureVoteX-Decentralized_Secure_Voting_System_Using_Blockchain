import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * VoteCard Component - Beautiful vote display card
 * Shows election, candidate, and transaction details with neon glow theme
 */
const VoteCard = ({ vote, onViewDetails }) => {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  return (
    <div className="relative group">
      {/* Glowing border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-2xl opacity-30 group-hover:opacity-60 blur transition-all duration-300"></div>
      
      {/* Card content */}
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-navy-900/90 via-navy-800/90 to-navy-700/90 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
        
        {/* Header - Election Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{vote.election.title}</h3>
                <p className="text-sm text-gray-400">{vote.election.description}</p>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-400">Recorded</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>

        {/* Candidate Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
              {vote.candidate.image ? (
                <img 
                  src={`http://localhost:5000${vote.candidate.image}`} 
                  alt={vote.candidate.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neon-pink to-neon-aqua flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {vote.candidate.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-navy-900 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-bold text-white mb-1">{vote.candidate.name}</h4>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-neon-blue/20 border border-neon-blue/50 rounded text-xs font-medium text-neon-blue">
                {vote.candidate.party}
              </span>
              <span className="text-sm text-gray-400">{vote.candidate.manifesto}</span>
            </div>
          </div>
        </div>

        {/* Vote Details */}
        <div className="space-y-2 mb-4">
          {/* Timestamp */}
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-gray-400">Voted on:</span>
            <span className="text-white font-medium">{formatDate(vote.vote_timestamp)}</span>
          </div>

          {/* Transaction Hash */}
          {vote.tx_hash && (
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span className="text-gray-400">Tx Hash:</span>
              <code className="text-neon-aqua font-mono text-xs">{truncateHash(vote.tx_hash)}</code>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(vote.tx_hash);
                }}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Copy transaction hash"
              >
                <svg className="w-3 h-3 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onViewDetails}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink text-white font-semibold rounded-lg hover:shadow-neon-purple transition-all duration-300 hover:scale-105"
          >
            View Receipt
          </button>
          
          <button
            onClick={() => navigate(`/voter/results/${vote.election.election_id}`)}
            className="flex-1 py-2 px-4 bg-white/5 border border-neon-aqua/30 text-neon-aqua font-semibold rounded-lg hover:bg-neon-aqua/10 transition-all duration-300 hover:scale-105"
          >
            View Results
          </button>
          
          {vote.receipt_hash && (
            <button className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-lg hover:bg-white/10 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoteCard;
