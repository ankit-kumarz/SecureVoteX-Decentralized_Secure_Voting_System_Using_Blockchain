import React, { useState, useEffect } from 'react';
import API from '../../api';

const AdminUserManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    admin_type: 'ELECTION_ADMIN'
  });
  const [tempPassword, setTempPassword] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/list-admins');
      setAdmins(res.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 403) {
        setError('⛔ You do not have permission to access this page. SUPER_ADMIN access required.');
      } else {
        setError('Failed to load admin list');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTempPassword(null);
    
    try {
      const res = await API.post('/admin/create-admin', formData);
      setSuccess('✅ Admin created successfully!');
      setTempPassword(res.data.admin.temp_password);
      fetchAdmins();
      
      // Reset form but keep it open to show temp password
      setFormData({ email: '', admin_type: 'ELECTION_ADMIN' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleResetPassword = async (adminId) => {
    if (!window.confirm('⚠️ Reset this admin\'s password? They will receive a new temporary password.')) return;
    
    try {
      const res = await API.post(`/admin/reset-password/${adminId}`);
      const newPassword = res.data.temp_password;
      
      // Show password in modal
      alert(`✅ Password Reset Successful!\n\nNew Temporary Password:\n${newPassword}\n\n⚠️ Send this to the admin via secure channel.`);
      setSuccess('Password reset successfully');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDisableAdmin = async (adminId) => {
    if (!window.confirm('⚠️ Disable this admin account? They will not be able to log in.')) return;
    
    try {
      await API.post(`/admin/disable/${adminId}`);
      setSuccess('Admin disabled successfully');
      fetchAdmins();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to disable admin');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('🚨 PERMANENTLY DELETE this admin account?\n\nThis action CANNOT be undone!')) return;
    
    try {
      await API.delete(`/admin/delete/${adminId}`);
      setSuccess('Admin deleted successfully');
      fetchAdmins();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete admin');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading && admins.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="text-4xl">👥</span>
          Admin User Management
        </h2>
        <p className="text-gray-400">Create and manage administrator accounts (SUPER_ADMIN only)</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">{error}</div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 flex items-start gap-3">
          <span className="text-2xl">✓</span>
          <div className="flex-1">{success}</div>
        </div>
      )}

      {/* Create Admin Button */}
      <button
        onClick={() => {
          setShowCreateForm(!showCreateForm);
          setTempPassword(null);
          setError('');
          setSuccess('');
        }}
        className="mb-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:scale-105 transition-all shadow-lg"
      >
        {showCreateForm ? '✕ Cancel' : '+ Create New Admin'}
      </button>

      {/* Create Admin Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateAdmin} className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📝</span> Create Admin Account
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Official Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="admin@securevotex.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Admin Role *
              </label>
              <select
                value={formData.admin_type}
                onChange={(e) => setFormData({...formData, admin_type: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white cursor-pointer focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="SUPER_ADMIN" className="bg-navy-800">🔑 Super Admin (Full Access)</option>
                <option value="ELECTION_ADMIN" className="bg-navy-800">🗳️ Election Admin (Manage Elections)</option>
                <option value="SYSTEM_AUDITOR" className="bg-navy-800">📊 System Auditor (Read-Only)</option>
                <option value="SUPPORT_STAFF" className="bg-navy-800">💬 Support Staff (Logs & Voters)</option>
              </select>
              <p className="text-gray-500 text-xs mt-2">
                Choose the appropriate access level for this administrator
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:scale-105 transition-all shadow-lg"
          >
            ✓ Create Admin
          </button>

          {tempPassword && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <p className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                <span className="text-2xl">🔐</span>
                Temporary Password Generated:
              </p>
              <div className="bg-black/30 px-4 py-3 rounded-lg mb-3">
                <code className="text-white text-lg font-mono break-all">
                  {tempPassword}
                </code>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                ⚠️ <strong>Important:</strong> Send this password to the admin via a secure channel (encrypted email, secure chat).
              </p>
              <p className="text-gray-400 text-sm">
                ℹ️ The admin must change this password on first login for security.
              </p>
            </div>
          )}
        </form>
      )}

      {/* Admins Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 bg-white/10 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>📋</span> Administrator Accounts ({admins.length})
          </h3>
        </div>
        
        {admins.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <div className="text-6xl mb-4">👤</div>
            <p>No admin accounts found</p>
            <p className="text-sm mt-2">Create your first admin account above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Email</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Role</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Created</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Status</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white">{admin.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        admin.admin_type === 'SUPER_ADMIN' ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30' :
                        admin.admin_type === 'ELECTION_ADMIN' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
                        admin.admin_type === 'SYSTEM_AUDITOR' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                        'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                      }`}>
                        {admin.admin_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(admin.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {admin.account_disabled ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-400/30">
                          Disabled
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-400/30">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResetPassword(admin.id)}
                          className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-xs font-medium border border-blue-400/30"
                          title="Reset Password"
                        >
                          🔑 Reset
                        </button>
                        <button
                          onClick={() => handleDisableAdmin(admin.id)}
                          className="px-3 py-1.5 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-all text-xs font-medium border border-yellow-400/30"
                          title="Disable Account"
                        >
                          🚫 Disable
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-xs font-medium border border-red-400/30"
                          title="Delete Account"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
        <p className="text-blue-300 text-sm">
          <strong>ℹ️ Security Note:</strong> Only SUPER_ADMIN accounts can create, modify, or delete other administrators. 
          All actions are logged in the audit trail for compliance and security monitoring.
        </p>
      </div>
    </div>
  );
};

export default AdminUserManagement;
