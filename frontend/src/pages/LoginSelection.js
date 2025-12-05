import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TopHeader from '../components/TopHeader';

const LoginSelection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 relative overflow-hidden">
      <TopHeader />
      
      {/* Animated background gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-neon-blue opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-pink opacity-10 rounded-full blur-3xl animate-pulse delay-500"></div>

      <div className="relative z-10 w-full max-w-6xl px-6 pt-20">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent mb-4">
            Blockchain Voting System
          </h1>
          <p className="text-gray-400 text-lg">Choose your login type to continue</p>
        </div>

        {/* Login Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Voter Card */}
          <div
            onClick={() => navigate('/voter-login')}
            className="group relative backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 cursor-pointer transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-neon-blue hover:shadow-neon-blue"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-aqua opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
            
            <div className="relative z-10 text-center">
              {/* Icon */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-neon-blue/20 to-neon-aqua/20 rounded-full flex items-center justify-center border-2 border-neon-blue/30 group-hover:border-neon-blue group-hover:shadow-neon-blue transition-all duration-300">
                <svg className="w-12 h-12 text-neon-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors duration-300">
                Login as Voter
              </h2>

              {/* Description */}
              <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                Cast your vote securely with end-to-end encryption and biometric verification
              </p>

              {/* Features */}
              <div className="space-y-2 text-sm text-gray-500 text-left">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-neon-aqua" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Encrypted voting</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-neon-aqua" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>View election results</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-neon-aqua" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Download vote receipt</span>
                </div>
              </div>

              {/* Arrow indicator */}
              <div className="mt-6 flex items-center justify-center">
                <span className="text-neon-blue font-semibold group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center">
                  Proceed
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Admin Card */}
          <div
            onClick={() => navigate('/admin-login')}
            className="group relative backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 cursor-pointer transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-neon-purple hover:shadow-neon-purple"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-pink opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
            
            <div className="relative z-10 text-center">
              {/* Icon */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 rounded-full flex items-center justify-center border-2 border-neon-purple/30 group-hover:border-neon-purple group-hover:shadow-neon-purple transition-all duration-300">
                <svg className="w-12 h-12 text-neon-purple" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-neon-purple transition-colors duration-300">
                Login as Admin
              </h2>

              {/* Description */}
              <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors duration-300">
                Manage elections, candidates, and view comprehensive analytics dashboard
              </p>

              {/* Features */}
              <div className="space-y-2 text-sm text-gray-500 text-left">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-neon-pink" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Create & manage elections</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-neon-pink" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Add candidates & uploads</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-neon-pink" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>View real-time analytics</span>
                </div>
              </div>

              {/* Arrow indicator */}
              <div className="mt-6 flex items-center justify-center">
                <span className="text-neon-purple font-semibold group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center">
                  Proceed
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center space-y-3">
          <p className="text-gray-400 text-sm">
            Don't have a voter account?{' '}
            <a href="/register" className="text-neon-aqua hover:text-neon-pink transition-colors font-medium">
              Register as Voter
            </a>
          </p>
          <p className="text-gray-500 text-xs">
            Admin accounts are invite-only. Contact your system administrator.
          </p>
          <a 
            href="/transparency" 
            className="text-gray-400 text-sm hover:text-neon-blue transition-colors inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            Verify Vote Receipt
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginSelection;
