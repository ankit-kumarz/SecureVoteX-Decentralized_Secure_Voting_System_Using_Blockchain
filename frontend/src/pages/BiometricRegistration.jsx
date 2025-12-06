import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import TopHeader from '../components/TopHeader';
import FaceCapture from '../components/FaceCapture';
import { AuthContext } from '../context/AuthContext';

/**
 * Biometric Registration Page
 * Allows users to register or update their face biometric after account creation
 */
const BiometricRegistration = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registering, setRegistering] = useState(false);
  const [complete, setComplete] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleBiometricCapture = async (embedding) => {
    try {
      setRegistering(true);
      setError('');
      
      // Register biometric
      await API.post('/biometric/register', {
        faceEmbeddingBase64: embedding
      });
      
      setComplete(true);
      setSuccess('✅ Face registered successfully!');
      
      // Redirect back to voter dashboard after 2 seconds
      setTimeout(() => {
        navigate('/voter/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Biometric registration failed. Please try again.');
      setRegistering(false);
    }
  };

  const handleCancel = () => {
    navigate('/voter/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 relative overflow-hidden">
      <TopHeader />
      
      {/* Animated background gradient orbs */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-neon-purple opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-neon-aqua opacity-20 rounded-full blur-3xl animate-pulse delay-700"></div>
      
      <div className="relative z-10 backdrop-blur-xl bg-white/5 p-10 rounded-2xl border border-white/10 shadow-neon-purple w-full max-w-lg mt-20">
        
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-purple via-neon-pink to-neon-aqua bg-clip-text text-transparent mb-2">
            Register Your Face
          </h2>
          <p className="text-gray-400 text-sm">
            {complete ? 'Face registered successfully!' : 'Secure your voting with facial recognition'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm backdrop-blur-sm">
            {success}
          </div>
        )}

        {!complete ? (
          <>
            <FaceCapture
              onCapture={handleBiometricCapture}
              onError={(err) => setError(err.message)}
              buttonText="Register Face"
              fastMode={true}
              disabled={registering}
            />
            
            <button
              type="button"
              onClick={handleCancel}
              className="w-full mt-4 py-3 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-all"
              disabled={registering}
            >
              Cancel
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-300 mb-4">Redirecting to your dashboard...</p>
            <div className="w-8 h-8 border-4 border-neon-purple border-t-neon-pink rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiometricRegistration;
