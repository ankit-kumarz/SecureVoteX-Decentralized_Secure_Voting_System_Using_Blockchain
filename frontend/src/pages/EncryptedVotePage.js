import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { encryptVote, createVotePayload } from '../utils/voteEncryption';
import ReceiptCard from '../components/Receipt/ReceiptCard';
import LanguageSwitcher from '../components/Settings/LanguageSwitcher';
import ThemeToggle from '../components/Settings/ThemeToggle';
import FaceVerificationModal from '../components/FaceVerificationModal';

const EncryptedVotePage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);

  useEffect(() => {
    loadElectionData();
  }, [id]);

  const loadElectionData = async () => {
    try {
      setLoading(true);
      
      // Load election details
      const electionRes = await API.get(`/elections`);
      const electionData = electionRes.data.find(e => e.id === parseInt(id));
      setElection(electionData);

      // Load candidates
      const candidatesRes = await API.get(`/candidates/${id}`);
      setCandidates(candidatesRes.data);

      // Load election public key
      const keyRes = await API.get(`/encrypted-vote/election/${id}/public-key`);
      setPublicKey(keyRes.data.publicKey);

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load election data');
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      setError('Please select a candidate');
      return;
    }

    if (!publicKey) {
      setError('Encryption key not available');
      return;
    }

    // Trigger face verification before voting
    setShowFaceVerification(true);
  };

  const handleVerificationSuccess = async () => {
    setFaceVerified(true);
    setShowFaceVerification(false);
    
    // Proceed with actual vote submission
    await submitVote();
  };

  const handleVerificationFailed = () => {
    setError('Face verification failed. Please try again.');
    setShowFaceVerification(false);
  };

  const submitVote = async () => {
    try {
      setVoting(true);
      setError('');

      // Create vote payload
      const votePayload = createVotePayload(
        selectedCandidate.id,
        parseInt(id),
        user.voter_id
      );

      // Encrypt vote
      const encrypted = await encryptVote(votePayload, publicKey);

      // Combine encrypted data
      const encryptedVoteData = JSON.stringify({
        encryptedVote: encrypted.encryptedVote,
        encryptedKey: encrypted.encryptedKey,
        iv: encrypted.iv,
        algorithm: encrypted.algorithm
      });

      // Submit encrypted vote
      const response = await API.post('/encrypted-vote/encrypted', {
        electionId: parseInt(id),
        candidateId: selectedCandidate.id,
        encryptedVote: encryptedVoteData
      });

      // Show receipt
      setReceipt({
        ...response.data,
        electionTitle: election.title
      });
      setShowReceipt(true);
      setVoting(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote');
      setVoting(false);
    }
  };

  const verifyReceipt = async (receiptHash) => {
    try {
      const response = await API.get(`/encrypted-vote/receipt/${receiptHash}/verify`);
      alert(JSON.stringify(response.data, null, 2));
    } catch (err) {
      alert('Verification failed: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue mb-4 mx-auto"></div>
          <p className="text-gray-400">Loading election...</p>
        </div>
      </div>
    );
  }

  if (showReceipt && receipt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 p-6">
        <div className="max-w-2xl mx-auto">
          <ReceiptCard 
            receipt={receipt} 
            electionTitle={election?.title}
            onVerify={verifyReceipt}
          />
          <button
            onClick={() => navigate('/voter')}
            className="w-full mt-4 py-3 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 p-6">
      <div className="absolute top-20 left-20 w-96 h-96 bg-neon-blue opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
            {election?.title}
          </h1>
          <p className="text-gray-400 mt-2">{election?.description}</p>
          <div className="flex items-center mt-4 text-sm text-gray-400">
            <svg className="w-5 h-5 mr-2 text-neon-aqua" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            End-to-End Encrypted Voting
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {/* Candidates */}
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Select Your Candidate</h2>
          {candidates.map(candidate => (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate)}
              className={`backdrop-blur-xl bg-white/5 p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                selectedCandidate?.id === candidate.id
                  ? 'border-neon-blue shadow-neon-blue scale-105'
                  : 'border-white/10 hover:border-neon-purple/50 hover:shadow-glow'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {candidate.image && (
                    <img 
                      src={candidate.image.startsWith('http') ? candidate.image : `${process.env.REACT_APP_API_URL}${candidate.image}`}
                      alt={candidate.name} 
                      className="w-20 h-20 object-cover rounded-xl mr-4 border-2 border-neon-purple/30 shadow-lg"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  {!candidate.image && (
                    <div className="w-20 h-20 rounded-xl mr-4 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border-2 border-white/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
                    <p className="text-neon-aqua">{candidate.party}</p>
                    {candidate.manifesto && (
                      <p className="text-gray-400 text-sm mt-1">{candidate.manifesto}</p>
                    )}
                  </div>
                </div>
                {selectedCandidate?.id === candidate.id && (
                  <div className="w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Vote Button */}
        <button
          onClick={handleVote}
          disabled={!selectedCandidate || voting}
          className={`w-full py-4 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink text-white font-semibold rounded-xl transition-all duration-300 ${
            selectedCandidate && !voting
              ? 'shadow-neon-purple hover:shadow-neon-pink hover:scale-105'
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          {voting ? 'Encrypting & Submitting Vote...' : faceVerified ? 'Cast Encrypted Vote' : 'Verify Face & Vote'}
        </button>
      </div>

      {/* Face Verification Modal */}
      <FaceVerificationModal
        isOpen={showFaceVerification}
        onClose={() => setShowFaceVerification(false)}
        onVerified={handleVerificationSuccess}
        onFailed={handleVerificationFailed}
      />
    </div>
  );
};

export default EncryptedVotePage;
