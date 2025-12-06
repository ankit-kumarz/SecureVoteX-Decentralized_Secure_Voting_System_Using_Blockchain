const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('🔑 Authentication check:', {
    hasAuthHeader: !!authHeader,
    hasToken: !!token,
    headerValue: authHeader ? authHeader.substring(0, 20) + '...' : 'none'
  });
  
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ Token verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log('✅ Token verified for user:', user.id, 'Role:', user.role);
    req.user = user;
    next();
  });
};

const authorize = (allowedRoles) => async (req, res, next) => {
  try {
    console.log('🔐 Authorization check:', {
      userRole: req.user?.role,
      allowedRoles,
      adminType: req.user?.admin_type
    });
    
    // Check if SUPER_ADMIN is required
    if (allowedRoles.includes('SUPER_ADMIN')) {
      // Fetch user from DB to get admin_type
      const user = await userModel.getUserById(req.user.id);
      
      if (!user || user.role !== 'admin' || user.admin_type !== 'SUPER_ADMIN') {
        console.log('❌ SUPER_ADMIN access denied');
        return res.status(403).json({ message: 'Forbidden: SUPER_ADMIN access required' });
      }
      
      // Check if account is disabled
      if (user.account_disabled) {
        return res.status(403).json({ message: 'Account is disabled' });
      }
      
      return next();
    }
    
    // Standard role check
    if (!allowedRoles.includes(req.user.role)) {
      console.log('❌ Role check failed:', { userRole: req.user.role, allowedRoles });
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    console.log('✅ Authorization passed');
    next();
  } catch (err) {
    console.error('❌ Authorization error:', err.message);
    return res.status(500).json({ message: 'Authorization failed', error: err.message });
  }
};

module.exports = { authenticate, authorize };
