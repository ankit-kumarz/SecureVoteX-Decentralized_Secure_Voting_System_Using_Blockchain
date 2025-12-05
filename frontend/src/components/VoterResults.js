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

  useEffect(() => {
    if (electionId) {
      fetchCandidates(electionId);
      fetchVotes(electionId);
    }
  }, [electionId]);

  const fetchCandidates = async (electionId) => {
    const res = await API.get(`/candidates/${electionId}`);
    setCandidates(res.data);
  };

  const fetchVotes = async (electionId) => {
    const res = await API.get(`/votes/${electionId}`);
    setVotes(res.data);
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

  return (
    <div>
      <div className="mb-6">
        <Bar data={barData} />
      </div>
      <div>
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default VoterResults;
