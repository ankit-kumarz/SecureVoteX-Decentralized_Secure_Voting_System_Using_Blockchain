const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

const authorize = (allowedRoles) => async (req, res, next) => {
  try {
    // Check if SUPER_ADMIN is required
    if (allowedRoles.includes('SUPER_ADMIN')) {
      // Fetch user from DB to get admin_type
      const user = await userModel.getUserById(req.user.id);
      
      if (!user || user.role !== 'admin' || user.admin_type !== 'SUPER_ADMIN') {
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
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Authorization failed', error: err.message });
  }
};

module.exports = { authenticate, authorize };
