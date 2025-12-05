import React, { useState, useEffect } from 'react';
import API from '../../api';

const BlockchainMonitor = ({ electionId }) => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (electionId) {
      loadBlockchainData();
      // Refresh every minute
      const interval = setInterval(loadBlockchainData, 60000);
      return () => clearInterval(interval);
    }
  }, [electionId]);

  const loadBlockchainData = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/analytics/election/${electionId}/blockchain`);
      setTransactions(response.data.transactions || []);
      setStats(response.data.stats || {});
      setLoading(false);
    } catch (err) {
      console.error('Failed to load blockchain data:', err);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      confirmed: 'bg-green-500/20 text-green-400 border-green-500/50',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      failed: 'bg-red-500/20 text-red-400 border-red-500/50',
    };

    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${colors[status] || colors.pending}`}>
        {status?.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Blockchain Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="backdrop-blur-xl bg-gradient-to-br from-neon-purple/10 to-neon-pink/10 p-6 rounded-xl border border-neon-purple/30 shadow-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Transactions</p>
              <p className="text-3xl font-bold text-white">{stats?.totalTransactions || 0}</p>
            </div>
            <svg className="w-12 h-12 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-neon-aqua/10 p-6 rounded-xl border border-green-500/30 shadow-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Confirmed</p>
              <p className="text-3xl font-bold text-green-400">{stats?.confirmed || 0}</p>
            </div>
            <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 rounded-xl border border-yellow-500/30 shadow-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-400">{stats?.pending || 0}</p>
            </div>
            <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 p-6 rounded-xl border border-neon-blue/30 shadow-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Gas Used</p>
              <p className="text-3xl font-bold text-white">{stats?.totalGas || '0'}</p>
            </div>
            <svg className="w-12 h-12 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Recent Blockchain Transactions</h3>
          <button
            onClick={loadBlockchainData}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:border-neon-purple transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Tx Hash</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Receipt Hash</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Block</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Gas</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Timestamp</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">
                    No blockchain transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((tx, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <code className="text-neon-blue text-xs font-mono">
                        {tx.tx_hash?.substring(0, 10)}...{tx.tx_hash?.substring(tx.tx_hash.length - 8)}
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-gray-400 text-xs font-mono">
                        {tx.receipt_hash?.substring(0, 10)}...
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(tx.status)}
                    </td>
                    <td className="py-3 px-4 text-white">{tx.block_number || 'Pending'}</td>
                    <td className="py-3 px-4 text-gray-300">{tx.gas_used || '-'}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : '-'}
                    </td>
                    <td className="py-3 px-4">
                      {tx.tx_hash && (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${tx.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-aqua hover:text-neon-purple transition-colors flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                          </svg>
                          View
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Network Info */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 p-6 rounded-xl border border-neon-purple/30">
        <h4 className="text-lg font-bold text-white mb-4">Network Information</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Network</p>
            <p className="text-white font-medium">Sepolia Testnet</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Contract Address</p>
            <code className="text-neon-aqua text-xs font-mono">
              {stats?.contractAddress?.substring(0, 10)}...
            </code>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Average Gas Price</p>
            <p className="text-white font-medium">{stats?.avgGasPrice || '0'} Gwei</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Last Block</p>
            <p className="text-white font-medium">{stats?.latestBlock || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainMonitor;
