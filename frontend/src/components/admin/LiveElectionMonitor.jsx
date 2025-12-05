import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import API from '../../api';

const COLORS = ['#06b6d4', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

/**
 * Live Election Monitoring Dashboard
 * Real-time monitoring with auto-refresh every 5-10 seconds
 */
const LiveElectionMonitor = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [monitorData, setMonitorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(10); // seconds

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      fetchMonitorData(selectedElection);
      const interval = setInterval(() => {
        fetchMonitorData(selectedElection);
      }, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [selectedElection, refreshInterval]);

  const fetchElections = async () => {
    try {
      const res = await API.get('/elections');
      setElections(res.data);
      if (res.data.length > 0) {
        setSelectedElection(res.data[0].election_id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch elections:', error);
      setLoading(false);
    }
  };

  const fetchMonitorData = async (electionId) => {
    try {
      const res = await API.get(`/admin/election-monitor/${electionId}`);
      if (res.data.success) {
        setMonitorData(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch monitor data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    );
  }

  if (elections.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No elections available for monitoring</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">📡 Live Election Monitor</h2>
          <p className="text-sm text-gray-400">Real-time monitoring • Auto-refresh every {refreshInterval}s</p>
        </div>
        
        <div className="flex gap-3">
          {/* Election Selector */}
          <select
            value={selectedElection || ''}
            onChange={(e) => setSelectedElection(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-purple"
          >
            {elections.map(election => (
              <option key={election.election_id} value={election.election_id} className="bg-navy-900">
                {election.title}
              </option>
            ))}
          </select>

          {/* Refresh Interval */}
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-aqua"
          >
            <option value={5} className="bg-navy-900">5s refresh</option>
            <option value={10} className="bg-navy-900">10s refresh</option>
            <option value={30} className="bg-navy-900">30s refresh</option>
          </select>
        </div>
      </div>

      {/* Live Stats Cards */}
      {monitorData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="backdrop-blur-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 p-6 rounded-2xl border border-neon-blue/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-400">Total Votes</h3>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-4xl font-bold text-neon-blue">{monitorData.monitoring.totalVotes}</p>
              <p className="text-xs text-gray-500 mt-1">of {monitorData.monitoring.totalEligibleVoters} eligible</p>
            </div>

            <div className="backdrop-blur-xl bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 p-6 rounded-2xl border border-neon-purple/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-400">Voter Turnout</h3>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-4xl font-bold text-neon-purple">{monitorData.monitoring.turnoutPercentage}%</p>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-neon-purple to-neon-pink h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(monitorData.monitoring.turnoutPercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-gradient-to-br from-neon-pink/20 to-neon-aqua/20 p-6 rounded-2xl border border-neon-pink/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-400">Election Status</h3>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold text-neon-pink">
                {new Date() < new Date(monitorData.election.start_time) ? 'Upcoming' :
                 new Date() > new Date(monitorData.election.end_time) ? 'Completed' : 'Active'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {format(new Date(monitorData.election.end_time), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vote Distribution - Pie Chart */}
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-neon-aqua" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                </svg>
                Vote Distribution
              </h3>
              
              {monitorData.monitoring.voteDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={monitorData.monitoring.voteDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, votes }) => `${name}: ${votes}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="votes"
                    >
                      {monitorData.monitoring.voteDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px'
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

            {/* Vote Distribution - Bar Chart */}
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                Candidate Comparison
              </h3>
              
              {monitorData.monitoring.voteDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monitorData.monitoring.voteDistribution}>
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
                        borderRadius: '8px'
                      }} 
                    />
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

          {/* Hourly Votes Line Chart */}
          {monitorData.monitoring.hourlyVotes.length > 0 && (
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                </svg>
                Voting Activity (Last 24 Hours)
              </h3>
              
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monitorData.monitoring.hourlyVotes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#9ca3af"
                    tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                  />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(value) => format(new Date(value), 'MMM dd, HH:mm')}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#ec4899" 
                    strokeWidth={2}
                    dot={{ fill: '#ec4899', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Votes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Live Activity Timeline */}
          <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-neon-aqua" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Live Activity Feed
                <span className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                  LIVE
                </span>
              </h3>
              <p className="text-sm text-gray-400">Last 50 votes</p>
            </div>

            <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-2">
              {monitorData.monitoring.recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/10"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-neon-aqua to-neon-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      Voter <span className="text-neon-aqua">{activity.voter_id}</span> voted for <span className="text-neon-purple">{activity.candidate_name}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(activity.vote_timestamp), 'MMM dd, yyyy HH:mm:ss')}
                    </p>
                  </div>
                  
                  {activity.tx_hash && (
                    <div className="flex-shrink-0">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${activity.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-neon-blue hover:text-neon-aqua"
                        title="View on Etherscan"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              ))}
              
              {monitorData.monitoring.recentActivity.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

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

export default LiveElectionMonitor;
