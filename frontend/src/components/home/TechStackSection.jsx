import React from 'react';
import { motion } from 'framer-motion';

const TechStackSection = () => {
  const technologies = [
    {
      name: 'Ethereum Sepolia',
      icon: '⟠',
      description: 'Decentralized blockchain network for immutable vote storage',
      color: 'from-gray-600 to-gray-800'
    },
    {
      name: 'React',
      icon: '⚛️',
      description: 'Modern frontend library for building interactive UI',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      name: 'Node.js',
      icon: '🟢',
      description: 'High-performance JavaScript runtime for backend services',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Ethers.js',
      icon: '🔗',
      description: 'Web3 library for blockchain interactions',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      name: 'PostgreSQL',
      icon: '🐘',
      description: 'Advanced relational database for user and election data',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      name: 'JWT Auth',
      icon: '🔐',
      description: 'Secure token-based authentication system',
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Face Embedding',
      icon: '🤖',
      description: 'TensorFlow.js powered facial recognition AI',
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'TailwindCSS',
      icon: '🎨',
      description: 'Utility-first CSS framework for modern design',
      color: 'from-cyan-400 to-blue-500'
    }
  ];

  return (
    <section id="tech-section" className="relative py-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-800 via-navy-900 to-navy-800"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-aqua opacity-10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-aqua via-neon-blue to-neon-purple bg-clip-text text-transparent">
            Technology Stack
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Built with industry-leading technologies for maximum security and performance
          </p>
        </motion.div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
            >
              <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 h-full flex flex-col items-center text-center relative overflow-hidden">
                {/* Hover Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl`}></div>

                {/* Icon */}
                <motion.div
                  className={`relative w-20 h-20 mb-4 bg-gradient-to-br ${tech.color} rounded-xl flex items-center justify-center shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-4xl">{tech.icon}</span>
                </motion.div>

                {/* Name */}
                <h3 className="text-lg font-bold text-white mb-2 relative z-10">
                  {tech.name}
                </h3>

                {/* Tooltip Description */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="backdrop-blur-xl bg-black/90 p-3 rounded-lg border border-white/20 shadow-xl">
                    <p className="text-sm text-gray-300">{tech.description}</p>
                  </div>
                  <div className="w-3 h-3 bg-black/90 border-r border-b border-white/20 transform rotate-45 mx-auto -mt-1.5"></div>
                </div>

                {/* Border Glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p className="text-gray-400 text-sm">
            Hover over each technology to learn more about its role in SecureVoteX
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;
