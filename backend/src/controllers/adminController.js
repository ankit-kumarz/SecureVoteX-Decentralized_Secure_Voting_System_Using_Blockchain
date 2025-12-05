const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userModel = require('../models/user');

// Generate strong temporary password
const generateTempPassword = () => {
  return crypto.randomBytes(12).toString('base64').slice(0, 16);
};

// Create Admin (SUPER_ADMIN only)
const createAdmin = async (req, res) => {
  try {
    const { email, admin_type } = req.body;
    
    // Validate request
    if (!email || !admin_type) {
      return res.status(400).json({ message: 'Email and admin type required' });
    }
    
    // Validate admin_type
    const validTypes = ['SUPER_ADMIN', 'ELECTION_ADMIN', 'SYSTEM_AUDITOR', 'SUPPORT_STAFF'];
    if (!validTypes.includes(admin_type)) {
      return res.status(400).json({ message: 'Invalid admin type' });
    }
    
    // Check if email exists
    const existing = await userModel.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    // Generate temporary password
    const tempPassword = generateTempPassword();
    const hash = await bcrypt.hash(tempPassword, 10);
    
    // Create admin user
    const adminUser = {
      email,
      password: hash,
      role: 'admin',
      admin_type,
      is_temp_password: true,
      created_by_admin_id: req.user.id,
      voter_id: null,
      wallet_address: null
    };
    
    const [created] = await userModel.createUser(adminUser);
    
    // In production, send email with credentials
    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: created.id,
        email,
        admin_type,
        temp_password: tempPassword
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Admin creation failed', error: err.message });
  }
};

// List all admins (SUPER_ADMIN only)
const listAdmins = async (req, res) => {
  try {
    const admins = await userModel.getAllAdmins();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admins', error: err.message });
  }
};

// Reset admin password (SUPER_ADMIN only)
const resetAdminPassword = async (req, res) => {
  try {
    const { admin_id } = req.params;
    const tempPassword = generateTempPassword();
    const hash = await bcrypt.hash(tempPassword, 10);
    
    await userModel.updateUserPassword(admin_id, hash, true);
    
    res.json({
      message: 'Password reset successful',
      temp_password: tempPassword
    });
  } catch (err) {
    res.status(500).json({ message: 'Password reset failed', error: err.message });
  }
};

// Disable admin account (SUPER_ADMIN only)
const disableAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;
    
    // Prevent disabling own account
    if (admin_id == req.user.id) {
      return res.status(400).json({ message: 'Cannot disable your own account' });
    }
    
    await userModel.disableUser(admin_id);
    res.json({ message: 'Admin account disabled' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to disable admin', error: err.message });
  }
};

// Delete admin (SUPER_ADMIN only)
const deleteAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;
    
    // Prevent deleting own account
    if (admin_id == req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    await userModel.deleteUser(admin_id);
    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete admin', error: err.message });
  }
};

// Change password (all admins)
const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    
    if (!current_password || !new_password) {
      return res.status(400).json({ message: 'Current and new password required' });
    }
    
    const user = await userModel.getUserById(req.user.id);
    
    // Verify current password
    const valid = await bcrypt.compare(current_password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Current password incorrect' });
    }
    
    // Update password
    const hash = await bcrypt.hash(new_password, 10);
    await userModel.updateUserPassword(req.user.id, hash, false);
    
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Password change failed', error: err.message });
  }
};

module.exports = {
  createAdmin,
  listAdmins,
  resetAdminPassword,
  disableAdmin,
  deleteAdmin,
  changePassword
};
