const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const register = async (req, res) => {
  try {
    const { email, password, role, wallet_address } = req.body;
    
    // Block admin registration via public endpoint
    if (role === 'admin') {
      return res.status(403).json({ 
        message: 'Admin registration is not allowed. Contact your system administrator for an invite.' 
      });
    }
    
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await userModel.getUserByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const voter_id = 'VOTER-' + Date.now() + Math.floor(Math.random() * 1000);
    const user = {
      email,
      password: hash,
      role: 'voter',
      voter_id,
      wallet_address: wallet_address || null
    };
    const [created] = await userModel.createUser(user);
    
    // Generate token for immediate biometric registration
    const token = jwt.sign({ id: created.id, role: created.role, voter_id: created.voter_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ 
      id: created.id, 
      role: created.role, 
      voter_id: created.voter_id, 
      wallet_address: created.wallet_address,
      token 
    });
  } catch (err) {
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
    const token = jwt.sign({ id: user.id, role: user.role, voter_id: user.voter_id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    req.session.user = { id: user.id, role: user.role, voter_id: user.voter_id };
    res.json({ token, role: user.role, voter_id: user.voter_id });
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
