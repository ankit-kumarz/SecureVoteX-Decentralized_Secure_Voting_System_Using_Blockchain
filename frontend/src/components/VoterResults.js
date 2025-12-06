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

const VoterResults = ({ electionId }) => {
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (electionId) {
      fetchElectionData(electionId);
    }
  }, [electionId]);

  const fetchElectionData = async (electionId) => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch election details
      const electionRes = await API.get(`/elections/${electionId}`);
      const electionData = electionRes.data;
      setElection(electionData);
      
      // Check if election is ongoing
      const now = new Date();
      const startDate = new Date(electionData.start_date);
      const endDate = new Date(electionData.end_date);
      
      if (now < startDate) {
        setError('Election has not started yet. Results will be available once voting begins.');
        setLoading(false);
        return;
      }
      
      if (now < endDate) {
        setError('Election is currently ongoing. Results will be declared after voting ends.');
        setLoading(false);
        return;
      }
      
      // Election has ended, fetch results
      const candidatesRes = await API.get(`/candidates/${electionId}`);
      setCandidates(candidatesRes.data);
      
      const votesRes = await API.get(`/votes/election/${electionId}`);
      setVotes(votesRes.data.votes || votesRes.data || []);
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch election results:', err);
      setError(err.response?.data?.message || 'Failed to load election results. Please try again.');
      setLoading(false);
    }
  };

  const voteCounts = candidates.map(c => votes.filter(v => v.candidate_id === c.id).length);

  const barData = {
    labels: candidates.map(c => c.name),
    datasets: [
      {
        label: 'Votes',
        data: voteCounts,
        backgroundColor: 'rgba(59, 130, 246, 0.7)'
      }
    ]
  };

  const pieData = {
    labels: candidates.map(c => c.name),
    datasets: [
      {
        data: voteCounts,
        backgroundColor: [
          '#3b82f6', '#f59e42', '#10b981', '#ef4444', '#6366f1', '#fbbf24', '#a3e635'
        ]
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-blue mb-3 mx-auto"></div>
          <p className="text-gray-400">Loading election results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-8 rounded-2xl border border-yellow-500/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-yellow-500 mb-2">Results Not Available</h3>
            <p className="text-gray-300 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p className="text-gray-400 text-lg">No candidates found for this election</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {election && (
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-2">{election.title}</h2>
          <p className="text-gray-300 mb-4">{election.description}</p>
          <div className="flex gap-4 text-sm text-gray-400">
            <span>Start: {new Date(election.start_date).toLocaleString()}</span>
            <span>End: {new Date(election.end_date).toLocaleString()}</span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">Vote Distribution</h3>
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-center">
          <div style={{ width: '100%', height: '300px' }}>
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>
      </div>
      
      <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Candidate Results</h3>
        <div className="space-y-3">
          {candidates.map((candidate) => {
            const candidateVotes = votes.filter(v => v.candidate_id === candidate.id).length;
            const percentage = votes.length > 0 ? ((candidateVotes / votes.length) * 100).toFixed(1) : 0;
            return (
              <div key={candidate.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-neon-pink to-neon-aqua flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-white">{candidate.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{candidate.name}</h4>
                  <p className="text-sm text-gray-400">{candidate.party}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-neon-aqua">{candidateVotes}</p>
                  <p className="text-sm text-gray-400">{percentage}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VoterResults;
