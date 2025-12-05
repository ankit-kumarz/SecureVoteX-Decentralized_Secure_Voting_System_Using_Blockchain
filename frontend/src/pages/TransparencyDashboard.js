import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import QRScanner from '../components/QRScanner/QRScanner';
import API from '../api';
import LanguageSwitcher from '../components/Settings/LanguageSwitcher';
import ThemeToggle from '../components/Settings/ThemeToggle';

const TransparencyDashboard = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [scanResult, setScanResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState('');

  const handleQRScan = async (qrData) => {
    try {
      setScanResult(qrData);
      setError('');
      setVerifying(true);

      // Parse QR data (could be JSON or just receipt hash)
      let receiptHash = qrData;
      try {
        const parsed = JSON.parse(qrData);
        receiptHash = parsed.receiptHash || parsed.receipt_hash || qrData;
      } catch (e) {
        // QR data is plain text receipt hash
      }

      // Verify receipt
      const response = await API.get(`/encrypted-vote/receipt/${receiptHash}/verify`);
      setVerificationResult(response.data);
      setVerifying(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      setVerifying(false);
    }
  };

  const handleScanError = (err) => {
    setError(err);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-neon-blue opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-neon-purple opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-12 h-12 mr-4 text-neon-aqua" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                  {t('transparencyDashboard')}
                </h1>
                <p className="text-gray-400 mt-2">{t('publicBlockchainVerification')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {user && (
                <button
                  onClick={() => navigate(user.role === 'admin' ? '/admin' : '/voter')}
                  className="px-4 py-2 bg-white/5 border border-neon-blue/30 text-neon-blue rounded-lg hover:bg-neon-blue/10 transition-all duration-300 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  {t('backToDashboard')}
                </button>
              )}
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 backdrop-blur-xl bg-white/5 p-2 rounded-xl border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon-blue'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('overview')}
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'scanner'
                ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-neon-purple'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('qrScanner')}
          </button>
          <button
            onClick={() => setActiveTab('blockchain')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'blockchain'
                ? 'bg-gradient-to-r from-neon-pink to-neon-aqua text-white shadow-neon-pink'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('blockchainExplorer')}
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-glow">
              <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center mx-auto mb-4 shadow-neon-blue">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">1. Cast Vote</h3>
                  <p className="text-gray-400 text-sm">Your vote is encrypted end-to-end before submission</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-pink rounded-xl flex items-center justify-center mx-auto mb-4 shadow-neon-purple">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">2. Get Receipt</h3>
                  <p className="text-gray-400 text-sm">Receive cryptographic receipt with QR code</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-pink to-neon-aqua rounded-xl flex items-center justify-center mx-auto mb-4 shadow-neon-pink">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">3. Verify</h3>
                  <p className="text-gray-400 text-sm">Scan QR code or enter hash to verify on blockchain</p>
                </div>
              </div>
            </div>

            {/* Blockchain Information */}
            <div className="backdrop-blur-xl bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 p-6 rounded-2xl border border-neon-blue/30 shadow-glow">
              <h3 className="text-xl font-bold text-white mb-4">Blockchain Network</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Network</p>
                  <p className="text-white font-medium">Ethereum Sepolia Testnet</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Contract Address</p>
                  <code className="text-neon-aqua font-mono text-sm">
                    {process.env.REACT_APP_CONTRACT_ADDRESS || '0x...pending deployment'}
                  </code>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Encryption</p>
                  <p className="text-white font-medium">RSA-2048 + AES-256-GCM</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Explorer</p>
                  <a
                    href="https://sepolia.etherscan.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-blue hover:text-neon-purple transition-colors flex items-center"
                  >
                    Sepolia Etherscan
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="backdrop-blur-xl bg-white/5 p-6 rounded-xl border border-white/10">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Security Features
                </h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-start">
                    <span className="text-neon-blue mr-2">•</span>
                    End-to-end encryption for all votes
                  </li>
                  <li className="flex items-start">
                    <span className="text-neon-blue mr-2">•</span>
                    Biometric authentication support
                  </li>
                  <li className="flex items-start">
                    <span className="text-neon-blue mr-2">•</span>
                    Cryptographic receipt generation
                  </li>
                  <li className="flex items-start">
                    <span className="text-neon-blue mr-2">•</span>
                    Immutable blockchain storage
                  </li>
                </ul>
              </div>

              <div className="backdrop-blur-xl bg-white/5 p-6 rounded-xl border border-white/10">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-neon-purple" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Transparency
                </h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-start">
                    <span className="text-neon-purple mr-2">•</span>
                    Public receipt verification
                  </li>
                  <li className="flex items-start">
                    <span className="text-neon-purple mr-2">•</span>
                    Real-time blockchain confirmations
                  </li>
                  <li className="flex items-start">
                    <span className="text-neon-purple mr-2">•</span>
                    QR code scanning for easy verification
                  </li>
                  <li className="flex items-start">
                    <span className="text-neon-purple mr-2">•</span>
                    Audit trail on Etherscan
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* QR Scanner Tab */}
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-glow">
              <h2 className="text-2xl font-bold text-white mb-4">Scan Vote Receipt</h2>
              <p className="text-gray-400 mb-6">
                Use your device camera to scan the QR code from your vote receipt for instant verification.
              </p>
              <QRScanner onScan={handleQRScan} onError={handleScanError} />
            </div>

            {/* Scan Result */}
            {verifying && (
              <div className="backdrop-blur-xl bg-white/5 p-6 rounded-xl border border-white/10 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue mb-4 mx-auto"></div>
                <p className="text-gray-400">Verifying receipt...</p>
              </div>
            )}

            {error && (
              <div className="backdrop-blur-xl bg-red-500/10 p-6 rounded-xl border border-red-500/30">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p className="text-red-400">{error}</p>
                </div>
              </div>
            )}

            {verificationResult && (
              <div className="backdrop-blur-xl bg-green-500/10 p-6 rounded-xl border border-green-500/30">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <h3 className="text-xl font-bold text-green-400">Receipt Verified!</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Election:</span>
                    <span className="text-white font-medium">{verificationResult.election_title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Vote Time:</span>
                    <span className="text-white font-medium">
                      {new Date(verificationResult.voted_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Receipt Hash:</span>
                    <code className="text-neon-aqua font-mono text-xs">
                      {verificationResult.receipt_hash?.substring(0, 32)}...
                    </code>
                  </div>
                  {verificationResult.blockchain_tx && (
                    <div className="mt-4 pt-4 border-t border-green-500/30">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${verificationResult.blockchain_tx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center text-neon-blue hover:text-neon-purple transition-colors"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                        View Transaction on Etherscan
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Blockchain Info Tab */}
        {activeTab === 'blockchain' && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-glow">
              <h2 className="text-2xl font-bold text-white mb-6">Smart Contract Information</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-3">Contract Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Network</p>
                      <p className="text-white font-mono">Ethereum Sepolia Testnet</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Chain ID</p>
                      <p className="text-white font-mono">11155111</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-400 mb-1">Contract Address</p>
                      <code className="text-neon-aqua font-mono break-all">
                        {process.env.REACT_APP_CONTRACT_ADDRESS || 'Pending deployment - will be updated after deployment'}
                      </code>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-3">Verification Methods</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-400 mb-2">1. Receipt Hash Verification</p>
                      <p className="text-white">Verify your vote was recorded using the cryptographic receipt hash</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-2">2. Blockchain Explorer</p>
                      <p className="text-white">View all transactions on Sepolia Etherscan for full transparency</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-2">3. QR Code Scanning</p>
                      <p className="text-white">Scan your receipt QR code with any device camera for instant verification</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 rounded-lg border border-neon-blue/30">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-neon-aqua" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    How to Verify Your Vote
                  </h3>
                  <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
                    <li>After voting, save your receipt (screenshot or print QR code)</li>
                    <li>Go to the "QR Scanner" tab or enter your receipt hash manually</li>
                    <li>Scan the QR code or paste the hash to verify</li>
                    <li>Check the blockchain transaction on Etherscan for immutable proof</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransparencyDashboard;
