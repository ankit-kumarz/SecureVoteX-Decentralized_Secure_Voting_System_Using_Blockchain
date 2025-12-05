import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../Settings/LanguageSwitcher';
import ThemeToggle from '../Settings/ThemeToggle';

const HeroSection = ({ onVoterLogin, onAdminLogin }) => {
  const { t } = useTranslation();
  const [showPlatformMenu, setShowPlatformMenu] = useState(false);
  
  const handleExplorePlatform = () => {
    const nextSection = document.getElementById('carousel-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-purple-950">
      
      {/* Premium Navigation Bar */}
      <motion.nav 
        className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">⟠</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SecureVoteX
              </span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about-section')}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('tech-section')}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Technology
              </button>
              <button 
                onClick={() => scrollToSection('features-section')}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('developers-section')}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Developers
              </button>
              
              {/* Platform Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowPlatformMenu(true)}
                  onMouseLeave={() => setShowPlatformMenu(false)}
                  className="text-gray-300 hover:text-white transition-colors font-medium flex items-center gap-1"
                >
                  Platform
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showPlatformMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onMouseEnter={() => setShowPlatformMenu(true)}
                    onMouseLeave={() => setShowPlatformMenu(false)}
                    className="absolute top-full mt-2 right-0 w-48 backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg shadow-xl py-2"
                  >
                    <button
                      onClick={onVoterLogin}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      🗳️ Voter Login
                    </button>
                    <button
                      onClick={onAdminLogin}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      👨‍💼 Admin Login
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-pink-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Main Hero Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left - Content */}
          <div className="text-left">
            
            {/* Trust Badges */}
            <motion.div 
              className="flex flex-wrap gap-3 mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-full text-sm text-green-300 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                ✔ Trusted by Web3 Community
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-sm text-blue-300 shadow-lg">
                ⟠ Powered by Ethereum Sepolia
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full text-sm text-orange-300 shadow-lg">
                🏛️ Government-Grade Security
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                <span className="text-white">India's</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Next-Generation
                </span>
                <br />
                <span className="text-white">Blockchain Voting</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Infrastructure
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
                A secure, transparent, and AI-powered voting platform built using 
                <span className="text-blue-400 font-semibold"> blockchain</span>, 
                <span className="text-purple-400 font-semibold"> cryptography</span>, and 
                <span className="text-pink-400 font-semibold"> biometrics</span>.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.button
                onClick={onVoterLogin}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg rounded-xl overflow-hidden shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  🗳️ Login as Voter
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.button>

              <motion.button
                onClick={onAdminLogin}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white font-bold text-lg rounded-xl overflow-hidden shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  👨‍💼 Login as Admin
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.button>

              <motion.button
                onClick={handleExplorePlatform}
                className="group px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold text-lg rounded-xl hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  Explore Platform
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </motion.button>
            </motion.div>

          </div>

          {/* Right - Illustration */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-full h-[600px]">
              
              {/* Central Voting Machine */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border-2 border-white/30 rounded-3xl shadow-2xl flex items-center justify-center"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="text-6xl">🗳️</div>
              </motion.div>

              {/* Feature Nodes */}
              {[
                { icon: '🔒', pos: 'top-10 left-10', color: 'from-blue-500 to-cyan-500', label: 'Encryption' },
                { icon: '⛓️', pos: 'top-10 right-10', color: 'from-purple-500 to-pink-500', label: 'Blockchain' },
                { icon: '🤖', pos: 'bottom-10 left-10', color: 'from-green-500 to-emerald-500', label: 'AI Verify' },
                { icon: '🛡️', pos: 'bottom-10 right-10', color: 'from-orange-500 to-red-500', label: 'Security' },
              ].map((node, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${node.pos} w-28 h-28 bg-gradient-to-br ${node.color} opacity-20 backdrop-blur-lg border border-white/20 rounded-2xl flex flex-col items-center justify-center shadow-xl`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 0.3, 
                    scale: 1,
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: 0.5 + i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <div className="text-4xl mb-1">{node.icon}</div>
                  <div className="text-xs text-white/70 font-semibold">{node.label}</div>
                </motion.div>
              ))}

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                {[[50, 50, 20, 20], [50, 50, 80, 20], [50, 50, 20, 80], [50, 50, 80, 80]].map((line, i) => (
                  <motion.line
                    key={i}
                    x1={`${line[0]}%`} y1={`${line[1]}%`} 
                    x2={`${line[2]}%`} y2={`${line[3]}%`}
                    stroke="rgba(139, 92, 246, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                  />
                ))}
              </svg>

              {/* Data Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                  style={{
                    left: `${30 + Math.random() * 40}%`,
                    top: `${30 + Math.random() * 40}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.5,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-gray-400 text-sm font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"
              animate={{ y: [0, 16, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>

    </section>
  );
};

export default HeroSection;
