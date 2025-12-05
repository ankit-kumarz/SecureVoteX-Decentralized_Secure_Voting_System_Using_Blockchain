import React, { useState, useEffect } from 'react';
import FaceCapture from './FaceCapture';
import { compareDescriptors } from '../utils/faceapiLoader';
import API from '../api';

/**
 * FaceVerificationModal Component - Simple Identity Matching
 * 
 * Modal popup for verifying voter identity using face recognition
 * - Instant face capture and comparison
 * - Client-side embedding comparison for speed
 * - No liveness detection
 * 
 * Props:
 * - isOpen: Boolean to control modal visibility
 * - onClose: Callback when modal is closed
 * - onVerified: Callback when verification succeeds
 * - onFailed: Callback when verification fails
 * - userId: User ID for verification (optional, uses auth token by default)
 */
const FaceVerificationModal = ({ isOpen, onClose, onVerified, onFailed, userId }) => {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState('');
  const [hasBiometric, setHasBiometric] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (isOpen) {
      checkBiometricStatus();
    } else {
      // Reset state when modal closes
      setVerificationResult(null);
      setError('');
      setHasBiometric(null);
      setCheckingStatus(true);
    }
  }, [isOpen]);

  const checkBiometricStatus = async () => {
    try {
      setCheckingStatus(true);
      const response = await API.get('/biometric/status');
      setHasBiometric(response.data.registered);
      setCheckingStatus(false);
    } catch (err) {
      console.error('Failed to check biometric status:', err);
      setError('Failed to check biometric registration status');
      setCheckingStatus(false);
      setHasBiometric(false);
    }
  };

  const handleFaceCapture = async (embedding) => {
    try {
      setVerifying(true);
      setError('');
      setVerificationResult(null);

      // Get stored embedding from server (instant retrieval)
      const response = await API.post('/biometric/verify');

      const { storedEmbedding } = response.data;

      // CLIENT-SIDE COMPARISON (INSTANT - no server processing)
      const distance = compareDescriptors(embedding, storedEmbedding);
      
      // Threshold: < 0.6 = match (same as face-api.js standard)
      const matched = distance < 0.6;
      const score = Math.max(0, 100 - (distance * 100)); // Convert distance to percentage

      setVerificationResult({
        matched,
        score: score.toFixed(1),
        message: matched ? '✓ Face verified successfully!' : '✗ Face does not match. Please try again.'
      });

      setVerifying(false);

      // Auto-close and callback after 1.5 seconds if verified
      if (matched) {
        setTimeout(() => {
          if (onVerified) onVerified({ matched, score, distance });
          onClose();
        }, 1500);
      } else {
        if (onFailed) onFailed({ matched: false, distance });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      setVerifying(false);
      if (onFailed) onFailed({ matched: false, error: err.message });
    }
  };

  const handleError = (err) => {
    setError(err.message || 'Failed to capture face');
  };

  const handleRetry = () => {
    setVerificationResult(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 rounded-2xl border border-white/10 shadow-2xl p-6 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          disabled={verifying}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
            Face Verification
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Verify your identity to cast your vote
          </p>
        </div>

        {/* Checking Status */}
        {checkingStatus && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue mb-3 mx-auto"></div>
            <p className="text-gray-400">Checking biometric status...</p>
          </div>
        )}

        {/* Not Registered */}
        {!checkingStatus && hasBiometric === false && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Biometric Not Registered</h3>
            <p className="text-gray-400 text-sm mb-4">
              You need to register your face first before using face verification.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-lg hover:bg-white/10 transition-all"
            >
              Close
            </button>
          </div>
        )}

        {/* Face Capture */}
        {!checkingStatus && hasBiometric === true && !verificationResult && (
          <div>
            <FaceCapture
              onCapture={handleFaceCapture}
              onError={handleError}
              buttonText="Verify Identity"
              fastMode={true}
            />
            {error && !verifying && (
              <div className="mt-4">
                <button
                  onClick={handleRetry}
                  className="w-full py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        )}

        {/* Verification Result */}
        {verificationResult && (
          <div className="text-center py-6">
            {verificationResult.matched ? (
              <div className="animate-fade-in">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                  <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-500 mb-2">Verification Successful!</h3>
                <p className="text-gray-400 text-sm mb-1">Identity confirmed</p>
                <p className="text-neon-aqua text-lg font-semibold">
                  Match Score: {verificationResult.score}%
                </p>
                <p className="text-gray-500 text-xs mt-4">Redirecting to voting...</p>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-red-500 mb-2">Verification Failed</h3>
                <p className="text-gray-400 text-sm mb-1">{verificationResult.message}</p>
                <p className="text-gray-500 text-lg">
                  Match Score: {verificationResult.score}%
                </p>
                <button
                  onClick={handleRetry}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold rounded-lg hover:shadow-neon-purple transition-all"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default FaceVerificationModal;
