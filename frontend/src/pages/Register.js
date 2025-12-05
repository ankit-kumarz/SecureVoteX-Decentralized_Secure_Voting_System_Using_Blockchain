import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TopHeader from '../components/TopHeader';
import FaceCapture from '../components/FaceCapture';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [wallet, setWallet] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showBiometricStep, setShowBiometricStep] = useState(false);
  const [biometricRegistering, setBiometricRegistering] = useState(false);
  const [biometricComplete, setBiometricComplete] = useState(false);
  const [registrationToken, setRegistrationToken] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Clear any old tokens when component mounts
  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await API.post('/auth/register', {
        email,
        password,
        role: 'voter',
        wallet_address: wallet || undefined
      });
      
      // Store token temporarily in localStorage for biometric registration
      localStorage.setItem('token', res.data.token);
      setRegistrationToken(res.data.token);
      
      // Show biometric registration step for voters
      setSuccess('Account created! Now register your face for secure voting.');
      setShowBiometricStep(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleBiometricCapture = async (embedding) => {
    try {
      setBiometricRegistering(true);
      setError('');
      
      // Register biometric (token already in localStorage, interceptor will add it)
      await API.post('/biometric/register', {
        faceEmbeddingBase64: embedding
      });
      
      setBiometricComplete(true);
      setSuccess('Face registered successfully! Redirecting to login...');
      
      // Clear token - user needs to login properly
      localStorage.removeItem('token');
      
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Biometric registration failed');
      setBiometricRegistering(false);
    }
  };

  const handleSkipBiometric = () => {
    // Clear token - user needs to login properly
    localStorage.removeItem('token');
    setSuccess('Registration completed. You can add face verification later.');
    setTimeout(() => navigate('/login'), 1500);
  };

  // MetaMask wallet connect (for voter)
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWallet(accounts[0]);
      } catch (err) {
        setError('Wallet connection failed');
      }
    } else {
      setError('MetaMask not found');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 relative overflow-hidden">
      <TopHeader />
      
      {/* Animated background gradient orbs */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-neon-purple opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-neon-aqua opacity-20 rounded-full blur-3xl animate-pulse delay-700"></div>
      
      <div className="relative z-10 backdrop-blur-xl bg-white/5 p-10 rounded-2xl border border-white/10 shadow-neon-purple w-full max-w-lg mt-20">
        
        {/* Biometric Registration Step */}
        {showBiometricStep ? (
          <div>
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
                {biometricComplete ? 'Face registered successfully!' : 'Secure your voting with facial recognition'}
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

            {!biometricComplete && (
              <>
                <FaceCapture
                  onCapture={handleBiometricCapture}
                  onError={(err) => setError(err.message)}
                  buttonText="Register Face"
                  fastMode={true}
                />
                
                <button
                  type="button"
                  onClick={handleSkipBiometric}
                  className="w-full mt-4 py-3 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-all"
                  disabled={biometricRegistering}
                >
                  Skip for Now
                </button>

                <p className="text-gray-500 text-xs text-center mt-4">
                  You can add face verification later from your dashboard
                </p>
              </>
            )}
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit}>
            {/* Title with gradient */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-neon-purple via-neon-pink to-neon-aqua bg-clip-text text-transparent mb-2">
                Voter Registration
              </h2>
              <p className="text-gray-400 text-sm">Create your secure voting account</p>
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

            <div className="space-y-5">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">{t('email')}</label>
                <input
                  type="email"
                  placeholder={t('enterEmail')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all backdrop-blur-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">{t('password')}</label>
                <input
                  type="password"
                  placeholder={t('createPassword')}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent transition-all backdrop-blur-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">{t('walletOptional')}</label>
                <button 
                  type="button" 
                  onClick={connectWallet} 
                  className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-navy-900 font-semibold rounded-xl shadow-neon-aqua hover:shadow-neon-pink hover:scale-105 transition-all duration-300"
                >
                  {wallet ? (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      {wallet.slice(0, 6)}...{wallet.slice(-4)}
                    </span>
                  ) : (
                    t('connectWallet')
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full mt-8 py-4 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-aqua text-white font-semibold rounded-xl shadow-neon-purple hover:shadow-neon-pink hover:scale-105 transition-all duration-300"
            >
              {t('register')}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                {t('alreadyHaveAccount')}{' '}
                <a href="/login" className="text-neon-blue hover:text-neon-purple transition-colors font-medium">
                  {t('signInHere')}
                </a>
              </p>
            </div>

            {/* Decorative gradient line */}
            <div className="mt-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;