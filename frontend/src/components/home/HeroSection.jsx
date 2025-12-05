import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../Settings/LanguageSwitcher';
import ThemeToggle from '../Settings/ThemeToggle';

const HeroSection = ({ onVoterLogin, onAdminLogin }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPlatformMenu, setShowPlatformMenu] = useState(false);
  
  const handleExplorePlatform = () => {
    const nextSection = document.getElementById('carousel-section');
    if (nextSection) {
      const yOffset = -80; // Offset for sticky navbar
      const y = nextSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const yOffset = -80; // Offset for sticky navbar
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-slate-100 via-blue-100 to-purple-100 dark:from-navy-900 dark:via-navy-800 dark:to-navy-700 transition-colors duration-300">
      {/* Premium Navigation Bar */}
      <motion.nav 
        className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">⟠</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                SecureVoteX
              </span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('carousel-section')}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about-section')}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('tech-section')}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
              >
                Technology
              </button>
              <button 
                onClick={() => scrollToSection('features-section')}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('developers-section')}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
              >
                Developers
              </button>
              
              {/* Platform Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowPlatformMenu(true)}
                  onMouseLeave={() => setShowPlatformMenu(false)}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium flex items-center gap-1"
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
                    className="absolute top-full mt-2 right-0 w-48 backdrop-blur-xl bg-white/95 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-lg shadow-xl py-2"
                  >
                    <button
                      onClick={onVoterLogin}
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/10 transition-colors"
                    >
                      🗳️ Voter Login
                    </button>
                    <button
                      onClick={onAdminLogin}
                      className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/10 transition-colors"
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

      {/* Subtle Background Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/40 dark:bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/40 dark:bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-300/30 dark:bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Minimal Floating Particles - 60% Reduced */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/40 rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center py-20">
        
        {/* Small Trust Badges - Minimal Style */}
        <motion.div 
          className="flex flex-wrap gap-3 mb-8 justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-3 py-1.5 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 rounded-full text-xs text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            {t('trustedByWeb3')}
          </div>
          <div className="px-3 py-1.5 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-purple-400/40 dark:border-purple-400/20 rounded-full text-xs text-gray-700 dark:text-gray-300">
            ⟠ {t('poweredByEthereum')}
          </div>
          <div className="px-3 py-1.5 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-orange-400/40 dark:border-orange-400/20 rounded-full text-xs text-orange-600 dark:text-orange-300/80">
            🏛️ {t('governmentGradeSecurity')}
          </div>
        </motion.div>

        {/* Main Title - Clean & Bold */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('secureVoteX')}
            </span>
          </h1>

          {/* Subtitle - Single Line */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90 mb-8">
            {t('indiaNextGenVoting')}
          </h2>

          {/* Mini Tagline - Max 2 Lines */}
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-400 max-w-3xl mx-auto mb-14 leading-relaxed">
            {t('secureTransparentAI')}
          </p>
        </motion.div>

        {/* Primary Action Buttons - Only 3 */}
        <motion.div
          className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.button
            onClick={onVoterLogin}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-lg rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('loginAsVoter')}
          </motion.button>

          <motion.button
            onClick={onAdminLogin}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white font-semibold text-lg rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('loginAsAdmin')}
          </motion.button>

          <motion.button
            onClick={handleExplorePlatform}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:bg-transparent text-white font-semibold text-lg rounded-xl border-2 border-indigo-600 dark:border-white/20 shadow-lg shadow-indigo-500/30 dark:shadow-none hover:shadow-indigo-500/50 dark:hover:bg-white/5 dark:hover:border-white/40 transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('explorePlatform')} →
          </motion.button>
        </motion.div>

        {/* Scroll Indicator - Subtle */}
        <motion.div
          className="mt-12"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-5 h-8 border border-white/20 rounded-full mx-auto flex justify-center">
            <motion.div
              className="w-1 h-1 bg-blue-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
