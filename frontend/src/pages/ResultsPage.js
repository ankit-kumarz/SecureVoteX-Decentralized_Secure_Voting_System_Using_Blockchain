import React from 'react';
import { useParams } from 'react-router-dom';
import VoterResults from '../components/VoterResults';

const ResultsPage = () => {
  const { electionId } = useParams();
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Election Results</h1>
      <VoterResults electionId={electionId} />
    </div>
  );
};

export default ResultsPage;
