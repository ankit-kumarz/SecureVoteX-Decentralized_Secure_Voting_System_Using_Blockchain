import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

/**
 * Welcome Message Component
 * Displays welcome message at the top of voter dashboard
 */
const WelcomeMessage = () => {
  const { user } = useContext(AuthContext);
  
  const getFirstName = () => {
    if (user?.email) {
      const name = user.email.split('@')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return 'Voter';
  };
  
  return (
    <div className="backdrop-blur-xl bg-gradient-to-r from-neon-blue/10 via-neon-purple/10 to-neon-pink/10 p-8 rounded-2xl border border-white/10 shadow-glow mb-6">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent mb-3">
          Welcome to the Decentralized Secure Voting System
        </h1>
        <p className="text-xl md:text-2xl text-white">
          Hello, <span className="font-bold text-neon-aqua">{getFirstName()}</span> 👋
        </p>
        <p className="text-gray-400 mt-2">
          Your voice matters. Vote securely with blockchain technology.
        </p>
      </div>
    </div>
  );
};

export default WelcomeMessage;
