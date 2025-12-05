import React, { useState, useEffect } from 'react';
import API from '../api';

const TransactionLogs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      // This assumes an endpoint like /logs exists
      const res = await API.get('/logs');
      setLogs(res.data);
    } catch (err) {
      setError('Failed to fetch logs');
    }
  };

  const exportCSV = () => {
    const csvRows = [
      ['Voter ID', 'Candidate', 'Tx Hash'],
      ...logs.map(l => [l.voter_id, l.candidate_id, l.tx_hash])
    ];
    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction_logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={exportCSV} 
        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-neon-aqua hover:shadow-neon-blue hover:scale-105 transition-all duration-300 flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
        </svg>
        Export CSV
      </button>
      
      {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
      
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-96">
          <table className="w-full">
            <thead>
              <tr className="bg-white/10 border-b border-white/10">
                <th className="p-4 text-left text-gray-300 font-semibold">Voter ID</th>
                <th className="p-4 text-left text-gray-300 font-semibold">Candidate</th>
                <th className="p-4 text-left text-gray-300 font-semibold">Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-400">No transaction logs available</td>
                </tr>
              ) : (
                logs.map((l, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white">{l.voter_id}</td>
                    <td className="p-4 text-gray-300">
                      {l.candidate_name ? `${l.candidate_name} (${l.candidate_party})` : l.candidate_id}
                    </td>
                    <td className="p-4">
                      {l.tx_hash ? (
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${l.tx_hash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-neon-aqua hover:text-neon-blue transition-colors font-mono text-sm flex items-center"
                        >
                          {l.tx_hash.slice(0, 10)}...{l.tx_hash.slice(-8)}
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                          </svg>
                        </a>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionLogs;
