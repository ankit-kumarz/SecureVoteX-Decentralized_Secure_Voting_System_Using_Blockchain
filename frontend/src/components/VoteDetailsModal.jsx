import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';

/**
 * VoteDetailsModal Component - Full vote receipt modal
 * Displays complete vote information with download and blockchain explorer options
 */
const VoteDetailsModal = ({ isOpen, onClose, vote }) => {
  const receiptRef = useRef(null);
  const [copied, setCopied] = useState(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !vote) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `vote-receipt-${vote.vote_id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(options).from(receiptRef.current).save();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to download receipt. Please try again.');
    }
  };

  const viewOnExplorer = () => {
    if (vote.tx_hash) {
      // Assuming Sepolia testnet - update if using different network
      window.open(`https://sepolia.etherscan.io/tx/${vote.tx_hash}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-[95%] md:w-[80%] lg:w-[70%] max-w-4xl">
        {/* Glowing background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-3xl opacity-40 blur-xl -z-10"></div>
        
        {/* Modal content */}
        <div className="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="sticky top-0 bg-navy-900/95 backdrop-blur-xl border-b border-white/10 p-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                  Vote Receipt
                </h2>
                <p className="text-sm text-gray-400">Official voting confirmation</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
            >
              <svg className="w-6 h-6 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div ref={receiptRef} className="p-6 pb-32 space-y-6">
            
            {/* Election Details */}
            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-neon-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"/>
                </svg>
                <h3 className="text-lg font-bold text-white">Election Details</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-400">Title</p>
                  <p className="text-white font-semibold">{vote.election.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="text-gray-300">{vote.election.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-gray-400">Start Date</p>
                    <p className="text-white text-sm">{formatDate(vote.election.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">End Date</p>
                    <p className="text-white text-sm">{formatDate(vote.election.end_date)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Vote */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl p-5 border border-green-500/30">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
                <h3 className="text-lg font-bold text-white">Your Vote</h3>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-500/50 shadow-lg">
                  {vote.candidate.image ? (
                    <img 
                      src={`http://localhost:5000${vote.candidate.image}`} 
                      alt={vote.candidate.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neon-pink to-neon-aqua flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {vote.candidate.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-white mb-1">{vote.candidate.name}</h4>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-1 bg-neon-blue/30 border border-neon-blue/50 rounded-full text-sm font-medium text-neon-blue">
                      {vote.candidate.party}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{vote.candidate.manifesto}</p>
                </div>
              </div>
            </div>

            {/* Blockchain Record */}
            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-neon-aqua" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <h3 className="text-lg font-bold text-white">Blockchain Record</h3>
              </div>
              
              <div className="space-y-3">
                {/* Transaction Hash */}
                {vote.tx_hash && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Transaction Hash</p>
                    <div className="flex items-center gap-2 p-3 bg-black/30 rounded-lg border border-white/5">
                      <code className="text-neon-aqua font-mono text-sm flex-1 overflow-x-auto">
                        {vote.tx_hash}
                      </code>
                      <button
                        onClick={() => copyToClipboard(vote.tx_hash, 'tx')}
                        className="p-2 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                        title="Copy transaction hash"
                      >
                        {copied === 'tx' ? (
                          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Voter ID */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Voter ID</p>
                    <p className="text-white font-mono text-sm">{vote.voter_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Vote ID</p>
                    <p className="text-white font-mono text-sm">#{vote.vote_id}</p>
                  </div>
                </div>

                {/* Timestamp */}
                <div>
                  <p className="text-sm text-gray-400 mb-1">Timestamp</p>
                  <p className="text-white font-medium">{formatDate(vote.vote_timestamp)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-navy-900/95 backdrop-blur-xl border-t border-white/10 p-6 flex gap-3">
            {vote.tx_hash && (
              <button
                onClick={viewOnExplorer}
                className="flex-1 py-3 px-4 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                View on Explorer
              </button>
            )}
            
            <button
              onClick={handleDownloadReceipt}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink text-white font-semibold rounded-lg hover:shadow-neon-purple transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Download Receipt
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VoteDetailsModal;
