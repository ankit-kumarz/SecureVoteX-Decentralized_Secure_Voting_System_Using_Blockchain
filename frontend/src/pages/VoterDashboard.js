import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ActiveElections from '../components/ActiveElections';
import MyVotesAndResults from '../components/MyVotesAndResults';
import ReceiptVerification from '../components/Verification/ReceiptVerification';
import TopHeader from '../components/TopHeader';
import FaceVerificationModal from '../components/FaceVerificationModal';
import WelcomeMessage from '../components/voter/WelcomeMessage';
import VotingInsightsPanel from '../components/voter/VotingInsightsPanel';
import SecurityHealthScore from '../components/voter/SecurityHealthScore';
import FaceVerificationStatusCard from '../components/voter/FaceVerificationStatusCard';
import BlockchainTransparencyWidget from '../components/voter/BlockchainTransparencyWidget';
import ActivityTimeline from '../components/voter/ActivityTimeline';
import VoterBadges from '../components/voter/VoterBadges';
import ThemeToggle from '../components/voter/ThemeToggle';
import API from '../api';

const VoterDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('elections'); // elections, votes, verify
  const [faceVerified, setFaceVerified] = useState(null);
  const [loadingBiometric, setLoadingBiometric] = useState(true);
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    try {
      const response = await API.get('/biometric/status');
      // Check if registered AND verified
      setFaceVerified(response.data.registered === true && response.data.verified === true);
    } catch (err) {
      console.error('Failed to check biometric status:', err);
      setFaceVerified(false);
    } finally {
      setLoadingBiometric(false);
    }
  };

  const getFirstName = () => {
    if (user.email) {
      const name = user.email.split('@')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return 'Voter';
  };

  if (!user || user.role !== 'voter') {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 relative overflow-x-hidden">
      <TopHeader />
      
      {/* Background animated gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-purple opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto mt-20">
        {/* Welcome Message */}
        <WelcomeMessage />
        
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 mt-2">Voter ID: <span className="text-neon-aqua font-mono">{user.voter_id || 'N/A'}</span></p>
            </div>
            <div className="flex gap-3">
              <ThemeToggle />
              <button
                onClick={() => navigate('/about-system')}
                className="px-6 py-3 bg-white/5 border border-neon-purple/30 text-neon-purple font-semibold rounded-xl hover:bg-neon-purple/10 hover:scale-105 transition-all duration-300 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Learn More
              </button>
              <a
                href="/transparency"
                className="px-6 py-3 bg-white/5 border border-neon-aqua/30 text-neon-aqua font-semibold rounded-xl hover:bg-neon-aqua/10 hover:scale-105 transition-all duration-300 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                {t('transparency')}
              </a>
              <button 
                onClick={logout} 
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl shadow-neon-pink hover:shadow-neon-aqua hover:scale-105 transition-all duration-300"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
        
        {/* New Dashboard Components */}
        <VotingInsightsPanel />
        <SecurityHealthScore />
        <FaceVerificationStatusCard />
        <BlockchainTransparencyWidget />
        <VoterBadges />
        <ActivityTimeline />

        {/* Face Verification Warning Card */}
        {!loadingBiometric && faceVerified === false && (
          <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6 rounded-2xl border-2 border-yellow-500/30 shadow-neon-pink mb-4 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-yellow-500 mb-2">Face Verification Pending</h3>
                <p className="text-gray-300 mb-4">You must verify your face before casting a secure vote. Complete face verification to unlock voting access.</p>
                <button
                  onClick={() => setShowFaceModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-navy-900 font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Verify Now →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="mb-6 flex gap-2 backdrop-blur-xl bg-white/5 p-2 rounded-xl border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab('elections')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'elections'
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon-blue'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('activeElections')}
          </button>
          <button
            onClick={() => setActiveTab('votes')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'votes'
                ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-neon-purple'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('myVotes')}
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === 'verify'
                ? 'bg-gradient-to-r from-neon-pink to-neon-aqua text-white shadow-neon-pink'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('verifyReceipt')}
          </button>
        </div>

        {activeTab === 'elections' && (
          <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-neon-blue hover:shadow-neon-purple transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center mr-4 shadow-neon-blue">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">Active Elections</h2>
            </div>
            <div className="h-px bg-gradient-to-r from-neon-blue via-neon-purple to-transparent mb-4"></div>
            <ActiveElections />
          </div>
        )}

        {activeTab === 'votes' && (
          <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-neon-purple hover:shadow-neon-pink transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-xl flex items-center justify-center mr-4 shadow-neon-purple">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">My Votes & Results</h2>
            </div>
            <div className="h-px bg-gradient-to-r from-neon-purple via-neon-pink to-transparent mb-4"></div>
            <MyVotesAndResults 
              showReceiptModal={showReceiptModal}
              setShowReceiptModal={setShowReceiptModal}
            />
          </div>
        )}

        {activeTab === 'verify' && (
          <ReceiptVerification />
        )}


        {/* Stats Overview (Optional Enhancement) */}
        {!showReceiptModal && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="backdrop-blur-xl bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 p-6 rounded-xl border border-neon-blue/30 shadow-glow">
              <p className="text-gray-400 text-sm mb-1">Voter ID</p>
              <p className="text-2xl font-bold text-white">{user.voter_id || 'N/A'}</p>
            </div>
            <div className="backdrop-blur-xl bg-gradient-to-br from-neon-purple/10 to-neon-pink/10 p-6 rounded-xl border border-neon-purple/30 shadow-glow">
              <p className="text-gray-400 text-sm mb-1">Role</p>
              <p className="text-2xl font-bold text-white capitalize">{user.role}</p>
            </div>
            <div className="backdrop-blur-xl bg-gradient-to-br from-neon-pink/10 to-neon-aqua/10 p-6 rounded-xl border border-neon-pink/30 shadow-glow">
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className="text-2xl font-bold text-neon-aqua">Active</p>
            </div>
          </div>
        )}
      </div>

      {/* Face Verification Modal */}
      <FaceVerificationModal
        isOpen={showFaceModal}
        onClose={() => setShowFaceModal(false)}
        onVerified={() => {
          setShowFaceModal(false);
          setFaceVerified(true);
          // Refresh biometric status
          checkBiometricStatus();
        }}
        onFailed={(error) => {
          console.error('Face verification failed:', error);
        }}
      />
    </div>
  );
};

export default VoterDashboard;
