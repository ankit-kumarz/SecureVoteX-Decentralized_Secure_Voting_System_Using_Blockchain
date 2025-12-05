import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AboutSystemSection = () => {
  const navigate = useNavigate();

  const highlights = [
    { icon: '⛓️', text: 'Decentralized Blockchain' },
    { icon: '🤖', text: 'AI Face Recognition' },
    { icon: '🔐', text: 'Cryptographic Encryption' },
    { icon: '📜', text: 'Tamper-Proof Logging' }
  ];

  return (
    <section id="about-section" className="relative py-24 px-6 bg-gradient-to-b from-navy-900 to-navy-800 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-800 via-navy-900 to-navy-800"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          className="backdrop-blur-xl bg-white/5 p-12 rounded-3xl border border-white/10 relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-neon-pink/10 to-neon-aqua/10"></div>

          {/* Icon */}
          <motion.div
            className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-neon-purple to-neon-pink rounded-2xl flex items-center justify-center shadow-2xl"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-5xl">🗳️</span>
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
            About SecureVoteX
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 text-center max-w-4xl mx-auto mb-8 leading-relaxed relative">
            SecureVoteX is a <span className="text-blue-400 font-semibold">government-grade digital voting infrastructure</span> built with{' '}
            <span className="text-neon-aqua font-semibold">decentralized blockchain technology</span>,{' '}
            <span className="text-neon-purple font-semibold">AI-based facial biometrics</span>,{' '}
            <span className="text-neon-pink font-semibold">military-grade encryption</span>, and{' '}
            <span className="text-neon-blue font-semibold">tamper-proof audit logging</span> to deliver a 
            secure, transparent, and scalable voting system for the modern digital era.
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                className="backdrop-blur-sm bg-white/10 px-6 py-3 rounded-full border border-white/20 flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-white font-semibold text-sm">{item.text}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <motion.button
              onClick={() => navigate('/about-system')}
              className="relative px-10 py-4 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold text-lg rounded-xl shadow-2xl overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Learn More
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-pink to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-neon-purple/20 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-neon-pink/20 to-transparent rounded-tr-full"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSystemSection;
