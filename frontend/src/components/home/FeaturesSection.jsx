import React from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      icon: '⛓️',
      title: 'Decentralized Blockchain Ledger',
      description: 'Immutable vote records stored on Ethereum Sepolia testnet ensuring transparency and tamper-proof audit trails.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🤖',
      title: 'AI-Powered Face Verification',
      description: 'Advanced facial recognition using TensorFlow models to prevent identity fraud and ensure voter authenticity.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🔐',
      title: 'End-to-End Vote Encryption',
      description: 'RSA-2048 encryption secures every vote from casting to blockchain, protecting voter choices and privacy.',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: '📜',
      title: 'Tamper-Proof Audit Trails',
      description: 'Complete transparency with immutable blockchain logs and downloadable cryptographic vote receipts.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: '📊',
      title: 'Real-Time Admin Transparency Dashboard',
      description: 'Live monitoring of elections, fraud detection alerts, system health, and comprehensive analytics.',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: '🛡️',
      title: 'Voter Privacy Protection',
      description: 'Zero-knowledge architecture ensures voter anonymity while maintaining electoral integrity and verifiability.',
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <section id="features-section" className="relative py-24 px-6 bg-gradient-to-b from-navy-900 to-purple-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 opacity-50"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Why Choose SecureVoteX?
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            India's most advanced blockchain voting infrastructure with government-grade security
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <motion.div
                className={`w-16 h-16 mb-6 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-4xl">{feature.icon}</span>
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-neon-purple group-hover:to-neon-pink transition-all">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Border Glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300`}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
