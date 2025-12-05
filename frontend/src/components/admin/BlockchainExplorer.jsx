import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import API from '../../api';

const BlockchainExplorer = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [blockchainStats, setBlockchainStats] = useState({
    latestBlock: null,
    totalTransactions: 0,
    syncStatus: 'synced'
  });

  useEffect(() => {
    fetchVotes();
    fetchBlockchainStats();
  }, []);

  const fetchVotes = async () => {
    try {
      const res = await API.get('/vote/all');
      if (res.data.success) {
        setVotes(res.data.votes);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch votes:', error);
      setLoading(false);
    }
  };

  const fetchBlockchainStats = async () => {
    try {
      const rpcUrl = 'https://rpc.sepolia.org';
      const blockNumResponse = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        })
      });
      
      const blockNumData = await blockNumResponse.json();
      const blockNumber = parseInt(blockNumData.result, 16);
      
      setBlockchainStats({
        latestBlock: blockNumber,
        totalTransactions: votes.length,
        syncStatus: 'synced'
      });
    } catch (error) {
      console.error('Failed to fetch blockchain stats:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredVotes = votes.filter(vote => {
    const matchesSearch = searchQuery === '' || 
      vote.voter_id?.toString().includes(searchQuery) ||
      vote.election_id?.toString().includes(searchQuery) ||
      vote.transaction_hash?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vote.vote_hash?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || vote.blockchain_status === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded-full text-xs font-bold">
            ✓ Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded-full text-xs font-bold animate-pulse">
            ⏳ Pending
          </span>
        );
      case 'failed':
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded-full text-xs font-bold">
            ✗ Failed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-500/20 text-gray-400 border border-gray-500/50 rounded-full text-xs font-bold">
            ? Unknown
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
            ⛓️ Blockchain Explorer
          </h2>
          <p className="text-sm text-gray-400 mt-1">Explore and verify blockchain transactions</p>
        </div>
        
        <a
          href="https://sepolia.etherscan.io"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all font-semibold"
        >
          View on Etherscan →
        </a>
      </div>

      {/* Blockchain Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-2xl border border-blue-500/30 hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400 font-medium">Latest Block</h3>
            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          </div>
          <p className="text-4xl font-bold text-blue-400">
            {blockchainStats.latestBlock?.toLocaleString() || '...'}
          </p>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 p-6 rounded-2xl border border-cyan-500/30 hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400 font-medium">Total Transactions</h3>
            <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          </div>
          <p className="text-4xl font-bold text-cyan-400">{votes.length}</p>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-teal-500/20 to-green-500/20 p-6 rounded-2xl border border-teal-500/30 hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-400 font-medium">Network Status</h3>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-4xl font-bold text-teal-400 capitalize">{blockchainStats.syncStatus}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">Search Transactions</label>
            <div className="relative">
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by voter ID, election ID, tx hash, or vote hash..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              />
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <label className="block text-sm text-gray-400 mb-2">Filter by Status</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all" className="bg-navy-900">All Status</option>
              <option value="confirmed" className="bg-navy-900">Confirmed</option>
              <option value="pending" className="bg-navy-900">Pending</option>
              <option value="failed" className="bg-navy-900">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd"/>
            </svg>
            Transaction Records
            <span className="ml-auto text-sm text-gray-400">({filteredVotes.length} results)</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredVotes.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p>No transactions found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-white/5 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Voter ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Election ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Transaction Hash
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Vote Hash
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredVotes.map((vote) => (
                    <tr key={vote.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-neon-aqua font-mono text-sm">
                          {vote.voter_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-neon-purple font-mono text-sm">
                          {vote.election_id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-blue-400 text-xs bg-white/10 px-2 py-1 rounded">
                            {vote.transaction_hash ? 
                              `${vote.transaction_hash.substring(0, 10)}...${vote.transaction_hash.substring(vote.transaction_hash.length - 8)}` 
                              : 'N/A'
                            }
                          </code>
                          {vote.transaction_hash && (
                            <button
                              onClick={() => navigator.clipboard.writeText(vote.transaction_hash)}
                              className="text-gray-400 hover:text-white"
                              title="Copy full hash"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-green-400 text-xs bg-white/10 px-2 py-1 rounded">
                          {vote.vote_hash ? 
                            `${vote.vote_hash.substring(0, 10)}...${vote.vote_hash.substring(vote.vote_hash.length - 8)}` 
                            : 'N/A'
                          }
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(vote.blockchain_status || 'confirmed')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {vote.timestamp ? format(new Date(vote.timestamp), 'MMM dd, yyyy HH:mm') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {vote.transaction_hash && (
                          <a
                            href={`https://sepolia.etherscan.io/tx/${vote.transaction_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded hover:bg-blue-500/30 transition-all text-xs font-semibold"
                          >
                            View
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                            </svg>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default BlockchainExplorer;
