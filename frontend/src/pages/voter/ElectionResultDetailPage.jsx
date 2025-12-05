import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import html2pdf from 'html2pdf.js';
import api from '../../api';

const COLORS = ['#06b6d4', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

const ElectionResultDetailPage = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);
  const [results, setResults] = useState([]);
  const [myVote, setMyVote] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);
  const certificateRef = React.useRef(null);

  useEffect(() => {
    fetchElectionData();
  }, [electionId]);

  const fetchElectionData = async () => {
    try {
      setLoading(true);
      
      // Fetch election details
      const electionRes = await api.get(`/api/election/${electionId}`);
      setElection(electionRes.data);

      // Fetch results
      const resultsRes = await api.get(`/api/vote/results/${electionId}`);
      setResults(resultsRes.data);

      // Fetch my vote
      try {
        const myVoteRes = await api.get(`/api/vote/my-vote/${electionId}`);
        setMyVote(myVoteRes.data);
      } catch (err) {
        console.log('No vote found for this election');
      }

      // Fetch blockchain data if available
      if (electionRes.data.blockchain_tx_hash) {
        setBlockchainData({
          txHash: electionRes.data.blockchain_tx_hash,
          blockNumber: electionRes.data.block_number || 'N/A',
          timestamp: electionRes.data.blockchain_timestamp || Date.now()
        });
      }

    } catch (error) {
      console.error('Error fetching election data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    const element = certificateRef.current;
    const options = {
      margin: 10,
      filename: `election-result-${electionId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const getTotalVotes = () => {
    return results.reduce((sum, r) => sum + (r.votes || 0), 0);
  };

  const getWinner = () => {
    if (results.length === 0) return null;
    return results.reduce((max, r) => (r.votes > max.votes ? r : max), results[0]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-aqua"></div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Election not found</h2>
          <button
            onClick={() => navigate('/voter')}
            className="px-6 py-3 bg-neon-purple text-white rounded-xl hover:scale-105 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalVotes = getTotalVotes();
  const winner = getWinner();
  const pieData = results.map(r => ({
    name: r.candidate_name,
    value: r.votes || 0
  }));

  const barData = results.map(r => ({
    name: r.candidate_name.length > 15 ? r.candidate_name.substring(0, 15) + '...' : r.candidate_name,
    votes: r.votes || 0,
    percentage: totalVotes > 0 ? ((r.votes / totalVotes) * 100).toFixed(1) : 0
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/voter')}
            className="flex items-center text-neon-aqua hover:text-white transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>
          
          <button
            onClick={handleDownloadCertificate}
            className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold rounded-xl hover:scale-105 transition-all shadow-neon-purple flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Download Certificate
          </button>
        </div>

        {/* Certificate Content (for PDF) */}
        <div ref={certificateRef} className="space-y-6">
          {/* Election Info Card */}
          <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-glow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent mb-4">
                  {election.title}
                </h1>
                <p className="text-gray-300 text-lg mb-6">{election.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-neon-aqua/30">
                    <p className="text-sm text-gray-400 mb-1">Start Date</p>
                    <p className="text-neon-aqua font-semibold">
                      {format(new Date(election.start_time), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-xl border border-neon-purple/30">
                    <p className="text-sm text-gray-400 mb-1">End Date</p>
                    <p className="text-neon-purple font-semibold">
                      {format(new Date(election.end_time), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-xl border border-neon-pink/30">
                    <p className="text-sm text-gray-400 mb-1">Total Votes</p>
                    <p className="text-neon-pink font-semibold text-2xl">{totalVotes}</p>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-xl border border-green-500/30">
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    <p className="text-green-400 font-semibold">
                      {new Date() > new Date(election.end_time) ? 'Completed' : 'Active'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Winner Announcement */}
          {winner && totalVotes > 0 && (
            <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 p-8 rounded-2xl border border-yellow-500/30 shadow-glow">
              <div className="text-center">
                <div className="inline-block p-4 bg-yellow-500/20 rounded-full mb-4">
                  <svg className="w-16 h-16 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">🎉 Winner</h2>
                <p className="text-4xl font-bold text-white mb-2">{winner.candidate_name}</p>
                <p className="text-xl text-gray-300">
                  {winner.votes} votes ({((winner.votes / totalVotes) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          )}

          {/* My Vote Card */}
          {myVote && (
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-neon-purple/30 shadow-glow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-neon-purple/20 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Your Vote</h3>
                  <p className="text-sm text-gray-400">
                    Cast on {format(new Date(myVote.timestamp), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-xl border border-neon-purple/30">
                <p className="text-sm text-gray-400 mb-2">You voted for:</p>
                <p className="text-2xl font-bold text-neon-purple">{myVote.candidate_name}</p>
                {myVote.blockchain_tx_hash && (
                  <p className="text-xs text-gray-500 mt-2 font-mono break-all">
                    TX: {myVote.blockchain_tx_hash}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-neon-aqua" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
                </svg>
                Vote Distribution
              </h3>
              
              {totalVotes > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No votes cast yet
                </div>
              )}
            </div>

            {/* Bar Chart */}
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                Vote Comparison
              </h3>
              
              {totalVotes > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9ca3af"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value, name) => {
                        if (name === 'votes') {
                          const item = barData.find(d => d.votes === value);
                          return [`${value} (${item?.percentage}%)`, 'Votes'];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="votes" fill="#a855f7" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  No votes cast yet
                </div>
              )}
            </div>
          </div>

          {/* Detailed Results Table */}
          <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              Detailed Results
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Rank</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Candidate</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Party</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Votes</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr 
                      key={result.candidate_id} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          index === 1 ? 'bg-gray-400/20 text-gray-400' :
                          index === 2 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-white/5 text-gray-500'
                        } font-bold`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white font-semibold">{result.candidate_name}</td>
                      <td className="py-4 px-4 text-gray-300">{result.party || 'Independent'}</td>
                      <td className="py-4 px-4 text-right text-neon-aqua font-bold text-lg">
                        {result.votes || 0}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end">
                          <div className="w-24 h-2 bg-white/10 rounded-full mr-3 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all duration-500"
                              style={{ 
                                width: totalVotes > 0 ? `${(result.votes / totalVotes) * 100}%` : '0%' 
                              }}
                            ></div>
                          </div>
                          <span className="text-neon-purple font-semibold w-16 text-right">
                            {totalVotes > 0 ? ((result.votes / totalVotes) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Blockchain Verification */}
          {blockchainData && (
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-neon-aqua/30 shadow-glow">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-neon-aqua" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                Blockchain Verification
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-sm text-gray-400 mb-2">Transaction Hash</p>
                  <p className="text-neon-aqua font-mono text-xs break-all">
                    {blockchainData.txHash}
                  </p>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${blockchainData.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-purple text-xs hover:underline mt-2 inline-block"
                  >
                    View on Etherscan →
                  </a>
                </div>
                
                <div className="bg-white/5 p-4 rounded-xl">
                  <p className="text-sm text-gray-400 mb-2">Block Number</p>
                  <p className="text-white font-semibold">{blockchainData.blockNumber}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {format(new Date(blockchainData.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="flex items-center text-green-400">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="font-semibold">Verified on Sepolia Testnet</span>
                </div>
                <p className="text-sm text-gray-300 mt-2">
                  This election result is permanently recorded on the Ethereum blockchain and cannot be altered.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElectionResultDetailPage;