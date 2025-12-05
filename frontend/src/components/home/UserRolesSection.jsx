import React from 'react';
import { motion } from 'framer-motion';

const UserRolesSection = () => {
  const roles = [
    {
      title: 'Voter Panel Features',
      icon: '🗳️',
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        { icon: '🤖', text: 'Face Verification' },
        { icon: '🔑', text: 'Secure Login' },
        { icon: '🔐', text: 'Vote Encryption' },
        { icon: '📄', text: 'Download Receipts' },
        { icon: '📊', text: 'Personalized Election Results' }
      ]
    },
    {
      title: 'Admin Panel Features',
      icon: '👑',
      gradient: 'from-purple-500 to-pink-500',
      features: [
        { icon: '🗳️', text: 'Election Management' },
        { icon: '👥', text: 'Candidate Management' },
        { icon: '📈', text: 'Analytics Dashboard' },
        { icon: '⛓️', text: 'Blockchain Explorer' },
        { icon: '🚨', text: 'Fraud Detection System' },
        { icon: '🔑', text: 'Security Key Monitoring' }
      ]
    }
  ];

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-navy-900 to-navy-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
            User Roles & Capabilities
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Tailored experiences for voters and administrators
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {roles.map((role, roleIndex) => (
            <motion.div
              key={roleIndex}
              className="group relative"
              initial={{ opacity: 0, x: roleIndex === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: roleIndex * 0.2 }}
            >
              <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-white/30 transition-all duration-300 h-full relative overflow-hidden">
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>

                {/* Header */}
                <div className="relative flex items-center gap-4 mb-8">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${role.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-4xl">{role.icon}</span>
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-neon-purple group-hover:to-neon-pink transition-all">
                    {role.title}
                  </h3>
                </div>

                {/* Features List */}
                <div className="space-y-4 relative">
                  {role.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className="flex items-center gap-4 p-4 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: roleIndex * 0.2 + featureIndex * 0.1 }}
                      whileHover={{ x: 10 }}
                    >
                      <div className={`w-10 h-10 bg-gradient-to-br ${role.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-xl">{feature.icon}</span>
                      </div>
                      <p className="text-white font-medium">{feature.text}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Decorative Corner */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${role.gradient} opacity-10 rounded-bl-full`}></div>
                <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${role.gradient} opacity-10 rounded-tr-full`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserRolesSection;
