import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GovernmentCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Next-Gen Tamper-Proof Blockchain Voting",
      description: "Every vote is permanently recorded on the Ethereum blockchain, ensuring complete transparency and immutability",
      icon: "⛓️",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "AI-Based Face Verification for Fraud Prevention",
      description: "Advanced facial recognition technology ensures only verified voters can cast their ballots securely",
      icon: "🤖",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Zero-Knowledge Privacy for Voter Anonymity",
      description: "Cryptographic protocols protect voter identity while maintaining complete vote verification",
      icon: "🛡️",
      gradient: "from-green-500 to-teal-500"
    },
    {
      title: "End-to-End Encryption Securing Every Vote",
      description: "Military-grade encryption ensures votes remain confidential from casting to final tally",
      icon: "🔐",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section id="carousel-section" className="relative py-24 px-6 bg-gradient-to-b from-navy-900 to-navy-800 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* NIC-Style Carousel */}
        <div className="relative h-80 md:h-96 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].gradient} opacity-10`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8 md:px-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                {/* Icon */}
                <motion.div
                  className="text-7xl md:text-8xl mb-6"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {slides[currentSlide].icon}
                </motion.div>

                {/* Title */}
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-4xl">
                  {slides[currentSlide].title}
                </h2>

                {/* Description */}
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-12 bg-gradient-to-r from-blue-500 to-purple-500' 
                  : 'w-3 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GovernmentCarousel;
