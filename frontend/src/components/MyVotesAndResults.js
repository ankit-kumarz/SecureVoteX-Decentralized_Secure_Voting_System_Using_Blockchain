import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import VoteCard from './VoteCard';
import VoteDetailsModal from './VoteDetailsModal';

const MyVotesAndResults = ({ showReceiptModal, setShowReceiptModal }) => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVote, setSelectedVote] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('/vote/my-votes');
      setVotes(res.data.votes || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch votes:', err);
      setError(err.response?.data?.message || 'Failed to load vote history');
      setLoading(false);
    }
  };

  const handleViewDetails = (vote) => {
    setSelectedVote(vote);
    setShowReceiptModal(true);
  };

  const handleCloseModal = () => {
    setShowReceiptModal(false);
    setSelectedVote(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue mb-3 mx-auto"></div>
          <p className="text-gray-400">Loading your votes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchVotes}
          className="mt-4 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
            My Votes & Results
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {votes.length === 0 ? 'No votes yet' : `${votes.length} vote${votes.length !== 1 ? 's' : ''} recorded`}
          </p>
        </div>
        
        {votes.length > 0 && (
          <button
            onClick={fetchVotes}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Refresh"
          >
            <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        )}
      </div>

      {/* Vote Cards */}
      {votes.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p className="text-gray-400 text-lg">You haven't cast any votes yet</p>
          <p className="text-gray-500 text-sm mt-2">Your voting history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {votes.map((vote) => (
            <VoteCard
              key={vote.vote_id}
              vote={vote}
              onViewDetails={() => handleViewDetails(vote)}
            />
          ))}
        </div>
      )}

      {/* Vote Details Modal */}
      <VoteDetailsModal
        isOpen={showReceiptModal}
        onClose={handleCloseModal}
        vote={selectedVote}
      />
    </div>
  );
};

export default MyVotesAndResults;
