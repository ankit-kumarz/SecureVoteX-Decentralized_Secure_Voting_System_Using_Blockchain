import React, { useState } from 'react';
import { format } from 'date-fns';
import API from '../../api';

const ExportManager = () => {
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      setExportStatus('❌ No data available to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async (type, exportFormat) => {
    setExporting(true);
    setExportStatus(`⏳ Exporting ${type}...`);

    try {
      let data = [];
      let filename = '';

      switch (type) {
        case 'elections':
          const electionsRes = await API.get('/elections');
          data = electionsRes.data.map(e => ({
            ID: e.id,
            Title: e.title,
            Description: e.description,
            'Start Date': format(new Date(e.start_date), 'yyyy-MM-dd HH:mm'),
            'End Date': format(new Date(e.end_date), 'yyyy-MM-dd HH:mm'),
            'Created At': format(new Date(e.created_at), 'yyyy-MM-dd HH:mm')
          }));
          filename = `elections_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;
          break;

        case 'candidates':
          const candidatesRes = await API.get('/candidates/all');
          data = candidatesRes.data.map(c => ({
            ID: c.id,
            Name: c.name,
            'Election ID': c.election_id,
            Party: c.party || 'Independent',
            Manifesto: c.manifesto || 'N/A',
            Image: c.image ? 'Yes' : 'No',
            'Created At': format(new Date(c.created_at), 'yyyy-MM-dd HH:mm')
          }));
          filename = `candidates_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;
          break;

        case 'voters':
          const votersRes = await API.get('/admin/users');
          const voters = votersRes.data.filter(u => u.role === 'voter');
          data = voters.map(u => ({
            ID: u.id,
            'Voter ID': u.voter_id,
            Email: u.email,
            Role: u.role,
            'Wallet Address': u.wallet_address || 'N/A',
            'Created At': format(new Date(u.created_at), 'yyyy-MM-dd HH:mm')
          }));
          filename = `voters_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;
          break;

        case 'votes':
          const votesRes = await API.get('/vote/all');
          data = votesRes.data.votes.map(v => ({
            ID: v.id,
            'Voter ID': v.voter_id,
            'Election ID': v.election_id,
            'Candidate ID': v.candidate_id,
            'Candidate Name': v.candidate_name || 'N/A',
            'Election Title': v.election_title || 'N/A',
            'Transaction Hash': v.transaction_hash || 'N/A',
            'Vote Hash': v.vote_hash || 'N/A',
            'Blockchain Status': v.blockchain_status || 'pending',
            'Created At': format(new Date(v.timestamp), 'yyyy-MM-dd HH:mm')
          }));
          filename = `votes_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;
          break;

        case 'analytics':
          const statsRes = await API.get('/admin/stats');
          const stats = statsRes.data.stats;
          data = [{
            'Total Elections': stats.totalElections,
            'Active Elections': stats.activeElections,
            'Total Voters': stats.totalVoters,
            'Total Votes': stats.totalVotes,
            'Face Verified Voters': stats.faceVerifiedVoters,
            'Pending Blockchain Sync': stats.pendingBlockchainSync,
            'Alerts Count': stats.alertsCount,
            'Average Turnout': stats.turnout ? `${stats.turnout}%` : 'N/A',
            'Report Generated': format(new Date(), 'yyyy-MM-dd HH:mm:ss')
          }];
          filename = `analytics_report_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;
          break;

        case 'fraud-alerts':
          const fraudRes = await API.get('/admin/fraud-alerts');
          const alerts = fraudRes.data.alerts;
          const allAlerts = [
            ...alerts.failedVerifications,
            ...alerts.duplicateVotes,
            ...alerts.bulkVoting
          ];
          data = allAlerts.map(a => ({
            Type: a.type.replace(/_/g, ' ').toUpperCase(),
            Severity: a.severity.toUpperCase(),
            Message: a.message,
            'Voter ID': a.voterId || 'N/A',
            'User ID': a.userId || 'N/A',
            'Election ID': a.electionId || 'N/A',
            'Attempt Count': a.attemptCount || 'N/A'
          }));
          filename = `fraud_alerts_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;
          break;

        case 'audit-trail':
          const auditRes = await API.get('/admin/audit-trail');
          data = auditRes.data.auditLogs.map(log => ({
            'Admin Name': log.adminName,
            Action: log.action.replace(/_/g, ' '),
            'Resource Type': log.resourceType,
            'Resource Name': log.resourceName,
            'Resource ID': log.resourceId || 'N/A',
            'Election ID': log.electionId || 'N/A',
            Timestamp: format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')
          }));
          filename = `audit_trail_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;
          break;

        default:
          setExportStatus('❌ Unknown export type');
          setExporting(false);
          return;
      }

      if (exportFormat === 'csv') {
        exportToCSV(data, filename);
        setExportStatus(`✅ Successfully exported ${data.length} records to ${filename}`);
      }

      setTimeout(() => setExportStatus(''), 5000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus(`❌ Export failed: ${error.message}`);
      setTimeout(() => setExportStatus(''), 5000);
    } finally {
      setExporting(false);
    }
  };

  const exportOptions = [
    {
      id: 'elections',
      name: 'Elections Data',
      description: 'Export all elections with dates, status, and details',
      icon: '📊',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'candidates',
      name: 'Candidates Data',
      description: 'Export all candidates with party and election info',
      icon: '👥',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'voters',
      name: 'Voters Data',
      description: 'Export voter registry with verification status',
      icon: '🗳️',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'votes',
      name: 'Votes & Transactions',
      description: 'Export all votes with blockchain transaction hashes',
      icon: '✅',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'analytics',
      name: 'Analytics Report',
      description: 'Export comprehensive system statistics',
      icon: '📈',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'fraud-alerts',
      name: 'Fraud Alerts',
      description: 'Export security alerts and fraud detection logs',
      icon: '🚨',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'audit-trail',
      name: 'Audit Trail',
      description: 'Export complete admin action history',
      icon: '📜',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            📥 Export Manager
          </h2>
          <p className="text-sm text-gray-400 mt-1">Download system data in various formats</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-white/10 border border-white/20 text-gray-300 rounded-lg">
            <span className="text-xs">Format: </span>
            <span className="font-bold">CSV</span>
          </div>
        </div>
      </div>

      {/* Export Status */}
      {exportStatus && (
        <div className={`backdrop-blur-xl p-4 rounded-xl border ${
          exportStatus.includes('✅') ? 'bg-green-500/10 border-green-500/30' :
          exportStatus.includes('❌') ? 'bg-red-500/10 border-red-500/30' :
          'bg-blue-500/10 border-blue-500/30'
        }`}>
          <p className={`text-sm font-semibold ${
            exportStatus.includes('✅') ? 'text-green-400' :
            exportStatus.includes('❌') ? 'text-red-400' :
            'text-blue-400'
          }`}>
            {exportStatus}
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 rounded-2xl border border-blue-500/30">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
          </svg>
          Quick Export
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleExport('elections', 'csv')}
            disabled={exporting}
            className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Export All Elections
          </button>
          <button
            onClick={() => handleExport('candidates', 'csv')}
            disabled={exporting}
            className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Export All Candidates
          </button>
          <button
            onClick={() => handleExport('votes', 'csv')}
            disabled={exporting}
            className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Export All Votes
          </button>
          <button
            onClick={() => handleExport('analytics', 'csv')}
            disabled={exporting}
            className="px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Export Analytics Report
          </button>
        </div>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportOptions.map((option) => (
          <div
            key={option.id}
            className={`backdrop-blur-xl bg-gradient-to-br ${option.color}/10 p-6 rounded-2xl border ${option.color.replace('from-', 'border-').split(' ')[0]}/30 hover:scale-[1.02] transition-all duration-300`}
          >
            <div className="text-4xl mb-3">{option.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{option.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{option.description}</p>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleExport(option.id, 'csv')}
                disabled={exporting}
                className={`flex-1 px-4 py-2 bg-gradient-to-r ${option.color} text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg`}
              >
                {exporting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Exporting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    Export CSV
                  </span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div>
            <h4 className="text-white font-bold mb-2">Export Information</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• CSV format is compatible with Excel, Google Sheets, and most database tools</li>
              <li>• All exports include timestamps for tracking and audit purposes</li>
              <li>• Sensitive data like passwords and private keys are never included in exports</li>
              <li>• Large datasets may take a few moments to prepare for download</li>
              <li>• Export files are generated fresh each time to ensure data accuracy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportManager;
