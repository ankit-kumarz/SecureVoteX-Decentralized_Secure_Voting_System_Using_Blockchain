import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../api';
import VotingStatistics from '../components/Analytics/VotingStatistics';
import ActivityMonitor from '../components/Analytics/ActivityMonitor';
import BlockchainMonitor from '../components/Analytics/BlockchainMonitor';
import LanguageSwitcher from '../components/Settings/LanguageSwitcher';
import ThemeToggle from '../components/Settings/ThemeToggle';

const AnalyticsDashboard = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [election, setElection] = useState(null);
  const [activeTab, setActiveTab] = useState('statistics');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (electionId) {
      loadElection();
    }
  }, [electionId]);

  const loadElection = async () => {
    try {
      setLoading(true);
      const response = await API.get('/elections');
      const electionData = response.data.find(e => e.id === parseInt(electionId));
      setElection(electionData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load election:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue mb-4 mx-auto"></div>
          <p className="text-gray-400">{t('loadingAnalytics')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-neon-blue opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <button
                onClick={() => navigate('/admin')}
                className="text-gray-400 hover:text-white mb-2 flex items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
                {t('backToDashboard')}
              </button>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                {t('analyticsDashboard')}
              </h1>
              <p className="text-gray-400 mt-2">{election?.title || t('electionAnalytics')}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">{t('electionId')}</p>
              <p className="text-2xl font-bold text-white">#{electionId}</p>
            </div>
          </div>
          
          {/* Settings */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 backdrop-blur-xl bg-white/5 p-2 rounded-xl border border-white/10 w-fit">
          <button
            onClick={() => setActiveTab('statistics')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center ${
              activeTab === 'statistics'
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon-blue'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            {t('statistics')}
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center ${
              activeTab === 'activity'
                ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-neon-purple'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {t('activity')}
          </button>
          <button
            onClick={() => setActiveTab('blockchain')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center ${
              activeTab === 'blockchain'
                ? 'bg-gradient-to-r from-neon-pink to-neon-aqua text-white shadow-neon-pink'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            {t('blockchain')}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'statistics' && <VotingStatistics electionId={electionId} />}
        {activeTab === 'activity' && <ActivityMonitor electionId={electionId} />}
        {activeTab === 'blockchain' && <BlockchainMonitor electionId={electionId} />}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
