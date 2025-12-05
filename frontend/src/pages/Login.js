import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import TopHeader from '../components/TopHeader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data);
      if (res.data.role === 'admin') navigate('/admin');
      else navigate('/voter');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 relative overflow-hidden">
      <TopHeader />
      
      {/* Animated background gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-neon-blue opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <form onSubmit={handleSubmit} className="relative z-10 backdrop-blur-xl bg-white/5 p-10 rounded-2xl border border-white/10 shadow-neon-blue w-full max-w-md mt-20">
        
        {/* Logo/Title with glow */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent mb-2">
            {t('welcomeBack')}
          </h2>
          <p className="text-gray-400 text-sm">{t('signInMessage')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">{t('email')}</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all backdrop-blur-sm"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">{t('password')}</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all backdrop-blur-sm"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full mt-8 py-4 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink text-white font-semibold rounded-xl shadow-neon-blue hover:shadow-neon-purple hover:scale-105 transition-all duration-300"
        >
          {t('signIn')}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {t('dontHaveAccount')}{' '}
            <a href="/register" className="text-neon-aqua hover:text-neon-pink transition-colors font-medium">
              {t('registerNow')}
            </a>
          </p>
        </div>

        {/* Transparency Link */}
        <div className="mt-4 text-center">
          <a 
            href="/transparency" 
            className="text-gray-400 text-sm hover:text-neon-blue transition-colors inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            {t('verifyReceipt')}
          </a>
        </div>

        {/* Decorative gradient line */}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </form>
    </div>
  );
};

export default Login;