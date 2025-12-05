import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import API from '../api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const ResultsAnalytics = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      fetchCandidates(selectedElection);
      fetchVotes(selectedElection);
    }
  }, [selectedElection]);

  const fetchElections = async () => {
    const res = await API.get('/elections');
    setElections(res.data);
    if (res.data.length > 0) setSelectedElection(res.data[0].id);
  };

  const fetchCandidates = async (electionId) => {
    const res = await API.get(`/candidates/${electionId}`);
    setCandidates(res.data);
  };

  const fetchVotes = async (electionId) => {
    const res = await API.get(`/vote/election/${electionId}`);
    setVotes(res.data);
  };

  const voteCounts = candidates.map(c => votes.filter(v => v.candidate_id === c.id).length);
  const totalVotes = voteCounts.reduce((a, b) => a + b, 0);

  const barData = {
    labels: candidates.map(c => c.name),
    datasets: [
      {
        label: 'Votes',
        data: voteCounts,
        backgroundColor: 'rgba(58, 111, 248, 0.7)',
        borderColor: 'rgba(58, 111, 248, 1)',
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  const pieData = {
    labels: candidates.map(c => c.name),
    datasets: [
      {
        data: voteCounts,
        backgroundColor: [
          'rgba(58, 111, 248, 0.8)', 
          'rgba(139, 92, 246, 0.8)', 
          'rgba(255, 77, 141, 0.8)', 
          'rgba(0, 230, 255, 0.8)', 
          'rgba(16, 185, 129, 0.8)', 
          'rgba(251, 191, 36, 0.8)'
        ],
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          font: { size: 12 }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  };

  return (
    <div className="space-y-6">
      <select 
        value={selectedElection} 
        onChange={e => setSelectedElection(e.target.value)} 
        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-purple transition-all"
      >
        {elections.map(e => <option key={e.id} value={e.id} className="bg-navy-800">{e.title}</option>)}
      </select>
      
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center">
          <span className="w-2 h-2 bg-neon-blue rounded-full mr-2"></span>
          Vote Distribution (Bar Chart)
        </h3>
        <Bar data={barData} options={chartOptions} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <span className="w-2 h-2 bg-neon-purple rounded-full mr-2"></span>
            Vote Share (Pie Chart)
          </h3>
          <Pie data={pieData} />
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <span className="w-2 h-2 bg-neon-pink rounded-full mr-2"></span>
            Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-gray-400">Total Votes</span>
              <span className="text-2xl font-bold text-neon-aqua">{totalVotes}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-gray-400">Candidates</span>
              <span className="text-2xl font-bold text-neon-blue">{candidates.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsAnalytics;
