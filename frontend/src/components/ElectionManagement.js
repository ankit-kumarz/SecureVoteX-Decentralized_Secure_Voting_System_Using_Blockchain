import React, { useState, useEffect } from 'react';
import API from '../api';

const ElectionManagement = () => {
  const [elections, setElections] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await API.get('/elections');
      setElections(res.data);
    } catch (err) {
      setError('Failed to fetch elections');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/elections', {
        title,
        description,
        start_date: startDate,
        end_date: endDate
      });
      setTitle(''); setDescription(''); setStartDate(''); setEndDate('');
      fetchElections();
    } catch (err) {
      setError('Failed to create election');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/elections/${id}`);
      fetchElections();
    } catch (err) {
      setError('Failed to delete election');
    }
  };

  const handleGenerateKeys = async (id, title) => {
    try {
      setError('');
      const res = await API.post(`/encrypted-vote/election/${id}/generate-keys`);
      alert(`✅ Encryption keys generated for "${title}"!\n\nYou can now vote in this election with end-to-end encryption.`);
    } catch (err) {
      if (err.response?.status === 409) {
        alert(`ℹ️ Encryption keys already exist for "${title}"`);
      } else {
        setError(err.response?.data?.message || 'Failed to generate keys');
      }
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleCreate} className="space-y-3">
        <input 
          type="text" 
          placeholder="Election Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-purple transition-all" 
          required 
        />
        <input 
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue transition-all" 
        />
        <div className="grid grid-cols-2 gap-3">
          <input 
            type="datetime-local" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)} 
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-aqua transition-all" 
            required 
          />
          <input 
            type="datetime-local" 
            value={endDate} 
            onChange={e => setEndDate(e.target.value)} 
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-pink transition-all" 
            required 
          />
        </div>
        <button 
          type="submit" 
          className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold rounded-lg shadow-neon-purple hover:shadow-neon-blue hover:scale-105 transition-all duration-300"
        >
          Create Election
        </button>
      </form>
      
      {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {elections.map(e => (
          <div key={e.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all group">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-white font-medium">{e.title}</h4>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(e.start_date).toLocaleDateString()} - {new Date(e.end_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleGenerateKeys(e.id, e.title)}
                  className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 hover:scale-105 transition-all flex items-center text-sm"
                  title="Generate encryption keys for this election"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                  Keys
                </button>
                <a
                  href={`/analytics/${e.id}`}
                  className="px-3 py-1 bg-neon-blue/20 border border-neon-blue/30 text-neon-blue rounded-lg hover:bg-neon-blue/30 hover:scale-105 transition-all flex items-center text-sm"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  Analytics
                </a>
                <button 
                  onClick={() => handleDelete(e.id)} 
                  className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 hover:scale-105 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectionManagement;
