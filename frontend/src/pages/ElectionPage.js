import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

const ElectionPage = () => {
  const { id } = useParams();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchElection();
    fetchCandidates();
    checkVoted();
    // eslint-disable-next-line
  }, [id]);

  const fetchElection = async () => {
    try {
      const res = await API.get(`/elections`);
      setElection(res.data.find(e => e.id === parseInt(id)));
    } catch (err) {
      setError('Failed to fetch election');
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await API.get(`/candidates/${id}`);
      setCandidates(res.data);
    } catch (err) {
      setError('Failed to fetch candidates');
    }
  };

  const checkVoted = async () => {
    try {
      const res = await API.get(`/votes/${id}`);
      if (res.data.find(v => v.voter_id === user.voter_id)) setVoted(true);
    } catch (err) {}
  };

  const handleVote = async (candidate_id) => {
    setError('');
    setSuccess('');
    try {
      await API.post('/vote', {
        election_id: id,
        candidate_id
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSuccess('Vote cast successfully!');
      setVoted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to vote');
    }
  };

  if (!election) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">{election.title}</h1>
      <p className="mb-4">{election.description}</p>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map(c => (
          <div key={c.id} className="bg-white p-4 rounded shadow flex flex-col items-center">
            {c.image && (
              <img 
                src={c.image.startsWith('http') ? c.image : `${process.env.REACT_APP_API_URL}${c.image}`}
                alt={c.name} 
                className="w-24 h-24 object-cover rounded-full mb-2"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <h2 className="text-lg font-semibold">{c.name}</h2>
            <p className="text-gray-600">{c.party}</p>
            <p className="text-sm mt-2 mb-2">{c.manifesto}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2 disabled:opacity-50"
              onClick={() => handleVote(c.id)}
              disabled={voted}
            >
              {voted ? 'Voted' : 'Vote'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectionPage;
