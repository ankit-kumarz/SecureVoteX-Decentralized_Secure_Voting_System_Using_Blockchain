import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const footerSections = [
    {
      title: 'About SecureVoteX',
      links: [
        { label: 'Our Mission', path: '/about-system' },
        { label: 'How It Works', path: '/about-system' },
        { label: 'Technology Stack', path: '/about-system' },
        { label: 'Security Features', path: '/about-system' }
      ]
    },
    {
      title: 'Blockchain Transparency',
      links: [
        { label: 'Blockchain Explorer', url: 'https://hardhat.org/docs/plugins/official-plugins', external: true },
        { label: 'Smart Contracts', path: '/about-system' },
        { label: 'Transaction Logs', path: '/transparency' },
        { label: 'Audit Trail', path: '/transparency' }
      ]
    },
    {
      title: 'Privacy & Security',
      links: [
        { label: 'Privacy Policy', path: '/privacy-policy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Data Protection', path: '/about-system' },
        { label: 'Security Policy', path: '/about-system' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Meet the Team', path: '#developers' },
        { label: 'Email Support', url: 'mailto:akumar899266@gmail.com', external: true },
        { label: 'GitHub', url: 'https://github.com/ankit-kumarz/', external: true },
        { label: 'Documentation', path: '/about-system' }
      ]
    }
  ];

  const handleLinkClick = (link) => {
    if (link.external && link.url) {
      window.open(link.url, '_blank');
    } else if (link.path) {
      navigate(link.path);
    } else if (link.path === '#developers') {
      document.getElementById('developers')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-navy-800 to-navy-900 pt-20 pb-10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink"></div>
      <div className="absolute top-10 right-0 w-64 h-64 bg-neon-purple opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-0 w-64 h-64 bg-neon-aqua opacity-5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {footerSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <motion.button
                      onClick={() => handleLinkClick(link)}
                      className="text-gray-400 hover:text-neon-aqua transition-colors text-sm flex items-center gap-2 group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="w-1.5 h-1.5 bg-neon-aqua rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.label}
                      {link.external && (
                        <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                      )}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo & Tagline */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-2xl font-bold bg-gradient-to-r from-neon-purple via-neon-pink to-neon-aqua bg-clip-text text-transparent mb-2">
              SecureVoteX
            </h4>
            <p className="text-gray-400 text-sm max-w-md">
              The future of secure, transparent, and decentralized voting powered by blockchain technology
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {[
              { icon: '📧', label: 'Email', url: 'mailto:akumar899266@gmail.com' },
              { icon: '🐙', label: 'GitHub', url: 'https://github.com/ankit-kumarz/SecureVoteX-Decentralized_Secure_Voting_System_Using_Blockchain' },
              { icon: '💼', label: 'LinkedIn', url: 'https://www.linkedin.com/in/ankitkumarz' },
              { icon: '🐦', label: 'Twitter', url: 'https://x.com/ankit_verse' }
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 hover:border-white/30 flex items-center justify-center transition-all hover:shadow-neon-purple"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={social.label}
              >
                <span className="text-2xl">{social.icon}</span>
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="mt-8 pt-8 border-t border-white/10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500 text-sm mb-2">
            © {new Date().getFullYear()} SecureVoteX. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mb-3">
            Powered by <span className="text-blue-400">Ethereum Hardhat Testnet</span> | Built with ❤️ by{' '}
            <span className="text-neon-purple font-semibold">Ankit Kumar</span>,{' '}
            <span className="text-neon-pink font-semibold">Akshat Jain</span>, and{' '}
            <span className="text-neon-aqua font-semibold">Akshita Agarwal</span>
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs text-gray-600">
            <a href="/privacy-policy" className="hover:text-neon-aqua transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" className="hover:text-neon-aqua transition-colors">Terms of Service</a>
            <span>•</span>
            <a 
              href="https://hardhat.org/docs/plugins/official-plugins" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-neon-aqua transition-colors"
            >
              Blockchain Explorer
            </a>
            <span>•</span>
            <a 
              href="mailto:akumar899266@gmail.com" 
              className="hover:text-neon-aqua transition-colors"
            >
              Email Support
            </a>
          </div>
          <div className="flex justify-center gap-2 mt-4 text-xs text-gray-600">
            <span>🔒 Blockchain Secured</span>
            <span>•</span>
            <span>🛡️ Privacy Protected</span>
            <span>•</span>
            <span>✅ Fully Transparent</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
