import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api';
import TopHeader from '../components/TopHeader';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isFirstLogin = location.state?.firstLogin || false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      await API.post('/admin/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });

      setSuccess('Password changed successfully! Redirecting...');
      
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 relative overflow-hidden">
      <TopHeader />
      
      {/* Background effects */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-neon-purple opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-neon-blue opacity-20 rounded-full blur-3xl animate-pulse delay-700"></div>
      
      <div className="relative z-10 backdrop-blur-xl bg-white/5 p-10 rounded-2xl border border-white/10 shadow-neon-purple w-full max-w-md mt-20">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
            {isFirstLogin ? 'Change Temporary Password' : 'Change Password'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isFirstLogin 
              ? '⚠️ You must change your temporary password before accessing the system'
              : 'Update your account password for better security'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm backdrop-blur-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Current Password *
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all backdrop-blur-sm"
              placeholder="Enter your current password"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              New Password *
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all backdrop-blur-sm"
              placeholder="Enter new password (min 6 characters)"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Confirm New Password *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all backdrop-blur-sm"
              placeholder="Re-enter new password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {/* Password Requirements */}
          <div className="p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
            <p className="text-blue-300 text-xs font-semibold mb-2">Password Requirements:</p>
            <ul className="text-blue-300 text-xs space-y-1">
              <li className="flex items-center gap-2">
                <span className={newPassword.length >= 6 ? 'text-green-400' : 'text-gray-400'}>
                  {newPassword.length >= 6 ? '✓' : '○'}
                </span>
                At least 6 characters
              </li>
              <li className="flex items-center gap-2">
                <span className={newPassword !== currentPassword && newPassword ? 'text-green-400' : 'text-gray-400'}>
                  {newPassword !== currentPassword && newPassword ? '✓' : '○'}
                </span>
                Different from current password
              </li>
              <li className="flex items-center gap-2">
                <span className={newPassword === confirmPassword && confirmPassword ? 'text-green-400' : 'text-gray-400'}>
                  {newPassword === confirmPassword && confirmPassword ? '✓' : '○'}
                </span>
                Passwords match
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating Password...
              </span>
            ) : (
              '🔒 Change Password'
            )}
          </button>

          {!isFirstLogin && (
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="w-full py-3 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-all"
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </form>

        {/* Security Note */}
        <div className="mt-6 p-3 bg-purple-500/10 border border-purple-400/30 rounded-lg">
          <p className="text-purple-300 text-xs">
            <strong>🔐 Security Tip:</strong> Use a strong, unique password that you don't use for other accounts. 
            Consider using a password manager for better security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
