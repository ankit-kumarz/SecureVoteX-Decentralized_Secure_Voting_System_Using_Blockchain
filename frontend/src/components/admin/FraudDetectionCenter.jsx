import React, { useState, useEffect } from 'react';
import API from '../../api';

const FraudDetectionCenter = () => {
  const [alerts, setAlerts] = useState({
    failedVerifications: [],
    duplicateVotes: [],
    bulkVoting: []
  });
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('all');

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await API.get('/admin/fraud-alerts');
      if (res.data.success) {
        setAlerts(res.data.alerts);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch fraud alerts:', error);
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return { bg: 'red-500', border: 'red-500', text: 'red-400' };
      case 'medium': return { bg: 'orange-500', border: 'orange-500', text: 'orange-400' };
      case 'low': return { bg: 'green-500', border: 'green-500', text: 'green-400' };
      default: return { bg: 'gray-500', border: 'gray-500', text: 'gray-400' };
    }
  };

  const AlertCard = ({ alert }) => {
    const colors = getSeverityColor(alert.severity);
    
    return (
      <div className={`backdrop-blur-xl bg-${colors.bg}/10 p-4 rounded-xl border border-${colors.border}/30 hover:scale-[1.02] transition-all duration-300`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full bg-${colors.bg} animate-pulse`}></div>
            <span className={`text-xs font-bold uppercase text-${colors.text}`}>
              {alert.severity}
            </span>
          </div>
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
            {alert.type.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>
        
        <p className="text-white text-sm mb-3 leading-relaxed">{alert.message}</p>
        
        <div className="flex flex-wrap gap-2 text-xs">
          {alert.voterId && (
            <span className="bg-white/10 px-2 py-1 rounded text-gray-300">
              Voter: <span className="text-neon-aqua">{alert.voterId}</span>
            </span>
          )}
          {alert.userId && (
            <span className="bg-white/10 px-2 py-1 rounded text-gray-300">
              User: <span className="text-neon-purple">{alert.userId}</span>
            </span>
          )}
          {alert.electionId && (
            <span className="bg-white/10 px-2 py-1 rounded text-gray-300">
              Election: <span className="text-neon-pink">{alert.electionId}</span>
            </span>
          )}
          {alert.attemptCount && (
            <span className="bg-white/10 px-2 py-1 rounded text-gray-300">
              Attempts: <span className="text-red-400">{alert.attemptCount}</span>
            </span>
          )}
        </div>

        {alert.severity === 'high' && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <button className="w-full px-3 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm font-semibold">
              ⚠️ Investigate Now
            </button>
          </div>
        )}
      </div>
    );
  };

  const allAlerts = [
    ...alerts.failedVerifications,
    ...alerts.duplicateVotes,
    ...alerts.bulkVoting
  ];

  const filteredAlerts = filterSeverity === 'all' 
    ? allAlerts 
    : allAlerts.filter(a => a.severity === filterSeverity);

  const sortedAlerts = filteredAlerts.sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            🚨 Fraud Detection Center
          </h2>
          <p className="text-sm text-gray-400 mt-1">AI-Powered Security Monitoring System</p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all" className="bg-navy-900">All Severity</option>
            <option value="high" className="bg-navy-900">High Only</option>
            <option value="medium" className="bg-navy-900">Medium Only</option>
            <option value="low" className="bg-navy-900">Low Only</option>
          </select>
          
          <button 
            onClick={fetchAlerts} 
            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 p-6 rounded-2xl border border-red-500/30 hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400 font-medium">Critical Alerts</h3>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-4xl font-bold text-red-400">
            {allAlerts.filter(a => a.severity === 'high').length}
          </p>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 p-6 rounded-2xl border border-orange-500/30 hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400 font-medium">Failed Verifications</h3>
            <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <p className="text-4xl font-bold text-orange-400">{alerts.failedVerifications.length}</p>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 p-6 rounded-2xl border border-yellow-500/30 hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400 font-medium">Duplicate Votes</h3>
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          </div>
          <p className="text-4xl font-bold text-yellow-400">{alerts.duplicateVotes.length}</p>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-2xl border border-purple-500/30 hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400 font-medium">Bulk Patterns</h3>
            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
          </div>
          <p className="text-4xl font-bold text-purple-400">{alerts.bulkVoting.length}</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">
            Recent Security Alerts
            <span className="ml-3 text-sm text-gray-400">({sortedAlerts.length} total)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : sortedAlerts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <p className="text-green-400 text-lg font-semibold">✅ No fraud alerts detected</p>
              <p className="text-gray-500 text-sm mt-2">System is secure and functioning normally</p>
            </div>
          ) : (
            sortedAlerts.map((alert, index) => (
              <AlertCard key={index} alert={alert} />
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(239, 68, 68, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(239, 68, 68, 0.7);
        }
      `}</style>
    </div>
  );
};

export default FraudDetectionCenter;
