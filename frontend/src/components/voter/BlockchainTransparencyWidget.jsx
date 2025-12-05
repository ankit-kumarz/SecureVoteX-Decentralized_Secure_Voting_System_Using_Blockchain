import React, { useState, useEffect } from 'react';

/**
 * Blockchain Transparency Widget Component
 * Shows live blockchain status and network information
 */
const BlockchainTransparencyWidget = () => {
  const [blockchainData, setBlockchainData] = useState({
    blockNumber: null,
    blockTimestamp: null,
    contractAddress: null,
    network: 'Sepolia Testnet',
    status: 'Checking...'
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchBlockchainData();
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchBlockchainData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const fetchBlockchainData = async () => {
    try {
      // Use public Sepolia RPC endpoint
      const rpcUrl = 'https://rpc.sepolia.org';
      
      // Get latest block number using JSON-RPC
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
      
      // Get block details
      const blockResponse = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBlockByNumber',
          params: [blockNumData.result, false],
          id: 2
        })
      });
      
      const blockData = await blockResponse.json();
      const blockTimestamp = parseInt(blockData.result.timestamp, 16);
      
      // Contract address from environment or placeholder
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
      
      setBlockchainData({
        blockNumber,
        blockTimestamp,
        contractAddress,
        network: 'Sepolia Testnet',
        status: 'Synced'
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch blockchain data:', err);
      setBlockchainData(prev => ({
        ...prev,
        status: 'Error'
      }));
      setLoading(false);
    }
  };
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Synced': return 'text-green-400';
      case 'Pending': return 'text-yellow-400';
      case 'Error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };
  
  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-neon-aqua/10 to-blue-500/10 p-6 rounded-2xl border border-neon-aqua/30 shadow-glow mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-aqua to-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-aqua to-blue-400 bg-clip-text text-transparent">
              🧾 Blockchain Status
            </h2>
            <p className="text-gray-400 text-sm">Live network transparency</p>
          </div>
        </div>
        
        <button
          onClick={fetchBlockchainData}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Refresh"
        >
          <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>
      
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Latest Block */}
          <div className="backdrop-blur-xl bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-neon-aqua" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"/>
              </svg>
              <span className="text-sm text-gray-400">Latest Block</span>
            </div>
            <p className="text-2xl font-bold text-white">
              #{blockchainData.blockNumber?.toLocaleString() || 'N/A'}
            </p>
          </div>
          
          {/* Block Timestamp */}
          <div className="backdrop-blur-xl bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-neon-aqua" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm text-gray-400">Latest Block Time</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {formatTimestamp(blockchainData.blockTimestamp)}
            </p>
          </div>
          
          {/* Smart Contract */}
          <div className="backdrop-blur-xl bg-white/5 p-4 rounded-lg border border-white/10 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-neon-aqua" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm text-gray-400">Smart Contract Address</span>
            </div>
            <p className="text-sm font-mono text-neon-aqua break-all">
              {blockchainData.contractAddress}
            </p>
          </div>
          
          {/* Network */}
          <div className="backdrop-blur-xl bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-neon-aqua" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm text-gray-400">Network</span>
            </div>
            <p className="text-lg font-bold text-white">{blockchainData.network}</p>
          </div>
          
          {/* System Status */}
          <div className="backdrop-blur-xl bg-white/5 p-4 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-neon-aqua" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm text-gray-400">System Status</span>
            </div>
            <p className={`text-lg font-bold ${getStatusColor(blockchainData.status)}`}>
              {blockchainData.status}
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300">Live updates every 30 seconds</span>
        </div>
        <a
          href={`https://sepolia.etherscan.io/address/${blockchainData.contractAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-neon-aqua hover:underline"
        >
          View on Explorer →
        </a>
      </div>
    </div>
  );
};

export default BlockchainTransparencyWidget;
