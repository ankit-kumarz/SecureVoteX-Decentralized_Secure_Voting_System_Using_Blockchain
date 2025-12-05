import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopHeader from '../../components/TopHeader';

/**
 * About the System Page
 * Comprehensive information about the decentralized voting system
 */
const AboutSystemPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 relative overflow-x-hidden">
      <TopHeader />
      
      {/* Background animated gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-purple opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 p-6 max-w-6xl mx-auto mt-20">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-glow mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Dashboard
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent mb-4">
            About the Decentralized Secure Voting System
          </h1>
          <p className="text-xl text-gray-300">
            Understanding how blockchain technology secures democracy
          </p>
        </div>
        
        {/* What is Decentralized Voting */}
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-glow mb-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">What is Decentralized Voting?</h2>
          </div>
          
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Decentralized voting is a revolutionary approach to democratic elections that leverages blockchain technology 
            to create a transparent, secure, and tamper-proof voting system. Unlike traditional voting systems controlled 
            by central authorities, our decentralized platform distributes trust across a network of nodes, making it 
            virtually impossible for any single entity to manipulate election results.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="backdrop-blur-xl bg-neon-blue/10 p-4 rounded-lg border border-neon-blue/30">
              <h3 className="font-bold text-white mb-2 flex items-center">
                <span className="text-2xl mr-2">🔒</span>
                Immutable
              </h3>
              <p className="text-sm text-gray-400">Once cast, votes cannot be altered or deleted</p>
            </div>
            <div className="backdrop-blur-xl bg-neon-purple/10 p-4 rounded-lg border border-neon-purple/30">
              <h3 className="font-bold text-white mb-2 flex items-center">
                <span className="text-2xl mr-2">🌐</span>
                Distributed
              </h3>
              <p className="text-sm text-gray-400">No single point of failure or control</p>
            </div>
            <div className="backdrop-blur-xl bg-neon-pink/10 p-4 rounded-lg border border-neon-pink/30">
              <h3 className="font-bold text-white mb-2 flex items-center">
                <span className="text-2xl mr-2">✅</span>
                Verifiable
              </h3>
              <p className="text-sm text-gray-400">Anyone can verify the integrity of results</p>
            </div>
          </div>
        </div>
        
        {/* How Blockchain Secures Votes */}
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-glow mb-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">How Blockchain Secures Every Vote</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-neon-blue/20 rounded-lg flex items-center justify-center">
                <span className="text-neon-blue font-bold">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Cryptographic Hashing</h3>
                <p className="text-gray-300">
                  Each vote is converted into a unique cryptographic hash (a digital fingerprint). This hash is generated 
                  using SHA-256 algorithm, making it mathematically impossible to reverse-engineer the original vote from the hash.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-neon-purple/20 rounded-lg flex items-center justify-center">
                <span className="text-neon-purple font-bold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Block Formation</h3>
                <p className="text-gray-300">
                  Votes are bundled into blocks along with metadata (timestamp, voter ID hash, election ID). Each block 
                  contains a reference to the previous block, creating an unbreakable chain of records.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-neon-pink/20 rounded-lg flex items-center justify-center">
                <span className="text-neon-pink font-bold">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Consensus Mechanism</h3>
                <p className="text-gray-300">
                  Multiple network nodes verify each transaction before it's added to the blockchain. This distributed 
                  consensus ensures that no single party can manipulate the voting records.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                <span className="text-green-400 font-bold">4</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Permanent Record</h3>
                <p className="text-gray-300">
                  Once a block is added to the chain, it becomes part of a permanent, tamper-proof ledger. Any attempt 
                  to alter past votes would require changing all subsequent blocks—computationally infeasible.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Privacy Protection */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-8 rounded-2xl border border-purple-500/30 shadow-glow mb-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">How User Privacy is Maintained</h2>
          </div>
          
          <div className="space-y-4">
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <svg className="w-6 h-6 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                Zero-Knowledge Proofs (ZKP)
              </h3>
              <p className="text-gray-300 mb-2">
                Our system implements Zero-Knowledge Proof cryptography, allowing the network to verify that you're an 
                eligible voter and that your vote is valid WITHOUT revealing your identity or your voting choice.
              </p>
              <p className="text-sm text-gray-400 italic">
                Think of it like proving you're over 18 without showing your ID—the verifier knows you meet the requirement 
                but learns nothing else about you.
              </p>
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 p-6 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <svg className="w-6 h-6 mr-2 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd"/>
                </svg>
                Pseudonymous Identifiers
              </h3>
              <p className="text-gray-300">
                Your voter ID is hashed and used as a pseudonym on the blockchain. While the blockchain records that "Voter X" 
                voted for "Candidate Y," only you know that "Voter X" is you. The mapping between your real identity and 
                pseudonym is stored securely off-chain with military-grade encryption.
              </p>
            </div>
          </div>
        </div>
        
        {/* End-to-End Encryption */}
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-glow mb-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">End-to-End Encryption Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-yellow-500/10 p-6 rounded-lg border border-yellow-500/30">
              <h3 className="text-xl font-bold text-white mb-3">Encryption at Rest</h3>
              <p className="text-gray-300 mb-3">
                All voter data stored in our database is encrypted using AES-256 encryption. Even if someone gains 
                unauthorized access to our servers, they cannot read the data without the encryption keys.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start">
                  <svg className="w-4 h-4 mt-0.5 mr-2 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Database encryption: AES-256-GCM
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mt-0.5 mr-2 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Key rotation every 90 days
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mt-0.5 mr-2 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Encrypted backups in secure cloud storage
                </li>
              </ul>
            </div>
            
            <div className="backdrop-blur-xl bg-orange-500/10 p-6 rounded-lg border border-orange-500/30">
              <h3 className="text-xl font-bold text-white mb-3">Encryption in Transit</h3>
              <p className="text-gray-300 mb-3">
                All data transmitted between your device and our servers is encrypted using TLS 1.3, the latest and 
                most secure transport layer security protocol.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start">
                  <svg className="w-4 h-4 mt-0.5 mr-2 text-orange-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  TLS 1.3 with perfect forward secrecy
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mt-0.5 mr-2 text-orange-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Certificate pinning to prevent MITM attacks
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mt-0.5 mr-2 text-orange-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  HSTS enforced for all connections
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Face Verification */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-8 rounded-2xl border border-green-500/30 shadow-glow mb-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Face Verification Explained</h2>
          </div>
          
          <p className="text-gray-300 text-lg mb-6">
            Our face verification system uses advanced AI to ensure that only authorized voters can cast ballots, 
            preventing fraud while maintaining privacy.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📸</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Biometric Capture</h3>
                <p className="text-gray-300">
                  During registration, we capture your facial biometric data using face-api.js with 128-dimensional 
                  facial embeddings. This creates a unique mathematical representation of your face.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Secure Storage</h3>
                <p className="text-gray-300">
                  Facial embeddings are stored as encrypted vectors in our database. We never store actual photos—
                  only mathematical representations that cannot be reverse-engineered into images.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Real-time Verification</h3>
                <p className="text-gray-300">
                  Before casting a vote, your face is captured and compared against your stored embedding using cosine 
                  similarity. A match threshold of &gt; 0.85 confirms your identity in under 1 second.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Why System is Tamper-Proof */}
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-glow mb-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Why This System is Tamper-Proof</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="backdrop-blur-xl bg-red-500/10 p-6 rounded-lg border border-red-500/30">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-2xl mr-2">🌳</span>
                Merkle Trees
              </h3>
              <p className="text-gray-300">
                Votes are organized into Merkle trees—a cryptographic data structure where any change to a single vote 
                changes the entire tree root. This makes tampering instantly detectable.
              </p>
            </div>
            
            <div className="backdrop-blur-xl bg-pink-500/10 p-6 rounded-lg border border-pink-500/30">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-2xl mr-2">🔗</span>
                Chain Linkage
              </h3>
              <p className="text-gray-300">
                Each block contains the hash of the previous block. Altering any past vote would require recalculating 
                all subsequent block hashes—computationally infeasible due to proof-of-work.
              </p>
            </div>
            
            <div className="backdrop-blur-xl bg-orange-500/10 p-6 rounded-lg border border-orange-500/30">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-2xl mr-2">📝</span>
                Smart Contracts
              </h3>
              <p className="text-gray-300">
                Voting logic is encoded in immutable smart contracts deployed on Ethereum. Once deployed, not even 
                administrators can change the rules—they're enforced automatically by the blockchain.
              </p>
            </div>
            
            <div className="backdrop-blur-xl bg-yellow-500/10 p-6 rounded-lg border border-yellow-500/30">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                <span className="text-2xl mr-2">🔢</span>
                Cryptographic Hashing
              </h3>
              <p className="text-gray-300">
                SHA-256 hashing ensures that even a single bit change in vote data produces a completely different hash. 
                This makes unauthorized modifications immediately obvious to network validators.
              </p>
            </div>
          </div>
        </div>
        
        {/* Why Sepolia Testnet */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-8 rounded-2xl border border-blue-500/30 shadow-glow mb-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Why Sepolia Testnet?</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-300 text-lg">
              We use Ethereum's Sepolia testnet for development and demonstration purposes. Here's why:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h3 className="font-bold text-white mb-1">Cost-Effective Testing</h3>
                  <p className="text-sm text-gray-400">
                    Sepolia uses free test ETH, allowing unlimited testing without real financial costs
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h3 className="font-bold text-white mb-1">Production-Like Environment</h3>
                  <p className="text-sm text-gray-400">
                    Sepolia mirrors Ethereum mainnet's behavior, providing realistic testing conditions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h3 className="font-bold text-white mb-1">Public Verifiability</h3>
                  <p className="text-sm text-gray-400">
                    Anyone can verify transactions on Sepolia Etherscan, ensuring transparency
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h3 className="font-bold text-white mb-1">Easy Migration</h3>
                  <p className="text-sm text-gray-400">
                    The system can be deployed to mainnet with minimal changes when ready for production
                  </p>
                </div>
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-blue-500/10 p-4 rounded-lg border border-blue-500/30 mt-6">
              <p className="text-gray-300 flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <span>
                  <strong>Note:</strong> For a real election system, we would deploy to Ethereum mainnet or a private 
                  consortium blockchain for maximum security and permanence.
                </span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink p-8 rounded-2xl border border-white/20 shadow-glow text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Participate?</h2>
          <p className="text-xl text-gray-100 mb-6">
            Your vote is secure, private, and verifiable. Join the future of democratic elections.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-white text-navy-900 font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Return to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutSystemPage;
