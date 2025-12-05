import React, { useState, useEffect } from 'react';
import { 
  connectWallet, 
  voteOnBlockchain, 
  hasVotedOnBlockchain,
  getCurrentAccount,
  onAccountChange 
} from '../utils/blockchain';
import axios from 'axios';

const BlockchainVotingExample = ({ electionId, candidates }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    // Check if wallet is already connected
    checkWalletConnection();
    
    // Listen for account changes
    onAccountChange((account) => {
      setWalletAddress(account);
      if (account) {
        checkVotingStatus(account);
      }
    });
  }, []);

  const checkWalletConnection = async () => {
    const account = await getCurrentAccount();
    if (account) {
      setWalletAddress(account);
      checkVotingStatus(account);
    }
  };

  const checkVotingStatus = async (address) => {
    try {
      const voted = await hasVotedOnBlockchain(electionId, address);
      setHasVoted(voted);
    } catch (error) {
      console.error('Error checking vote status:', error);
    }
  };

  const handleConnectWallet = async () => {
    try {
      setLoading(true);
      const address = await connectWallet();
      setWalletAddress(address);
      await checkVotingStatus(address);
      alert(`Wallet connected: ${address.substring(0, 6)}...${address.substring(38)}`);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    if (!selectedCandidate) {
      alert('Please select a candidate');
      return;
    }

    if (hasVoted) {
      alert('You have already voted in this election');
      return;
    }

    try {
      setLoading(true);

      // Step 1: Cast vote on blockchain
      console.log('Casting vote on blockchain...');
      const blockchainResult = await voteOnBlockchain(electionId, selectedCandidate);
      
      console.log('Blockchain transaction:', blockchainResult.txHash);
      setTxHash(blockchainResult.txHash);

      // Step 2: Record vote in database (with tx_hash)
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/vote',
        {
          election_id: electionId,
          candidate_id: selectedCandidate,
          tx_hash: blockchainResult.txHash
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Vote recorded in database:', response.data);

      alert(`✅ Vote cast successfully!\nTransaction: ${blockchainResult.txHash}`);
      
      // Update UI
      setHasVoted(true);
      setSelectedCandidate(null);

    } catch (error) {
      console.error('Voting error:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blockchain-voting-container p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Blockchain Voting</h2>

      {/* Wallet Connection Section */}
      <div className="wallet-section mb-6 p-4 bg-gray-100 rounded">
        {!walletAddress ? (
          <button
            onClick={handleConnectWallet}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Connecting...' : '🔗 Connect MetaMask Wallet'}
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected Wallet:</p>
              <p className="font-mono text-lg font-semibold">
                {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
              </p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              ✓ Connected
            </span>
          </div>
        )}
      </div>

      {/* Voting Status */}
      {walletAddress && (
        <div className="status-section mb-6">
          {hasVoted ? (
            <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
              <p className="text-yellow-800 font-semibold">
                ⚠️ You have already voted in this election
              </p>
            </div>
          ) : (
            <div className="p-4 bg-green-100 border border-green-300 rounded">
              <p className="text-green-800 font-semibold">
                ✅ You are eligible to vote
              </p>
            </div>
          )}
        </div>
      )}

      {/* Candidates Selection */}
      {walletAddress && !hasVoted && (
        <div className="candidates-section mb-6">
          <h3 className="text-xl font-semibold mb-3">Select Candidate:</h3>
          <div className="space-y-3">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedCandidate === candidate.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    checked={selectedCandidate === candidate.id}
                    onChange={() => setSelectedCandidate(candidate.id)}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold text-lg">{candidate.name}</p>
                    <p className="text-sm text-gray-600">{candidate.party}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vote Button */}
      {walletAddress && !hasVoted && (
        <button
          onClick={handleVote}
          disabled={loading || !selectedCandidate}
          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Transaction...
            </span>
          ) : (
            '🗳️ Cast Vote on Blockchain'
          )}
        </button>
      )}

      {/* Transaction Hash Display */}
      {txHash && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-gray-600 mb-1">Transaction Hash:</p>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-blue-600 hover:underline break-all"
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  );
};

export default BlockchainVotingExample;
