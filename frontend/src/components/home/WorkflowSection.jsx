import React from 'react';
import { motion } from 'framer-motion';

const WorkflowSection = () => {
  const steps = [
    {
      number: '01',
      icon: '📝',
      title: 'Register',
      description: 'Create your secure account with email verification and unique voter ID generation.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '02',
      icon: '🤖',
      title: 'Face Verification',
      description: 'Complete AI-powered facial recognition to create your biometric profile.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: '03',
      icon: '🔑',
      title: 'Secure Login',
      description: 'Access your account with JWT authentication and optional face re-verification.',
      color: 'from-green-500 to-teal-500'
    },
    {
      number: '04',
      icon: '🗳️',
      title: 'Cast Encrypted Vote',
      description: 'Select your candidate and encrypt your vote with RSA-2048 before submission.',
      color: 'from-orange-500 to-red-500'
    },
    {
      number: '05',
      icon: '⛓️',
      title: 'Transaction to Blockchain',
      description: 'Your encrypted vote is recorded on Ethereum Sepolia with a unique transaction hash.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      number: '06',
      icon: '📄',
      title: 'View Results + Receipt',
      description: 'Download your cryptographic receipt and view real-time election results.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-navy-900 to-navy-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            System Workflow
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            A seamless six-step process ensuring government-grade security at every stage
          </p>
        </motion.div>

        {/* Workflow Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-30 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
              >
                <div className="group backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
                  {/* Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                  {/* Step Number */}
                  <div className="absolute top-4 right-4 text-6xl font-bold text-white/5 group-hover:text-white/10 transition-all">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <motion.div
                    className={`relative w-20 h-20 mb-6 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-5xl">{step.icon}</span>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-neon-purple group-hover:to-neon-pink transition-all">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow for Desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <svg className="w-8 h-8 text-neon-aqua" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
