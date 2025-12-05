import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ElectionManagement from '../components/ElectionManagement';
import CandidateManagement from '../components/CandidateManagement';
import ResultsAnalytics from '../components/ResultsAnalytics';
import TransactionLogs from '../components/TransactionLogs';
import AdminKPIDashboard from '../components/admin/AdminKPIDashboard';
import LiveElectionMonitor from '../components/admin/LiveElectionMonitor';
import FraudDetectionCenter from '../components/admin/FraudDetectionCenter';
import SystemHealthMonitor from '../components/admin/SystemHealthMonitor';
import AdminAuditTrail from '../components/admin/AdminAuditTrail';
import BlockchainExplorer from '../components/admin/BlockchainExplorer';
import ExportManager from '../components/admin/ExportManager';
import AdminUserManagement from './admin/AdminUserManagement';
import LanguageSwitcher from '../components/Settings/LanguageSwitcher';
import ThemeToggle from '../components/Settings/ThemeToggle';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'elections', name: 'Elections', icon: '🗳️' },
    { id: 'candidates', name: 'Candidates', icon: '👥' },
    { id: 'user-management', name: 'User Management', icon: '👤', superAdminOnly: true },
    { id: 'monitor', name: 'Live Monitor', icon: '📡' },
    { id: 'fraud', name: 'Fraud Detection', icon: '🚨' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'blockchain', name: 'Blockchain', icon: '⛓️' },
    { id: 'health', name: 'System Health', icon: '🏥' },
    { id: 'audit', name: 'Audit Trail', icon: '📜' },
    { id: 'export', name: 'Export Tools', icon: '📥' },
    { id: 'logs', name: 'Transaction Logs', icon: '📝' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminKPIDashboard />;
      case 'elections':
        return <ElectionManagement />;
      case 'candidates':
        return <CandidateManagement />;
      case 'user-management':
        return <AdminUserManagement />;
      case 'monitor':
        return <LiveElectionMonitor />;
      case 'fraud':
        return <FraudDetectionCenter />;
      case 'analytics':
        return <ResultsAnalytics />;
      case 'blockchain':
        return <BlockchainExplorer />;
      case 'health':
        return <SystemHealthMonitor />;
      case 'audit':
        return <AdminAuditTrail />;
      case 'export':
        return <ExportManager />;
      case 'logs':
        return <TransactionLogs />;
      default:
        return <AdminKPIDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 relative overflow-hidden">
      {/* Background animated gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-neon-purple opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-pink opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple via-neon-pink to-neon-aqua bg-clip-text text-transparent">
                {t('adminControlCenter')}
              </h1>
              <p className="text-gray-400 mt-2">Advanced Admin Control Panel - All Features Enabled</p>
            </div>
            <button 
              onClick={logout} 
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl shadow-neon-pink hover:shadow-neon-aqua hover:scale-105 transition-all duration-300"
            >
              {t('logout')}
            </button>
          </div>
          
          {/* Settings Bar */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="backdrop-blur-xl bg-white/5 p-2 rounded-2xl border border-white/10 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-neon-purple'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
