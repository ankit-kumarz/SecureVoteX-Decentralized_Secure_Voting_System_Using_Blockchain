import React, { useState, useEffect } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';

/**
 * Face Verification Status Card Component
 * Shows face verification status with action buttons
 */
const FaceVerificationStatusCard = () => {
  const [biometricStatus, setBiometricStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchBiometricStatus();
  }, []);
  
  const fetchBiometricStatus = async () => {
    try {
      setLoading(true);
      const res = await API.get('/biometric/status');
      setBiometricStatus(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch biometric status:', err);
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow mb-6 animate-pulse">
        <div className="h-32 bg-white/10 rounded-lg"></div>
      </div>
    );
  }
  
  const isVerified = biometricStatus?.registered === true;
  
  return (
    <div className={`backdrop-blur-xl p-6 rounded-2xl border shadow-glow mb-6 ${
      isVerified 
        ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30' 
        : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
    }`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isVerified ? 'bg-green-500/20' : 'bg-yellow-500/20'
          }`}>
            {isVerified ? (
              <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              {isVerified ? '✔ Face Verification Completed' : '❗ Face Verification Pending'}
            </h3>
            
            {isVerified ? (
              <div className="space-y-1">
                <p className="text-gray-300">
                  <span className="text-gray-400">Last verification:</span>{' '}
                  {biometricStatus.verifiedAt 
                    ? new Date(biometricStatus.verifiedAt).toLocaleDateString() 
                    : 'Recently'
                  }
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-400">Status:</span>{' '}
                  <span className="text-green-400 font-semibold">Active & Secure</span>
                </p>
              </div>
            ) : (
              <p className="text-gray-300">
                Complete face verification to secure your votes and unlock full voting access.
              </p>
            )}
          </div>
        </div>
        
        {!isVerified && (
          <button
            onClick={() => {
              // Trigger face verification modal
              // This can be handled by parent component state
              window.location.reload(); // Temporary - replace with proper state management
            }}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-navy-900 font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap"
          >
            Complete Verification Now →
          </button>
        )}
      </div>
    </div>
  );
};

export default FaceVerificationStatusCard;
