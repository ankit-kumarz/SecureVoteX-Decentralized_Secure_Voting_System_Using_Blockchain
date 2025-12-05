import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const CoreTechnologies = () => {
  const { t } = useTranslation();
  
  const technologies = [
    { 
      icon: '⛓️', 
      label: t('blockchain'),
      description: t('immutableTransparent'),
      fullDesc: t('everyVoteRecorded'),
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: '🤖', 
      label: t('aiPowered'),
      description: t('biometricVerification'),
      fullDesc: t('facialRecognition'),
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      icon: '🔐', 
      label: t('e2eEncryption'),
      description: t('zeroKnowledge'),
      fullDesc: t('votesEncrypted'),
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      icon: '🛡️', 
      label: t('zkProofs'),
      description: t('cryptographicGuarantees'),
      fullDesc: t('zkSNARKs'),
      gradient: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-navy-900 to-navy-800 dark:from-navy-900 dark:to-navy-800 light:from-slate-100 light:to-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-white light:text-gray-900 mb-3">
            Core Technologies Powering SecureVoteX
          </h2>
          <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-lg max-w-2xl mx-auto">
            Enterprise-grade security meets cutting-edge innovation
          </p>
        </motion.div>

        {/* Technology Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
            >
              <div className="relative backdrop-blur-xl bg-white/5 dark:bg-white/5 light:bg-white/80 p-6 rounded-2xl border border-white/10 dark:border-white/10 light:border-gray-200 hover:border-white/30 dark:hover:border-white/30 light:hover:border-gray-300 transition-all duration-300 h-full shadow-lg light:shadow-xl">
                {/* Gradient Glow on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${tech.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-3xl">{tech.icon}</span>
                </motion.div>

                {/* Label */}
                <h3 className="text-lg font-bold text-white dark:text-white light:text-gray-900 text-center mb-2">
                  {tech.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 text-center leading-relaxed">
                  {tech.fullDesc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreTechnologies;
