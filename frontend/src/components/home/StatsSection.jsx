import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StatsSection = () => {
  const [counts, setCounts] = useState({
    voters: 0,
    elections: 0,
    transactions: 0,
    fraudPrevented: 0,
    verified: 0
  });

  const finalStats = {
    voters: 15847,
    elections: 342,
    transactions: 18295,
    fraudPrevented: 127,
    verified: 14982
  };

  const stats = [
    {
      id: 'voters',
      label: 'Total Registered Voters',
      value: counts.voters,
      icon: '👥',
      gradient: 'from-blue-500 to-cyan-500',
      suffix: '+'
    },
    {
      id: 'elections',
      label: 'Elections Conducted',
      value: counts.elections,
      icon: '🗳️',
      gradient: 'from-purple-500 to-pink-500',
      suffix: '+'
    },
    {
      id: 'transactions',
      label: 'Blockchain Transactions',
      value: counts.transactions,
      icon: '⛓️',
      gradient: 'from-green-500 to-teal-500',
      suffix: '+'
    },
    {
      id: 'fraudPrevented',
      label: 'Fraud Attempts Prevented',
      value: counts.fraudPrevented,
      icon: '🛡️',
      gradient: 'from-orange-500 to-red-500',
      suffix: ''
    },
    {
      id: 'verified',
      label: 'Verified Voters',
      value: counts.verified,
      icon: '✅',
      gradient: 'from-indigo-500 to-purple-500',
      suffix: '+'
    }
  ];

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        voters: Math.floor(finalStats.voters * progress),
        elections: Math.floor(finalStats.elections * progress),
        transactions: Math.floor(finalStats.transactions * progress),
        fraudPrevented: Math.floor(finalStats.fraudPrevented * progress),
        verified: Math.floor(finalStats.verified * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(finalStats);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-800 via-navy-900 to-navy-800"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple opacity-5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent">
            System Statistics
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Real-time metrics showcasing SecureVoteX's impact and reliability
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="group relative"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 text-center relative overflow-hidden h-full">
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl`}></div>

                {/* Icon */}
                <motion.div
                  className={`relative w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(168, 85, 247, 0.4)',
                      '0 0 40px rgba(236, 72, 153, 0.6)',
                      '0 0 20px rgba(168, 85, 247, 0.4)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-3xl">{stat.icon}</span>
                </motion.div>

                {/* Value */}
                <div className="relative mb-2">
                  <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {stat.value.toLocaleString()}
                  </span>
                  <span className="text-2xl text-neon-aqua ml-1">{stat.suffix}</span>
                </div>

                {/* Label */}
                <p className="text-sm text-gray-400 relative">{stat.label}</p>

                {/* Pulse Animation */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 blur-xl animate-pulse`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Indicator */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="w-3 h-3 bg-green-500 rounded-full"
            animate={{ 
              opacity: [1, 0.3, 1],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-gray-400 text-sm">Live statistics updated in real-time</span>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
