import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import API from '../../api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const VotingStatistics = ({ electionId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h'); // 24h, 7d, 30d, all

  useEffect(() => {
    if (electionId) {
      loadStatistics();
    }
  }, [electionId, timeRange]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/analytics/election/${electionId}/statistics?range=${timeRange}`);
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load statistics:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-400">
        No statistics available
      </div>
    );
  }

  // Candidate votes chart data
  const candidateChartData = {
    labels: stats.candidateVotes?.map(c => c.name) || [],
    datasets: [
      {
        label: 'Votes',
        data: stats.candidateVotes?.map(c => c.votes) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 211, 238, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(74, 222, 128, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(147, 51, 234)',
          'rgb(236, 72, 153)',
          'rgb(34, 211, 238)',
          'rgb(251, 146, 60)',
          'rgb(74, 222, 128)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Turnout chart data
  const turnoutChartData = {
    labels: ['Voted', 'Not Voted'],
    datasets: [
      {
        data: [stats.totalVotes || 0, (stats.totalEligibleVoters || 0) - (stats.totalVotes || 0)],
        backgroundColor: [
          'rgba(34, 211, 238, 0.8)',
          'rgba(71, 85, 105, 0.5)',
        ],
        borderColor: [
          'rgb(34, 211, 238)',
          'rgb(71, 85, 105)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Hourly votes trend
  const hourlyTrendData = {
    labels: stats.hourlyTrend?.map(h => h.hour) || [],
    datasets: [
      {
        label: 'Votes per Hour',
        data: stats.hourlyTrend?.map(h => h.count) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb',
          font: {
            family: 'Poppins',
            size: 12,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e5e7eb',
          font: {
            family: 'Poppins',
            size: 12,
          },
        },
      },
    },
  };

  const turnoutPercentage = stats.totalEligibleVoters > 0
    ? ((stats.totalVotes / stats.totalEligibleVoters) * 100).toFixed(2)
    : 0;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2 backdrop-blur-xl bg-white/5 p-2 rounded-xl border border-white/10 w-fit">
        {['24h', '7d', '30d', 'all'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              timeRange === range
                ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon-blue'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {range === '24h' ? 'Last 24h' : range === '7d' ? 'Last 7d' : range === '30d' ? 'Last 30d' : 'All Time'}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="backdrop-blur-xl bg-gradient-to-br from-neon-blue/10 to-neon-purple/10 p-6 rounded-xl border border-neon-blue/30 shadow-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Votes</p>
              <p className="text-3xl font-bold text-white">{stats.totalVotes || 0}</p>
            </div>
            <svg className="w-12 h-12 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-neon-purple/10 to-neon-pink/10 p-6 rounded-xl border border-neon-purple/30 shadow-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Turnout Rate</p>
              <p className="text-3xl font-bold text-white">{turnoutPercentage}%</p>
            </div>
            <svg className="w-12 h-12 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-neon-pink/10 to-neon-aqua/10 p-6 rounded-xl border border-neon-pink/30 shadow-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Eligible Voters</p>
              <p className="text-3xl font-bold text-white">{stats.totalEligibleVoters || 0}</p>
            </div>
            <svg className="w-12 h-12 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-gradient-to-br from-neon-aqua/10 to-neon-blue/10 p-6 rounded-xl border border-neon-aqua/30 shadow-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Encrypted Votes</p>
              <p className="text-3xl font-bold text-white">{stats.encryptedVotes || 0}</p>
            </div>
            <svg className="w-12 h-12 text-neon-aqua" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Votes Bar Chart */}
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow">
          <h3 className="text-xl font-bold text-white mb-4">Votes by Candidate</h3>
          <div className="h-80">
            <Bar data={candidateChartData} options={chartOptions} />
          </div>
        </div>

        {/* Turnout Doughnut Chart */}
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow">
          <h3 className="text-xl font-bold text-white mb-4">Voter Turnout</h3>
          <div className="h-80">
            <Doughnut data={turnoutChartData} options={doughnutOptions} />
          </div>
        </div>

        {/* Hourly Trend Line Chart */}
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 shadow-glow lg:col-span-2">
          <h3 className="text-xl font-bold text-white mb-4">Voting Activity Trend</h3>
          <div className="h-80">
            <Line data={hourlyTrendData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingStatistics;
