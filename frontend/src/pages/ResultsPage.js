import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VoterResults from '../components/VoterResults';
import TopHeader from '../components/TopHeader';

const ResultsPage = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 relative overflow-x-hidden">
      <TopHeader />
      
      {/* Background animated gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-purple opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto mt-20">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 mb-6 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        
        <VoterResults electionId={electionId} />
      </div>
    </div>
  );
};

export default ResultsPage;
