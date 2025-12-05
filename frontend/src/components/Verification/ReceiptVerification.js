import React, { useState } from 'react';
import API from '../../api';

const ReceiptVerification = () => {
  const [receiptHash, setReceiptHash] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!receiptHash.trim()) {
      setError('Please enter a receipt hash');
      return;
    }

    try {
      setVerifying(true);
      setError('');
      setResult(null);

      const response = await API.get(`/encrypted-vote/receipt/${receiptHash}/verify`);
      setResult(response.data);
      setVerifying(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      setVerifying(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-glow">
      <div className="flex items-center mb-6">
        <svg className="w-8 h-8 mr-3 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h2 className="text-2xl font-bold text-white">Verify Vote Receipt</h2>
      </div>

      <p className="text-gray-400 mb-6">
        Enter your receipt hash to verify that your vote was recorded correctly on the blockchain.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Receipt Hash
          </label>
          <input
            type="text"
            value={receiptHash}
            onChange={(e) => setReceiptHash(e.target.value)}
            placeholder="Enter 64-character hash from your receipt"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:shadow-neon-blue transition-all"
          />
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-lg font-bold text-green-400">Receipt Verified!</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Election:</span>
                <span className="text-white font-medium">{result.election_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vote Time:</span>
                <span className="text-white font-medium">
                  {new Date(result.voted_at).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Receipt Hash:</span>
                <span className="text-neon-aqua font-mono text-xs break-all">
                  {result.receipt_hash}
                </span>
              </div>
              {result.blockchain_tx && (
                <div className="mt-4">
                  <a
                    href={`https://sepolia.etherscan.io/tx/${result.blockchain_tx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-neon-blue hover:text-neon-purple transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                    View on Etherscan
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={verifying || !receiptHash.trim()}
          className={`w-full py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold rounded-xl transition-all duration-300 ${
            verifying || !receiptHash.trim()
              ? 'opacity-50 cursor-not-allowed'
              : 'shadow-neon-blue hover:shadow-neon-purple hover:scale-105'
          }`}
        >
          {verifying ? 'Verifying...' : 'Verify Receipt'}
        </button>
      </div>
    </div>
  );
};

export default ReceiptVerification;
