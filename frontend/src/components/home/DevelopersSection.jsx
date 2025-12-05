import React from 'react';
import { motion } from 'framer-motion';

const DevelopersSection = () => {
  const developers = [
    {
      name: 'Ankit Kumar',
      role: 'Backend Developer, System Workflow Engineer, Database Developer',
      bio: 'Ankit specializes in backend architecture, database engineering, secure system workflows, encryption logic, and backend APIs powering SecureVoteX.',
      photo: '/assets/developers/dev1.png',
      github: 'https://github.com/ankit-kumarz',
      linkedin: 'https://www.linkedin.com/in/ankitkumarz',
      gradient: 'from-blue-500 to-cyan-500',
      icon: '⚙️'
    },
    {
      name: 'Akshat Jain',
      role: 'Blockchain & Web3 Integration, UI Enhancements',
      bio: 'Akshat built smart contract flows, integrated Ethereum Sepolia Web3 operations, optimized wallet connectivity, and modernized the UI for seamless voting experiences.',
      photo: '/assets/developers/dev2.png',
      github: 'https://github.com/17akshat05',
      linkedin: 'https://www.linkedin.com/in/akshat-jain17/',
      gradient: 'from-purple-500 to-pink-500',
      icon: '⛓️'
    },
    {
      name: 'Akshita Agarwal',
      role: 'Frontend Developer, UI/UX Designer',
      bio: 'Akshita designed responsive interfaces, polished interactive layouts, improved accessibility, and ensured a professional user experience across SecureVoteX.',
      photo: '/assets/developers/dev3.png',
      github: 'https://github.com/Akshita27-lab',
      linkedin: 'https://www.linkedin.com/in/akshitaagarwal78/',
      gradient: 'from-pink-500 to-rose-500',
      icon: '🎨'
    }
  ];

  return (
    <section id="developers-section" className="relative py-24 px-6 bg-gradient-to-b from-navy-900 to-navy-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-aqua bg-clip-text text-transparent">
            Meet the Developers
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            The brilliant minds behind SecureVoteX's cutting-edge technology
          </p>
        </motion.div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developers.map((dev, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -15 }}
            >
              <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border-2 border-white/10 hover:border-white/30 transition-all duration-300 h-full relative overflow-hidden">
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${dev.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl pointer-events-none`}></div>
                
                {/* Photo Container */}
                <div className="relative mb-6">
                  <motion.div
                    className={`w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br ${dev.gradient} p-1 shadow-2xl`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="w-full h-full rounded-xl overflow-hidden bg-navy-900">
                      <img
                        src={dev.photo}
                        alt={dev.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image doesn't exist
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br ${dev.gradient}"><span class="text-5xl">${dev.icon}</span></div>`;
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Role Icon Badge */}
                  <motion.div
                    className={`absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br ${dev.gradient} rounded-xl flex items-center justify-center shadow-lg border-2 border-navy-900`}
                    whileHover={{ scale: 1.2, rotate: 180 }}
                  >
                    <span className="text-2xl">{dev.icon}</span>
                  </motion.div>
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold text-white text-center mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-neon-purple group-hover:to-neon-pink transition-all">
                  {dev.name}
                </h3>

                {/* Role */}
                <p className={`text-sm font-semibold text-center mb-4 bg-gradient-to-r ${dev.gradient} bg-clip-text text-transparent`}>
                  {dev.role}
                </p>

                {/* Bio */}
                <p className="text-gray-400 text-sm text-center leading-relaxed mb-6">
                  {dev.bio}
                </p>

                {/* Social Links */}
                <div className="flex justify-center gap-4 relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a
                      href={dev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-gradient-to-br ${dev.gradient} rounded-xl flex items-center justify-center hover:shadow-2xl transition-all cursor-pointer`}
                    >
                      <svg className="w-6 h-6 text-white pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.15, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a
                      href={dev.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-gradient-to-br ${dev.gradient} rounded-xl flex items-center justify-center hover:shadow-2xl transition-all cursor-pointer`}
                    >
                      <svg className="w-6 h-6 text-white pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </motion.div>
                </div>

                {/* Decorative Corner */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${dev.gradient} opacity-10 rounded-bl-full pointer-events-none`}></div>
                <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${dev.gradient} opacity-10 rounded-tr-full pointer-events-none`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DevelopersSection;
