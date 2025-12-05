import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m SecureVoteX AI Assistant. How can I help you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const predefinedQuestions = [
    "How does voting work?",
    "What is blockchain?",
    "Explain my receipt",
    "Face verification process",
    "Login help",
    "Encryption & ZKP"
  ];

  const getAIResponse = (question) => {
    const responses = {
      "How does voting work?": "Voting on SecureVoteX is simple:\n1. Register and complete face verification\n2. Login securely with biometric authentication\n3. Select your candidate from the active election\n4. Submit your encrypted vote to the blockchain\n5. Download your digital receipt for verification\n\nYour vote is encrypted, anonymous, and permanently recorded on the blockchain.",
      
      "What is blockchain?": "Blockchain is a distributed ledger technology that:\n• Records every vote as an immutable transaction\n• Ensures transparency without compromising privacy\n• Prevents tampering and fraud\n• Provides permanent audit trails\n\nSecureVoteX uses Ethereum Sepolia testnet for secure, decentralized vote storage.",
      
      "Explain my receipt": "Your digital receipt contains:\n• Unique transaction hash on the blockchain\n• Encrypted vote confirmation\n• Timestamp of your vote\n• Election details\n\nYou can verify your vote anytime using the transaction hash on the blockchain explorer. Your candidate choice remains encrypted and anonymous.",
      
      "Face verification process": "AI-powered face verification:\n1. Capture your face using your device camera\n2. AI compares against your registered face embedding\n3. Advanced liveness detection prevents spoofing\n4. Facial features are extracted and encrypted\n5. Only matching faces can proceed to voting\n\nThis prevents identity fraud and ensures one person = one vote.",
      
      "Login help": "Login issues? Try these steps:\n• Ensure you've completed registration\n• Use the correct login page (Voter/Admin)\n• Complete face verification before login\n• Check your internet connection\n• Clear browser cache if needed\n\nNeed more help? Contact support@securevotex.com",
      
      "Encryption & ZKP": "Security measures:\n\n**End-to-End Encryption:**\nVotes are encrypted using RSA-4096 before blockchain submission.\n\n**Zero-Knowledge Proofs (ZKP):**\nYour vote is verified without revealing your choice to anyone, including administrators.\n\n**Privacy Guarantees:**\n• Vote choice remains anonymous\n• Only aggregated results are public\n• Individual votes cannot be linked to voters"
    };

    return responses[question] || "I'm here to help! Please select one of the predefined questions above, or contact our support team for detailed assistance.";
  };

  const handleQuestionClick = (question) => {
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: question }]);
    
    // Simulate typing
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const response = getAIResponse(question);
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {isOpen ? '✕' : '🤖'}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.3 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[600px] backdrop-blur-2xl bg-gradient-to-b from-navy-800/95 to-navy-900/95 rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">SecureVoteX AI</h3>
                <p className="text-blue-100 text-xs">Always here to help</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-white/10 text-gray-200 border border-white/20'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-blue-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-purple-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, delay: 0.2, repeat: Infinity }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-pink-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, delay: 0.4, repeat: Infinity }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Predefined Questions */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-3">Quick Questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {predefinedQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs text-white transition-all text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
