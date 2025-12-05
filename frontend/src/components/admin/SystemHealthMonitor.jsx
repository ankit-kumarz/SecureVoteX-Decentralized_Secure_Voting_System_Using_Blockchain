import React, { useState, useEffect } from 'react';
import API from '../../api';

const SystemHealthMonitor = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blockchainData, setBlockchainData] = useState({
    blockNumber: null,
    syncing: false
  });

  useEffect(() => {
    fetchHealth();
    fetchBlockchainInfo();
    
    const healthInterval = setInterval(fetchHealth, 15000); // 15s
    const blockchainInterval = setInterval(fetchBlockchainInfo, 30000); // 30s
    
    return () => {
      clearInterval(healthInterval);
      clearInterval(blockchainInterval);
    };
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await API.get('/admin/system-health');
      if (res.data.success) {
        setHealth(res.data.health);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch system health:', error);
      setLoading(false);
    }
  };

  const fetchBlockchainInfo = async () => {
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
      
      setBlockchainData({
        blockNumber,
        syncing: false
      });
    } catch (error) {
      console.error('Failed to fetch blockchain info:', error);
    }
  };

  const getStatusIndicator = (status) => {
    switch (status) {
      case 'healthy': return { color: 'green', icon: '🟢', label: 'Healthy', pulse: 'animate-pulse' };
      case 'warning': return { color: 'yellow', icon: '🟡', label: 'Warning', pulse: 'animate-pulse' };
      case 'critical': return { color: 'red', icon: '🔴', label: 'Critical', pulse: 'animate-pulse' };
      default: return { color: 'gray', icon: '⚪', label: 'Unknown', pulse: '' };
    }
  };

  const ComponentStatus = ({ name, status, details, icon }) => {
    const indicator = getStatusIndicator(status.status);
    
    return (
      <div className={`backdrop-blur-xl bg-${indicator.color}-500/10 p-6 rounded-2xl border border-${indicator.color}-500/30 hover:scale-[1.02] transition-all duration-300`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br from-${indicator.color}-500 to-${indicator.color}-600 rounded-xl flex items-center justify-center shadow-lg`}>
              {icon}
            </div>
            <h3 className="text-lg font-bold text-white">{name}</h3>
          </div>
          <span className={`text-3xl ${indicator.pulse}`}>{indicator.icon}</span>
        </div>
        
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold bg-${indicator.color}-500/20 text-${indicator.color}-400 border border-${indicator.color}-500/50`}>
            {indicator.label}
          </span>
        </div>
        
        <div className="space-y-2 text-sm">
          {Object.entries(details || {}).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
              <span className="text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
              <span className="text-white font-semibold">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading || !health) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const overallIndicator = getStatusIndicator(health.overall);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            🏥 System Health Monitor
          </h2>
          <p className="text-sm text-gray-400 mt-1">Real-time System Status & Performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-6 py-3 rounded-xl font-bold text-lg shadow-lg ${
            health.overall === 'healthy' ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50' :
            health.overall === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/50' :
            'bg-red-500/20 text-red-400 border-2 border-red-500/50'
          }`}>
            <span className="mr-2">{overallIndicator.icon}</span>
            Overall: {overallIndicator.label}
          </span>
          <button 
            onClick={() => { fetchHealth(); fetchBlockchainInfo(); }}
            className="px-4 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
      </div>

      {/* System Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComponentStatus 
          name="Database Server" 
          status={health.components.database} 
          details={{ 
            'Tables Count': health.components.database.tablesCount,
            'Status': health.components.database.status.toUpperCase()
          }}
          icon={
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
            </svg>
          }
        />

        <ComponentStatus 
          name="API Server" 
          status={health.components.apiServer}
          details={{ 
            'Uptime': `${Math.floor(health.components.apiServer.uptime / 60)} minutes`,
            'Status': health.components.apiServer.status.toUpperCase()
          }}
          icon={
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/>
            </svg>
          }
        />

        <ComponentStatus 
          name="Blockchain Node" 
          status={health.components.blockchainNode}
          details={{ 
            'Network': health.components.blockchainNode.network,
            'Latest Block': blockchainData.blockNumber || 'Fetching...',
            'Contract': health.components.blockchainNode.contractAddress.substring(0, 10) + '...'
          }}
          icon={
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          }
        />

        <ComponentStatus 
          name="Face Recognition" 
          status={health.components.faceRecognition}
          details={{ 
            'Registered Profiles': health.components.faceRecognition.registeredProfiles,
            'Status': health.components.faceRecognition.status.toUpperCase()
          }}
          icon={
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          }
        />
      </div>

      {/* Blockchain Live Data */}
      <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 rounded-2xl border border-blue-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">⛓️</span>
            Sepolia Testnet Status
            <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full animate-pulse">
              LIVE
            </span>
          </h3>
          <a
            href={`https://sepolia.etherscan.io/block/${blockchainData.blockNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-semibold"
          >
            View on Etherscan →
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-sm text-gray-400 mb-1">Latest Block</p>
            <p className="text-2xl font-bold text-blue-400">{blockchainData.blockNumber?.toLocaleString() || '...'}</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-sm text-gray-400 mb-1">Network</p>
            <p className="text-2xl font-bold text-purple-400">Sepolia</p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-sm text-gray-400 mb-1">Sync Status</p>
            <p className="text-2xl font-bold text-green-400">
              {blockchainData.syncing ? 'Syncing...' : 'Synced ✓'}
            </p>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      {health.overall !== 'healthy' && (
        <div className="backdrop-blur-xl bg-yellow-500/10 p-6 rounded-2xl border border-yellow-500/30">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <div>
              <h4 className="text-yellow-400 font-bold text-lg mb-2">System Warnings Detected</h4>
              <p className="text-gray-300 text-sm">
                One or more system components require attention. Please review the component status above.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemHealthMonitor;
