const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const register = async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body.email);
    const { email, password, role, wallet_address } = req.body;
    
    // Block admin registration via public endpoint
    if (role === 'admin') {
      console.log('❌ Admin registration blocked');
      return res.status(403).json({ 
        message: 'Admin registration is not allowed. Contact your system administrator for an invite.' 
      });
    }
    
    if (!email || !password) {
      console.log('❌ Missing fields');
      return res.status(400).json({ message: 'Missing fields' });
    }
    
    console.log('🔍 Checking existing user...');
    const existing = await userModel.getUserByEmail(email);
    if (existing) {
      console.log('❌ Email already registered');
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    console.log('🔐 Hashing password...');
    const hash = await bcrypt.hash(password, 10);
    const voter_id = 'VOTER-' + Date.now() + Math.floor(Math.random() * 1000);
    const user = {
      email,
      password: hash,
      role: 'voter',
      voter_id,
      wallet_address: wallet_address || null
    };
    
    console.log('💾 Creating user in database...');
    const [created] = await userModel.createUser(user);
    console.log('✅ User created:', created.id);
    
    // Generate token for immediate biometric registration
    const token = jwt.sign({ id: created.id, role: created.role, voter_id: created.voter_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    console.log('✅ Registration successful');
    res.status(201).json({ 
      id: created.id, 
      role: created.role, 
      voter_id: created.voter_id, 
      wallet_address: created.wallet_address,
      token 
    });
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.getUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    
    // Create token with admin info
    const token = jwt.sign({ 
      id: user.id, 
      role: user.role, 
      voter_id: user.voter_id,
      admin_type: user.admin_type 
    }, process.env.JWT_SECRET, { expiresIn: '2h' });
    
    req.session.user = { 
      id: user.id, 
      role: user.role, 
      voter_id: user.voter_id,
      admin_type: user.admin_type
    };
    
    res.json({ 
      token, 
      role: user.role, 
      voter_id: user.voter_id,
      admin_type: user.admin_type,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
};

module.exports = { register, login, logout };
