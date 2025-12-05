import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import API from '../../api';

const AdminAuditTrail = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const res = await API.get('/admin/audit-trail');
      if (res.data.success) {
        setAuditLogs(res.data.auditLogs);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch audit trail:', error);
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'created_election':
        return (
          <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
          </svg>
        );
      case 'added_candidate':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
          </svg>
        );
      case 'deleted_election':
        return (
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
        );
      case 'modified_keys':
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
        );
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'created_election':
      case 'added_candidate':
        return 'from-green-500/20 to-blue-500/20 border-green-500/30';
      case 'deleted_election':
        return 'from-red-500/20 to-pink-500/20 border-red-500/30';
      case 'modified_keys':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const filteredLogs = filterType === 'all' 
    ? auditLogs 
    : auditLogs.filter(log => log.action === filterType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            📜 Admin Audit Trail
          </h2>
          <p className="text-sm text-gray-400 mt-1">Complete log of all administrative actions</p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all" className="bg-navy-900">All Actions</option>
            <option value="created_election" className="bg-navy-900">Created Elections</option>
            <option value="added_candidate" className="bg-navy-900">Added Candidates</option>
            <option value="deleted_election" className="bg-navy-900">Deleted Elections</option>
            <option value="modified_keys" className="bg-navy-900">Modified Keys</option>
          </select>
          
          <button 
            onClick={fetchAuditLogs} 
            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="backdrop-blur-xl bg-green-500/10 p-4 rounded-xl border border-green-500/30">
          <p className="text-sm text-gray-400 mb-1">Elections Created</p>
          <p className="text-2xl font-bold text-green-400">
            {auditLogs.filter(l => l.action === 'created_election').length}
          </p>
        </div>
        
        <div className="backdrop-blur-xl bg-blue-500/10 p-4 rounded-xl border border-blue-500/30">
          <p className="text-sm text-gray-400 mb-1">Candidates Added</p>
          <p className="text-2xl font-bold text-blue-400">
            {auditLogs.filter(l => l.action === 'added_candidate').length}
          </p>
        </div>
        
        <div className="backdrop-blur-xl bg-red-500/10 p-4 rounded-xl border border-red-500/30">
          <p className="text-sm text-gray-400 mb-1">Elections Deleted</p>
          <p className="text-2xl font-bold text-red-400">
            {auditLogs.filter(l => l.action === 'deleted_election').length}
          </p>
        </div>
        
        <div className="backdrop-blur-xl bg-purple-500/10 p-4 rounded-xl border border-purple-500/30">
          <p className="text-sm text-gray-400 mb-1">Total Actions</p>
          <p className="text-2xl font-bold text-purple-400">{auditLogs.length}</p>
        </div>
      </div>

      {/* Audit Log Timeline */}
      <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
          </svg>
          Activity Timeline
          <span className="ml-auto text-sm text-gray-400">({filteredLogs.length} events)</span>
        </h3>

        <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p>No audit logs found</p>
            </div>
          ) : (
            filteredLogs.map((log, index) => (
              <div 
                key={index}
                className={`flex items-start gap-4 p-4 bg-gradient-to-r ${getActionColor(log.action)} rounded-xl hover:scale-[1.01] transition-all duration-300 border`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  {getActionIcon(log.action)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-white font-semibold">
                      <span className="text-gray-400">{log.adminName}</span>
                      {' '}
                      <span className="text-neon-aqua">{log.action.replace(/_/g, ' ')}</span>
                      {' '}
                      <span className="text-neon-purple">{log.resourceName}</span>
                    </p>
                    <span className="text-xs text-gray-500 whitespace-nowrap bg-white/10 px-2 py-1 rounded">
                      {log.resourceType}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="text-gray-400 bg-white/5 px-2 py-1 rounded">
                      <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                      {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                    </span>
                    
                    {log.electionId && (
                      <span className="text-gray-400 bg-white/5 px-2 py-1 rounded">
                        Election ID: <span className="text-neon-pink">{log.electionId}</span>
                      </span>
                    )}
                    
                    {log.resourceId && (
                      <span className="text-gray-400 bg-white/5 px-2 py-1 rounded">
                        Resource ID: <span className="text-neon-blue">{log.resourceId}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
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
          background: rgba(168, 85, 247, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
};

export default AdminAuditTrail;
