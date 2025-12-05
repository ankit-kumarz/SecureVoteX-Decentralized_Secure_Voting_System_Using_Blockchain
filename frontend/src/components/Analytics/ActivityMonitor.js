import React, { useState, useEffect } from 'react';
import API from '../../api';

const ActivityMonitor = ({ electionId }) => {
  const [activities, setActivities] = useState([]);
  const [suspiciousActivities, setSuspiciousActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, suspicious, normal

  useEffect(() => {
    if (electionId) {
      loadActivities();
      // Refresh every 30 seconds
      const interval = setInterval(loadActivities, 30000);
      return () => clearInterval(interval);
    }
  }, [electionId, filter]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/analytics/election/${electionId}/activity?filter=${filter}`);
      setActivities(response.data.activities || []);
      setSuspiciousActivities(response.data.suspicious || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load activities:', err);
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'vote':
        return (
          <svg className="w-5 h-5 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        );
      case 'suspicious':
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        );
      case 'biometric_fail':
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
        );
      case 'ip_change':
        return (
          <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        );
    }
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/50',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    };

    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${colors[severity] || colors.low}`}>
        {severity?.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Suspicious Activity Alerts */}
      {suspiciousActivities.length > 0 && (
        <div className="backdrop-blur-xl bg-red-500/10 p-6 rounded-2xl border border-red-500/30 shadow-glow">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <h3 className="text-lg font-bold text-red-400">Suspicious Activities Detected</h3>
            <span className="ml-auto bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {suspiciousActivities.length}
            </span>
          </div>
          <div className="space-y-2">
            {suspiciousActivities.slice(0, 5).map((activity, idx) => (
              <div key={idx} className="bg-white/5 p-4 rounded-lg border border-red-500/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.description}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Voter ID: {activity.voter_id} • IP: {activity.ip_address}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {getSeverityBadge(activity.severity)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 backdrop-blur-xl bg-white/5 p-2 rounded-xl border border-white/10 w-fit">
        {['all', 'suspicious', 'normal'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 capitalize ${
              filter === f
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon-blue'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Activity Log */}
      <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          <button
            onClick={loadActivities}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:border-neon-blue transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No activities to display
            </div>
          ) : (
            activities.map((activity, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  activity.type === 'suspicious'
                    ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-gray-400 text-sm mt-1">{activity.details}</p>
                      </div>
                      {activity.severity && getSeverityBadge(activity.severity)}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Voter: {activity.voter_id || 'N/A'}</span>
                      <span>•</span>
                      <span>IP: {activity.ip_address || 'N/A'}</span>
                      <span>•</span>
                      <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="backdrop-blur-xl bg-white/5 p-4 rounded-xl border border-white/10">
          <p className="text-gray-400 text-sm mb-1">Total Activities</p>
          <p className="text-2xl font-bold text-white">{activities.length}</p>
        </div>
        <div className="backdrop-blur-xl bg-red-500/10 p-4 rounded-xl border border-red-500/30">
          <p className="text-gray-400 text-sm mb-1">Suspicious</p>
          <p className="text-2xl font-bold text-red-400">{suspiciousActivities.length}</p>
        </div>
        <div className="backdrop-blur-xl bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/30">
          <p className="text-gray-400 text-sm mb-1">Biometric Failures</p>
          <p className="text-2xl font-bold text-yellow-400">
            {activities.filter(a => a.type === 'biometric_fail').length}
          </p>
        </div>
        <div className="backdrop-blur-xl bg-blue-500/10 p-4 rounded-xl border border-blue-500/30">
          <p className="text-gray-400 text-sm mb-1">IP Changes</p>
          <p className="text-2xl font-bold text-blue-400">
            {activities.filter(a => a.type === 'ip_change').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityMonitor;
