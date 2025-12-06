import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

const ActiveElections = () => {
  const [elections, setElections] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      // Try new active-elections endpoint first
      const res = await API.get('/election/active-elections');
      setElections(res.data.elections || []);
    } catch (err) {
      console.error('Failed to fetch active elections:', err);
      // Fallback to old method
      try {
        const res = await API.get('/elections');
        const now = new Date();
        const active = res.data.filter(e => new Date(e.start_date) <= now && new Date(e.end_date) >= now);
        setElections(active);
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
        setElections([]);
      }
    }
  };

  return (
    <div className="space-y-3">
      {elections.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No active elections at the moment</p>
        </div>
      ) : (
        elections.map(e => (
          <div key={e.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-neon-blue/50 transition-all duration-300 group">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold text-lg group-hover:text-neon-blue transition-colors">{e.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{e.description || 'Click to view details'}</p>
              </div>
              <a 
                href={`/vote-encrypted/${e.id}`} 
                className="px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-medium rounded-lg shadow-neon-blue hover:shadow-neon-purple hover:scale-105 transition-all duration-300 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Vote Securely
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ActiveElections;
