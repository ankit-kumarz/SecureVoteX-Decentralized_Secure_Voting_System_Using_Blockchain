import React, { useState, useEffect } from 'react';
import API from '../api';

const CandidateManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [manifesto, setManifesto] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [electionId, setElectionId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await API.get('/elections');
      setElections(res.data);
      if (res.data.length > 0) {
        setElectionId(res.data[0].id);
        fetchCandidates(res.data[0].id);
      }
    } catch (err) {
      setError('Failed to fetch elections');
    }
  };

  const fetchCandidates = async (electionId) => {
    try {
      const res = await API.get(`/candidates/${electionId}`);
      setCandidates(res.data);
    } catch (err) {
      setError('Failed to fetch candidates');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError('Only JPG and PNG images are allowed');
        return;
      }
      
      // Validate file size (3MB)
      if (file.size > 3 * 1024 * 1024) {
        setError('Image size must be less than 3MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('party', party);
      formData.append('manifesto', manifesto);
      formData.append('election_id', electionId);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      await API.post('/candidates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setName(''); 
      setParty(''); 
      setManifesto(''); 
      setImageFile(null);
      setImagePreview('');
      fetchCandidates(electionId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add candidate');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/candidates/${id}`);
      fetchCandidates(electionId);
    } catch (err) {
      setError('Failed to delete candidate');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleCreate} className="space-y-3">
        <select 
          value={electionId} 
          onChange={e => { setElectionId(e.target.value); fetchCandidates(e.target.value); }} 
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue transition-all"
        >
          {elections.map(e => <option key={e.id} value={e.id} className="bg-navy-800">{e.title}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <input 
            type="text" 
            placeholder="Candidate Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-purple transition-all" 
            required 
          />
          <input 
            type="text" 
            placeholder="Party" 
            value={party} 
            onChange={e => setParty(e.target.value)} 
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-aqua transition-all" 
            required 
          />
        </div>
        <input 
          type="text" 
          placeholder="Manifesto" 
          value={manifesto} 
          onChange={e => setManifesto(e.target.value)} 
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink transition-all" 
        />
        
        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Candidate Image (JPG/PNG, max 3MB)</label>
          <input 
            type="file" 
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleImageChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-neon-blue file:to-neon-aqua file:text-white hover:file:scale-105 file:transition-all file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-neon-blue transition-all" 
          />
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative w-32 h-32 mx-auto">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover rounded-xl border-2 border-neon-blue shadow-neon-blue"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview('');
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-600 transition-all"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          className="w-full py-3 bg-gradient-to-r from-neon-blue to-neon-aqua text-white font-semibold rounded-lg shadow-neon-blue hover:shadow-neon-aqua hover:scale-105 transition-all duration-300"
        >
          Add Candidate
        </button>
      </form>
      
      {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {candidates.map(c => (
          <div key={c.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all group">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 flex-1">
                {c.image && (
                  <img 
                    src={c.image.startsWith('http') ? c.image : `${process.env.REACT_APP_API_URL}${c.image}`}
                    alt={c.name} 
                    className="w-12 h-12 object-cover rounded-full border-2 border-neon-purple/30 flex-shrink-0"
                    onError={(e) => { 
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"%3E%3Cpath d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/%3E%3Ccircle cx="12" cy="7" r="4"/%3E%3C/svg%3E';
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{c.name || 'Unknown'}</h4>
                  <p className="text-gray-400 text-xs mt-1 truncate">{c.party || 'Independent'}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(c.id)} 
                className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 hover:scale-105 transition-all ml-2 flex-shrink-0"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateManagement;
